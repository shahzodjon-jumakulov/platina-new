/**
 * RSS 2.0 feed of the latest Latin-script articles.
 *
 * Aggregators, Telegram auto-posters and regional press-monitoring services
 * all consume RSS; without a feed none of them can syndicate the site.
 *
 * Reuses the news sitemap's cached "latest" list for the Latin variant, so it
 * costs no extra CMS request. If the CMS is down and nothing is cached, an
 * empty but valid channel is served instead of a 500.
 */
const ITEMS = 30;

// The CMS serves a mix of .webp and .jpg; declaring every image as JPEG makes
// strict feed readers drop the enclosure.
function imageType(url: string): string {
  const ext = (url.split("?")[0] ?? "").split(".").pop()?.toLowerCase();
  if (ext === "webp") return "image/webp";
  if (ext === "png") return "image/png";
  if (ext === "gif") return "image/gif";
  return "image/jpeg";
}

export default defineEventHandler(async (event) => {
  let results: FeedArticle[] = [];
  let degraded = false;
  try {
    results = (await getLatestArticles("uz")).slice(0, ITEMS);
  } catch {
    degraded = true;
  }

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
    // Same ≤ 1 min data as the news sitemap; feed readers and Telegram
    // auto-posters should see a new article as soon as Google does.
    degraded ? 30 : 60
  );
});
