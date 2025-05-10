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
          <CardShorts :video="item" />
        </SwiperSlide>
      </Swiper>

      <div class="pagination pagination-tv flex gap-2 justify-center"></div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pagination {
  --swiper-pagination-bullet-inactive-opacity: 1;
  --swiper-pagination-bullet-opacity: 1;
  --swiper-pagination-bullet-horizontal-gap: 0;
  --swiper-pagination-bullet-height: 0.5rem;
  --swiper-pagination-bullet-width: 0.5rem;
  --swiper-pagination-bullet-border-radius: 1rem;

  &:deep(.swiper-pagination-bullet) {
    transition: all 0.2s ease-in-out;
    will-change: width;
    cursor: pointer;
    background-color: #0066cc66;
    overflow: hidden;

    .dark & {
      background-color: #178FE066;
    }

    &:hover {
      background-color: #0066cc;
    }
  }

  &:deep(.swiper-pagination-bullet-active) {
    width: 2rem;
    background-color: #0066cc;

    .dark & {
      background-color: #178FE0;
    }
  }
}
</style>
