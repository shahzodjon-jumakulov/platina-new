<script setup>
const shortsUrl = useShorts();

watch(shortsUrl.value.open, (newVal) => {
  if (newVal) return;
  shortsUrl.value.url = null;
});

const ui = {
  wrapper: "z-[101]",
  container: "items-center",
  overlay: {
    background: "bg-blue bg-opacity-60",
  },
  background: "bg-transparent dark:bg-transparent",
  rounded: "rounded-none",
  shadow: "shadow-none",
  width: "w-full sm:max-w-[28rem]",
};
</script>

<template>
  <div>
    <UModal v-model="shortsUrl.open" :ui="ui">
      <div class="relative">
        <div class="w-full aspect-[9/16] max-h-[calc(100svh-6.5rem)] relative">
          <USkeleton class="absolute inset-0 z-[-1] rounded-2xl" />
          <iframe
            :src="getYtId(shortsUrl.url)"
            class="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        <button
          @click="shortsUrl.open = false"
          class="absolute bottom-[calc(100%+1rem)] right-0 sm:top-0 sm:left-[calc(100%+1rem)]"
        >
          <div
            class="size-8 flex-center rounded-lg group bg-[#9099B6] hover:bg-red-500 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M1.28516 1.28577L6.99944 7.00005L1.28516 12.7143"
                stroke="white"
                stroke-width="2.28571"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.7148 12.7144L7.00056 7.00007L12.7148 1.28578"
                stroke="white"
                stroke-width="2.28571"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>
    </UModal>
  </div>
</template>
