/**
 * RSS 2.0 feed of the latest Latin-script articles.
 *
 * Aggregators, Telegram auto-posters and regional press-monitoring services
 * all consume RSS; without a feed none of them can syndicate the site.
 */
const ITEMS = 30;

// The CMS serves a mix of .webp and .jpg; declaring every image as JPEG makes
// strict feed readers drop the enclosure.
function imageType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  if (ext === "webp") return "image/webp";
  if (ext === "png") return "image/png";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

export default defineCachedEventHandler(
  async (event) => {
    const { results } = await fetchArticles({ limit: ITEMS, api: "uz" });

    const items = results
      .map((article) => {
        const link = SITE + X_DEFAULT_PREFIX + articlePath(article);
        return (
          `<item>` +
          `<title>${xml(article.title)}</title>` +
          `<link>${xml(link)}</link>` +
          `<guid isPermaLink="true">${xml(link)}</guid>` +
          `<pubDate>${xml(toRfc822(article.publish))}</pubDate>` +
          (article.category?.name
            ? `<category>${xml(article.category.name)}</category>`
            : "") +
          `<description>${xml(stripHtml(article.short_content))}</description>` +
          (article.image_large
            ? // RSS 2.0 requires length; 0 is the accepted value when unknown.
              `<enclosure url="${xml(article.image_large)}" length="0" type="${imageType(
                article.image_large
              )}"/>`
            : "") +
          `</item>`
        );
      })
      .join("");

    const lastBuild = results[0]
      ? toRfc822(results[0].publish)
      : new Date().toUTCString();

    return sendXml(
      event,
      `<?xml version="1.0" encoding="UTF-8"?>` +
        `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">` +
        `<channel>` +
        `<title>Platina.uz</title>` +
        `<link>${SITE}</link>` +
        `<description>Oʻzbekiston va jahon yangiliklari</description>` +
        `<language>uz</language>` +
        `<lastBuildDate>${xml(lastBuild)}</lastBuildDate>` +
        `<atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>` +
        items +
        `</channel>` +
        `</rss>`,
      600
    );
  },
  { maxAge: 600, name: "rss", getKey: () => "rss" }
);
