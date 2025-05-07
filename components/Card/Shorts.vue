<script setup>
defineProps({
  video: {
    type: Object,
    required: true,
  },
});

const thumbnail = (link) => {
  return `https://i.ytimg.com/vi/${getYtId(link, true)}/oardefault.jpg`;
};
const shortsUrl = useShorts();
const handleShorts = (link) => {
  shortsUrl.value.url = link;
  shortsUrl.value.open = true;
};
</script>

<template>
  <button
    @click="handleShorts(video.link)"
    class="relative w-full aspect-[9/16] group cursor-pointer rounded-lg overflow-hidden select-none"
  >
    <img :src="thumbnail(video.link)" :alt="video.name" class="w-full" />

    <div
      class="absolute inset-0 bg-white-200 opacity-0 group-hover:opacity-100 transition-opacity"
    ></div>
    <div class="absolute bottom-3 right-3 z-[1]">
      <img src="~/assets/icons/video-icon.svg" alt="video" class="h-8" />
    </div>
  </button>
</template>
