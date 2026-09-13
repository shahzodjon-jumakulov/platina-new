<script setup>
defineProps({
  article: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <NuxtLinkLocale
    :to="useNewsUrl(article.publish, article.slug)"
    @click="storeSelected(article)"
    class="group block"
  >
    <article class="flex items-start gap-3">
      <div class="flex flex-col gap-2 flex-1 min-w-0">
        <BaseMeta :category="article.category.name" :date="article.publish" />
        <h3 class="title text-sm line-clamp-4" v-hover-transition>
          {{ article.title }}
        </h3>
      </div>
      <BaseOverlayImg
        :src="article.image_small"
        :data="article"
        class="h-20 shrink-0 !rounded-lg"
      />
    </article>
  </NuxtLinkLocale>
</template>
