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
    <article class="flex flex-col gap-2.5">
      <BaseOverlayImg
        :src="article.image_small"
        :data="article"
        class="shrink-0 !rounded-lg"
      />
      <div class="flex flex-col gap-1.5">
        <BaseMeta :category="article.category.name" :date="article.publish" />
        <h3 class="title text-base">{{ article.title }}</h3>
      </div>
    </article>
  </NuxtLinkLocale>
</template>
