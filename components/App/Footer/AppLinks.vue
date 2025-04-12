<script setup>
import {
  LazyIconApple as IconApple,
  LazyIconGooglePlay as IconGooglePlay,
} from "#components";

const apps = computed(() => [
  {
    id: 1,
    name: "iOS",
    link: "https://play.google.com/store/apps/details?id=uz.platina.mobile",
    component: IconApple,
  },
  {
    id: 2,
    name: "Android",
    link: "https://play.google.com/store/apps/details?id=uz.platina.mobile",
    component: IconGooglePlay,
  },
]);
</script>

<template>
  <div class="flex items-center gap-4">
    <p class="text-sm text-black-500 dark:text-white-500">
      {{ $t("download_app") }}
    </p>
    <NuxtLink
      v-for="item in apps"
      :key="item.id"
      :to="item.link"
      class="px-4 py-3 flex items-center gap-2 bg-light-blue-100 hover:bg-light-blue-200 dark:bg-white-100 dark:hover:bg-white-200 rounded-lg"
    >
      <component :is="item.component" class="w-5 h-6" />
      <span class="text-sm text-black dark:text-white font-medium">
        {{ item.name }}
      </span>
    </NuxtLink>
  </div>
</template>
