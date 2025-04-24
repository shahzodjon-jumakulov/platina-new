<script setup>
const news = ref([]);
const { data } = await useMyFetch("/news/all/", {
  params: { categories: "intervyu", limit: 5 },
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <NuxtLinkLocale
        :to="useNewsUrl(news[0].publish, news[0].slug)"
        @click="storeSelected(news[0])"
        class="group row-span-4 bg-light-blue-100 dark:bg-light-blue-dark-100 rounded-2xl"
      >
        <article class="flex flex-col">
          <BaseOverlayImg
            :src="news[0].image_large"
            :data="news[0]"
            class="!rounded-2xl"
          />

          <div class="p-4 md:p-5 flex flex-col gap-3">
            <BaseMeta
              :date="news[0].publish"
              :category="news[0].category.name"
            />
            <h3
              class="title text-lg md:text-2xl !font-semibold md:line-clamp-3"
              v-hover-transition
            >
              {{ news[0].title }}
            </h3>
            <div
              class="short_content text-sm md:text-base md:line-clamp-2"
              v-html="news[0].short_content"
            ></div>
          </div>
        </article>
      </NuxtLinkLocale>

      <div
        class="flex flex-col gap-4 px-4"
        v-for="(item, index) in news.slice(1)"
        :key="item.id"
      >
        <UDivider v-if="index !== 0" />

        <NuxtLinkLocale
          :to="useNewsUrl(item.publish, item.slug)"
          @click="storeSelected(item)"
          class="group"
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
