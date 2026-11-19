#!/usr/bin/env node
/**
 * Mock of the Platina CMS API (cp.platina.uz) for testing the frontend —
 * especially the sitemap / RSS routes — WITHOUT touching production.
 *
 *   node scripts/mock-cms.mjs                     # http://localhost:8787
 *   BASE_URL=http://localhost:8787 node .output/server/index.mjs
 *
 * Environment (all optional):
 *   MOCK_PORT      port to listen on                       (default 8787)
 *   MOCK_ARTICLES  number of fake articles                 (default 2500)
 *   MOCK_SITEMAP   0 = /api/news/sitemap/ answers 404, like
 *                  the backend before that endpoint shipped (default 1)
 *   MOCK_BAD       comma-separated archive positions (0-based, oldest first)
 *                  that make /api/news/all/ return 500 whenever the page
 *                  contains them — simulates the rows with missing image
 *                  files (ISSUES.md #4)                    (default none)
 *   MOCK_DELAY_MS  artificial latency per request          (default 20)
 *   MOCK_LOG       1 = print every request
 *
 * Control endpoints (change settings without restarting):
 *   GET /__stats                      request counts per route, peak concurrency
 *   GET /__reset                      zero the counters
 *   GET /__config?sitemap=0&bad=10,11&delay=50
 *
 * Fixture: an article with slug "konstitutsiyaviy-sud-test" published
 * 2023-03-13T09:05:00, for the padded/unpadded date redirect tests.
 */
import http from "node:http";

const PORT = Number(process.env.MOCK_PORT || 8787);
const N = Number(process.env.MOCK_ARTICLES || 2500);

const config = {
  sitemap: process.env.MOCK_SITEMAP !== "0",
  bad: new Set(
    String(process.env.MOCK_BAD || "")
      .split(",")
      .filter(Boolean)
      .map(Number)
  ),
  delay: Number(process.env.MOCK_DELAY_MS ?? 20),
  log: process.env.MOCK_LOG === "1",
};

// ---------------------------------------------------------------- data ----

const CATEGORIES = [
  "jamiyat",
  "siyosat",
  "jahon",
  "iqtisod",
  "sport",
  "madaniyat",
  "maqola",
  "tahlil",
  "video",
].map((slug, i) => ({
  id: i + 1,
  name: slug[0].toUpperCase() + slug.slice(1),
  slug,
  description: `${slug} yangiliklari`,
  icon: null,
  image: null,
}));

const pad = (n) => String(n).padStart(2, "0");
/** Naive "YYYY-MM-DDTHH:MM:SS" (Tashkent wall clock), like the real API. */
const naive = (ms) => {
  const d = new Date(ms);
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
};

// "Now" in Tashkent wall-clock terms, expressed as a UTC timestamp.
const NOW = Date.now() + 5 * 3600 * 1000;
const START = Date.UTC(2022, 0, 1, 8, 0, 0);
const RECENT = 30; // the newest 30 are spread over the last 30 hours

const rows = [];
for (let i = 0; i < N; i++) {
  let t;
  if (i >= N - RECENT) {
    t = NOW - (N - i) * 3600 * 1000 + 10 * 60 * 1000;
  } else {
    const end = NOW - 3 * 24 * 3600 * 1000;
    t = START + Math.floor(((end - START) * i) / (N - RECENT));
  }
  rows.push({ t });
}
// Fixture for the redirect tests.
rows.push({ t: Date.UTC(2023, 2, 13, 9, 5, 0), fixture: "konstitutsiyaviy-sud-test" });
rows.sort((a, b) => a.t - b.t);

const ARTICLES = rows.map((row, i) => {
  const id = i + 1;
  const slug = row.fixture || `maqola-${id}-test-sarlavha`;
  // Like the real API, some timestamps carry microseconds.
  const publish = naive(row.t) + (id % 13 === 0 ? ".250000" : "");
  // Every 7th article was edited two days after publishing.
  const modifiedMs = id % 7 === 0 ? Math.min(row.t + 2 * 86400000, NOW) : row.t;
  const modified = naive(modifiedMs) + (id % 7 === 0 ? ".465691" : "");
  const category = CATEGORIES[id % (CATEGORIES.length - 1)];
  return {
    id,
    position: i, // oldest first
    slug,
    publish,
    modified,
    category,
    tags: [
      `teg-${id % 5}`,
      id % 11 === 0 ? "rare-tag" : "umumiy",
      // A multi-word Cyrillic tag, as real person-name tags are.
      ...(id % 17 === 0 ? ["Пиримқул Қодиров"] : []),
    ],
    is_pinned: id % 97 === 0,
    number_of_views: (id * 7919) % 5000,
    short_slug: id.toString(16).padStart(6, "0"),
  };
});
const BY_SLUG = new Map(ARTICLES.map((a) => [a.slug, a]));
const BY_SHORT = new Map(ARTICLES.map((a) => [a.short_slug, a]));
// Articles imported from WordPress carry the old numeric post id as their
// short_slug; emulate that as 10000 + id (so /?p=10006 → article 6).
for (const a of ARTICLES) BY_SHORT.set(String(10000 + a.id), a);

