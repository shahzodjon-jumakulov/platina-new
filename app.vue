<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { t, locale } = useI18n();
const colorMode = useColorMode();

onMounted(() => {
  setMomentLocale(locale.value);
});

watch(locale, (newVal) => {
  setMomentLocale(newVal);
});

const lang = computed(() => {
  const langs = { "o'z": "uz-Latn", uz: "uz-Cyrl" };
  return langs[locale.value] || locale.value;
});

const langAlternate = computed(() => {
  // dummy code, works only if 2 locales available
  // if more than 2 locales, need to change the logic
  const langs = { "o'z": "uz-Cyrl", uz: "uz-Latn" };
  return langs[locale.value];
});

const themeColor = computed(() => {
  return colorMode.value === "dark" ? "#13142D" : "#ffffff";
});

useHead({
  htmlAttrs: { lang: lang },
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "canonical", href: "https://platina.uz" },
    { rel: "alternate", href: "https://platina.uz", hreflang: "x-default" },
    { rel: "alternate", href: "https://platina.uz/uz", hreflang: "uz-Cyrl" },
    { rel: "alternate", href: "https://platina.uz/o'z", hreflang: "uz-Latn" },
  ],
  meta: [{ name: "theme-color", content: themeColor }],
  script: [
    {
      language: "javascript",
      innerHTML: `<!-- top_js="1.0";top_r="id=47699&r="+escape(document.referrer)+"&pg="+escape(window.location.href);document.cookie="smart_top=1; path=/"; top_r+="&c="+(document.cookie?"Y":"N") //-->`,
    },
    {
      language: "javascript1.1",
      innerHTML: `<!-- top_js="1.1";top_r+="&j="+(navigator.javaEnabled()?"Y":"N") //-->`,
    },
    {
      language: "javascript1.2",
      innerHTML: `<!-- top_js="1.2";top_r+="&wh="+screen.width+'x'+screen.height+"&px="+ (((navigator.appName.substring(0,3)=="Mic"))?screen.colorDepth:screen.pixelDepth) //-->`,
    },
    {
      language: "javascript1.3",
      innerHTML: `<!-- top_js="1.3"; //-->`,
    },
    {
      language: "JavaScript",
      innerHTML: `<!-- top_rat="&col=0063AF&t=ffffff&p=E6850F";top_r+="&js="+top_js+"";document.write('<img src="http://cnt0.www.uz/counter/collect?'+top_r+top_rat+'" width=0 height=0 border=0 alt="platina.uz" style="position: fixed; top:0; left:0; height: 0;">')//-->`,
    },
  ],
  noscript: {
    innerHTML: `<IMG height=0 src="http://cnt0.www.uz/counter/collect?id=47699&pg=http%3A//uzinfocom.uz&&col=0063AF&amp;t=ffffff&amp;p=E6850F" width=0 border=0 alt="platina.uz">`,
  },
});

useSeoMeta({
  title: t("meta.title"),
  description: t("meta.desc"),
  ogTitle: t("meta.title"),
  ogDescription: t("meta.desc"),
  twitterTitle: t("meta.title"),
  twitterDescription: t("meta.desc"),
  twitterCard: "summary_large_image",
  ogImage: "/platina.jpg",
  twitterImage: "/platina.jpg",
  // twitterSite: "@platinauz",
  ogUrl: "https://platina.uz/",
  colorScheme: "light dark",
  ogLocale: lang.value,
  ogLocaleAlternate: [langAlternate.value],
});

const { websiteSchema } = useSchemaProperties();

useSchemaOrg(websiteSchema);
</script>
