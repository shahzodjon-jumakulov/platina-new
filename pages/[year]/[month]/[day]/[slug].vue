<script setup>
definePageMeta({
  middleware: ["i18n"],
});

const route = useRoute();
const localePath = useLocalePath();
const { locale, t } = useI18n();
const { slug } = route.params;
const selectedNews = useSelectedNews();

const { data } = await useMyFetch(`/news/${slug}`, {
  default: () => selectedNews.value || {},
  key: `news-${locale}-${slug}`,
});

useSeoMeta({
  title: data.value.title || $t("meta.title"),
  description: htmlToText(data.value.short_content) || t("meta.desc"),
  ogTitle: data.value.title || $t("meta.title"),
  ogDescription: htmlToText(data.value.short_content) || t("meta.desc"),
  twitterTitle: data.value.title || $t("meta.title"),
  twitterDescription: htmlToText(data.value.short_content) || t("meta.desc"),
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

const { relAlternate } = useRelAlternate(route.path);
useHead({
  link: relAlternate,
});

const { generateNewsArticle, generateBreadcrumbList } = useSchemaProperties();
const breadcrumbList = generateBreadcrumbList(data.value.category, data.value);
const schemaNodes = generateNewsArticle(data.value);
useSchemaOrg([schemaNodes, breadcrumbList]);

const similar = ref([]);
await useMyFetch(`/news/similar/${data.value?.id}`, {
  params: { limit: 4 },
  server: false,
  lazy: true,
  onResponse({ response }) {
    if (response._data?.similar?.length) {
      similar.value = response._data.similar.slice(0, 4);
    }
  },
});
</script>

<template>
  <UContainer class="flex flex-col items-center gap-4 md:gap-5 sm:py-5">
    <SectionDetail :data="data" />
    <GroupCardSlider :news="similar" :title="$t('similar')" transparent-bg />
    <GroupBusiness transparent-bg />
  </UContainer>
</template>
