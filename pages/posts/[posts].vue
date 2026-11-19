<script setup>
// Remount per ?page= so each archive page behaves like a real document.
definePageMeta({
  key: (route) => route.fullPath,
});

const route = useRoute();
const { t } = useI18n();
const { posts } = route.params;
const titles = { popular: "popular_news", pinned: "pinned_news" };
const title = t(titles[posts] || "latest");

const PER_PAGE = 12;
const page = Math.max(1, Number(route.query.page) || 1);
const pageSuffix = page > 1 ? ` — ${page}` : "";
useSeoMeta({
  title: `${title}${pageSuffix} | Platina.uz`,
  ogTitle: `${title}${pageSuffix} | Platina.uz`,
  twitterTitle: `${title}${pageSuffix} | Platina.uz`,
});

const endpoint = posts === "popular" ? "/news/popular/" : "/news/all/";
const { data, error } = await useMyFetch(endpoint, {
  params: {
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
    ...(posts === "pinned" && { is_pinned: true }),
  },
});

// CMS failure → 503; a ?page= past the end → 404 (not an empty 200 page).
if (error.value) throwApiError(error.value);
if (page > 1 && !data.value?.results?.length) throwApiError(null);

const count = ref(data.value?.count || 0);
const next = ref(data.value?.next || null);
const news = ref(data.value?.results || []);
// "Popular" is a rolling 7-day ranking: not worth paging for crawlers.
const totalPages =
  posts === "popular" ? 1 : Math.max(1, Math.ceil(count.value / PER_PAGE));
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

          <BasePagination
            :page="page"
            :total-pages="totalPages"
            :path="`/posts/${posts}`"
            :label="title"
          />
        </div>
      </div>

      <GroupBusiness transparent-bg />
    </div>
  </UContainer>
</template>
