<script setup>
const { t, locale } = useI18n();


onMounted(() => {
  setMomentLocale(locale.value);
});

watch(locale, (newVal) => {
  setMomentLocale(newVal);
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
