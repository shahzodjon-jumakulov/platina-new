/**
 * Data layer for the sitemaps and the RSS feed (ISSUES.md #3, backend repo).
 *
 * WHY THIS FILE EXISTS
 * The first sitemap implementation fetched 1,000 fully serialised articles per
 * chunk from /api/news/all/, and when the CMS answered 500 (a handful of
 * archive rows with missing image files) it bisected the window and retried
 * BOTH halves IN PARALLEL, recursively — on top of ofetch's own automatic
 * retry. The cache lived in per-process memory and pm2 runs 8 processes. The
 * result was hundreds of heavy concurrent requests per crawl and a CMS admin
 * that queued behind them.
 *
 * WHAT IT DOES NOW
 *  - Prefers GET /{api}/api/news/sitemap/ — slug, publish and modified only,
 *    one cheap request per 1,000-article chunk.
 *  - If that endpoint answers 404 (older backend), falls back to
 *    /api/news/all/ in pages of 100, fetched SEQUENTIALLY — at most 10
 *    requests per chunk, no retries, no bisection.
 *  - A chunk is only ever served COMPLETE. If any page fails (a 500 from a
 *    broken archive row, a timeout, anything), the build is abandoned: the
 *    previous complete copy keeps being served (stale-while-revalidate), and
 *    with no copy the route answers 503 + Retry-After. Nothing incomplete is
 *    ever cached. (An earlier version dropped failed windows and cached the
 *    rest; Google was shown a chunk with 500 of its 1,000 articles.)
 *  - A failed build is not retried for a while (10 min for a chunk, 1 min for
 *    the small lookups), and the
 *    back-off is recorded in the shared cache so all pm2 processes respect it.
 *  - Which endpoint works is remembered in the shared cache (archive meta,
 *    10 min), so the probe is not repeated on every request.
 *  - Never more than MAX_CONCURRENT_REQUESTS requests in flight per process,
 *    no automatic retries (ofetch retries 500s by default — disabled).
 *  - Results are cached in the `cache` storage mount, which nuxt.config.ts
 *    points at a directory shared by all pm2 processes. Concurrent misses for
 *    the same key inside one process share a single rebuild.
 *  - Two cache policies:
 *      · frozen archive chunks, the index lastmods, categories: Nitro's
 *        stale-while-revalidate (a crawler gets the stale copy while one
 *        rebuild runs in the background). They rarely change, so age is free.
 *      · everything that moves on every publish — the newest articles
 *        (news-sitemap.xml, rss.xml, ≤ 1 min), the live chunk and the article
 *        count (≤ 10 min): defineFreshCache, which never serves a copy older
 *        than its maxAge while the CMS answers. Nitro's SWR has no upper bound
 *        on age, so the first request after a quiet hour used to get the
 *        hour-old list (news sitemap missing the latest 5-10 articles).
 *    In both, a failed rebuild leaves the previous copy in place.
 */
import {
  ARTICLES_PER_CHUNK,
  CMS,
  SITEMAP_ORDERING,
  lastmodOf,
  type FeedArticle,
  type SitemapRow,
} from "./feed";
import { defineFreshCache } from "./fresh-cache";

export type ArchiveMode = "sitemap" | "legacy";

/** The script variant whose slugs the archive sitemaps are built from. */
const ARCHIVE_API = "uz";

const SITEMAP_ENDPOINT = (api: string) => `${CMS}/${api}/api/news/sitemap/`;
const ALL_ENDPOINT = (api: string) => `${CMS}/${api}/api/news/all/`;

/** The new endpoint's maximum page size; used for the index's single pass. */
const SITEMAP_PASS_PAGE = 5000;

/** Fallback mode page size: 10 sequential requests per 1,000-row chunk. */
const LEGACY_PAGE = 100;

const REQUEST_TIMEOUT_MS = 20_000;
const BUILD_DEADLINE_MS = 120_000;
const MAX_CONCURRENT_REQUESTS = 2;

