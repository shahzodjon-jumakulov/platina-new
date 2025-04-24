<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const props = defineProps({
  news: {
    type: Array,
    default: [],
  },
  suffix: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  short: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "",
  },
  to: {
    type: String,
    required: false,
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
    el: `.pagination-${props.suffix}`,
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
  <BaseCard :to="to" :title="title" v-if="news.length">
    <div
      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5 max-sm:px-4 max-md:hidden"
    >
      <NuxtLinkLocale
        v-for="item in news"
        :key="item.id"
        :to="useNewsUrl(item.publish, item.slug)"
        @click="storeSelected(item)"
        :class="[
          'group',
          { 'max-lg:[&:nth-child(n+7)]:hidden': news.length >= 8 },
          { 'max-lg:[&:nth-child(n+4)]:hidden': news.length === 4 },
          {
            'bg-light-blue-100 dark:bg-light-blue-dark-100 rounded-2xl':
              color === 'light',
          },
        ]"
      >
        <article class="flex flex-col gap-3">
          <BaseOverlayImg
            class="!rounded-xl"
            :src="item.image_large || item.image_medium"
            :data="item"
          />
          <div
            class="flex flex-col gap-1.5"
            :class="{ 'p-4 pt-0': color }"
          >
            <BaseMeta
              :category="item.category.name"
              :date="item.publish"
            />
            <h3
              class="title text-lg md:text-base !leading-std line-clamp-3"
              v-hover-transition
            >
              {{ item.title }}
            </h3>
            <div
              v-if="short"
              class="short-content text-sm line-clamp-2"
              v-html="item.short_content"
            ></div>
          </div>
        </article>
      </NuxtLinkLocale>
    </div>

    <div class="flex flex-col gap-4 md:hidden overflow-hidden sm:-mx-5">
      <div
        ref="bulletsRef"
        :class="`flex gap-2 pagination pagination-${suffix} px-5`"
        :style="{ '--progress': progress }"
      ></div>

      <div>
        <Swiper
          v-bind="options"
          class="!px-4 sm:!px-5"
          @autoplayTimeLeft="onAutoplayTimeLeft"
          @activeIndexChange="onActiveChange"
        >
          <SwiperSlide
            v-for="(item, index) in news.slice(0, 6)"
            :key="index"
            class="!h-auto"
          >
            <NuxtLinkLocale
              :to="useNewsUrl(item.publish, item.slug)"
              @click="storeSelected(item)"
              class="group inline-flex h-full"
            >
              <article
                class="flex flex-col gap-3 bg-light-blue-100 dark:bg-white-100 rounded-2xl"
              >
                <BaseOverlayImg
                  class="rounded-lg"
                  :src="item.image_large || item.image_medium"
                  :data="item"
                />
                <div class="flex flex-col gap-2 p-4 pt-0">
                  <BaseMeta
                    :category="item.category.name"
                    :date="item.publish"
                  />
                  <h3 class="title line-clamp-3 text-lg" v-hover-transition>
                    {{ item.title }}
                  </h3>
                  <div
                    v-if="short"
                    class="short-content text-sm line-clamp-2"
                    v-html="item.short_content"
                  ></div>
                </div>
              </article>
            </NuxtLinkLocale>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped lang="scss">
.pagination {
  --swiper-pagination-color: #0066cc66;
  --swiper-pagination-bullet-inactive-color: #0066cc66;
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
    background-color: #0066cc66;
    overflow: hidden;
  }

  &:deep(.swiper-pagination-bullet.is-passed) {
    background-color: #0066cc;
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
      background-color: #0066cc;
      border-radius: 1rem;
      transform: scaleX(var(--progress));
      transform-origin: left;
      will-change: transform;
    }
  }
}
</style>