const LOREM =
  "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod " +
  "tempor incididunt ut labore et dolore magna aliqua.</p>";

/** Full serializer output, roughly as heavy as the real one. */
function full(article, api, base) {
  const cyr = api === "uz-cyril";
  const title = `${cyr ? "Кирилл сарлавҳа" : "Lotin sarlavha"} #${article.id}`;
  return {
    id: article.id,
    translations: Object.fromEntries(
      ["uz", "uz-cyril", "ru"].map((lang) => [
        lang,
        { title: `${lang} ${title}`, slug: article.slug, content: LOREM.repeat(15) },
      ])
    ),
    category: article.category,
    tags: article.tags,
    title,
    short_content: `<p>${title} — qisqa matn &amp; tavsif</p>`,
    content: LOREM.repeat(15),
    slug: article.slug,
    news_status: "published",
    publish: article.publish,
    number_of_views: article.number_of_views,
    is_pinned: article.is_pinned,
    author_choice: false,
    youtube_link: null,
    image_original: article.id % 2 ? `${base}/media/originals/${article.id}.jpg` : null,
    image_large: `${base}/media/images/${article.id}.webp`,
    image_medium: `${base}/media/images/${article.id}-m.webp`,
    image_small: `${base}/media/images/${article.id}-s.webp`,
    image_source: null,
    image_name: null,
    gallery: [],
    short_slug: article.short_slug,
  };
}

// --------------------------------------------------------------- stats ----

let stats;
function resetStats() {
  stats = { total: 0, byRoute: {}, inFlight: 0, maxInFlight: 0, maxInFlightByRoute: {}, recent: [] };
}
resetStats();
const inFlightByRoute = {};

