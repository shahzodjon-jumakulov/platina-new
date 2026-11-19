<script setup>
/**
 * Real <a href> pagination, rendered server-side. The "load more" buttons are
 * the primary UX, but crawlers don't click buttons — without these links
 * everything past the first page of a listing is unreachable for them.
 * Each ?page=N self-canonicalises (app.vue keeps ?page on the canonical).
 */
const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  // Route path without the locale prefix, percent-encoded (e.g. "/tag/sport").
  path: { type: String, required: true },
  // Extra query to keep on every link.
  query: { type: Object, default: () => ({}) },
  label: { type: String, default: "" },
});

const to = (n) => ({
  path: props.path,
  query: { ...props.query, ...(n > 1 ? { page: n } : {}) },
});
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="col-span-full flex items-center justify-center gap-4 text-sm"
    :aria-label="label || undefined"
  >
    <NuxtLinkLocale
      v-if="page > 1"
      :to="to(page - 1)"
      rel="prev"
      class="px-3 py-2 rounded-md bg-light-blue-100 dark:bg-light-blue-dark-100 text-light-blue dark:text-light-blue-dark hover:bg-light-blue-200 dark:hover:bg-light-blue-dark-200 transition-colors"
    >
      &larr;
    </NuxtLinkLocale>

    <span class="text-black-400 dark:text-white-400 tabular-nums">
      {{ page }} / {{ totalPages }}
    </span>

    <NuxtLinkLocale
      v-if="page < totalPages"
      :to="to(page + 1)"
      rel="next"
      class="px-3 py-2 rounded-md bg-light-blue-100 dark:bg-light-blue-dark-100 text-light-blue dark:text-light-blue-dark hover:bg-light-blue-200 dark:hover:bg-light-blue-dark-200 transition-colors"
    >
      &rarr;
    </NuxtLinkLocale>
  </nav>
</template>
