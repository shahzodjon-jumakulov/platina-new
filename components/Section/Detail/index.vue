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
      class="bg-white dark:bg-white-100 p-4 md:px-8 md:py-5 flex flex-col gap-4 md:gap-5 max-sm:rounded-t-none rounded-2xl w-full"
    >
      <div class="flex flex-col gap-4">
        <header class="flex flex-col gap-3">
          <BaseMeta
            :category="data.category.name"
            :link="data.category.slug"
            :date="data.publish"
          />
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

      <figure class="flex flex-col gap-2">
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
