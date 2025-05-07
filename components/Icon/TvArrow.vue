<script setup>
defineProps({
  right: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <button
    class="rounded-lg p-1.5 md:p-2 bg-light-blue-100 hover:bg-light-blue-200 dark:bg-white-100 dark:hover:bg-white-200 disabled:!bg-transparent border border-transparent disabled:border-light-blue-100 disabled:dark:border-white-100 group"
    :class="[{ 'rotate-180': right }]"
  >
    <svg
      class="max-md:size-4"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        class="stroke-light-blue dark:stroke-light-blue-dark group-disabled:stroke-blue-400 group-disabled:dark:stroke-white-400"
        d="M7.97501 4.94189L2.91667 10.0002L7.97501 15.0586"
        stroke-width="1.25"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        class="stroke-light-blue dark:stroke-light-blue-dark group-disabled:stroke-blue-400 group-disabled:dark:stroke-white-400"
        d="M17.0833 10H3.05834"
        opacity="0.4"
        stroke-width="1.25"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>
