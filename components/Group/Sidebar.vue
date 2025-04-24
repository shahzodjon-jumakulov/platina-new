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

const { generateItemList } = useSchemaProperties();
const schemaNodes = generateItemList(news.value.news, t("latest"));
useSchemaOrg(schemaNodes);
</script>

<template>
  <div class="flex flex-col gap-4 lg:gap-5 relative h-full">
    <div class="grow">
      <div class="lg:h-[calc(100%-4rem)] lg:overflow-hidden gradient">
        <div
          class="grid grid-cols-1 md:max-lg:grid-cols-2 gap-4 md:max-lg:gap-x-0"
        >
          <NuxtLinkLocale
            :to="useNewsUrl(pinned.publish, pinned.slug)"
            @click="storeSelected(pinned)"
            class="max-md:bg-light-blue-100 max-md:dark:bg-light-blue-dark-100 max-md:rounded-2xl group md:max-lg:mr-2.5"
          >
            <article
              class="flex max-md:flex-col-reverse gap-3 md:justify-between"
            >
              <div class="flex flex-col gap-2 max-md:p-4 pt-0">
                <BaseMeta
                  :category="pinned.category.name"
                  :date="pinned.publish"
                />
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
                :data="pinned"
              />
            </article>
          </NuxtLinkLocale>

          <div
            class="flex flex-col gap-4 max-sm:px-4 md:max-lg:last:hidden"
            v-for="(item, index) in remaining"
            :key="item.id"
          >
            <UDivider :class="{ 'max-lg:hidden': index === 0 }" />

            <NuxtLinkLocale
              :to="useNewsUrl(item.publish, item.slug)"
              @click="storeSelected(item)"
              class="group"
              :class="[
                { 'md:max-lg:ml-2.5': index % 2 === 0 },
                { 'md:max-lg:mr-2.5': index % 2 === 1 },
              ]"
            >
              <article class="flex justify-between items-start gap-3">
                <div class="flex flex-col gap-2 md:gap-1.5">
                  <BaseMeta
                    :category="item.category.name"
                    :date="item.publish"
                  />
                  <h3 class="title text-sm line-clamp-3" v-hover-transition>
                    {{ item.title }}
                  </h3>
                </div>
                <BaseOverlayImg
                  :src="item.image_medium"
                  :data="item"
                  class="h-20 !rounded-lg shrink-0"
                />
              </article>
            </NuxtLinkLocale>
          </div>
        </div>
      </div>
    </div>

    <div class="lg:absolute bottom-0 left-0 w-full max-sm:px-4">
      <UButton label="Кўпроқ янгиликлар" variant="soft" block size="lg" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.gradient {
  @media (max-width: 768px), (min-width: 1280px) {
    mask-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, #fff 16%);
  }
}
</style>
