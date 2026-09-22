const BASE = "https://platina.uz";

/**
 * Builds the canonical + hreflang set for the page currently being rendered.
 *
 * The canonical is SELF-REFERENCING: the Latin page points at itself, the
 * Cyrillic page points at itself. Previously both pointed at the Cyrillic URL,
 * which told Google to drop the Latin version from the index entirely.
 *
 * @param {string|Function} [path]   Route path to build from. Defaults to the current route.
 * @param {Object}  [options]
 * @param {Function} [options.suffix] Returns a query string (e.g. "?page=3") to append,
 *                                    so paginated pages self-canonicalise instead of
 *                                    collapsing back onto page 1.
 */
export default (path, options = {}) => {
  const localePath = useLocalePath();
  const { locale } = useI18n();
  const route = useRoute();

  const resolve = (loc) => {
    const target = typeof path === "function" ? path() : path || route.path;
    const suffix = options.suffix ? options.suffix() : "";
    return BASE + localePath(target, loc) + suffix;
  };

  const relAlternate = computed(() => [
    { rel: "canonical", href: resolve(locale.value) },
    // "uz" is what browsers actually send for Uzbek and Latin is the default
    // script for that tag, so the Latin variant claims it.
    { rel: "alternate", hreflang: "uz", href: resolve("o'z") },
    { rel: "alternate", hreflang: "uz-Cyrl", href: resolve("uz") },
    { rel: "alternate", hreflang: "x-default", href: resolve("o'z") },
  ]);

  return { relAlternate };
};
