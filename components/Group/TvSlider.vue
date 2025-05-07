<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const options = {
  slidesPerView: 2.5,
  spaceBetween: 16,
  breakpoints: {
    480: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 5,
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
  transform: (data) => data.results,
});
console.log(data.value);
</script>

<template>
  <section
    class="bg-white dark:bg-white-200 rounded-2xl p-5 flex flex-col gap-4"
  >
    <div class="flex justify-between items-center">
      <IconPlatinatv />
      <div class="flex gap-2">
        <IconTvArrow class="swiper-tv-prev" />
        <IconTvArrow right class="swiper-tv-next" />
      </div>
    </div>

    <div class="space-y-5 -mx-5">
      <Swiper v-bind="options" class="!px-5">
        <SwiperSlide v-for="item in data" :key="item.id" class="!h-auto">
          <h1>{{ item.name }}</h1>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
