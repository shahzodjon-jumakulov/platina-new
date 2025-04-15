<script setup>
defineProps({
  to: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <section
    class="py-5 sm:px-5 bg-white dark:bg-white-100 rounded-2xl flex flex-col gap-4"
  >
    <div class="flex items-center justify-between max-sm:px-4">
      <div class="flex items-center gap-2.5">
        <IconHexagon class="h-3" />
        <h2
          class="text-xl font-bold text-blue dark:text-white-600 leading-[normal]"
        >
          {{ title }}
        </h2>
      </div>

      <NuxtLinkLocale v-if="to" :to="to" class="all-link group">
        <span
          class="text-xs leading-normal font-medium text-black dark:text-white-600 px-1"
        >
          {{ $t("all") }}
        </span>
        <IconArrowRight />
      </NuxtLinkLocale>
    </div>

    <slot />
  </section>
</template>

<style scoped lang="scss">
.all-link {
  @apply relative px-2 py-1 rounded-md flex items-center hover:bg-black-100 dark:hover:bg-white-200;

  &:hover svg {
    animation: wiggle 1s ease-in-out;
  }

  & svg {
    @apply size-5 transition-transform duration-300;
  }
}

@keyframes wiggle {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(4px);
  }
  40% {
    transform: translateX(0);
  }
  60% {
    transform: translateX(4px);
  }
  80% {
    transform: translateX(0);
  }
}
</style>
