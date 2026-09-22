/**
 * Home page, category hubs and the static pages, in both script variants.
 */
const STATIC_PATHS = ["/", "/about", "/our-team", "/reklama"];

export default defineCachedEventHandler(
  async (event) => {
    let categoryPaths: string[] = [];

    try {
      const categories = await $fetch<{ results: { slug: string }[] }>(
        `${CMS}/uz/api/categories/list/`,
        { timeout: 15000 }
      );
      categoryPaths = (categories?.results ?? []).map(
        (c) => `/category/${c.slug}`
      );
    } catch {
      // A category-list outage shouldn't take the whole sitemap down.
    }

    // Must match what the page's own canonical tag emits exactly: the Cyrillic
    // home page is "/", the Latin one is "/o'z" with no trailing slash.
    const localise = (prefix: string, path: string) =>
      SITE + (path === "/" ? prefix || "/" : prefix + path);

    const body = [...STATIC_PATHS, ...categoryPaths]
      .map((path) => {
        const alternates = [
          ...VARIANTS.map(
            (v) =>
              `<xhtml:link rel="alternate" hreflang="${v.hreflang}" href="${xml(
                localise(v.prefix, path)
              )}"/>`
          ),
          `<xhtml:link rel="alternate" hreflang="x-default" href="${xml(
            localise(X_DEFAULT_PREFIX, path)
          )}"/>`,
        ].join("");

        return VARIANTS.map(
          (v) =>
            `<url><loc>${xml(localise(v.prefix, path))}</loc>` +
            `<changefreq>daily</changefreq>` +
            `<priority>${path === "/" ? "1.0" : "0.7"}</priority>` +
            alternates +
            `</url>`
        ).join("");
      })
      .join("");

    return sendXml(event, urlsetDocument(body));
  },
  { maxAge: 3600, name: "sitemap-pages", getKey: () => "pages" }
);
