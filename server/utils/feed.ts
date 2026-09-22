/**
 * Shared helpers for the sitemap / news-sitemap / RSS routes.
 *
 * Everything is derived from the CMS API that the site already consumes, so
 * there is no second source of truth to keep in sync.
 */

export const SITE = "https://platina.uz";

export const CMS = process.env.BASE_URL || "https://cp.platina.uz";

/**
 * The two script variants. The unprefixed URL serves Cyrillic (i18n default
 * locale "uz"); "/o'z" serves Latin. Slugs are identical across both, so one
 * API call yields both URLs.
 */
export const VARIANTS = [
  { prefix: "", hreflang: "uz-Cyrl", api: "uz-cyril" },
  { prefix: "/o'z", hreflang: "uz", api: "uz" },
] as const;

/** Latin is what people actually search in, so it takes x-default. */
export const X_DEFAULT_PREFIX = "/o'z";

export const ARTICLES_PER_CHUNK = 1000;

/**
 * Sitemap chunks are ordered OLDEST FIRST, and that ordering is load-bearing.
 *
 * With the API's default newest-first ordering, publishing a single article
 * shifts every article down one position, so the contents of all 13 chunks
 * change every time the newsroom posts. Google would re-download ~16 MB of
 * sitemap on every pass to discover almost nothing new.
 *
 * Oldest-first pins each chunk: chunk 0 is the 1,000 oldest articles and never
 * changes again. New articles only ever land in the final chunk, so that is the
 * only file Google needs to re-read.
 */
export const SITEMAP_ORDERING = "publish";

export interface Article {
  slug: string;
  title: string;
  publish: string;
  short_content?: string;
  image_large?: string;
  category?: { name: string; slug: string };
}

/** Escapes text for use inside an XML element. */
export function xml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * `publish` arrives as a naive local timestamp ("2026-09-12T13:15:45").
 * Slice it rather than going through Date, so the path can never drift by a
 * day depending on the server's timezone.
 */
export function articlePath(article: Article): string {
  const [year, month, day] = article.publish.slice(0, 10).split("-");
  return `/${year}/${month}/${day}/${article.slug}`;
}

/** Uzbekistan has no DST, so the offset is always +05:00. */
export function toIso(publish: string): string {
  return `${publish}+05:00`;
}

export function toRfc822(publish: string): string {
  return new Date(toIso(publish)).toUTCString();
}

/** Strips CMS HTML down to plain text for descriptions. */
export function stripHtml(html?: string): string {
  return String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface FetchOptions {
  limit?: number;
  offset?: number;
  api?: string;
  ordering?: string;
}

export async function fetchArticles({
  limit = ARTICLES_PER_CHUNK,
  offset = 0,
  api = "uz",
  ordering,
}: FetchOptions = {}): Promise<{ count: number; results: Article[] }> {
  const response = await $fetch<{ count: number; results: Article[] }>(
    `${CMS}/${api}/api/news/all/`,
    {
      params: ordering ? { limit, offset, ordering } : { limit, offset },
      timeout: 30000,
    }
  );
  return { count: response?.count ?? 0, results: response?.results ?? [] };
}

/**
 * Same as fetchArticles, but survives the handful of archive records that make
 * the CMS return 500 (as of this writing, four rows around offset 12120-12150).
 * A failing window is bisected down to single records so one bad row costs one
 * URL instead of the whole sitemap chunk.
 */
export async function fetchArticlesResilient(options: FetchOptions = {}): Promise<
  Article[]
> {
  const { limit = ARTICLES_PER_CHUNK, offset = 0, api = "uz", ordering } = options;

  try {
    const { results } = await fetchArticles({ limit, offset, api, ordering });
    return results;
  } catch (error) {
    if (limit <= 1) {
      console.warn(
        `[sitemap] skipping unreadable article at offset ${offset} (${api}):`,
        (error as Error)?.message
      );
      return [];
    }

    const half = Math.ceil(limit / 2);
    const [first, second] = await Promise.all([
      fetchArticlesResilient({ limit: half, offset, api, ordering }),
      fetchArticlesResilient({
        limit: limit - half,
        offset: offset + half,
        api,
        ordering,
      }),
    ]);
    return [...first, ...second];
  }
}

/**
 * The publish date of the newest article in each chunk, for the sitemap index.
 *
 * Previously every entry carried `new Date()`, which told Google all 13 chunks
 * had just changed on every single read — the opposite of what lastmod is for.
 * Because chunks are ordered oldest-first, the real answer is the last article
 * in each chunk, and it's stable for every chunk but the final one.
 */
export async function fetchChunkLastmods(count: number): Promise<(string | null)[]> {
  const chunks = Math.max(1, Math.ceil(count / ARTICLES_PER_CHUNK));

  return Promise.all(
    Array.from({ length: chunks }, async (_, i) => {
      const last = Math.min((i + 1) * ARTICLES_PER_CHUNK, count) - 1;
      try {
        const { results } = await fetchArticles({
          limit: 1,
          offset: Math.max(0, last),
          ordering: SITEMAP_ORDERING,
        });
        return results[0]?.publish ? toIso(results[0].publish) : null;
      } catch {
        // A lastmod we can't determine is better omitted than faked.
        return null;
      }
    })
  );
}

export async function countArticles(): Promise<number> {
  const { count } = await fetchArticles({ limit: 1 });
  return count;
}

/** One <url> entry per script variant, cross-linked with xhtml:link alternates. */
export function urlEntries(article: Article): string {
  const path = articlePath(article);
  const alternates = [
    ...VARIANTS.map(
      (v) =>
        `<xhtml:link rel="alternate" hreflang="${v.hreflang}" href="${xml(
          SITE + v.prefix + path
        )}"/>`
    ),
    `<xhtml:link rel="alternate" hreflang="x-default" href="${xml(
      SITE + X_DEFAULT_PREFIX + path
    )}"/>`,
  ].join("");

  return VARIANTS.map(
    (v) =>
      `<url><loc>${xml(SITE + v.prefix + path)}</loc>` +
      `<lastmod>${xml(toIso(article.publish))}</lastmod>` +
      alternates +
      `</url>`
  ).join("");
}

/**
 * Makes browsers render the sitemap as a readable table instead of raw XML.
 * Crawlers ignore xml-stylesheet, so this changes nothing for Google or Yandex.
 */
// Relative, not absolute: browsers block cross-origin XSLT, so a hard-coded
// https://platina.uz href would fail to render on localhost and staging.
export const STYLESHEET = `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>`;

export function urlsetDocument(body: string): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    STYLESHEET +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
    `xmlns:xhtml="http://www.w3.org/1999/xhtml">` +
    body +
    `</urlset>`
  );
}

export function sendXml(event: any, body: string, maxAge = 3600): string {
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  setHeader(event, "Cache-Control", `public, max-age=${maxAge}`);
  return body;
}
