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

const { data } = await useFetch(`${lang}/api/news/short_slug/${short}/`, {
  baseURL: config.public.baseURL,
});

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
navigateTo(path);
</script>

<template>
  <h1>Redirecting...</h1>
</template>
