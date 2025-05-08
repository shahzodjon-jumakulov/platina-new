<script setup>
const isLenta = ref(false);
</script>

<template>
  <header
    class="bg-white-600 dark:bg-white-100 border-b border-secondary dark:border-white-100 sticky top-0 z-50 backdrop-blur-2xl dark:backdrop-blur-3xl max-sm:rounded-b-2xl"
  >
    <UContainer class="md:py-5 lg:pb-0 max-sm:px-2">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-5">
          <div class="flex items-center justify-between gap-5 grow">
            <AppHeaderBurger class="lg:hidden" />

            <NuxtLinkLocale to="/" class="inline-flex max-md:py-3">
              <IconLogo class="max-md:h-8" />
            </NuxtLinkLocale>

            <AppHeaderSearch class="lg:grow" />
          </div>

          <div class="flex items-center gap-1 max-lg:hidden">
            <AppHeaderColorMode />
            <AppHeaderLang />
          </div>
        </div>

        <AppHeaderNav />
      </div>
    </UContainer>
  </header>
</template>
