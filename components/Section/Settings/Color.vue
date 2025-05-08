<script setup>
const { locale } = useI18n();
const colorMode = useColorMode();

const activeTab = ref(colorMode.value === "dark" ? 1 : 0);
const tabs = [
  {
    name: "light",
    value: 0,
  },
  {
    name: "dark",
    value: 1,
  },
];
watch(activeTab, (val) => {
  if (val === tabs[0].value) {
    colorMode.preference = "light";
  } else if (val === tabs[1].value) {
    colorMode.preference = "dark";
  }
});
</script>

<template>
  <div class="p-4 flex flex-col gap-3">
    <h4 class="text-base text-black dark:text-white-600 font-medium">
      {{ $t("site_appearance") }}
    </h4>
    <BaseTabs v-model="activeTab" :tabs="tabs" />
  </div>
</template>
