<script setup>
defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      class="stroke-blue-500 dark:stroke-white-500"
      :class="{'max-md:!stroke-white-500': dark}"
      d="M12.0247 4.94141L17.0831 9.99974L12.0247 15.0581"
      stroke-width="1.25"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      class="stroke-blue-500 dark:stroke-white-500 opacity-40"
      :class="{'max-md:!stroke-white-500': dark}"
      d="M2.91669 10H16.9417"
      stroke-width="1.25"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
