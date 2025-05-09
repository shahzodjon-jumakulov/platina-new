<script setup>
const { locale } = useI18n();
const open = ref(false);

watch(locale, () => {
  open.value = false;
});
</script>

<template>
  <UPopover v-model:open="open">
    <button class="px-2 py-3 flex items-center group">
      <span
        class="px-1 text-sm font-medium text-black dark:text-white group-hover:text-light-blue dark:group-hover:text-light-blue-dark"
      >
        {{ $i18n.locale === "uz" ? "Ўзбекча" : "O‘zbekcha" }}
      </span>
      <IconChevronDown :class="open ? '' : ''" />
    </button>

    <template #panel>
      <div class="py-1 flex flex-col">
        <NuxtLink
          :to="$switchLocalePath('uz')"
          class="text-sm text-black dark:text-white hover:bg-blue-100 dark:hover:bg-white-100 px-4 py-2"
          >Ўзбекча</NuxtLink
        >
        <NuxtLink
          :to="$switchLocalePath('o\'z')"
          class="text-sm text-black dark:text-white hover:bg-blue-100 dark:hover:bg-white-100 px-4 py-2"
          >O‘zbekcha</NuxtLink
        >
      </div>
    </template>
  </UPopover>
</template>
