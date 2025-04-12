<script setup>
//
</script>

<template>
  <header
    class="bg-white dark:bg-white-100 border-b border-secondary dark:border-light-blue-100"
  >
    <UContainer class="md:py-5 lg:pb-0 max-sm:px-2">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-16">
          <div class="flex items-center justify-between gap-5 grow max-md:py-3">
            <AppHeaderBurger class="lg:hidden" />

            <NuxtLink to="/" class="inline-flex">
              <IconLogo class="max-md:h-8" />
            </NuxtLink>

            <AppHeaderSearch class="lg:grow" />
          </div>

          <div class="flex items-center gap-1 max-lg:hidden">
            <AppHeaderColorMode />
            <AppHeaderLang />
          </div>
        </div>

        <div class="max-lg:hidden">
          <!-- Categories nav -->
        </div>
      </div>
    </UContainer>
  </header>
</template>
