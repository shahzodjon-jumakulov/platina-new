<script setup>
const news = ref([]);
const { data } = await useMyFetch("/news/all/", {
  params: { categories: "intervyu", limit: 8 },
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
  <BaseCard :title="news[0]?.category.name" to="/" v-if="news.length">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-y-4">
      <div
        class="flex flex-col gap-4 max-lg:[&:nth-child(n+6)]:hidden max-sm:px-4"
        v-for="(item, index) in news"
        :key="item.id"
      >
        <UDivider v-if="index !== 0" :class="{ 'lg:hidden': index === 1 }" />

        <NuxtLinkLocale
          :to="useNewsUrl(item.publish, item.slug)"
          @click="storeSelected(item)"
          class="group"
          :class="{
            'lg:pr-2': index % 2 === 0,
            'lg:pl-2': index % 2 === 1,
          }"
        >
          <article class="flex max-md:flex-col gap-3 md:gap-4">
            <BaseOverlayImg
              class="rounded-lg md:h-[7.5rem] shrink-0"
              :src="item.image_medium"
              :data="item"
            />
            <div class="flex flex-col gap-2 md:gap-1.5">
              <BaseMeta :date="item.publish" :category="item.category.name" />
              <h3
                class="title text-lg md:text-base !leading-std line-clamp-2"
                v-hover-transition
              >
                {{ item.title }}
              </h3>
              <div
                class="short_content md:max-lg:text-xs text-sm !leading-snug line-clamp-3"
                v-html="item.short_content"
              ></div>
            </div>
          </article>
        </NuxtLinkLocale>
      </div>
    </div>
  </BaseCard>
</template>
