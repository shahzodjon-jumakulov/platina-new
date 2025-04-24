<script setup>
defineProps({
  article: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <NuxtLinkLocale to="/" class="group">
    <article class="py-4 flex justify-between items-start gap-3">
      <div class="flex flex-col gap-2">
        <BaseMeta :category="article.category.name" :date="article.publish" />
        <h3 class="title text-sm">{{ article.title }}</h3>
      </div>
      <BaseOverlayImg
        :src="article.image_small"
        :data="article"
        class="h-20 shrink-0 !rounded-lg"
      />
    </article>
  </NuxtLinkLocale>
</template>
