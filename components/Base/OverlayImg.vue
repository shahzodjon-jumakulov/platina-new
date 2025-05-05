<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  imgClass: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="relative rounded-xl md:rounded-lg overflow-hidden aspect-[3/2]">
    <img
      :src="src"
      :alt="data.image_name?.length ? data.image_name : data.title"
      :class="imgClass"
      class="size-full aspect-[3/2] object-cover select-none"
    />
    <div
      class="absolute inset-0 bg-white-200 opacity-0 group-hover:opacity-100 transition-opacity"
    ></div>

    <div
      class="absolute bottom-3 right-3 z-[1]"
      v-if="data.youtube_link?.length > 0"
    >
      <img src="~/assets/icons/video-icon.svg" alt="video" class="h-8" />
    </div>
  </div>
</template>
