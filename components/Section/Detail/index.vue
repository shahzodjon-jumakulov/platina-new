<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-5 max-w-[50.25rem] w-full">
    <article
      v-if="data"
      class="bg-white dark:bg-white-100 p-4 md:px-8 md:py-5 flex flex-col gap-4 md:gap-5 max-sm:rounded-t-none rounded-2xl w-full relative"
    >
      <div class="flex flex-col gap-4">
        <header class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <BaseMeta
              :category="data.category.name"
              :link="data.category.slug"
              :date="data.publish"
            />
            <BaseShare :short="data.short_slug" :title="data.title" />
          </div>
          <h1
            class="text-blue dark:text-white-600 text-xl md:text-2xl !leading-std font-bold"
          >
            {{ data.title }}
          </h1>
        </header>

        <section
          class="p-4 md:px-5 rounded-xl border border-light-blue-400 dark:border-light-blue-dark-400 text-base md:text-lg !leading-[140%] font-medium text-black dark:text-white-600 short"
          v-html="data.short_content"
        ></section>
      </div>

      <figure
        v-if="data.youtube_link"
        class="w-full aspect-[16/9] rounded-2xl overflow-hidden"
      >
        <ScriptYouTubePlayer
          ref="video"
          :video-id="getYtId(data.youtube_link, true)"
          :placeholder-attrs="{ loading: 'eager' }"
        >
          <template #awaitingLoad>
            <div class="absolute-center h-[48px] w-[68px]">
              <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                <path
                  d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                  fill="#f00"
                />
                <path d="M 45,24 27,14 27,34" fill="#fff" />
              </svg>
            </div>
          </template>
        </ScriptYouTubePlayer>
      </figure>
      <figure class="flex flex-col gap-2" v-else>
        <img
          :src="data.image_large"
          :alt="data.image_name || data.title"
          class="rounded-2xl w-full aspect-[3/2]"
        />
        <figcaption
          v-if="data.image_source"
          class="text-[0.813rem] leading-std text-black-400 dark:text-white-400"
        >
          {{ data.image_source }}
        </figcaption>
      </figure>

      <section
        v-html="modifyContent(data.content)"
        class="content text-base md:text-lg !leading-[140%] text-black dark:text-white-600"
      ></section>

      <section>
        <ul class="flex items-center gap-2.5 flex-wrap">
          <li v-for="(item, index) in data.tags" :key="index">
            <NuxtLinkLocale
              :to="`/tag/${encodeURIComponent(item)}`"
              class="px-2.5 py-2 rounded bg-light-blue-100 dark:bg-light-blue-dark-200 text-xs leading-std text-light-blue dark:text-light-blue-dark hover:bg-light-blue-200 dark:hover:bg-light-blue-dark-300 transition-colors duration-200 ease-in-out"
            >
              {{ item }}
            </NuxtLinkLocale>
          </li>
        </ul>
      </section>
    </article>
  </div>
</template>

<style scoped lang="scss">
.content > :deep(*:not(:first-child)) {
  margin-top: 1rem;
}

.content:deep(figure) {
  margin: 1rem auto 0 !important;
  width: fit-content;
}

.content :deep(img) {
  border-radius: 8px;
  height: auto !important;
  max-width: 100% !important;
  max-height: 80svh;
  object-fit: contain;
  width: auto !important;
  display: block;
}

.content:deep(a) {
  color: #0066cc !important;
}

.content:deep(a:hover) {
  text-decoration: underline;
}

.content:deep(span) {
  background-color: transparent !important;
  color: #000000 !important;

  .dark & {
    color: rgba(255, 255, 255, 0.88) !important;
  }
}

.content:deep(figcaption),
.credit {
  font-weight: 400;
  font-size: 13px !important;
  line-height: normal;
  margin-top: 0.5rem;
  color: rgba(0, 0, 0, 0.4) !important;
  .dark & {
    color: rgba(255, 255, 255, 0.4) !important;
  }
}

.content:deep(ol) {
  list-style-type: decimal;
  list-style-position: outside;
  padding-left: 20px;
  @apply space-y-2;
}

.content:deep(ul) {
  list-style-type: disc;
  list-style-position: outside;
  padding-left: 20px;
  @apply space-y-2;
}

.gradient {
  background: linear-gradient(
    180deg,
    rgba(29, 48, 104, 0) 0%,
    rgba(29, 48, 104, 0.8) 100%
  );
}

.short:deep(span) {
  background-color: transparent !important;
  color: #000000 !important;

  .dark & {
    color: rgba(255, 255, 255, 0.88) !important;
  }
}
</style>
