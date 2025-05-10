<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

defineProps({
  transparentBg: {
    type: Boolean,
    default: false,
  },
});

const news = ref([]);
await useMyFetch("/news/business/", {
  params: { limit: 4 },
  server: false,
  lazy: true,
  onResponse({ response }) {
    if (response._data?.results?.length) {
      news.value = response._data.results;
    }
  },
});

const options = {
  slidesPerView: 1,
  spaceBetween: 16,
  breakpoints: {
    480: {
      spaceBetween: 20,
    },
  },
  resistanceRatio: 0,
  modules: [Pagination, Autoplay],
  pagination: {
    el: ".pagination-business",
    clickable: true,
  },
  autoplay: {
    delay: 5000,
  },
};

const progress = ref(0);
const active = ref(0);
const bulletsRef = ref(null);

const onActiveChange = (swiper) => {
  active.value = swiper.activeIndex;
  updatePassedBullets();
};

function onAutoplayTimeLeft(swiper, time, progressRatio) {
  progress.value = 1 - progressRatio;
}

const updatePassedBullets = () => {
  if (!bulletsRef.value) return;

  const bullets = Array.from(bulletsRef.value.children) || [];
  bullets.forEach((bullet, index) => {
    bullet.classList.toggle("is-passed", index < active.value);
  });
};
</script>

<template>
  <section
    v-if="news.length"
    :class="transparentBg ? 'md:p-0' : 'md:bg-white md:dark:bg-white-100'"
    class="max-md:bg-blue py-5 sm:px-5 rounded-2xl grid grid-cols-1 gap-4"
  >
    <div class="flex items-center justify-between max-sm:px-4">
      <div class="flex items-center gap-2.5">
        <IconHexagon dark class="h-2.5 md:h-3" />
        <h2
          class="text-lg md:text-xl font-bold text-white md:text-blue dark:text-white-600 !leading-[normal]"
        >
          {{ $t("business") }}
        </h2>
      </div>

      <NuxtLinkLocale to="/category/biznes" class="all-link group">
        <span
          class="text-xs leading-normal font-medium text-black dark:text-white-600 px-1"
        >
          {{ $t("all") }}
        </span>
        <IconArrowRight />
      </NuxtLinkLocale>
    </div>

    <div class="grid grid-cols-3 lg:grid-cols-4 gap-5 max-md:hidden">
      <NuxtLinkLocale
        :to="useNewsUrl(item.publish, item.slug)"
        @click="storeSelected(item)"
        v-for="item in news"
        :key="item.id"
        class="group bg-blue rounded-xl max-lg:[&:nth-child(n+4)]:hidden"
      >
        <article class="flex flex-col">
          <BaseOverlayImg
            class="md:rounded-b-xl"
            :src="item.image_large"
            :data="item"
          />

          <div class="p-4">
            <h3
              class="text-base text-white dark:text-white-600 group-hover:text-light-blue-dark font-medium line-clamp-3"
              v-hover-transition
            >
              {{ item.title }}
            </h3>
          </div>
        </article>
      </NuxtLinkLocale>
    </div>

    <div class="flex flex-col gap-4 md:hidden overflow-hidden sm:-mx-5">
      <div
        ref="bulletsRef"
        :class="`flex gap-2 pagination pagination-business px-5`"
        :style="{ '--progress': progress }"
      ></div>

      <div>
        <Swiper
          v-bind="options"
          class="!px-4 sm:!px-5"
          @autoplayTimeLeft="onAutoplayTimeLeft"
          @activeIndexChange="onActiveChange"
        >
          <SwiperSlide v-for="item in news" :key="item.id" class="!h-auto">
            <NuxtLinkLocale
              :to="useNewsUrl(item.publish, item.slug)"
              @click="storeSelected(item)"
              class="group inline-flex h-full"
            >
              <article class="flex flex-col gap-3">
                <BaseOverlayImg :src="item.image_large" :data="item" />

                <h3
                  class="text-white group-hover:text-light-blue-dark line-clamp-3 text-lg"
                  v-hover-transition
                >
                  {{ item.title }}
                </h3>
              </article>
            </NuxtLinkLocale>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pagination {
  --swiper-pagination-color: #ffffff66;
  --swiper-pagination-bullet-inactive-color: #ffffff66;
  --swiper-pagination-bullet-inactive-opacity: 1;
  --swiper-pagination-bullet-opacity: 1;
  --swiper-pagination-bullet-horizontal-gap: 0;
  --swiper-pagination-bullet-height: 0.125rem;
  --swiper-pagination-bullet-width: auto;
  --swiper-pagination-bullet-border-radius: 1rem;

  &:deep(.swiper-pagination-bullet) {
    transition: transform 0.3s ease-in-out;
    flex-grow: 1;
    cursor: pointer;
    background-color: #ffffff66;
    overflow: hidden;
  }

  &:deep(.swiper-pagination-bullet.is-passed) {
    background-color: #ffffff;
  }

  &:deep(.swiper-pagination-bullet-active) {
    height: 0.125rem;
    position: relative;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: #ffffff;
      border-radius: 1rem;
      transform: scaleX(var(--progress));
      transform-origin: left;
      will-change: transform;
    }
  }
}
</style>
