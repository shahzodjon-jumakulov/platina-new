/**
 * Sitemap index. Points at the static-pages sitemap, the article chunks, and
 * the Google News sitemap.
 */
export default defineEventHandler(async (event) => {
  let index: IndexData;
  try {
    index = await getArchiveIndex();
  } catch {
    return sendUnavailable(event);
  }

  const now = new Date().toISOString();

  const entry = (loc: string, lastmod: string | null) =>
    `<sitemap><loc>${xml(loc)}</loc>` +
    (lastmod ? `<lastmod>${xml(lastmod)}</lastmod>` : "") +
    `</sitemap>`;

  const entries = [
    // These two genuinely do change on every publish.
    entry(`${SITE}/sitemap-pages.xml`, now),
    entry(`${SITE}/news-sitemap.xml`, now),
    // Chunks are oldest-first, so all but the last are frozen; each carries
    // the newest lastmod (edit, else publish date) among its articles.
    ...index.lastmods.map((lastmod, i) =>
      entry(`${SITE}/sitemap-articles.xml?p=${i}`, lastmod)
    ),
  ].join("");

  return sendXml(
    event,
    `<?xml version="1.0" encoding="UTF-8"?>` +
      STYLESHEET +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      entries +
      `</sitemapindex>`
  );
});
