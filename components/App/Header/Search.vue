<script setup>
const ui = {
  rounded: "rounded-lg",
  size: {
    sm: "text-sm",
  },
  padding: {
    sm: "px-5 py-3",
  },
  trailing: {
    padding: { sm: "pe-16" },
  },
  color: {
    white: {
      outline:
        "bg-blue-100 dark:bg-white-100 text-black-500 dark:text-white-500 ring-0 focus:ring-0",
    },
  },
  icon: {
    trailing: {
      padding: { sm: "px-5" },
    },
  },
};
</script>

<template>
  <div>
    <UInput
      :placeholder="$t('search.placeholder')"
      class="w-full h-full max-lg:hidden"
      :ui="ui"
    >
      <template #trailing>
        <IconSearch />
      </template>
    </UInput>
    <div class="max-sm:p-2">
      <IconSearch class="lg:hidden" />
    </div>
  </div>
</template>
