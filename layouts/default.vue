<script setup>
//
</script>

<template>
  <div class="min-h-[100svh] flex flex-col">
    <NuxtLoadingIndicator color="#0066CC" />
    <AppHeader />

    <GroupVideoModal />

    <main class="grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
