<script setup>
const model = defineModel();

defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="relative rounded-lg bg-light-blue-100 dark:bg-light-blue-dark-100 grid grid-cols-2 h-fit p-0.5"
  >
    <button
      v-for="item in tabs"
      :key="item.value"
      :disabled="disabled"
      type="button"
      @click="model = item.value"
      class="text-sm text-black dark:text-white text-center px-3 py-1.5 z-[1] relative"
      :class="{
        'font-bold': model === item.value,
        '!text-gray-400 dark:!text-gray-500': disabled,
      }"
    >
      <span
        class="absolute-center text-center transition-all whitespace-nowrap"
      >
        {{ $t(item.name) }}
      </span>
      <span class="font-bold invisible">{{ $t(item.name) }}</span>
    </button>

    <div
      class="block bg-white dark:bg-white-200 h-[calc(100%-0.25rem)] w-[calc((100%-0.25rem)/2)] absolute top-0 rounded-md transition-all duration-300 ease-in-out m-0.5"
      :class="{
        'left-0': model === tabs[0].value,
        'left-[calc(50%-0.125rem)]': model === tabs[1].value,
      }"
    ></div>
  </div>
</template>
