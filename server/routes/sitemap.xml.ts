/**
 * Sitemap index. Points at the static-pages sitemap, the article chunks, and
 * the Google News sitemap.
 *
 * lastmod is only given where it is true: Google stops trusting a site's
 * lastmods once they turn out to be "now" on every fetch.
 */
export default defineEventHandler(async (event) => {
  // How many chunks exist: from the article count, ≤ 10 min old. Without it
  // there is nothing to list.
  let meta: ArchiveMeta;
  try {
    meta = await getArchiveMeta();
  } catch {
    return sendUnavailable(event);
  }
  const chunks = chunkCount(meta.count);

  // Frozen chunks: newest lastmod per chunk from an hourly pass over the
  // archive (they only move when an old article is edited). Optional in the
  // protocol, so an outage just leaves them out.
  const index = await getArchiveIndex().catch(() => null);
  const lastmods: (string | null)[] = Array.from(
    { length: chunks },
    (_, i) => index?.lastmods[i] ?? null
  );

  // The live chunk is where every new article lands: its lastmod comes from
  // the chunk itself (≤ 10 min old), not from the hourly index.
  const live = await getChunk(chunks - 1, meta).catch(() => null);
  const liveLastmod = live ? chunkLastmod(live) : null;
  if (liveLastmod) lastmods[chunks - 1] = liveLastmod;

  // The news sitemap changes when an article is published: its newest one.
  const latest = await getLatestArticles("uz").catch(() => []);
  const newsLastmod = latest[0] ? toIso(latest[0].publish) : null;

  const entry = (loc: string, lastmod: string | null) =>
    `<sitemap><loc>${xml(loc)}</loc>` +
    (lastmod ? `<lastmod>${xml(lastmod)}</lastmod>` : "") +
    `</sitemap>`;

  const entries = [
    // Home, categories and static pages: the file only changes when a
    // category is added, which nothing here can date.
    entry(`${SITE}/sitemap-pages.xml`, null),
    entry(`${SITE}/news-sitemap.xml`, newsLastmod),
    ...lastmods.map((lastmod, i) => entry(`${SITE}/sitemap-articles.xml?p=${i}`, lastmod)),
  ].join("");

  return sendXml(
    event,
    `<?xml version="1.0" encoding="UTF-8"?>` +
      STYLESHEET +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      entries +
      `</sitemapindex>`,
    300
  );
});
