export const useMyFetch = async (request, opts) => {
  const { $i18n } = useNuxtApp();
  const locale = $i18n.locale;
  const config = useRuntimeConfig();

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
      ...opts,
    }
  );
};
