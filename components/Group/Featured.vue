<script setup>
const { locale } = useI18n();
const pinnedNews = loadedPinnedNews();

if (
  pinnedNews.value.lang !== locale.value ||
  pinnedNews.value.news.length < 7 ||
  pinnedNews.value.time < Date.now() - 1000 * 60 * 5
) {
  const { data } = await useMyFetch("/news/all/", {
    params: { is_pinned: true, limit: 7 },
    transform: (data) => data.results,
  });
  pinnedNews.value = { lang: locale.value, news: data.value, time: Date.now() };
}
const pinned = ref(pinnedNews.value.news[0] || null);
const news = ref(pinnedNews.value.news.slice(1, 7) || []);
</script>

<template>
  <div class="flex flex-col md:gap-4">
    <NuxtLinkLocale
      to="/"
      class="bg-light-blue-100 dark:bg-light-blue-dark-100 rounded-2xl"
    >
      <article class="flex flex-col gap-3">
        <BaseOverlayImg
          :src="pinned.image_large"
          :alt="pinned.image_name"
          :title="pinned.title"
        />

        <div class="flex flex-col gap-2 p-4 pt-0">
          <BaseMeta
            :category="pinned.category.name"
            :date="pinned.publish"
          />
          <h3 class="title text-lg md:text-2xl !font-semibold">
            {{ pinned.title }}
          </h3>
          <div
            class="short-content text-sm md:text-base"
            v-html="pinned.short_content"
          ></div>
        </div>
      </article>
    </NuxtLinkLocale>
  </div>
</template>