/**
 * After a failed build, don't try that build again for this long — in any
 * process. In fallback mode a chunk with a broken row fails every time until
 * the backend is fixed, so retrying on every crawl would only add load.
 */
const CHUNK_FAILURE_BACKOFF_MS = 10 * 60_000;

// ------------------------------------------------------------ plumbing ----

let active = 0;
const waiting: (() => void)[] = [];

/** Per-process limit on concurrent CMS requests made by these routes. */
async function withSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (active < MAX_CONCURRENT_REQUESTS) active++;
  else await new Promise<void>((resolve) => waiting.push(resolve)); // slot handed over
  try {
    return await fn();
  } finally {
    const next = waiting.shift();
    if (next) next();
    else active--;
  }
}

function cmsGet<T>(url: string, query: Record<string, string | number>): Promise<T> {
  return withSlot(() =>
    $fetch<T>(url, { query, timeout: REQUEST_TIMEOUT_MS, retry: 0 })
  ) as Promise<T>;
}

export function statusOf(error: unknown): number | undefined {
  const e = error as { status?: number; statusCode?: number; response?: { status?: number } };
  return e?.response?.status ?? e?.status ?? e?.statusCode;
}

function describe(error: unknown): string {
  const status = statusOf(error);
  return status ? `HTTP ${status}` : (error as Error)?.message || String(error);
}

// Failure markers live next to the cached entries, so every pm2 process sees
// them (same `cache` mount, see nuxt.config.ts).
const failureKey = (key: string) => `sitemap-failures:${key.replace(/\W+/g, "_")}`;

/** Runs a build, refusing to retry it for `backoffMs` after a failure. */
async function guarded<T>(
  key: string,
  build: () => Promise<T>,
  backoffMs = 60_000
): Promise<T> {
  const storage = useStorage("cache");
  const last = Number(await storage.getItem(failureKey(key)).catch(() => 0)) || 0;
  if (Date.now() - last < backoffMs) {
    throw new Error(`[sitemap] ${key}: backing off after a recent failure`);
  }
  try {
    const result = await build();
    if (last) await storage.removeItem(failureKey(key)).catch(() => {});
    return result;
  } catch (error) {
    await storage.setItem(failureKey(key), Date.now()).catch(() => {});
    console.warn(`[sitemap] ${key} failed: ${describe(error)}`);
    throw error;
  }
}

interface Page<T> {
  count: number;
  next: string | null;
  results: T[];
}

function isPage(value: unknown): value is Page<unknown> {
  const v = value as Page<unknown>;
  return !!v && typeof v.count === "number" && Array.isArray(v.results);
}

function toRow(item: SitemapRow): SitemapRow {
  return { slug: item.slug, publish: item.publish, modified: item.modified ?? null };
}

// A chunk build that hits a 404 on the new endpoint flips this process to the
// fallback until the shared meta entry is refreshed.
let legacyUntil = 0;
function markLegacy() {
  legacyUntil = Date.now() + 15 * 60_000;
}

// ---------------------------------------------------------------- meta ----

export interface ArchiveMeta {
  mode: ArchiveMode;
  count: number;
}

async function probeMeta(): Promise<ArchiveMeta> {
  if (Date.now() >= legacyUntil) {
    try {
      const page = await cmsGet<unknown>(SITEMAP_ENDPOINT(ARCHIVE_API), { limit: 1, offset: 0 });
      if (isPage(page)) return { mode: "sitemap", count: page.count };
      // Anything else (e.g. an article that happens to be called "sitemap")
      // means the endpoint isn't there.
    } catch (error) {
      if (statusOf(error) !== 404) throw error;
    }
  }
  // Newest-first: recent rows are the ones least likely to be broken.
  const page = await cmsGet<Page<unknown>>(ALL_ENDPOINT(ARCHIVE_API), { limit: 1 });
  if (!isPage(page)) throw new Error("unexpected /api/news/all/ response");
  return { mode: "legacy", count: page.count };
}

