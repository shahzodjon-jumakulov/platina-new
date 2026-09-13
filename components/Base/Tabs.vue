<script setup>
const model = defineModel();

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "sm",
    validator: (value) => ["sm", "lg"].includes(value),
  },
});

// `lg` matches the hero rail: a flush track (its ground is the rail itself, so
// it stays transparent) with the active pill filling exactly half of it.
const isLg = computed(() => props.size === "lg");
</script>

<template>
  <div
    class="relative rounded-lg grid grid-cols-2 h-fit bg-light-blue-100 dark:bg-white-100">
    <button
      v-for="item in tabs"
      :key="item.value"
      :disabled="disabled"
      type="button"
      @click="model = item.value"
      class="text-center z-[1] relative leading-tight"
      :class="[
        isLg ? 'text-base font-bold px-4 py-2.5' : 'text-sm px-3 py-1.5',
        isLg
          ? model === item.value
            ? 'text-light-blue dark:text-white'
            : 'text-blue-400 dark:text-white-400'
          : 'text-black dark:text-white',
        {
          'font-bold': !isLg && model === item.value,
          '!text-gray-400 dark:!text-gray-500': disabled,
        },
      ]"
    >
      <span
        class="absolute-center text-center transition-all whitespace-nowrap"
      >
        {{ $t(item.name) }}
      </span>
      <!-- Sizing ghost. `lg` matches the design's nowrap label, so the track
           keeps its one-line height instead of growing to a wrapped ghost. -->
      <span
        class="font-bold invisible"
        :class="isLg ? 'whitespace-nowrap' : ''"
        >{{ $t(item.name) }}</span
      >
    </button>

    <div
      class="block bg-white dark:bg-white-300 absolute top-0 transition-all duration-300 ease-in-out rounded-lg"
      :class="[
        isLg
          ? 'h-full w-1/2'
          : 'h-[calc(100%-0.25rem)] w-[calc((100%-0.25rem)/2)] m-0.5',
        {
          'left-0': model === tabs[0].value,
          'left-1/2': isLg && model === tabs[1].value,
          'left-[calc(50%-0.125rem)]': !isLg && model === tabs[1].value,
        },
      ]"
    ></div>
  </div>
</template>
