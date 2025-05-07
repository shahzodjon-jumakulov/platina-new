<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const options = {
  slidesPerView: 2.5,
  spaceBetween: 16,
  breakpoints: {
    768: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1280: {
      slidesPerView: 5,
      spaceBetween: 22,
    },
  },
  resistanceRatio: 0,
  modules: [Pagination, Navigation],
  pagination: {
    el: `.pagination-tv`,
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-tv-next",
    prevEl: ".swiper-tv-prev",
  },
  autoplay: {
    delay: 5000,
  },
};

const { data } = await useMyFetch("/news/video/shorts/", {
  params: { limit: 10 },
  server: false,
  lazy: true,
  transform: (data) => data.results,
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
  <section
    v-if="data?.length"
    class="bg-white dark:bg-white-200 rounded-2xl p-4 md:p-5 flex flex-col gap-4"
  >
    <div class="flex justify-between items-center">
      <IconPlatinatv class="max-md:h-8" />
      <div class="flex gap-2">
        <IconTvArrow class="swiper-tv-prev" />
        <IconTvArrow right class="swiper-tv-next" />
      </div>
    </div>

    <div class="space-y-5 -mx-4 sm:-mx-5">
      <Swiper v-bind="options" class="!px-4 md:!px-5">
        <SwiperSlide v-for="item in data" :key="item.id" class="!h-auto">
          <button
            @click="handleShorts(item.link)"
            class="relative w-full aspect-[9/16] group cursor-pointer rounded-lg overflow-hidden select-none"
          >
            <img :src="thumbnail(item.link)" :alt="item.name" class="w-full" />

            <div
              class="absolute inset-0 bg-white-200 opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <div class="absolute bottom-3 right-3 z-[1]">
              <img
                src="~/assets/icons/video-icon.svg"
                alt="video"
                class="h-8"
              />
            </div>
          </button>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
