<script setup>
import desktopBanner from "~/assets/icons/desktop.png";
import mobileBanner from "~/assets/icons/mobile.png";
</script>

<template>
  <UContainer class="pt-3 md:pt-4 max-sm:px-2">
    <NuxtLink
      to="https://tcm.uz"
      target="_blank"
      rel="noopener sponsored"
      class="block mx-auto max-w-[1300px] rounded-xl overflow-hidden"
    >
      <!-- <picture> so each device downloads only its own banner -->
      <picture>
        <source
          media="(min-width: 768px)"
          :srcset="desktopBanner"
          width="1300"
          height="220"
        />
        <img
          :src="mobileBanner"
          width="640"
          height="300"
          alt="Tashkent Content Market — 4–5 fevral 2027, tcm.uz"
          class="block w-full h-auto"
        />
      </picture>
    </NuxtLink>
  </UContainer>
</template>
