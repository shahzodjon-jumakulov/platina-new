<script setup>
const news = ref([]);
const { data } = await useMyFetch("/news/popular/", {
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
  <BaseCard to="/" :title="$t('popular')" v-if="news.length">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5">
      <NuxtLinkLocale to="/" class="group">
        <article
          class="max-md:bg-light-blue-100 max-md:dark:bg-light-blue-dark-100 rounded-2xl flex flex-col gap-3"
        >
          <BaseOverlayImg
            :src="news[0].image_small"
            :alt="news[0].image_name"
            :title="news[0].title"
            :video="news[0].youtube_link"
          />

          <div class="flex flex-col gap-2 md:gap-1.5 max-md:p-4 pt-0">
            <BaseMeta
              :category="news[0].category.name"
              :date="news[0].publish"
            />
            <h3
              class="title text-lg md:text-base max-md:!font-semibold"
              v-hover-transition
            >
              {{ news[0].title }}
            </h3>
            <div
              class="short-content text-sm md:hidden"
              v-html="news[0].short_content"
            ></div>
          </div>
        </article>
      </NuxtLinkLocale>

      <div
        class="max-sm:px-4 flex flex-col gap-4 md:max-lg::[&:nth-child(n+7)]:hidden lg:[&:nth-child(n+9)]:hidden"
        v-for="(item, index) in news.slice(1)"
        :key="item.id"
      >
        <UDivider v-if="index !== 0" class="md:hidden" />

        <NuxtLinkLocale to="/" class="group">
          <article
            class="flex justify-between items-start md:flex-col-reverse gap-3"
          >
            <div class="flex flex-col gap-2 md:gap-1.5">
              <BaseMeta :category="item.category.name" :date="item.publish" />
              <h3
                class="title text-sm md:text-base line-clamp-3"
                v-hover-transition
              >
                {{ item.title }}
              </h3>
            </div>

            <BaseOverlayImg
              class="max-md:h-20 shrink-0 !rounded-lg"
              :src="item.image_small"
              :alt="item.image_name"
              :title="item.title"
              :video="item.youtube_link"
            />
          </article>
        </NuxtLinkLocale>
      </div>
    </div>
  </BaseCard>
</template>
