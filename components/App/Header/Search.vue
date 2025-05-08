<script setup>
const isOpen = useSearchModal();
const ui = {
  container: "items-start sm:items-start",
  padding: "sm:p-4",
  overlay: {
    background: "bg-black-500 dark:bg-black-500",
  },
};
</script>

<template>
  <div>
    <AppHeaderCombobox class="max-lg:hidden" />
    <div class="max-sm:p-2 lg:hidden flex">
      <button @click="isOpen = true">
        <IconSearch />
      </button>

      <UModal v-model="isOpen" :ui="ui">
        <AppHeaderCombobox always-open @close="isOpen = false" />
      </UModal>
    </div>
  </div>
</template>
