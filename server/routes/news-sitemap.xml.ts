/**
 * Google News sitemap: articles published in the last 48 hours only, which is
 * what Publisher Center expects. Entry into Top Stories requires this.
 *
 * Each article is listed once per script variant with its own localised
 * headline, so both can surface for their own audience.
 *
 * Data comes from the shared cache (getLatestArticles), never more than a
 * minute old while the CMS answers, and browsers/crawlers may keep the file
 * for a minute too. If the CMS is down, the last good list is served; with
 * nothing cached the variant is simply left out: a valid, shorter file is
 * better for Google than a 500.
 */
const WINDOW_HOURS = 48;

export default defineEventHandler(async (event) => {
  const cutoff = Date.now() - WINDOW_HOURS * 60 * 60 * 1000;
  let degraded = false;

  const perVariant = await Promise.all(
    VARIANTS.map(async (variant) => {
      let results: FeedArticle[] = [];
      try {
        results = await getLatestArticles(variant.api);
      } catch {
        degraded = true;
      }

      return results
        .filter((a) => new Date(toIso(a.publish)).getTime() >= cutoff)
        .map(
          (article) =>
            `<url>` +
            `<loc>${xml(SITE + variant.prefix + articlePath(article))}</loc>` +
            `<news:news>` +
            `<news:publication>` +
            `<news:name>Platina.uz</news:name>` +
            // Google News has a single language code for Uzbek regardless of script.
            `<news:language>uz</news:language>` +
            `</news:publication>` +
            `<news:publication_date>${xml(
              toIso(article.publish)
            )}</news:publication_date>` +
            `<news:title>${xml(article.title)}</news:title>` +
            `</news:news>` +
            (article.image_large
              ? `<image:image><image:loc>${xml(
                  article.image_large
                )}</image:loc></image:image>`
              : "") +
            `</url>`
        )
        .join("");
    })
  );

  return sendXml(
    event,
    `<?xml version="1.0" encoding="UTF-8"?>` +
      STYLESHEET +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
      `xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" ` +
      `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
      perVariant.join("") +
      `</urlset>`,
    degraded ? 30 : 60
  );
});
