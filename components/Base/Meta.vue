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
});

const localDate = $moment(props.date).local();
const isLatn = $moment.locale() === "uz-latn";

const tooltipText = computed(() =>
  localDate.format(`D${isLatn ? "-" : " "}MMMM YYYY, H:m:s`)
);
</script>

<template>
  <div class="flex items-center gap-2 text-xs leading-std">
    <span class="text-light-blue">{{ category }}</span>
    <IconDot />
    <UTooltip :text="tooltipText" :popper="{ placement: 'top' }">
      <time :datetime="date" class="text-black-400 dark:text-white-400">
        {{ $formatDate(localDate) }}
      </time>
    </UTooltip>
  </div>
</template>
