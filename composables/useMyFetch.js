// The list endpoints (/news/all/, /news/popular/, …) return every article's
// full body (`content`), which no list displays. With it, the SSR payload of
// the home page carried ~140 KB of article HTML for its ten pinned/latest
// stories (406 KB → 258 KB raw, 94 KB → 56 KB gzip without it), all of it on
// the critical path before the LCP image. Only the article page uses
// `content`, and it gets it from the detail endpoint (an object, not a list).
// Server only: in the browser the bytes are already downloaded, and the
// article page falls back to the clicked list item (useSelectedNews) when its
// own request fails, which needs the body.
const dropListBodies = (data) => {
  if (!import.meta.server || !Array.isArray(data?.results)) return;
  for (const item of data.results) {
    if (item && typeof item === "object") delete item.content;
  }
};

export const useMyFetch = async (request, opts) => {
  const { $i18n } = useNuxtApp();
  const locale = $i18n.locale;
  const config = useRuntimeConfig();
  const { onResponse, ...rest } = opts || {};

  return await useFetch(
    () =>
      `${
        locale.value === "o'z"
          ? "uz"
          : locale.value === "uz"
          ? "uz-cyril"
          : locale.value
      }/api${request}`,
    {
      baseURL: config.public.baseURL,
      // SSR must not hang on a stuck CMS: give up and let the page answer 503
      // (composables/throwApiError.js) instead of holding the connection
      // until nginx times out.
      timeout: import.meta.server ? 10000 : 15000,
      // No automatic retry during SSR: when the CMS is overloaded a retry
      // only doubles the load. The browser keeps ofetch's single retry.
      ...(import.meta.server && { retry: 0 }),
      ...rest,
      // Runs before `transform` and before the caller's own onResponse.
      onResponse(ctx) {
        dropListBodies(ctx.response?._data);
        return onResponse?.(ctx);
      },
    }
  );
};
