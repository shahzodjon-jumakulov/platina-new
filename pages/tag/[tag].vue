<script setup>
const route = useRoute();
const { tag } = route.params;
const { popular } = route.query;
const term = ref(tag ? decodeURIComponent(tag) : null);
useSeoMeta({
  title: `${term.value} | Platina.uz`,
  ogTitle: `${term.value} | Platina.uz`,
  twitterTitle: `${term.value} | Platina.uz`,
});

const activeTab = ref(popular ? 1 : 0);
const tabs = [
  {
    name: "sort.latest",
    value: 0,
  },
  {
    name: "sort.popular",
    value: 1,
  },
];
watch(activeTab, (val) => {
  if (val === tabs[0].value) {
    navigateTo({ query: { popular: undefined } });
  } else if (val === tabs[1].value) {
    navigateTo({ query: { popular: true } });
  }
});

const { data } = await useMyFetch("/news/all", {
  params: {
    tags: tag,
    limit: 12,
    ordering: popular ? "-number_of_views" : "",
  },
});
const next = ref(data.value?.next || null);
const news = ref(data.value?.results || []);
const loading = ref(false);
const tempNews = ref([]);
const tempNext = ref(null);

const initNews = async (isPopular = false) => {
  loading.value = true;
  const { data: newData } = await useMyFetch("/news/all", {
    params: {
      tags: tag,
      limit: 12,
      ordering: isPopular ? "-number_of_views" : "",
    },
  });
  next.value = newData.value?.next || null;
  news.value = newData.value?.results || [];
  loading.value = false;
};
watch(
  () => route.query,
  (newVal) => initNews(newVal.popular)
);

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
        <div class="flex max-md:flex-col gap-3 md:gap-4 justify-between">
          <div class="flex items-center gap-3">
            <IconSearchHexagon :loading="loading" hashtag />

            <h1
              class="text-xl font-bold leading-none text-blue dark:text-white-600"
            >
              {{ term }}
            </h1>
          </div>

          <BaseTabs v-model="activeTab" :tabs="tabs" :disabled="loading" />
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
                :src="item.image_medium"
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
