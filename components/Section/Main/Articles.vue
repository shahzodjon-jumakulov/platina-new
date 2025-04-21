<script setup>
const news = ref([]);
const { data } = await useMyFetch("/news/all/", {
  params: { categories: "maqola", limit: 8 },
  server: false,
  lazy: true,
  onResponse({ response }) {
    if (response._data?.results?.length) {
      news.value = response._data.results;
    }
  },
});
</script>

<template>
  <GroupCardSlider :news="news" :title="$t('article')" to="/" />
  <!-- class="max-md:hidden" -->
</template>
