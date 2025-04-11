<script setup>
//
</script>

<template>
  <div class="min-h-[100svh] flex flex-col">
    <AppHeader />

    <main class="grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
