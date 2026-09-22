<script setup>
definePageMeta({
  layout: false,
});

const config = useRuntimeConfig();
const localePath = useLocalePath();
const route = useRoute();
const { short } = route.params;
const { t } = useI18n();
const langs = { uz: "uz-cyril", "o'z": "uz" };
const cookieLang = useCookie("i18n_redirected").value;
const lang = langs[cookieLang] || "uz-cyril";

// This route is a root-level catch-all: every unmatched single-segment path
// lands here. Unhandled fetch failures were surfacing as 500s for what are
// really 404s, which suppressed crawling site-wide.
const { data, error } = await useFetch(`${lang}/api/news/short_slug/${short}/`, {
  baseURL: config.public.baseURL,
});

if (error.value || !data.value?.slug) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const ogTitle = data.value.title || t("meta.title");
const ogDesciption = htmlToText(data.value.short_content) || t("meta.desc");
useSeoMeta({
  title: ogTitle,
  description: ogDesciption,
  ogTitle: ogTitle,
  ogDescription: ogDesciption,
  twitterTitle: ogTitle,
  twitterDescription: ogDesciption,
  author: "Platina.uz",
  ogType: "article",
  ogUrl: "https://platina.uz" + route.path,
  articlePublishedTime: data.value.publish,
  articleTag: data.value.tags.join(", "),
  articleSection: data.value.category.name,
  creator: "Platina.uz",
  twitterCard: "summary_large_image",
  ogImage: data.value.image_large,
  twitterImage: data.value.image_large,
});

const path = localePath(
  useNewsUrl(data.value.publish, data.value.slug),
  cookieLang
);
// A real HTTP redirect rather than a client-side hop, so crawlers and link
// shorteners follow it directly.
//
// 302, NOT 301: the target locale comes from the visitor's `i18n_redirected`
// cookie, so the destination differs per reader. A 301 is cached permanently
// by the browser, which would pin whoever loaded the link first to that script
// forever — even after they switch language. Link equity still reaches the
// article, because the article self-canonicalises.
await navigateTo(path, { redirectCode: 302 });
</script>

<template>
  <h1>Redirecting...</h1>
</template>
