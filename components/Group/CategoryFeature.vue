<script setup>
// Figma "936"/"935" family (748:44700 light / 749:53923 dark / 749:53629 mobile):
// a tinted category block with a large cover story beside two columns of
// compact rows; on mobile the cover stacks above a single list.
const props = defineProps({
  category: {
    type: String,
    required: true,
  },
});

const news = ref([]);

await useMyFetch("/news/all/", {
  key: `category-feature-${props.category}`,
  params: { categories: props.category, limit: 5 },
  server: false,
  lazy: true,
  onResponse({ response }) {
    if (response._data?.results?.length) {
      news.value = response._data.results;
    }
  },
});

const lead = computed(() => news.value[0]);
const rest = computed(() => news.value.slice(1, 5));
</script>

<template>
  <UContainer>
    <BaseCard
      v-if="news.length"
      accent
      surface="bg-light-blue-200 dark:bg-white-200"
      :title="news[0].category.name"
      :to="`/category/${category}`"
      class="max-sm:pb-2"
    >
      <!-- Desktop: cover story beside two columns of rows -->
      <div class="max-md:hidden flex flex-col lg:flex-row gap-5">
        <CardCover
          v-if="lead"
          :article="lead"
          class="shrink-0 lg:basis-[34.7%]"
        />

        <!-- One grid rather than two stacks, so both rows are equal height and
             the row dividers line up across the columns. `grid-flow-col` fills
             top-to-bottom first, matching the design's reading order. The
             dividers sit on the cells' padding edges, which puts each one
             exactly midway between the rows / columns it separates. -->
        <div class="flex-1 grid grid-rows-2 grid-flow-col auto-cols-fr">
          <div
            v-for="(item, index) in rest"
            :key="item.id"
            :class="[
              'flex',
              index >= 2
                ? 'pl-4 border-l border-light-blue-200 dark:border-white-200'
                : 'pr-4',
            ]"
          >
            <div
              :class="[
                'flex w-full',
                index % 2
                  ? 'pt-2 border-t border-light-blue-200 dark:border-white-200'
                  : 'pb-2',
              ]"
            >
              <CardSmall :article="item" class="w-full" />
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile: cover story, then a single list -->
      <!-- The cover runs edge to edge here; only the list below is inset. -->
      <div class="md:hidden flex flex-col">
        <CardCover v-if="lead" :article="lead" />

        <div
          v-if="rest.length"
          class="mt-2 max-sm:mx-4 border-t border-light-blue-300 dark:border-white-300"
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
