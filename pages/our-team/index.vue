<script setup>
const { t } = useI18n();
const staffs = useStaffs();

useSeoMeta({
  title: t("footer.team"),
  description: null,
  ogTitle: t("footer.team"),
  ogDescription: null,
  twitterTitle: t("footer.team"),
  twitterDescription: null,
  ogImage: null,
  twitterImage: null,
});
</script>

<template>
  <UContainer class="flex flex-col gap-5 max-sm:px-4 py-4 md:py-8">
    <h1 class="text-blue dark:text-white-600 text-2xl font-bold">{{ $t("footer.team") }}</h1>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      <CardStaff v-for="(item, index) in staffs" :key="index" :staff="item" />
    </div>
  </UContainer>
</template>
