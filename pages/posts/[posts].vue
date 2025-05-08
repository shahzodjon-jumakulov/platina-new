<script setup>
const route = useRoute();
const { t } = useI18n();
const { posts } = route.params;
const title = posts === "popular" ? t("popular_news") : t("latest");
useSeoMeta({
  title: `${title} | Platina.uz`,
  ogTitle: `${title} | Platina.uz`,
  twitterTitle: `${title} | Platina.uz`,
})

const endpoint = posts === "popular" ? "/news/popular" : "/news/all";
const { data } = await useMyFetch(endpoint, {
  params: { limit: 12 },
});
const count = ref(data.value?.count || 0);
const next = ref(data.value?.next || null);
const news = ref(data.value?.results || []);
const loading = ref(false);
const tempNews = ref([]);
const tempNext = ref(null);

const loadMore = async () => {
  if (next.value) {
    loading.value = true;
    const moreDate = await $fetch(next.value);
    if (moreDate?.results?.length) {
      tempNews.value = moreDate.results;
      tempNext.value = moreDate.next;
    } else {
      next.value = null;
    }
  }
  loading.value = false;
};

const showMore = () => {
  news.value.push(...tempNews.value);
  next.value = tempNext.value;
  tempNews.value = [];
  tempNext.value = null;

  if (next.value) loadMore();
};

onMounted(() => {
  loadMore();
});
</script>

<template>
  <UContainer class="py-5 max-sm:px-4">
    <div class="flex flex-col gap-8">
      <div class="grid grid-cols-1 gap-4 md:gap-5 !max-w-[38rem] mx-auto">
        <div class="flex items-center gap-2">
          <IconHexagon />
          <h1
            class="text-xl md:text-2xl font-bold leading-none text-blue dark:text-white-600"
          >
            {{ title }}
          </h1>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <NuxtLinkLocale
            v-for="item in news"
            :key="item.id"
            :to="useNewsUrl(item.publish, item.slug)"
            class="group"
          >
            <article class="rounded-lg bg-white dark:bg-white-100 flex">
              <BaseOverlayImg
                :src="item.image_medium || item.image_large"
                :data="item"
                class="h-[5.875rem] md:h-[8.125rem] aspect-[3/2] max-md:rounded-lg shrink-0 self-center"
              />

              <div class="p-4 max-md:px-3 flex flex-col gap-1.5">
                <BaseMeta :category="item.category.name" :date="item.publish" />
                <h3
                  class="title text-sm md:text-base line-clamp-3"
                  v-hover-transition
                >
                  {{ item.title }}
                </h3>
                <div
                  class="line-clamp-3 text-xs text-black-500 dark:text-white-500 max-md:hidden"
                  v-html="item.short_content"
                ></div>
              </div>
            </article>
          </NuxtLinkLocale>

          <UButton
            v-if="next"
            class="col-span-full"
            :label="$t('more_news')"
            variant="soft"
            size="lg"
            block
            @click="showMore"
            :loading="loading"
          />
        </div>
      </div>

      <GroupBusiness transparent-bg />
    </div>
  </UContainer>
</template>
