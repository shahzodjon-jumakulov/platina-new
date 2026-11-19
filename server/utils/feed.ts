/**
 * Shared helpers for the sitemap / news-sitemap / RSS routes.
 *
 * Everything is derived from the CMS API that the site already consumes, so
 * there is no second source of truth to keep in sync. The data fetching and
 * caching for the article archive lives in ./archive.ts.
 */
import { createHash } from "node:crypto";
import type { H3Event } from "h3";

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

/**
 * Articles per `sitemap-articles.xml?p=N` file. Public contract: Google has
 * these URLs, so changing it reshuffles every chunk. Keep it at 1000.
 */
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

/** The minimum an article needs to appear in a sitemap. */
export interface SitemapRow {
  slug: string;
  publish: string;
  /** Last edit, when the API provides it (the /api/news/sitemap/ endpoint does). */
  modified?: string | null;
}

/** What the news sitemap and RSS need — a trimmed copy of the API object. */
export interface FeedArticle extends SitemapRow {
  title: string;
  short_content?: string;
  image_large?: string;
  category?: { name: string };
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
 * day depending on the server's timezone. Month and day stay zero-padded: that
 * is the canonical form (utils/useNewsUrl.js builds the same path).
 */
export function articlePath(article: SitemapRow): string {
  const [year, month, day] = article.publish.slice(0, 10).split("-");
  return `/${year}/${month}/${day}/${article.slug}`;
}

/**
 * Naive Tashkent wall-clock time → W3C datetime. Uzbekistan has no DST, so
 * the offset is always +05:00. Values that already carry an offset are kept.
 */
export function toIso(value: string): string {
  const s = String(value).trim().replace(" ", "T").replace(/\.\d+/, "");
  return /(Z|[+-]\d\d:?\d\d)$/i.test(s) ? s : `${s}+05:00`;
}

export function toRfc822(publish: string): string {
  return new Date(toIso(publish)).toUTCString();
}

/** The date Google should see as "last changed" for an article. */
export function lastmodOf(row: SitemapRow): string {
  return toIso(row.modified || row.publish);
}

/** Strips CMS HTML down to plain text for descriptions. */
export function stripHtml(html?: string): string {
  return String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** One <url> entry per script variant, cross-linked with xhtml:link alternates. */
export function urlEntries(article: SitemapRow): string {
  const path = articlePath(article);
  const lastmod = xml(lastmodOf(article));
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
      `<lastmod>${lastmod}</lastmod>` +
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

/**
 * Sends an XML body with a content-hash ETag, answering conditional requests
 * (If-None-Match) with 304 so crawlers that re-check an unchanged file get
 * an empty response.
 */
export function sendXml(event: H3Event, body: string, maxAge = 3600): string | undefined {
  const etag = `"${createHash("sha1").update(body).digest("base64url").slice(0, 22)}"`;
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  if (handleCacheHeaders(event, { etag, maxAge })) return;
  return body;
}

/**
 * The CMS is down and there is nothing cached to fall back on. 503 + Retry-After
 * tells crawlers to come back later without dropping anything; a 500 (what the
 * old code produced) reads as "this site is broken".
 */
export function sendUnavailable(event: H3Event, retryAfter = 600): string {
  setResponseStatus(event, 503, "Service Unavailable");
  setHeader(event, "Retry-After", retryAfter);
  setHeader(event, "Cache-Control", "no-store");
  setHeader(event, "Content-Type", "text/plain; charset=utf-8");
  return "Temporarily unavailable, please retry later.\n";
}
