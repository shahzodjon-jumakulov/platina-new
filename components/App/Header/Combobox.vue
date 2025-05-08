<script setup>
const route = useRoute();
const query = route.query;
const localePath = useLocalePath();
const { locale } = useI18n();
const props = defineProps({
  alwaysOpen: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["close"]);

const wrapperRef = ref(null);
const inputRef = ref(null);
const listboxRef = ref(null);

const open = ref(props.alwaysOpen);
watch(
  () => route.fullPath,
  () => {
    if (open.value) closeCombobox();
  }
);

const searchTerm = ref("");
const activeIndex = ref(-1);

const openCombobox = () => {
  open.value = true;
};
const closeCombobox = () => {
  if (props.alwaysOpen) emits("close");
  open.value = false;
};
defineShortcuts({
  "/": {
    usingInput: false,
    handler: () => {
      if (!open.value) openCombobox();
    },
  },
  escape: {
    usingInput: true,
    handler: () => {
      closeCombobox();
    },
  },
});
watch(open, (val) => {
  const inputEl = inputRef.value?.$el?.querySelector("input");
  if (val) {
    disableScroll();
    inputEl.focus();
  } else {
    enableScroll();
    inputEl.blur();
    activeIndex.value = -1;
  }
});
watch(searchTerm, () => {
  if (searchTerm.value?.trim().length < 3) {
    activeIndex.value = -1;
  }
});

// <-- Options start -->
const popular = ref([]);
const filteredOptions = ref([]);
const loading = ref(true);
const debounceTimeout = ref(null);
watch(searchTerm, async () => {
  if (searchTerm.value?.trim().length < 3) {
    filteredOptions.value = popular.value || [];
  } else {
    loading.value = true;
    clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(async () => {
      const term = searchTerm.value.trim();
      const { data } = await useMyFetch("/news/all", {
        params: { search: term, limit: 6 },
      });
      if (searchTerm.value === term) {
        filteredOptions.value = data.value.results;
        loading.value = false;
      }
    }, 300);
  }
});

const popularNews = loadedPopularNews();
if (popularNews.value.lang === locale.value && popularNews.value.news.length) {
  popular.value = popularNews.value.news;
  filteredOptions.value = popular.value;
  loading.value = false;
} else {
  loading.value = true;
  await useMyFetch("/news/popular/", {
    params: { limit: 6 },
    server: false,
    lazy: true,
    onResponse({ response }) {
      if (response._data?.results?.length) {
        popular.value = response._data.results;
        filteredOptions.value = popular.value;
        loading.value = false;
      }
    },
  });
}

const searchQuery = () => {
  if (searchTerm.value?.trim().length < 3) return;

  const query = encodeURIComponent(searchTerm.value.trim());
  if (!query) return "";
  if (query.length < 3) return "";
  navigateTo(localePath(`/search?q=${query}`));
  closeCombobox();
  emits("close");
};

const selectOption = (option) => {
  navigateTo(localePath(useNewsUrl(option.publish, option.slug)));
  emits("close");
  closeCombobox();
};

const handleKeyDown = (event) => {
  if (event.key === "ArrowDown") {
    if (activeIndex.value < filteredOptions.value.length - 1) {
      activeIndex.value++;
    } else return;
  } else if (event.key === "ArrowUp") {
    if (activeIndex.value !== -1) {
      activeIndex.value--;
    } else return;
  } else if (event.key === "Enter") {
    if (activeIndex.value >= 0) {
      selectOption(filteredOptions.value[activeIndex.value]);
    } else searchQuery();
  } else if (event.key === "Escape") {
    closeCombobox();
  }
  nextTick(() => {
    if (!open.value) return;
    const activeEl = listboxRef.value?.children[activeIndex.value];
    activeEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
};

const highlightMatch = (option) => {
  const query = searchTerm.value;
  if (!query || query.length < 3) return option;
  const regex = new RegExp(`(${query})`, "gi");
  return option.replace(regex, `<b>$1</b>`);
};

const selectText = (event) => {
  event.target.select();
};
</script>

<template>
  <div class="z-[1] w-full relative" ref="wrapperRef">
    <div ref="comboboxRef">
      <UInput
        role="combobox"
        aria-expanded="true"
        aria-controls="listbox"
        tabindex="0"
        ref="inputRef"
        :autofocus="alwaysOpen"
        @click="openCombobox"
        @keydown="handleKeyDown"
        @focus="selectText"
        v-model="searchTerm"
        variant="outline"
        :placeholder="$t('search.placeholder')"
        class="z-[1] w-full"
        :input-class="open ? '!bg-white dark:!bg-dark-blue' : ''"
      >
        <template #trailing>
          <UIcon
            v-if="loading"
            name="i-heroicons-arrow-path-16-solid"
            class="text-blue-500 dark:text-white-500 animate-spin size-5"
          />
          <IconSearch v-else />
        </template>
      </UInput>

      <div
        v-show="open"
        role="listbox"
        class="bg-white dark:bg-dark-blue w-full rounded-lg absolute top-[calc(100%+0.375rem)] left-0 overflow-hidden p-2.5"
      >
        <div class="h-auto max-h-[80vh] overflow-y-auto" ref="listboxRef">
          <div
            v-if="searchTerm?.trim().length >= 3"
            class="py-2 px-4 flex items-center gap-4 cursor-pointer rounded-md data-[highlighted]:outline-none data-[highlighted]:bg-blue-100 data-[highlighted]:dark:bg-white-100"
            aria-selected="false"
            :data-highlighted="activeIndex === -1 ? 'true' : undefined"
            tabindex="-1"
            @mouseover="activeIndex = -1"
          >
            <IconInputBack />
            <span class="text-black dark:text-white">
              {{ $t("search.results") }}
            </span>
          </div>
          <div class="" v-if="loading">
            <div
              class="flex items-center gap-3 p-2"
              v-for="item in 6"
              :key="item"
            >
              <USkeleton class="h-10 aspect-[3/2] rounded-md" />
              <div class="flex flex-col gap-1 w-full">
                <USkeleton class="h-3 w-3/5" />
                <div class="flex gap-5">
                  <USkeleton class="h-2 w-12" />
                  <USkeleton class="h-2 w-20" />
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <NuxtLinkLocale
              v-for="(option, index) in filteredOptions"
              :key="option.id"
              :to="useNewsUrl(option.publish, option.slug)"
              aria-selected="false"
              :data-highlighted="activeIndex === index ? 'true' : undefined"
              tabindex="-1"
              @mouseover="activeIndex = index"
              class="flex items-center gap-3 p-2 relative select-none group truncate cursor-pointer rounded-md data-[highlighted]:outline-none data-[highlighted]:bg-blue-100 data-[highlighted]:dark:bg-white-100"
            >
              <img
                :src="option.image_small"
                :alt="option.title"
                class="h-10 aspect-[3/2] rounded-md"
              />
              <div class="flex flex-col gap-1">
                <h3
                  class="title text-sm truncate line-clamp-1 !whitespace-break-spaces"
                >
                  {{ option.title }}
                </h3>
                <BaseMeta
                  :category="option.category.name"
                  :date="option.publish"
                />
              </div>
            </NuxtLinkLocale>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="open && !alwaysOpen"
      @click="open = false"
      class="fixed inset-0 h-screen z-[-1] bg-black-500 dark:bg-black-500 transition-colors duration-300 max-md:hidden"
    ></div>
  </div>
</template>
