<script setup>
const colorMode = useColorMode();

const toggle = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <button class="px-2 py-3 flex items-center group" @click="toggle">
    <IconMoon />
    <span class="text-sm text-black dark:text-white font-medium px-1">
      {{ $t("dark_mode") }}
    </span>
  </button>
</template>