/**
 * Which endpoint to use and how many articles there are. Shared, ≤ 10 min old:
 * the count decides how many chunks exist and which one is live, so a stale
 * count would hide a newly started chunk. One tiny request.
 */
export const getArchiveMeta = defineFreshCache(
  { name: "sitemap-meta", maxAge: 10 * 60, getKey: () => "meta" },
  () => guarded("meta", probeMeta)
);

export function chunkCount(count: number): number {
  return Math.max(1, Math.ceil(count / ARTICLES_PER_CHUNK));
}

// -------------------------------------------------------------- chunks ----

export interface ChunkData {
  rows: SitemapRow[];
  mode: ArchiveMode;
  requests: number;
  builtAt: string;
}

async function sitemapChunk(offset: number): Promise<{ rows: SitemapRow[]; requests: number }> {
  const end = offset + ARTICLES_PER_CHUNK;
  const rows: SitemapRow[] = [];
  let cursor = offset;
  let requests = 0;
  // One request normally; loops only if the server caps `limit` lower.
  while (cursor < end && requests < 10) {
    requests++;
    const page = await cmsGet<unknown>(SITEMAP_ENDPOINT(ARCHIVE_API), {
      limit: end - cursor,
      offset: cursor,
    });
    if (!isPage(page)) throw new Error("unexpected /api/news/sitemap/ response");
    rows.push(...(page.results as SitemapRow[]).map(toRow));
    if (!page.results.length || !page.next) break;
    cursor += page.results.length;
  }
  return { rows, requests };
}

/**
 * Fallback: /api/news/all/ in pages of 100, one after the other. Any failed
 * page aborts the build — a chunk is complete or it is not served at all.
 */
async function legacyChunk(offset: number, total: number) {
  const deadline = Date.now() + BUILD_DEADLINE_MS;
  const end = Math.min(offset + ARTICLES_PER_CHUNK, Math.max(total, offset + 1));
  const rows: SitemapRow[] = [];
  let requests = 0;
  for (let o = offset; o < end; o += LEGACY_PAGE) {
    if (Date.now() > deadline) throw new Error("chunk build exceeded its deadline");
    requests++;
    try {
      const page = await cmsGet<Page<SitemapRow>>(ALL_ENDPOINT(ARCHIVE_API), {
        limit: Math.min(LEGACY_PAGE, end - o),
        offset: o,
        ordering: SITEMAP_ORDERING,
      });
      rows.push(...page.results.map(toRow));
      if (page.results.length < Math.min(LEGACY_PAGE, end - o)) break; // archive ended
    } catch (error) {
      throw new Error(
        `incomplete: rows ${o}-${Math.min(o + LEGACY_PAGE, end) - 1} unreadable ` +
          `(${describe(error)}) after ${requests} requests`
      );
    }
  }
  return { rows, requests };
}

async function buildChunk(n: number, mode: ArchiveMode, total: number): Promise<ChunkData> {
  const started = Date.now();
  const offset = n * ARTICLES_PER_CHUNK;
  let result: { rows: SitemapRow[]; requests: number } | undefined;
  let used: ArchiveMode = mode;

  if (mode === "sitemap" && Date.now() >= legacyUntil) {
    try {
      result = await sitemapChunk(offset);
    } catch (error) {
      if (statusOf(error) !== 404) throw error;
      markLegacy(); // backend rolled back; meta catches up within the hour
    }
  }
  if (!result) {
    used = "legacy";
    result = await legacyChunk(offset, total);
  }

  // Never cache an empty chunk that should have rows: it would hide 1,000
  // articles from Google for as long as the entry lives.
  if (!result.rows.length && offset < total) {
    throw new Error(`chunk ${n}: no readable rows`);
  }

  console.info(
    `[sitemap] built chunk ${n} (${used}): ${result.rows.length} rows, ` +
      `${result.requests} requests, ${Date.now() - started} ms`
  );
  return { rows: result.rows, mode: used, requests: result.requests, builtAt: new Date().toISOString() };
}

