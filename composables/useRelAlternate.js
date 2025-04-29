export default (fullPath) => {
  const localePath = useLocalePath();
  const path = localePath(fullPath, "uz");

  const locales = [
    { code: "x-default", value: "" },
    { code: "uz-Latn", value: "/o'z" },
    { code: "uz-Cyrl", value: "/uz" },
  ];

  const relAlternate = computed(() => {
    const alternates = locales.map((loc) => {
      return {
        rel: "alternate",
        hrefLang: loc.code,
        href: `https://platina.uz${loc.value}${path}`,
      };
    });

    const canonical = {
      rel: "canonical",
      href: `https://platina.uz${path}`,
    };

    return [canonical, ...alternates];
  });

  return {
    relAlternate,
  };
};
