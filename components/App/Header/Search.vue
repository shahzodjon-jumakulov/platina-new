<script setup>
const route = useRoute();
const query = route.query;
const localePath = useLocalePath();
const props = defineProps({
  alwaysOpen: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["close"]);

const wrapperRef = ref(null);
const comboboxRef = ref(null);
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
const activeIndex = ref(0);

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
    activeIndex.value = 0;
  }
});
watch(searchTerm, () => {
  if (searchTerm.value?.length < 3) {
    activeIndex.value = 0;
  }
});

// <-- Options start -->
const popular = ref([]);
const filteredOptions = ref([]);
const debounceTimeout = ref(null);
watch(searchTerm, async () => {
  if (searchTerm.value?.length < 3) {
    filteredOptions.value = popular.value || [];
  } else {
    clearTimeout(debounceTimeout.value);
    debounceTimeout.value = setTimeout(async () => {
      const { data } = await useMyFetch("/news/all", {
        params: { search: searchTerm.value, limit: 6 },
      });
      filteredOptions.value = data.value.results;
    }, 300);
  }
});
await useMyFetch("/news/popular/", {
  params: { limit: 6 },
  server: false,
  lazy: true,
  onResponse({ response }) {
    if (response._data?.results?.length) {
      popular.value = response._data.results;
      filteredOptions.value = popular.value;
    }
  },
});

const searchQuery = () => {
  if (searchTerm.value?.length < 3) return;
  // searchQueryText.value.category = "";
  // searchQueryText.value.query = searchTerm.value;
  // navigateTo(localePath(`/announcements?search=${searchTerm.value}`));
  closeCombobox();
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
  <div class="z-[1] w-full relative h-[3.125rem]" ref="wrapperRef">
    <div
      ref="comboboxRef"
      class="absolute top-0 right-0 w-full transition-all duration-300"
    >
      <div
        class="max-md:px-4 max-md:flex items-center gap-2.5 relative z-[1] max-md:pt-4"
      >
        <!-- <button
          class="-rotate-90 md:hidden size-6"
          tabindex="-1"
          @click="closeCombobox"
        >
          <i class="icon-up text-2xl text-light-gray" />
        </button> -->
        <UInput
          role="combobox"
          aria-expanded="true"
          aria-controls="listbox"
          tabindex="0"
          ref="inputRef"
          @click="openCombobox"
          @keydown="handleKeyDown"
          @focus="selectText"
          v-model="searchTerm"
          :placeholder="$t('search.placeholder')"
          class="overflow-hidden z-[1] w-full"
          :input-class="open ? '!bg-white dark:!bg-dark-blue' : ''"
        >
          <template #trailing>
            <IconSearch />
          </template>
        </UInput>
      </div>

      <div
        v-show="open"
        role="listbox"
        class="bg-white dark:bg-dark-blue w-full rounded-lg absolute top-[calc(100%+0.375rem)] left-0 overflow-hidden p-2.5"
      >
        <div
          class="h-auto max-h-[calc(100vh)] md:max-h-[50vh] overflow-y-auto"
          ref="listboxRef"
        >
          <NuxtLinkLocale
            v-for="(option, index) in filteredOptions"
            :key="option.id"
            :to="useNewsUrl(option.publish, option.slug)"
            aria-selected="false"
            :data-highlighted="activeIndex === index ? 'true' : undefined"
            tabindex="-1"
            @mouseover="activeIndex = index"
            class="flex items-center gap-3 px-2.5 py-3 relative select-none group truncate cursor-pointer rounded-md data-[highlighted]:outline-none data-[highlighted]:bg-blue-100 data-[highlighted]:dark:bg-white-100"
          >
            <img
              :src="option.image_small"
              :alt="option.title"
              class="h-10 aspect-[3/2] rounded-md"
            />
            <div class="flex flex-col gap-1">
              <h3 class="title text-sm truncate line-clamp-1">
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

    <div
      v-if="open"
      @click="open = false"
      class="fixed inset-0 h-screen z-[-1] bg-black-500 dark:bg-black-500 transition-colors duration-300 max-md:hidden"
    ></div>
  </div>
  <!-- <div>
    <UInput
      :placeholder="$t('search.placeholder')"
      class="w-full h-full max-lg:hidden"
    >
      <template #trailing>
        <IconSearch />
      </template>
    </UInput>
    <div class="max-sm:p-2">
      <IconSearch class="lg:hidden" />
    </div>
  </div> -->
</template>
