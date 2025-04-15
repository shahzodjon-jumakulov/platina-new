<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  imgClass: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="relative rounded-xl md:rounded-lg overflow-hidden">
    <img :src="src" :alt="alt" :class="imgClass" />
    <div
      class="absolute inset-0 bg-white-200 opacity-0 hover:opacity-100 transition-opacity duration-300"
    ></div>
  </div>
</template>