const chunkKey = (n: number) => `p${n}`;

// Chunks whose cached copy was built in the other mode, to be rebuilt.
const upgrade = new Set<number>();
const chunkCacheOptions = {
  swr: true,
  getKey: chunkKey,
  shouldInvalidateCache: (n: number) => upgrade.delete(n),
};

/**
 * Every chunk but the last is frozen (oldest-first ordering), so it only needs
 * re-reading for the odd edit or unpublish: 24 h.
 */
const getFrozenChunk = defineCachedFunction(
  (n: number, mode: ArchiveMode, total: number) =>
    guarded(`chunk ${mode} ${n}`, () => buildChunk(n, mode, total), CHUNK_FAILURE_BACKOFF_MS),
  { name: "sitemap-chunk-frozen", maxAge: 24 * 60 * 60, ...chunkCacheOptions }
);

/**
 * The last chunk receives every new article: ≤ 10 min old. With the
 * /api/news/sitemap/ endpoint that is one light request per rebuild.
 */
const getLiveChunk = defineFreshCache<[n: number, mode: ArchiveMode, total: number], ChunkData>(
  { name: "sitemap-chunk-live", maxAge: 10 * 60, getKey: chunkKey },
  (n: number, mode: ArchiveMode, total: number) =>
    guarded(`chunk ${mode} ${n}`, () => buildChunk(n, mode, total), CHUNK_FAILURE_BACKOFF_MS)
);

export function isLiveChunk(n: number, meta: ArchiveMeta): boolean {
  return n === chunkCount(meta.count) - 1;
}

/**
 * Chunk `n` (0-based), complete, from the shared cache. Throws when there is
 * no complete copy and none can be built right now — the route answers 503.
 *
 * The cache key does not include the mode, so if the endpoint disappears the
 * last complete copy keeps being served. When a copy built by the fallback is
 * found while the new endpoint is available, it is served one last time and
 * rebuilt from the endpoint in the background (better lastmods, one request).
 */
export async function getChunk(n: number, meta: ArchiveMeta): Promise<ChunkData> {
  const upgradeable = (chunk: ChunkData) =>
    chunk.mode !== meta.mode && meta.mode === "sitemap";

  if (isLiveChunk(n, meta)) {
    const chunk = await getLiveChunk(n, meta.mode, meta.count);
    if (upgradeable(chunk)) getLiveChunk.refresh(n, meta.mode, meta.count).catch(() => {});
    return chunk;
  }

  const chunk = await getFrozenChunk(n, meta.mode, meta.count);
  if (upgradeable(chunk)) {
    upgrade.add(n);
    getFrozenChunk(n, meta.mode, meta.count).catch(() => {});
  }
  return chunk;
}

/** Newest lastmod (edit, else publish) among a chunk's articles. */
export function chunkLastmod(chunk: ChunkData): string | null {
  let newest: string | null = null;
  for (const row of chunk.rows) newest = maxIso(newest, lastmodOf(row));
  return newest;
}

// --------------------------------------------------------------- index ----

export interface IndexData {
  count: number;
  /** Newest lastmod per chunk, or null where it could not be determined. */
  lastmods: (string | null)[];
  mode: ArchiveMode;
}

const maxIso = (a: string | null, b: string) =>
  !a || Date.parse(b) > Date.parse(a) ? b : a;

/**
 * New endpoint: one pass over the whole archive in pages of 5,000 (3 light
 * requests for ~13k articles) gives each chunk's true newest lastmod,
 * including edits to old articles.
 */
async function indexFromSitemap(count: number): Promise<IndexData> {
  const chunks = chunkCount(count);
  const lastmods: (string | null)[] = Array(chunks).fill(null);
  let position = 0;
  let total = count;
  for (let requests = 0; position < total && requests < 20; requests++) {
    const page = await cmsGet<unknown>(SITEMAP_ENDPOINT(ARCHIVE_API), {
      limit: SITEMAP_PASS_PAGE,
      offset: position,
    });
    if (!isPage(page)) throw new Error("unexpected /api/news/sitemap/ response");
    total = page.count;
    for (const row of page.results as SitemapRow[]) {
      const i = Math.floor(position / ARTICLES_PER_CHUNK);
      if (i < chunks) lastmods[i] = maxIso(lastmods[i] ?? null, lastmodOf(row));
      position++;
    }
    if (!page.results.length || !page.next) break;
  }
  return { count, lastmods, mode: "sitemap" };
}

