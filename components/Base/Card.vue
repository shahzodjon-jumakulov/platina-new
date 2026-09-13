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
  transparent: {
    type: Boolean,
    default: false,
  },
  accent: {
    type: Boolean,
    default: false,
  },
  // Surface classes for the section shell. Overridden by sections that sit on
  // a tinted ground (Figma: the "Мақола"/"Таҳлил" blocks).
  surface: {
    type: String,
    default: "bg-white dark:bg-white-100",
  },
});
</script>

<template>
  <section
    :class="[
      transparent ? 'bg-transparent md:!p-0 md:!bg-transparent' : '',
      surface,
      'rounded-2xl grid grid-cols-1 content-start gap-4 py-5 sm:px-5',
    ]"
  >
    <div
      :class="[
        accent
          ? 'border-t-4 border-light-blue dark:border-light-blue-dark pt-4'
          : '',
        // Margin rather than padding so the accent rule is inset too, as in Figma.
        'flex items-center justify-between max-sm:mx-4',
      ]"
    >
      <div class="flex items-center gap-2.5">
        <IconHexagon class="h-2.5 md:h-3" />
        <h2
          :class="accent ? 'uppercase' : ''"
          class="text-lg md:text-xl font-bold text-blue dark:text-white-600 !leading-[normal]"
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

<style lang="scss">
a.all-link {
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
