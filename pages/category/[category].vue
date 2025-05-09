<script setup>
const route = useRoute();
const { locale, t } = useI18n();
const category = ref(route.params.category);

const categoriesState = useCategories();
const categories = computed(() => categoriesState.categories.value.categories);
const cat = ref({});
watch(categories, (newVal) => {
  cat.value = newVal.find((item) => item.slug === category.value);
  if (cat.value) {
    const title = `${cat.value.name} ${t("meta.category_news")} | Platina.uz`;
    const description = cat.value.description;
    useSeoMeta({
      title: title,
      description: description,
      ogTitle: title,
      ogDescription: description,
      twitterTitle: title,
      twitterDescription: description,
      ogImage: cat.value.image,
      twitterImage: cat.value.image,
    });
  }
});

useSeoMeta({
  ogUrl: "https://platina.uz/category/" + category.value,
});

const news = ref([]);
const next = ref(null);
const loading = ref(false);
const tempNews = ref([]);
const tempNext = ref(null);

if (category.value === "platina-tv") {
  const { data } = await useMyFetch("/news/video/shorts/", {
    params: { limit: 15 },
  });
  news.value = data.value.results;
  next.value = data.value.next;
} else {
  const { data } = await useMyFetch("/news/all/", {
    params: { categories: category, limit: 16 },
  });
  news.value = data.value.results;
  next.value = data.value.next;
}

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

const { generateBreadcrumbList } = useSchemaProperties();
const breadcrumbList = generateBreadcrumbList(news.value[0]?.category);
useSchemaOrg(breadcrumbList);
</script>

<template>
  <div class="h-[10rem] md:h-[14rem] overflow-hidden">
    <div
      class="flex-center relative z-[1] h-full max-sm:px-4 bg-cover bg-center bg-blend-luminosity bg-blue"
    >
      <img
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
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 p-4"
        >
          <CardShorts v-for="item in news" :key="item" :video="item" />
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 max-md:bg-white max-sm:py-4"
        >
          <article
            v-for="(item, index) in news"
            :key="item.id"
            class="flex flex-col gap-4 max-sm:px-4 md:bg-white md:dark:bg-white-100 md:rounded-xl overflow-hidden"
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
      </section>

      <GroupBusiness transparent-bg />
    </div>
  </UContainer>
</template>
