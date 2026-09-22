<script setup>
const { $moment } = useNuxtApp();

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
});

const localDate = computed(() => $moment(props.article.publish).local());
</script>

<template>
  <NuxtLinkLocale
    :to="useNewsUrl(article.publish, article.slug)"
    @click="storeSelected(article)"
    class="group block relative overflow-hidden rounded-2xl md:rounded-lg"
  >
    <article class="relative">
      <img
        :src="article.image_large || article.image_medium"
        :alt="article.image_name?.length ? article.image_name : article.title"
        loading="lazy"
        decoding="async"
        class="w-full aspect-[3/2] object-cover select-none"
      />

      <!-- Figma paints the caption over the bottom 60% of the image; the stops
           in `.cover-scrim` are the design's own gradient ramp. -->
      <div class="cover-scrim absolute inset-x-0 bottom-0 h-[60%]"></div>

      <div
        class="absolute inset-x-0 bottom-0 z-[1] flex flex-col gap-2 md:gap-3 p-4 md:p-[1.125rem]"
      >
        <div class="flex items-center gap-2 text-xs leading-std text-white">
          <span>{{ article.category.name }}</span>
          <IconDot class="shrink-0 [&_path]:!fill-white" />
          <time :datetime="article.publish">{{ $formatDate(localDate) }}</time>
        </div>
        <h3
          class="font-bold text-white text-lg md:text-base !leading-[1.4] line-clamp-4"
        >
          {{ article.title }}
        </h3>
      </div>

      <div
        class="absolute inset-0 bg-white-200 opacity-0 group-hover:opacity-100 transition-opacity"
      ></div>
    </article>
  </NuxtLinkLocale>
</template>

<style scoped>
.cover-scrim {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 7%,
    rgba(0, 0, 0, 0.08) 12%,
    rgba(0, 0, 0, 0.16) 17%,
    rgba(0, 0, 0, 0.22) 21%,
    rgba(0, 0, 0, 0.32) 26%,
    rgba(0, 0, 0, 0.42) 32%,
    rgba(0, 0, 0, 0.52) 38%,
    rgba(0, 0, 0, 0.62) 47%,
    rgba(0, 0, 0, 0.72) 57%,
    rgba(0, 0, 0, 0.82) 65%
  );
}
</style>
