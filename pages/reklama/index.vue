<script setup>
//
</script>

<template>
  <UContainer class="py-5 max-sm:px-4">
    <div class="grid grid-cols-1 gap-8 max-w-[50.25rem] mx-auto">
      <section class="flex flex-col gap-5">
        <h1 class="text-blue dark:text-white-600 font-bold text-xl">
          {{ $t("footer.reklama") }}
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <NuxtLink
            to="tel:+998970220110"
            class="px-4 py-3 flex items-center gap-3 bg-light-blue-100 dark:bg-white-100 hover:bg-light-blue-300 dark:hover:bg-white-200 transition-colors rounded-lg group"
          >
            <div
              class="rounded-lg bg-white dark:bg-dark-blue p-3 h-full shrink-0 flex-center"
            >
              <IconReklamaPhone />
            </div>

            <div class="px-1 flex flex-col gap-1">
              <h2 class="text-black dark:text-white-600 text-sm">
                {{ $t("reklama.phone") }}
              </h2>
              <p
                class="text-light-blue dark:text-light-blue-dark text-base font-bold"
              >
                +998 97 022 01 10
              </p>
            </div>
          </NuxtLink>
          <NuxtLink
            to="https://t.me/PlatinaPR"
            class="px-4 py-3 flex items-center gap-3 bg-light-blue-100 dark:bg-white-100 hover:bg-light-blue-300 dark:hover:bg-white-200 transition-colors rounded-lg group"
          >
            <div
              class="rounded-lg bg-white dark:bg-dark-blue p-3 h-full shrink-0 flex-center"
            >
              <IconReklamaTelegram />
            </div>

            <div class="px-1 flex flex-col gap-1">
              <h2 class="text-black dark:text-white-600 text-sm">
                {{ $t("reklama.telegram") }}
              </h2>
              <p
                class="text-light-blue dark:text-light-blue-dark text-base font-bold"
              >
                @PlatinaPR
              </p>
            </div>
          </NuxtLink>
        </div>

        <img src="/images/reklama.png" alt="reklama" />
      </section>

      <SectionSocials />
    </div>
  </UContainer>
</template>
