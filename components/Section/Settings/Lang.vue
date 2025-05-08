<script setup>
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const activeTab = ref(locale.value === "uz" ? 0 : 1);
const tabs = [
  {
    name: "Ўзб",
    value: 0,
  },
  {
    name: "O’zb",
    value: 1,
  },
];
watch(activeTab, (val) => {
  if (val === tabs[0].value) {
    navigateTo(switchLocalePath("uz"));
  } else if (val === tabs[1].value) {
    navigateTo(switchLocalePath("o'z"));
  }
});
</script>

<template>
  <div class="p-4 flex flex-col gap-3">
    <h4 class="text-base text-black dark:text-white-600 font-medium">
      {{ $t("site_lang") }}
    </h4>
    <BaseTabs v-model="activeTab" :tabs="tabs" />
  </div>
</template>
