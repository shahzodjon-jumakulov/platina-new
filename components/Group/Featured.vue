<script setup>
const { t, locale } = useI18n();
const news = loadedPinnedNews();

if (
  news.value.lang !== locale.value ||
  news.value.news.length < 7 ||
  news.value.time < Date.now() - 1000 * 60 * 5
) {
  const { data } = await useMyFetch("/news/all/", {
    params: { is_pinned: true, limit: 7 },
    transform: (data) => data.results,
  });
  news.value = { lang: locale.value, news: data.value, time: Date.now() };
}
const pinned = ref(news.value.news[0] || null);
const remaining = ref(news.value.news.slice(1, 7) || []);

const { generateItemList } = useSchemaProperties();
const schemaNodes = generateItemList(news.value.news, t("pinned_news"));
useSchemaOrg(schemaNodes);
</script>

<template>
  <div class="flex flex-col gap-4">
    <NuxtLinkLocale
      :to="useNewsUrl(pinned.publish, pinned.slug)"
      @click="storeSelected(pinned)"
      class="bg-light-blue-100 dark:bg-light-blue-dark-100 rounded-2xl group"
    >
      <article class="flex max-md:flex-col-reverse max-md:gap-3">
        <div class="flex flex-col gap-2 p-4 pt-0 md:p-5 md:max-lg:w-1/2">
          <BaseMeta :category="pinned.category.name" :date="pinned.publish" />
          <h3
            class="title text-lg md:text-2xl !font-semibold"
            v-hover-transition
          >
            {{ pinned.title }}
          </h3>
          <div
            class="short-content text-sm md:text-base"
            v-html="pinned.short_content"
          ></div>
        </div>

        <BaseOverlayImg
          class="md:w-1/2 lg:w-[25.5rem] md:self-center shrink-0 rounded-lg"
          :src="pinned.image_large"
          :data="pinned"
        />
      </article>
    </NuxtLinkLocale>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-y-5">
      <div
        class="flex flex-col gap-4"
        v-for="(item, index) in remaining"
        :key="item.id"
      >
        <UDivider v-if="index !== 0" class="md:hidden" />

        <NuxtLinkLocale
          :to="useNewsUrl(item.publish, item.slug)"
          @click="storeSelected(item)"
          class="group max-sm:mx-4"
        >
          <article
            class="flex justify-between items-start gap-3 md:flex-col-reverse"
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
              :src="item.image_medium"
              :data="item"
              class="max-md:h-20 md:w-full !rounded-lg shrink-0"
            />
          </article>
        </NuxtLinkLocale>
      </div>
    </div>
  </div>
</template>
