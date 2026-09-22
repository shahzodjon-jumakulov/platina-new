<script setup>
// Remount on ?page= change so the archive pages behave like real documents.
definePageMeta({
  key: (route) => route.fullPath,
});

const route = useRoute();
const { locale, t } = useI18n();
const category = ref(route.params.category);

const PER_PAGE = 16;
const page = computed(() => Math.max(1, Number(route.query.page) || 1));

// Awaited during setup so the metadata below resolves in the SSR pass. It used
// to be assigned inside watch(categories, ...), which never fires on the
// server — so every category page shipped the generic home page title.
const { data: categoryList } = await useMyFetch("/categories/list", {
  key: `categories-${locale.value}`,
  transform: (data) => data.results,
  default: () => [],
});
const cat = computed(
  () => categoryList.value?.find((item) => item.slug === category.value) || {}
);

const news = ref([]);
const total = ref(0);
const next = ref(null);
const loading = ref(false);
const tempNews = ref([]);
const tempNext = ref(null);

if (category.value === "platina-tv") {
  const { data } = await useMyFetch("/news/video/shorts/", {
    params: { limit: 15, offset: (page.value - 1) * 15 },
  });
  news.value = data.value?.results || [];
  total.value = data.value?.count || 0;
  next.value = data.value?.next || null;
} else {
  const { data } = await useMyFetch("/news/all/", {
    params: {
      categories: category,
      limit: PER_PAGE,
      offset: (page.value - 1) * PER_PAGE,
    },
  });
  news.value = data.value?.results || [];
  total.value = data.value?.count || 0;
  next.value = data.value?.next || null;
}

// Empty pages must be real 404s, not 200s with nothing on them ("soft 404s"),
// which Google treats as low-quality duplicates. Two cases: a ?page= past the
// end of the archive, and a category slug that doesn't exist.
const unknownCategory =
  category.value !== "platina-tv" &&
  categoryList.value?.length > 0 &&
  !cat.value?.slug;

if (!news.value.length && (page.value > 1 || unknownCategory)) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const totalPages = computed(() =>
  Math.max(1, Math.ceil(total.value / (category.value === "platina-tv" ? 15 : PER_PAGE)))
);
const hasPrev = computed(() => page.value > 1);
const hasNext = computed(() => page.value < totalPages.value);
const pageQuery = (n) => ({
  path: `/category/${category.value}`,
  query: n > 1 ? { page: n } : {},
});

const pageTitle = computed(() => {
  // platina-tv is a front-end-only section; the CMS category list doesn't
  // know about it, so it needs its own display name.
  const name =
    cat.value?.name ||
    (category.value === "platina-tv" ? "Platina TV" : category.value);
  const suffix = page.value > 1 ? ` — ${page.value}` : "";
  return `${name} ${t("meta.category_news")}${suffix} | Platina.uz`;
});

useSeoMeta({
  title: () => pageTitle.value,
  description: () => cat.value?.description || t("meta.desc"),
  ogTitle: () => pageTitle.value,
  ogDescription: () => cat.value?.description || t("meta.desc"),
  twitterTitle: () => pageTitle.value,
  twitterDescription: () => cat.value?.description || t("meta.desc"),
  ogImage: () => cat.value?.image,
  twitterImage: () => cat.value?.image,
  ogUrl: () =>
    "https://platina.uz/category/" +
    category.value +
    (page.value > 1 ? `?page=${page.value}` : ""),
});

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

const { generateBreadcrumbList, generateItemList } = useSchemaProperties();
const breadcrumbList = generateBreadcrumbList(
  cat.value?.slug ? cat.value : news.value[0]?.category
);
// Only real articles go in the ItemList: Platina TV shorts have no `publish`
// date, and useNewsUrl() throws without one — that took the whole page down.
const listable = news.value.filter((item) => item?.publish && item?.slug);
useSchemaOrg(
  listable.length
    ? [breadcrumbList, generateItemList(listable, pageTitle.value)]
    : [breadcrumbList]
);
</script>

