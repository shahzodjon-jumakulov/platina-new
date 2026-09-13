<script setup>
const { t, locale } = useI18n();

const tabs = [
  { value: "latest", name: "latest" },
  { value: "popular", name: "popular" },
];
const activeTab = ref("latest");

const news = loadedLatestNews();

if (
  news.value.lang !== locale.value ||
  news.value.news.length < 6 ||
  news.value.time < Date.now() - 1000 * 60 * 5
) {
  const { data } = await useMyFetch("/news/all/", {
    params: { limit: 6 },
    transform: (data) => data.results,
  });
  news.value = { lang: locale.value, news: data.value, time: Date.now() };
}

// Popular is kept out of the initial render so the first paint stays a single
// request, but it is warmed as soon as the page goes idle — by the time the
// tab is clicked the data is usually already there.
const {
  data: popularData,
  status: popularStatus,
  execute: fetchPopular,
} = await useMyFetch("/news/popular/", {
  key: "sidebar-popular",
  params: { limit: 6 },
  server: false,
  immediate: false,
  transform: (data) => data.results,
});

const popular = computed(() => popularData.value || []);

const loadPopular = () => {
  if (popularStatus.value === "idle") fetchPopular();
};

onMounted(() => {
  const whenIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
  whenIdle(() => loadPopular());
});

// Still needed for the case where the tab is clicked before the warm-up runs.
watch(activeTab, (tab) => {
  if (tab === "popular") loadPopular();
});

const items = computed(() =>
  activeTab.value === "popular" ? popular.value : news.value.news
);

// Only reachable if the click beats the prefetch; keeps the rail from
// collapsing to an empty box while the request is in flight.
const showSkeleton = computed(
  () =>
    activeTab.value === "popular" &&
    !popular.value.length &&
    popularStatus.value !== "error"
);

const moreLink = computed(() =>
  activeTab.value === "popular" ? "/posts/popular" : "/posts/latest"
);

const { generateItemList } = useSchemaProperties();
const schemaNodes = generateItemList(news.value.news, t("latest"));
useSchemaOrg(schemaNodes);
</script>

<template>
  <div
    class="flex flex-col gap-4 lg:gap-5 rounded-2xl p-4 sm:p-5 bg-light-blue-100 dark:bg-white-100 h-full"
  >
    <BaseTabs v-model="activeTab" :tabs="tabs" size="lg" />

    <div class="grow min-h-0 lg:overflow-hidden gradient">
      <div
        v-if="showSkeleton"
        class="grid grid-cols-1 md:max-lg:grid-cols-2 gap-4 md:max-lg:gap-x-5"
      >
        <div class="flex flex-col gap-4" v-for="n in 6" :key="n">
          <UDivider v-if="n !== 1" :class="{ 'md:max-lg:hidden': n === 2 }" />

          <div class="flex justify-between items-start gap-4">
            <div class="flex flex-col gap-1.5 grow">
              <USkeleton
                class="h-[0.875rem] w-28 bg-light-blue-200 dark:bg-white-200"
              />
              <USkeleton
                class="h-4 w-full bg-light-blue-200 dark:bg-white-200"
              />
              <USkeleton class="h-4 w-4/5 bg-light-blue-200 dark:bg-white-200" />
            </div>
            <USkeleton
              class="w-[129px] aspect-[3/2] shrink-0 !rounded-lg bg-light-blue-200 dark:bg-white-200"
            />
          </div>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:max-lg:grid-cols-2 gap-4 md:max-lg:gap-x-5"
      >
        <div
          class="flex flex-col gap-4"
          v-for="(item, index) in items"
          :key="item.id"
        >
          <UDivider
            v-if="index !== 0"
            :class="{ 'md:max-lg:hidden': index === 1 }"
          />

          <NuxtLinkLocale
            :to="useNewsUrl(item.publish, item.slug)"
            @click="storeSelected(item)"
            class="group"
          >
            <article class="flex justify-between items-start gap-4">
              <div class="flex flex-col gap-1.5">
                <BaseMeta :category="item.category.name" :date="item.publish" />
                <h3 class="title text-base line-clamp-3" v-hover-transition>
                  {{ item.title }}
                </h3>
              </div>
              <!-- /news/popular/ only returns image_large, no image_medium -->
              <BaseOverlayImg
                :src="item.image_medium || item.image_large"
                :data="item"
                class="w-[129px] shrink-0 !rounded-lg"
              />
            </article>
          </NuxtLinkLocale>
        </div>
      </div>
    </div>

    <UButton variant="soft" block size="lg" :to="$localePath(moreLink)">
      {{ $t("more_news") }}
      <IconArrowRight
        class="size-5 [&_path]:!stroke-light-blue dark:[&_path]:!stroke-light-blue-dark"
      />
    </UButton>
  </div>
</template>

<style scoped lang="scss">
.gradient {
  @media (max-width: 768px), (min-width: 1280px) {
    mask-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, #fff 16%);
  }
}
</style>
