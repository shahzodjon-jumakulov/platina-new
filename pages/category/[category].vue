<script setup>
const route = useRoute();
const { locale, t } = useI18n();
const category = ref(route.params.category);
const categoryRef = ref(null);

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
  categoryRef.value.style.backgroundImage = `url(${cat.value?.image})`;
});

const { generateBreadcrumbList } = useSchemaProperties();
const breadcrumbList = generateBreadcrumbList(news.value[0]?.category);
useSchemaOrg(breadcrumbList);
</script>

<template>
  <div class="h-[10rem] md:h-[14rem] overflow-hidden">
    <div
      class="flex-center h-full relative z-[1] max-sm:px-4 bg-cover bg-blend-luminosity bg-blue"
      ref="categoryRef"
      :style="{ backgroundImage: `url(${cat?.image})` }"
    >
      <div class="flex flex-col gap-5 items-center z-[1]">
        <div class="flex items-center gap-4">
          <img
            v-if="cat?.icon"
            :src="cat.icon"
            alt=""
            role="presentation"
            class="select-none w-[3.188rem]"
          />
          <h1 class="text-5xl leading-std font-bold text-white">
            {{ cat?.name }}
          </h1>
        </div>
        <p class="max-w-md text-center" v-if="cat?.description">
          {{ cat.description }}
        </p>
      </div>

      <div
        class="absolute-center size-[30rem] bg-light-blue blur-[9.4rem] z-[0] max-md:opacity-50"
      ></div>
    </div>
  </div>

  <UContainer class="py-7 max-sm:px-4">
    <div class="flex flex-col gap-7">
      <section class="grid grid-cols-1 gap-5">
        <div
          v-if="category === 'platina-tv'"
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5"
        >
          <CardShorts v-for="item in news" :key="item" :video="item" />
        </div>

        <div
          v-else
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          <NuxtLinkLocale
            v-for="item in news"
            :key="item.id"
            :to="useNewsUrl(item.publish, item.slug)"
            class="group bg-white dark:bg-white-100 rounded-xl overflow-hidden"
          >
            <article class="flex flex-col">
              <BaseOverlayImg
                :src="item.image_large"
                :data="item"
                class="!rounded-none"
              />
              <div class="p-4 flex flex-col gap-1.5">
                <BaseMeta :category="item.category.name" :date="item.publish" />
                <h3 class="title line-clamp-3 text-base" v-hover-transition>
                  {{ item.title }}
                </h3>
              </div>
            </article>
          </NuxtLinkLocale>
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
