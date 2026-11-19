/**
 * Permanent redirects for old and duplicate URL forms, answered before Vue
 * renders anything.
 *
 *  /uz, /uz/...                → /...        (no CMS request)
 *  /o’z/ /oʻz/ /o‘z/ /oz/ /o%27z/ → /o'z/   (no CMS request)
 *  /feed, /feed/               → /rss.xml    (no CMS request)
 *  /?p=<n>                     → article     (WordPress post id → short_slug)
 *  /YYYY/MM/DD/<n>             → article     (same; the 2024 import re-slugged)
 *
 * `/uz/...`: the i18n strategy is `prefix_and_default`, so every Cyrillic page
 * was also served under an explicit `/uz` prefix. Nothing on the site links
 * there, but Google holds ~12.5k of them ("Alternate page with proper
 * canonical tag"); a 301 consolidates them for good.
 *
 * The Latin-prefix lookalikes used to be handled by middleware/latn.global.ts,
 * which never fired: Vue Router hands it the already-decoded path.
 */
import type { H3Event } from "h3";

const LATIN_LOOKALIKES = new Set(["o’z", "oʻz", "o‘z", "o`z", "o´z", "oz", "o'z"]);

const CANONICAL_HOST = "https://platina.uz";

/** WordPress post ids were imported as `short_slug`. */
async function findByShortSlug(
  event: H3Event,
  id: string,
  latin: boolean
): Promise<{ slug: string; publish: string } | null | undefined> {
  const base = useRuntimeConfig(event).public.baseURL;
  try {
    const article = await $fetch<{ slug?: string; publish?: string }>(
      `${base}/${latin ? "uz" : "uz-cyril"}/api/news/short_slug/${id}/`,
      { timeout: 5000, retry: 0 }
    );
    return article?.slug && article?.publish
      ? { slug: article.slug, publish: article.publish }
      : null;
  } catch (error) {
    // null = the CMS says it doesn't exist; undefined = couldn't tell.
    return statusOf(error) === 404 ? null : undefined;
  }
}

function articleUrl(article: { slug: string; publish: string }, latin: boolean) {
  const [y, m, d] = article.publish.slice(0, 10).split("-");
  return `${CANONICAL_HOST}${latin ? "/o'z" : ""}/${y}/${m}/${d}/${encodeURIComponent(article.slug)}`;
}

export default defineEventHandler(async (event) => {
  const raw = event.path || "/";
  const q = raw.indexOf("?");
  const pathname = q === -1 ? raw : raw.slice(0, q);
  const search = q === -1 ? "" : raw.slice(q);

  // Cheap exit for build assets and Nuxt internals.
  if (pathname.startsWith("/_nuxt/") || pathname.startsWith("/__")) return;

  // /uz → /, /uz/<rest> → /<rest>
  if (pathname === "/uz" || pathname.startsWith("/uz/")) {
    return sendRedirect(event, (pathname.slice(3) || "/") + search, 301);
  }

  // Latin prefix lookalikes → /o'z
  const firstEnd = pathname.indexOf("/", 1);
  const first = firstEnd === -1 ? pathname.slice(1) : pathname.slice(1, firstEnd);
  let decodedFirst = first;
  try {
    decodedFirst = decodeURIComponent(first);
  } catch {
    // leave as is
  }
  if (first !== "o'z" && LATIN_LOOKALIKES.has(decodedFirst)) {
    const rest = firstEnd === -1 ? "" : pathname.slice(firstEnd);
    return sendRedirect(event, `/o'z${rest}` + search, 301);
  }

  if (pathname === "/feed" || pathname === "/feed/") {
    return sendRedirect(event, "/rss.xml", 301);
  }

  // /?p=1234 (WordPress permalink by post id)
  if (pathname === "/" || pathname === "/o'z") {
    const p = getQuery(event).p;
    if (typeof p === "string" && /^\d{1,7}$/.test(p)) {
      const latin = pathname === "/o'z";
      const article = await findByShortSlug(event, p, latin);
      if (article) return sendRedirect(event, articleUrl(article, latin), 301);
      if (article === null) {
        throw createError({ statusCode: 404, statusMessage: "Page not found" });
      }
      // CMS unreachable: fall through to the home page.
    }
    return;
  }

  // /YYYY/MM/DD/<numeric id>
  const legacy = /^(\/o'z)?\/\d{4}\/\d{1,2}\/\d{1,2}\/(\d{1,7})\/?$/.exec(pathname);
  if (legacy) {
    const latin = !!legacy[1];
    const article = await findByShortSlug(event, legacy[2]!, latin);
    if (article) return sendRedirect(event, articleUrl(article, latin), 301);
    // Not found / CMS down: let the article page answer (404 / 503).
  }
});
