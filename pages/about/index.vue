<script setup>
const { t } = useI18n();
const { data } = await useMyFetch("/pages/about/");
const ogImage = data.value.image;

// Without its own title this page inherited the generic home page metadata.
const title = computed(
  () => `${data.value?.name || t("footer.about")} | Platina.uz`
);
const description = computed(() => {
  const text = htmlToText(data.value?.short_content || data.value?.content);
  return text ? text.trim().slice(0, 300) : t("meta.desc");
});

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
});
</script>

<template>
  <UContainer class="md:!max-w-[48rem] grid gap-8 py-4 md:py-8">
    <div class="bg-white dark:bg-white-100 rounded-2xl p-5 flex flex-col gap-5">
      <h1 class="text-blue dark:text-white-600 text-2xl font-bold">
        {{ data.name }}
      </h1>
      <div
        class="content text-black dark:text-white-600"
        v-html="modifyContent(data.short_content)"
      ></div>
      <video
        ref="videoRef"
        v-if="data.video"
        :src="data.video"
        class="rounded-2xl"
        muted
        autoplay
        playsinline
        loop
      ></video>
      <img :src="ogImage" v-if="ogImage" />
      <div
        class="content text-black dark:text-white-600"
        v-html="modifyContent(data.content)"
      ></div>
    </div>

    <SectionSocials class="max-sm:px-4" />
  </UContainer>
</template>

<style scoped lang="scss">
.content > :deep(*:not(:first-child)) {
  margin-top: 1rem;
}

.content:deep(a) {
  color: #0066cc !important;

  .dark & {
    color: #178FE0 !important;
  }
}

.content:deep(a:hover) {
  text-decoration: underline;
}
</style>
