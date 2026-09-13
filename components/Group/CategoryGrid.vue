<script setup>
// Figma "929" family (748:44487 light / 749:51905 dark / 749:48448 mobile):
// a category block rendered as four equal cards on desktop, and as a lead
// story followed by three compact rows on mobile.
const props = defineProps({
  category: {
    type: String,
    required: true,
  },
});

const news = ref([]);

await useMyFetch("/news/all/", {
  key: `category-grid-${props.category}`,
  params: { categories: props.category, limit: 4 },
  server: false,
  lazy: true,
  onResponse({ response }) {
    if (response._data?.results?.length) {
      news.value = response._data.results;
    }
  },
});

const lead = computed(() => news.value[0]);
const rest = computed(() => news.value.slice(1, 4));
</script>

<template>
  <UContainer>
    <BaseCard
      class="!py-0"
      v-if="news.length"
      transparent
      accent
      :title="news[0].category.name"
      :to="`/category/${category}`"
    >
      <!-- Desktop: four equal cards -->
      <div class="max-md:hidden grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLinkLocale
          v-for="item in news"
          :key="item.id"
          :to="useNewsUrl(item.publish, item.slug)"
          @click="storeSelected(item)"
          class="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-white-100 shadow-[3px_4px_8.9px_0px_rgba(0,0,0,0.16)] dark:shadow-none"
        >
          <BaseOverlayImg
            :src="item.image_medium || item.image_large"
            :data="item"
            class="!rounded-none"
          />
          <div class="flex flex-col gap-1.5 px-4 pt-3 pb-4">
            <BaseMeta :category="item.category.name" :date="item.publish" />
            <h3 class="title text-base line-clamp-3" v-hover-transition>
              {{ item.title }}
            </h3>
          </div>
        </NuxtLinkLocale>
      </div>

      <!-- Mobile: lead story, then compact rows -->
      <div class="md:hidden flex flex-col">
        <NuxtLinkLocale
          v-if="lead"
          :to="useNewsUrl(lead.publish, lead.slug)"
          @click="storeSelected(lead)"
          class="group block max-sm:mx-4"
        >
          <article class="flex flex-col gap-3">
            <BaseOverlayImg
              :src="lead.image_large || lead.image_medium"
              :data="lead"
              class="!rounded-2xl"
            />
            <div class="flex flex-col gap-2">
              <BaseMeta :category="lead.category.name" :date="lead.publish" />
              <h3
                class="title text-lg !font-bold line-clamp-4"
                v-hover-transition
              >
                {{ lead.title }}
              </h3>
            </div>
          </article>
        </NuxtLinkLocale>

        <div
          v-if="rest.length"
          class="mt-4 max-sm:mx-4 border-t border-light-blue-300 dark:border-white-300"
        ></div>

        <div
          v-for="(item, index) in rest"
          :key="item.id"
          :class="[
            'py-4 max-sm:mx-4',
            index !== 0 &&
              'border-t border-light-blue-200 dark:border-white-200',
          ]"
        >
          <CardSmall :article="item" />
        </div>
      </div>
    </BaseCard>
  </UContainer>
</template>
