<script setup>
// WebP copies of the original PNGs (441 KB / 340 KB → 56 KB / 44 KB), served
// from public/ so Vite does not emit a <link rel="prefetch"> for both files
// on every page — that made phones download the desktop banner too.
// New campaign → new file names, so browsers don't keep the old one cached.
const desktopBanner = "/images/tcm/tcm-2027-desktop.webp";
const mobileBanner = "/images/tcm/tcm-2027-mobile.webp";
</script>

<template>
  <!--
    w-full matters: the layout is a flex column and UContainer centres itself
    with mx-auto, which makes it shrink-to-fit — 0 px wide until the banner
    image has loaded, so the aspect-ratio box below was 0 px tall too.
  -->
  <UContainer class="w-full pt-3 md:pt-4 max-sm:px-2">
    <!--
      The box gets its height from CSS aspect-ratio (640×300 on phones,
      1300×220 from md up), so it occupies its final size before the image
      arrives. Without it the whole page jumped down when the banner loaded —
      the single biggest layout shift on every page.
    -->
    <NuxtLink
      to="https://tcm.uz"
      target="_blank"
      rel="noopener sponsored"
      class="block mx-auto max-w-[1300px] rounded-xl overflow-hidden aspect-[640/300] md:aspect-[1300/220] bg-[#041e41]"
    >
      <!-- <picture> so each device downloads only its own banner -->
      <picture class="block w-full h-full">
        <source
          media="(min-width: 768px)"
          :srcset="desktopBanner"
          type="image/webp"
          width="1300"
          height="220"
        />
        <img
          :src="mobileBanner"
          width="640"
          height="300"
          alt="Tashkent Content Market — 4–5 fevral 2027, tcm.uz"
          class="block w-full h-full object-cover"
        />
      </picture>
    </NuxtLink>
  </UContainer>
</template>
