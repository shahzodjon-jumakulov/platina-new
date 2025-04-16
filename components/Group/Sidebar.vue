<script setup>
const { t, locale } = useI18n();
const news = loadedLatestNews();

if (
  news.value.lang !== locale.value ||
  news.value.news.length < 7 ||
  news.value.time < Date.now() - 1000 * 60 * 5
) {
  const { data } = await useMyFetch("/news/all/", {
    params: { limit: 7 },
    transform: (data) => data.results,
  });
  news.value = { lang: locale.value, news: data.value, time: Date.now() };
}
const pinned = ref(news.value.news[0] || null);
const remaining = ref(news.value.news.slice(1, 7) || []);
</script>

<template>
  <div class="grid grid-cols-1 md:max-lg:grid-cols-2 gap-4 md:gap-x-5">
    <NuxtLinkLocale
      to="/"
      class="max-md:bg-light-blue-100 max-md:dark:bg-light-blue-dark-100 max-md:rounded-2xl group"
    >
      <article
        class="flex max-md:flex-col-reverse gap-3 md:justify-between"
      >
        <div class="flex flex-col gap-2 max-md:p-4 pt-0">
          <BaseMeta :category="pinned.category.name" :date="pinned.publish" />
          <h3
            class="title text-lg md:text-sm md:line-clamp-3 max-md:!font-semibold"
            v-hover-transition
          >
            {{ pinned.title }}
          </h3>
          <div
            class="short-content text-sm md:hidden"
            v-html="pinned.short_content"
          ></div>
        </div>

        <BaseOverlayImg
          class="md:h-20 shrink-0 rounded-lg"
          :src="pinned.image_large"
          :alt="pinned.image_name"
          :title="pinned.title"
        />
      </article>
    </NuxtLinkLocale>

    <div
      class="flex flex-col gap-4 max-sm:px-4 md:max-lg:last:hidden"
      v-for="(item, index) in remaining"
      :key="item.id"
    >
      <UDivider v-if="index !== 0" />

      <NuxtLinkLocale to="/" class="group">
        <article class="flex justify-between items-start gap-3">
          <div class="flex flex-col gap-2 md:gap-1.5">
            <BaseMeta :category="item.category.name" :date="item.publish" />
            <h3 class="title text-sm line-clamp-3" v-hover-transition>
              {{ item.title }}
            </h3>
          </div>
          <BaseOverlayImg
            :src="item.image_medium"
            :alt="item.image_name"
            :title="item.title"
            :video="item.youtube_link.length > 0"
            class="h-20 !rounded-lg shrink-0"
          />
        </article>
      </NuxtLinkLocale>
    </div>
  </div>
</template>
