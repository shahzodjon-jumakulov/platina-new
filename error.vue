<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

const handleError = () => clearError({ redirect: localePath("/") });
</script>

<template>
  <div class="min-h-[100svh] flex flex-col">
    <NuxtLoadingIndicator color="#0066CC" />
    <AppHeader />

    <main class="grow flex items-center">
      <UContainer class="grid gap-7 py-8">
        <section class="flex flex-col gap-2 lg:gap-4 items-center">
          <div class="flex gap-1 lg:gap-2.5">
            <img
              src="~/assets/icons/error-4.svg"
              alt="404 error"
              class="max-lg:w-[3rem]"
            />
            <img
              src="~/assets/icons/error-0.svg"
              alt="404 error"
              class="max-lg:w-[3rem]"
            />
            <img
              src="~/assets/icons/error-4.svg"
              alt="404 error"
              class="max-lg:w-[3rem]"
            />
          </div>
          <div class="flex flex-col gap-1 lg:gap-2.5 items-center">
            <h1 class="text-xl lg:text-[2rem] font-semibold text-blue dark:text-white">
              {{ t("error.title") }}
            </h1>
            <div class="flex-y-center flex-col">
              <button @click="handleError" class="flex items-center gap-1.5 group">
                <p class="text-light-blue dark:text-light-blue-dark font-medium text-base">
                  {{ t("error.back") }}
                </p>
                <svg
                  class="group-hover:translate-x-1 transition-all"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                >
                  <path
                    d="M2.30566 9.42529H15.6936"
                    stroke="#0066CC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.9746 5.70642L15.6935 9.42529L11.9746 13.1442"
                    stroke="#0066CC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </UContainer>
    </main>

    <AppFooter />
  </div>
</template>