function routeKey(pathname) {
  // Slashless requests are counted separately: each one is a wasted redirect.
  const slashless = !pathname.endsWith("/") && !/\/news\/similar\/\d+$/.test(pathname);
  if (slashless) return `${pathname.replace(/^\/(uz|uz-cyril)\//, "/{api}/").replace(/\/news\/(?!all$|popular$|similar)[^/]+$/, "/news/:slug")} (301)`;
  return pathname
    .replace(/^\/(uz|uz-cyril)\//, "/{api}/")
    .replace(/\/news\/similar\/\d+/, "/news/similar/:id")
    .replace(/\/news\/short_slug\/[^/]+\//, "/news/short_slug/:short/")
    .replace(
      /\/news\/(?!all\/|popular\/|business\/|sitemap\/|video\/|similar\/|short_slug\/)[^/]+\/$/,
      "/news/:slug/"
    );
}

// -------------------------------------------------------------- server ----

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};
const notFound = (res) => json(res, 404, { detail: "No News matches the given query." });
const serverError = (res) => {
  res.writeHead(500, { "content-type": "text/html" });
  res.end("<h1>Server Error (500)</h1>");
};

function paginate(list, url, defaultLimit = 20, maxLimit = Infinity) {
  const limit = Math.min(Number(url.searchParams.get("limit") || defaultLimit), maxLimit);
  const offset = Number(url.searchParams.get("offset") || 0);
  const page = list.slice(offset, offset + limit);
  const link = (o) => {
    const u = new URL(url);
    u.searchParams.set("limit", String(limit));
    u.searchParams.set("offset", String(o));
    return u.toString();
  };
  return {
    page,
    count: list.length,
    next: offset + limit < list.length ? link(offset + limit) : null,
    previous: offset > 0 ? link(Math.max(0, offset - limit)) : null,
  };
}

function filterAll(url) {
  let list = ARTICLES;
  const cats = url.searchParams.get("categories");
  if (cats) {
    const wanted = cats.replace(/[[\]'"\s]/g, "").split(",");
    list = list.filter((a) => wanted.includes(a.category.slug));
  }
  const tag = url.searchParams.get("tags");
  if (tag) list = list.filter((a) => a.tags.includes(tag));
  if (url.searchParams.get("is_pinned") === "true") list = list.filter((a) => a.is_pinned);
  const search = url.searchParams.get("search");
  if (search) list = list.filter((a) => String(a.id).includes(search));
  const ordering = url.searchParams.get("ordering") || "-publish";
  list = [...list];
  if (ordering === "publish") list.sort((a, b) => a.position - b.position);
  else if (ordering === "-number_of_views")
    list.sort((a, b) => b.number_of_views - a.number_of_views);
  else list.sort((a, b) => b.position - a.position);
  return list;
}

async function handle(req, res, url) {
  const base = `http://${req.headers.host}`;
  const m = url.pathname.match(/^\/(uz|uz-cyril)\/api(\/.*)$/);
  if (!m) return json(res, 404, { detail: "Not found." });
  const [, api, rest] = m;

  // Django's APPEND_SLASH: a slashless URL costs an extra 301 round trip
  // (except routes that are declared without one, like news/similar/<id>).
  if (!rest.endsWith("/") && !/^\/news\/similar\/\d+$/.test(rest)) {
    res.writeHead(301, { location: `${url.pathname}/${url.search}` });
    return res.end();
  }

  if (rest === "/news/sitemap/") {
    if (!config.sitemap) return notFound(res); // old backend: hits <str:slug>/
    const { page, count, next, previous } = paginate(ARTICLES, url, 1000, 5000);
    res.setHeader("X-Robots-Tag", "noindex");
    res.setHeader("Cache-Control", "max-age=600");
    return json(res, 200, {
      count,
      next,
      previous,
      results: page.map((a) => ({ slug: a.slug, publish: a.publish, modified: a.modified })),
    });
  }

  if (rest === "/news/all/") {
    const { page, count, next, previous } = paginate(filterAll(url), url);
    if (page.some((a) => config.bad.has(a.position))) return serverError(res);
    return json(res, 200, { count, next, previous, results: page.map((a) => full(a, api, base)) });
  }

  if (rest === "/news/popular/" || rest === "/news/business/") {
    const list = rest === "/news/business/" ? ARTICLES.slice(-6) : ARTICLES.slice(-40);
    const { page, count, next, previous } = paginate([...list].reverse(), url);
    return json(res, 200, { count, next, previous, results: page.map((a) => full(a, api, base)) });
  }

  if (rest === "/news/video/shorts/") {
    const shorts = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      name: `Short ${i + 1}`,
      link: `https://youtube.com/shorts/abcdefghij${i % 10}`,
    }));
    const { page, count, next, previous } = paginate(shorts, url);
    return json(res, 200, { count, next, previous, results: page });
  }

  if (rest === "/categories/list/") {
    return json(res, 200, { count: CATEGORIES.length, next: null, previous: null, results: CATEGORIES });
  }

  if (rest === "/pages/about/") {
    return json(res, 200, { name: "Biz haqimizda", content: LOREM, short_content: LOREM, image: null });
  }

  let mm;
  if ((mm = rest.match(/^\/news\/similar\/(\d+)$/))) {
    const id = Number(mm[1]);
    const similar = ARTICLES.filter((a) => a.id !== id).slice(-4).map((a) => full(a, api, base));
    return json(res, 200, { similar, next_news: null, prev_news: null });
  }

  if ((mm = rest.match(/^\/news\/short_slug\/([^/]+)\/$/))) {
    const a = BY_SHORT.get(mm[1]);
    if (!a) return notFound(res);
    return json(res, 200, { ...full(a, api, base), languages: ["uz", "uz-cyril"] });
  }

  if ((mm = rest.match(/^\/news\/([^/]+)\/?$/))) {
    const a = BY_SLUG.get(decodeURIComponent(mm[1]));
    if (!a) return notFound(res);
    if (config.bad.has(a.position)) return serverError(res);
    return json(res, 200, { ...full(a, api, base), languages: ["uz", "uz-cyril"] });
  }

  return json(res, 404, { detail: "Not found." });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/__stats") return json(res, 200, { ...stats, config: { ...config, bad: [...config.bad] } });
  if (url.pathname === "/__reset") {
    resetStats();
    return json(res, 200, { ok: true });
  }
  if (url.pathname === "/__config") {
    const p = url.searchParams;
    if (p.has("sitemap")) config.sitemap = p.get("sitemap") !== "0";
    if (p.has("bad")) config.bad = new Set(p.get("bad").split(",").filter(Boolean).map(Number));
    if (p.has("delay")) config.delay = Number(p.get("delay"));
    return json(res, 200, { ...config, bad: [...config.bad] });
  }

  // Placeholder article images (3:2, like the real ones), served late so that
  // layout-shift testing sees images arrive after first paint. Not counted.
  if (url.pathname.startsWith("/media/")) {
    await new Promise((r) => setTimeout(r, 400));
    res.writeHead(200, { "content-type": "image/svg+xml", "cache-control": "max-age=3600" });
    return res.end(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">` +
        `<rect width="1200" height="800" fill="#9bb7d4"/></svg>`
    );
  }

  const key = routeKey(url.pathname);
  stats.total++;
  stats.byRoute[key] = (stats.byRoute[key] || 0) + 1;
  stats.inFlight++;
  stats.maxInFlight = Math.max(stats.maxInFlight, stats.inFlight);
  inFlightByRoute[key] = (inFlightByRoute[key] || 0) + 1;
  stats.maxInFlightByRoute[key] = Math.max(stats.maxInFlightByRoute[key] || 0, inFlightByRoute[key]);
  stats.recent.push(`${req.method} ${url.pathname}${url.search}`);
  if (stats.recent.length > 300) stats.recent.shift();
  if (config.log) console.log(`${req.method} ${url.pathname}${url.search}`);

  res.on("close", () => {
    stats.inFlight--;
    inFlightByRoute[key]--;
  });

  if (config.delay) await new Promise((r) => setTimeout(r, config.delay));
  try {
    await handle(req, res, url);
  } catch (error) {
    console.error(error);
    serverError(res);
  }
});

server.listen(PORT, () => {
  console.log(
    `mock CMS on http://localhost:${PORT} — ${ARTICLES.length} articles, ` +
      `sitemap endpoint ${config.sitemap ? "ON" : "OFF (404)"}, ` +
      `bad positions [${[...config.bad].join(",")}], delay ${config.delay}ms`
  );
});
