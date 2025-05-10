export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath();
  const langs = { uz: "uz-cyril", "o'z": "uz" };

  const localeFromPath = to.path.split("/")[1];
  const cookieLang = useCookie("i18n_redirected").value;
  const lang = langs[cookieLang] || cookieLang;
  const path = localePath(to.path, cookieLang);

  if (lang && to.path !== path) {
    console.log("Redirecting to", path);
    return navigateTo(path, { redirectCode: 302 });
  }

  if (langs[localeFromPath] && !lang) {
    // No redirection
  }
});
