<script setup>
const { locale } = useI18n();
const open = ref(false);

watch(locale, () => {
  open.value = false;
})
</script>

<template>
  <UPopover v-model:open="open">
    <button class="px-2 py-3 flex items-center">
      <span class="px-1 text-sm font-medium text-black dark:text-white">
        {{ $i18n.locale === 'uz' ? 'Ўзбекча' : 'O‘zbekcha' }}
      </span>
      <IconChevronDown :class="open ? '' : ''" />
    </button>

    <template #panel>
      <div class="p-4 flex flex-col gap-2">
        <NuxtLink :to="$switchLocalePath('uz')">Ўзбекча</NuxtLink>
        <NuxtLink :to="$switchLocalePath('o\'z')">O‘zbekcha</NuxtLink>
      </div>
    </template>
  </UPopover>
</template>
