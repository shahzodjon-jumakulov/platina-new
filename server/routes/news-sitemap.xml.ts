/**
 * Google News sitemap: articles published in the last 48 hours only, which is
 * what Publisher Center expects. Entry into Top Stories requires this.
 *
 * Each article is listed once per script variant with its own localised
 * headline, so both can surface for their own audience.
 */
const WINDOW_HOURS = 48;

export default defineCachedEventHandler(
  async (event) => {
    const cutoff = Date.now() - WINDOW_HOURS * 60 * 60 * 1000;

    const perVariant = await Promise.all(
      VARIANTS.map(async (variant) => {
        const { results } = await fetchArticles({
          limit: 100,
          api: variant.api,
        });

        const recent = results.filter(
          (a) => new Date(toIso(a.publish)).getTime() >= cutoff
        );

        return recent
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
      300
    );
  },
  { maxAge: 300, name: "news-sitemap", getKey: () => "news" }
);