<template>
  <div class="h-[10rem] md:h-[14rem] overflow-hidden">
    <div
      class="flex-center relative z-[1] h-full max-sm:px-4 bg-cover bg-center bg-blend-luminosity bg-blue"
    >
      <img
        v-if="cat?.image"
        :src="cat?.image"
        alt=""
        role="presentation"
        class="absolute w-full h-full object-cover mix-blend-luminosity"
      />
      <div class="flex flex-col gap-3 md:gap-5 items-center z-[1]">
        <div class="flex items-center gap-4">
          <img
            v-if="cat?.icon"
            :src="cat.icon"
            alt=""
            role="presentation"
            class="select-none w-8 md:w-[3.188rem]"
          />
          <h1 class="text-[2rem] md:text-5xl leading-std font-bold text-white">
            {{ cat?.name || news[0]?.category?.name }}
          </h1>
        </div>
        <p
          v-if="cat?.description"
          class="max-w-md text-center text-sm md:text-base text-white"
        >
          {{ cat.description }}
        </p>
      </div>

      <div
        class="absolute-center size-[30rem] bg-light-blue blur-[9.4rem] z-[0] max-md:opacity-50"
      ></div>
    </div>
  </div>

  <UContainer class="md:py-7">
    <div class="flex flex-col gap-7">
      <section class="grid grid-cols-1 gap-5">
        <div
          v-if="category === 'platina-tv'"
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 max-md:p-4"
        >
          <CardShorts v-for="item in news" :key="item" :video="item" />
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 max-md:bg-white max-md:dark:bg-white-100 max-md:py-4 max-md:rounded-b-xl"
        >
          <article
            v-for="(item, index) in news"
            :key="item.id"
            class="flex flex-col gap-4 max-md:px-4 md:bg-white md:dark:bg-white-100 md:rounded-xl overflow-hidden"
          >
            <UDivider v-if="index !== 0" class="md:hidden" />

            <NuxtLinkLocale
              :to="useNewsUrl(item.publish, item.slug)"
              class="group"
            >
              <article
                class="flex flex-row-reverse max-md:justify-between max-md:gap-3 md:flex-col"
              >
                <BaseOverlayImg
                  :src="item.image_large"
                  :data="item"
                  class="md:!rounded-none max-md:h-20 max-md:shrink-0"
                />
                <div class="md:p-4 flex flex-col gap-1.5">
                  <BaseMeta
                    :category="item.category.name"
                    :date="item.publish"
                  />
                  <h3
                    class="title line-clamp-3 text-sm md:text-base"
                    v-hover-transition
                  >
                    {{ item.title }}
                  </h3>
                </div>
              </article>
            </NuxtLinkLocale>
          </article>
        </div>

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

        <!--
          Real <a href> pagination, rendered server-side. The "load more" button
          above is the primary UX, but crawlers don't click buttons — without
          these links everything past the first page of every category was
          unreachable.
        -->
        <nav
          v-if="totalPages > 1"
          class="col-span-full flex items-center justify-center gap-4 text-sm"
          :aria-label="$t('meta.category_news')"
        >
          <NuxtLinkLocale
            v-if="hasPrev"
            :to="pageQuery(page - 1)"
            rel="prev"
            class="px-3 py-2 rounded-md bg-light-blue-100 dark:bg-light-blue-dark-100 text-light-blue dark:text-light-blue-dark hover:bg-light-blue-200 dark:hover:bg-light-blue-dark-200 transition-colors"
          >
            &larr;
          </NuxtLinkLocale>

          <span class="text-black-400 dark:text-white-400 tabular-nums">
            {{ page }} / {{ totalPages }}
          </span>

          <NuxtLinkLocale
            v-if="hasNext"
            :to="pageQuery(page + 1)"
            rel="next"
            class="px-3 py-2 rounded-md bg-light-blue-100 dark:bg-light-blue-dark-100 text-light-blue dark:text-light-blue-dark hover:bg-light-blue-200 dark:hover:bg-light-blue-dark-200 transition-colors"
          >
            &rarr;
          </NuxtLinkLocale>
        </nav>
      </section>

      <!-- <GroupBusiness transparent-bg /> -->
    </div>
  </UContainer>
</template>
