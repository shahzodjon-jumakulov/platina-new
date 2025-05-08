<script setup>
const { $moment } = useNuxtApp();

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
});

const localDate = $moment(props.date).local();
const isLatn = $moment.locale() === "uz-latn";

const tooltipText = computed(() =>
  localDate.format(`D${isLatn ? "-" : " "}MMMM YYYY, H:m:s`)
);
</script>

<template>
  <div class="flex items-center gap-2 text-xs leading-std">
    <span v-if="!link" class="text-light-blue dark:text-light-blue-dark">
      {{ category }}
    </span>
    <NuxtLinkLocale
      v-else
      :to="`/category/${link}`"
      class="text-light-blue dark:text-light-blue-dark hover:text-light-blue-500 dark:hover:text-light-blue-500"
      v-hover-transition
    >
      {{ category }}
    </NuxtLinkLocale>
    <IconDot />
    <UTooltip :text="tooltipText" :popper="{ placement: 'top' }">
      <time :datetime="date" class="text-black-400 dark:text-white-400">
        {{ $formatDate(localDate) }}
      </time>
    </UTooltip>
  </div>
</template>
