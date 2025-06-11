<script setup>
defineProps({
  news: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <section class="grid grid-cols-1 gap-4" v-if="news.length">
    <div class="flex items-center justify-between max-sm:px-4">
      <div class="flex items-center gap-2.5">
        <IconHexagon class="h-2.5 md:h-3" />
        <h2
          class="text-lg md:text-xl font-bold text-blue dark:text-white-600 !leading-[normal]"
        >
          {{ $t("similar") }}
        </h2>
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 md:gap-y-5"
    >
      <NuxtLinkLocale
        v-for="item in news.slice(0, 4)"
        :key="item.id"
        :to="useNewsUrl(item.publish, item.slug)"
        @click="storeSelected(item)"
        class="group bg-white dark:bg-white-100 rounded-xl max-md:p-4"
      >
        <article class="flex max-md:gap-3 md:flex-col">
          <BaseOverlayImg
            class="!rounded-lg md:!rounded-xl max-md:h-20 shrink-0"
            :src="item.image_large || item.image_medium"
            :data="item"
          />
          <div class="flex flex-col gap-1.5 md:p-4">
            <BaseMeta :category="item.category.name" :date="item.publish" />
            <h3
              class="title text-sm md:text-base !leading-std line-clamp-3"
              v-hover-transition
            >
              {{ item.title }}
            </h3>
          </div>
        </article>
      </NuxtLinkLocale>
    </div>
  </section>
</template>
