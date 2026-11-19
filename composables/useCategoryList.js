// Module-level so every caller passes the very same functions: Nuxt then
// treats the calls as one shared fetch under one key.
const transform = (data) => data?.results || [];
const empty = () => [];

/**
 * The category list, fetched once per render and shared by the header nav,
 * the burger menu and the category page (previously two requests per
 * category page, each behind a slashless-URL redirect).
 */
export const useCategoryList = () => {
  const { locale } = useI18n();
  return useMyFetch("/categories/list/", {
    key: `categories-${locale.value}`,
    transform,
    default: empty,
  });
};
