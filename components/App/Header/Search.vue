<script setup>
//
</script>

<template>
  <div>
    <UInput
      :placeholder="$t('search.placeholder')"
      class="w-full h-full max-lg:hidden"
      :ui="{ base: 'h-full' }"
    />
    <div class="max-sm:p-2">
      <IconSearch class="lg:hidden" />
    </div>
  </div>
</template>
