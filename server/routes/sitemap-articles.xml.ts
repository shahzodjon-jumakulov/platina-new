/**
 * One chunk of the article archive: ARTICLES_PER_CHUNK articles, each emitted
 * once per script variant.
 *
 * The chunk number is a query parameter rather than a path segment because
 * Nitro does not match route params that sit mid-segment
 * (`sitemap-articles-[n].xml`). Google accepts sitemap URLs with query strings.
 */
export default defineCachedEventHandler(
  async (event) => {
    const raw = getQuery(event).p ?? "0";
    const n = Number(raw);

    if (!Number.isInteger(n) || n < 0) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    const results = await fetchArticlesResilient({
      limit: ARTICLES_PER_CHUNK,
      offset: n * ARTICLES_PER_CHUNK,
      // Oldest-first: keeps every chunk but the last one byte-stable as the
      // newsroom publishes. See SITEMAP_ORDERING.
      ordering: SITEMAP_ORDERING,
    });

    if (!results.length && n > 0) {
      throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return sendXml(event, urlsetDocument(results.map(urlEntries).join("")));
  },
  {
    maxAge: 3600,
    name: "sitemap-articles",
    getKey: (event) => `chunk-${getQuery(event).p ?? "0"}`,
  }
);
