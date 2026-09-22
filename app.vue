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
const route = useRoute();

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

// Self-referencing canonical + reciprocal hreflang for every page. Applied here
// rather than per-page so category, tag and static pages stop declaring
// themselves duplicates of the home page.
const { relAlternate } = useRelAlternate(
  () => route.path,
  {
    // Keep ?page=N on the canonical so paginated archives stay indexable.
    suffix: () => {
      const page = Number(route.query.page);
      return page > 1 ? `?page=${page}` : "";
    },
  }
);

// Computed so the canonical follows client-side navigation instead of freezing
// on whichever page was server-rendered first.
const links = computed(() => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  // The API and every article image are served from this origin.
  { rel: "preconnect", href: "https://cp.platina.uz", crossorigin: "" },
  { rel: "dns-prefetch", href: "https://cp.platina.uz" },
  {
    rel: "alternate",
    type: "application/rss+xml",
    title: "Platina.uz",
    href: "https://platina.uz/rss.xml",
  },
  ...relAlternate.value,
]);

useHead({
  htmlAttrs: { lang: lang },
  link: links,
  meta: [{ name: "theme-color", content: themeColor }],
  script: [
    {
      // www.uz national counter. Rewritten from the five legacy
      // `document.write` blocks, which blocked the parser and requested an
      // http:// image from an https:// page (browsers blocked it outright).
      type: "text/javascript",
      tagPosition: "bodyClose",
      innerHTML:
        `(function(){try{` +
        `var r="id=47699&r="+encodeURIComponent(document.referrer)+"&pg="+encodeURIComponent(location.href);` +
        `document.cookie="smart_top=1; path=/";` +
        `r+="&c="+(document.cookie?"Y":"N");` +
        `r+="&j="+(navigator.javaEnabled&&navigator.javaEnabled()?"Y":"N");` +
        `r+="&wh="+screen.width+"x"+screen.height+"&px="+(screen.colorDepth||screen.pixelDepth);` +
        `r+="&js=1.3";` +
        `new Image().src="https://cnt0.www.uz/counter/collect?"+r+"&col=0063AF&t=ffffff&p=E6850F";` +
        `}catch(e){}})();`,
    },
    {
      type: "text/javascript",
      innerHTML:
        `(function(m,e,t,r,i,k,a){` +
        `m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};` +
        `m[i].l=1*new Date();` +
        `for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}` +
        `k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)` +
        `})(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105970426', 'ym');` +
        `ym(105970426, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`,
    },
  ],
  noscript: [
    {
      innerHTML: `<img height="0" width="0" border="0" alt="platina.uz" src="https://cnt0.www.uz/counter/collect?id=47699&amp;pg=https%3A//platina.uz&amp;col=0063AF&amp;t=ffffff&amp;p=E6850F">`,
    },
    {
      innerHTML: `<div><img src="https://mc.yandex.ru/watch/105970426" style="position:absolute; left:-9999px;" alt="" /></div>`,
    },
  ],
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
