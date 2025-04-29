export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();
  const { short } = to.params;
  const langs = { uz: "uz-cyril", "o'z": "uz" };
  const cookieLang = useCookie("i18n_redirected").value;
  const lang = langs[cookieLang] || cookieLang;

  const { data } = await useFetch(`${lang}/api/news/short_slug/${short}/`, {
    baseURL: config.public.baseURL,
  });
  const path = useNewsUrl(data.value.publish, data.value.slug);

  return navigateTo(path, { redirectCode: 301 });
});
