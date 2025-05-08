<script setup>
const colorMode = useColorMode();

const toggle = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <button class="px-2 py-3 flex items-center group" @click="toggle">
    <IconMoon />
    <span
      v-hover-transition
      class="text-sm text-black dark:text-white group-hover:text-light-blue dark:group-hover:text-light-blue-dark font-medium px-1"
    >
      {{ $t("dark_mode") }}
    </span>
  </button>
</template>
