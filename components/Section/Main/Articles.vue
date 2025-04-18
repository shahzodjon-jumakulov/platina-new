<script setup>
const isSmallScreen = useMediaQuery("max-width: 768px");

const news = ref([]);
const { data } = await useMyFetch("/news/all/", {
  params: { categories: "maqola", limit: 8 },
  server: false,
  onResponse({ response }) {
    if (response._data?.results?.length) {
      news.value = response._data.results;
    }
  },
});
</script>

<template>
  <BaseCard
    to="/latest"
    :title="$t('article')"
    v-if="!isSmallScreen && news.length"
    class="max-md:hidden"
  >
    <div
      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5 max-sm:px-4"
    >
      <NuxtLinkLocale
        to="/"
        v-for="item in news"
        :key="item.id"
        class="group max-lg:[&:nth-child(n+7)]:hidden"
      >
        <article class="flex flex-col gap-3">
          <BaseOverlayImg
            class="rounded-lg"
            :src="item.image_large"
            :alt="item.image_name"
            :title="item.title"
          />
          <div class="flex flex-col gap-1.5">
            <BaseMeta :category="item.category.name" :date="item.publish" />
            <h3 class="title line-clamp-3" v-hover-transition>
              {{ item.title }}
            </h3>
          </div>
        </article>
      </NuxtLinkLocale>
    </div>
  </BaseCard>
</template>
