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
  video: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="relative rounded-xl md:rounded-lg overflow-hidden aspect-[3/2]">
    <img
      :src="src"
      :alt="alt"
      :class="imgClass"
      class="size-full aspect-[3/2] object-cover"
    />
    <div
      class="absolute inset-0 bg-white-200 opacity-0 group-hover:opacity-100 transition-opacity"
    ></div>

    <div class="absolute bottom-3 right-3 z-[1]" v-if="video">
      <img src="~/assets/icons/video-icon.svg" alt="video" class="h-8" />
    </div>
  </div>
</template>