/**
 * Fallback: the publish date of the last article in each chunk, one tiny
 * request per chunk, strictly sequential. A row that 500s just loses its
 * lastmod (optional in the protocol); a CMS that is failing outright stops
 * the loop and the remaining lastmods are omitted.
 */
async function indexFromLegacy(count: number): Promise<IndexData> {
  const chunks = chunkCount(count);
  const lastmods: (string | null)[] = Array(chunks).fill(null);
  for (let i = 0; i < chunks; i++) {
    const last = Math.min((i + 1) * ARTICLES_PER_CHUNK, count) - 1;
    try {
      const page = await cmsGet<Page<SitemapRow>>(ALL_ENDPOINT(ARCHIVE_API), {
        limit: 1,
        offset: Math.max(0, last),
        ordering: SITEMAP_ORDERING,
      });
      lastmods[i] = page.results[0] ? lastmodOf(page.results[0]) : null;
    } catch (error) {
      if (statusOf(error) !== 500) {
        console.warn(`[sitemap] index lastmods stopped at chunk ${i}: ${describe(error)}`);
        break;
      }
    }
  }
  return { count, lastmods, mode: "legacy" };
}

async function buildIndex(): Promise<IndexData> {
  const meta = await getArchiveMeta();
  if (meta.mode === "sitemap" && Date.now() >= legacyUntil) {
    try {
      return await indexFromSitemap(meta.count);
    } catch (error) {
      if (statusOf(error) !== 404) throw error;
      markLegacy();
    }
  }
  return indexFromLegacy(meta.count);
}

export const getArchiveIndex = defineCachedFunction(
  () => guarded("index", buildIndex),
  { name: "sitemap-index", maxAge: 60 * 60, swr: true, getKey: () => "index" }
);

// -------------------------------------------------------- latest / RSS ----

/** Newest articles for the Google News sitemap (48 h window) and RSS. */
export const LATEST_LIMIT = 100;

async function fetchLatest(api: string): Promise<FeedArticle[]> {
  const page = await cmsGet<Page<FeedArticle & { category?: { name: string } }>>(
    ALL_ENDPOINT(api),
    { limit: LATEST_LIMIT }
  );
  // Keep only what the feeds render: the API objects carry every translation
  // of the full article body.
  return page.results.map((a) => ({
    slug: a.slug,
    publish: a.publish,
    title: a.title,
    short_content: a.short_content,
    image_large: a.image_large,
    category: a.category?.name ? { name: a.category.name } : undefined,
  }));
}

/**
 * Shared by news-sitemap.xml (both variants), rss.xml (Latin) and the sitemap
 * index. Never more than a minute old while the CMS answers, so an article is
 * in the news sitemap within ~1 min of going live. A rebuild is one request
 * (~2 s, ~370 kB for 100 articles) and only happens when someone asks.
 */
export const getLatestArticles = defineFreshCache(
  { name: "latest-articles", maxAge: 60, getKey: (api: string) => api },
  (api: string) => guarded(`latest ${api}`, () => fetchLatest(api))
);

// ---------------------------------------------------------- categories ----

export const getCategorySlugs = defineCachedFunction(
  () =>
    guarded("categories", async () => {
      const res = await cmsGet<{ results?: { slug: string }[] }>(
        `${CMS}/uz/api/categories/list/`,
        {}
      );
      return (res?.results ?? []).map((c) => c.slug).filter(Boolean);
    }),
  { name: "category-slugs", maxAge: 60 * 60, swr: true, getKey: () => "uz" }
);
