<script setup>
const route = useRoute();
const { slug } = route.params;
const selectedNews = useSelectedNews();

const { data } = await useMyFetch(`/news/${slug}`, {
  default: () => selectedNews.value || {},
});

const { generateNewsArticle } = useSchemaProperties();
const schemaNodes = generateNewsArticle(data.value);
useSchemaOrg(schemaNodes);

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
    <GroupCardSlider :news="similar" :title="$t('similar')" />
    <GroupBusiness />
  </UContainer>
</template>
