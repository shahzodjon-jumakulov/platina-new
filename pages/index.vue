<script setup>
import Hero from "~/components/Section/Main/Hero.vue";
import Articles from "~/components/Section/Main/Articles.vue";
import Interview from "~/components/Section/Main/Interview.vue";
import Popular from "~/components/Section/Main/Popular.vue";

const news = ref([]);
const { data } = await useMyFetch("/news/all/", {
  params: { categories: "tahlil", limit: 4 },
  server: false,
  lazy: true,
  onResponse({ response }) {
    if (response._data?.results?.length) {
      news.value = response._data.results;
    }
  },
});

const { webpageSchema } = useSchemaProperties();

useSchemaOrg(webpageSchema);
</script>

<template>
  <UContainer>
    <h1 class="sr-only">{{ $t("meta.title") }}</h1>
    <div class="flex flex-col gap-5 sm:py-5">
      <Hero />
      <Articles class="max-md:hidden" />
      <Interview />
      <GroupCardSlider :title="news[0]?.category.name" to="/" :news="news" color="light" />
      <Popular />

      <GroupTvSlider />
      
      <GroupBusiness />
    </div>
  </UContainer>
</template>
