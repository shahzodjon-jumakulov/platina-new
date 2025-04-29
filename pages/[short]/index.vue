<script setup>
definePageMeta({
  middleware: ["short"],
  layout: false,
});

const route = useRoute();
const { short } = route.params;
</script>

<template>
  <h1>Hello, World!</h1>
  <p class="text-3xl">Short: {{ short }}</p>
</template>
