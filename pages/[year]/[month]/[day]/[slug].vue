<script setup>
definePageMeta({
  // middleware: ["i18n"],
});

const route = useRoute();
const localePath = useLocalePath();
const { locale, t } = useI18n();
const { slug } = route.params;
const selectedNews = useSelectedNews();

const { data, error } = await useMyFetch(`/news/${slug}`, {
  default: () => selectedNews.value || {},
  key: `news-${locale}-${slug}`,
});

// Without this an unknown slug threw on `data.value.tags.join(...)` below and
// Nuxt answered 500. Googlebot reads a 500 as "server is broken" and throttles
// crawling of the whole domain; a 404 just retires the URL.
if (error.value || !data.value?.id) {
  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
    fatal: true,
  });
}

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

// Canonical + hreflang are set globally in app.vue from the current route.

const { generateNewsArticle, generateBreadcrumbList } = useSchemaProperties();
const breadcrumbList = generateBreadcrumbList(data.value.category, data.value);
const schemaNodes = generateNewsArticle(data.value);
useSchemaOrg([schemaNodes, breadcrumbList]);

// Rendered on the server: this is the only thing linking one article to
// another, and with `server: false` an article page shipped zero outbound
// article links, making every story a crawl dead end.
const { data: similarData } = await useMyFetch(
  `/news/similar/${data.value.id}`,
  {
    params: { limit: 4 },
    key: `similar-${locale}-${data.value.id}`,
    default: () => ({ similar: [] }),
  }
);
const similar = computed(() => (similarData.value?.similar || []).slice(0, 4));
</script>

<template>
  <UContainer class="flex flex-col gap-4 md:gap-8 max-sm:pb-5 sm:py-8">
    <div class="flex flex-col items-center gap-5 self-center">
      <SectionDetail :data="data" />

      <SectionDetailSimilar :news="similar" />
    </div>
    <GroupBusiness />
  </UContainer>
</template>
