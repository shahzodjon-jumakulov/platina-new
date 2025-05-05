<script setup>
const { locale } = useI18n();
const route = useRoute();
const category = ref(route.params.category);

const categoriesStore = useCategories();
const categories = computed(() => categoriesStore.categories.value.categories);

// handling a line under selected category
const getIndex = (slug) => {
  if (!categories.value.length) return -1;
  const idx = categories.value.findIndex((item) => item.slug === slug);
  return categories.value[idx]?.id;
};
const activeIndex = ref(null);

const block = ref(null);

const handleActive = () => {
  const el = document.getElementById(`menu-item-${activeIndex.value}`);
  console.log(activeIndex.value)
  if (!el || !activeIndex.value) {
    block.value.style.width = 0;
    // block.value.style.left = 0;
  } else {
    block.value.style.width = `${el.offsetWidth}px`;
    block.value.style.left = `${el.offsetLeft}px`;
  }
};

watch(
  () => route.params.category,
  (slug) => {
    // if (newIndex === -1) return;
    activeIndex.value = getIndex(slug);

    handleActive();
  }
);

onMounted(() => {
  activeIndex.value = getIndex(category.value);
  handleActive();
  window.addEventListener("resize", handleActive);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleActive);
});
</script>

<template>
  <div class="max-lg:hidden flex justify-between items-end">
    <div class="flex items-center gap-8 relative">
      <NuxtLinkLocale
        v-for="item in categories"
        :key="item.id"
        :to="`/category/${item.slug}`"
        class="py-4 text-sm font-semibold group"
        :id="`menu-item-${item.id}`"
        v-hover-transition
      >
        <span
          :class="
            activeIndex === item.id
              ? 'text-light-blue dark:text-light-blue-dark'
              : 'text-black dark:text-white group-hover:text-light-blue dark:group-hover:text-light-blue-dark'
          "
        >
          {{ item.name }}
        </span>
      </NuxtLinkLocale>
      <div
        ref="block"
        class="bg-light-blue dark:bg-light-blue-dark h-1 rounded-t-sm absolute bottom-0 transition-all will-change-transform"
      ></div>
    </div>

    <NuxtLink
      to="https://t.me/platinauzb"
      target="_blank"
      class="telegram-link"
    >
      <img
        src="~/assets/icons/telegram-sm-white.svg"
        alt="telegram"
        class="size-5"
      />
      <span class="text-sm font-medium text-white">platinauzb</span>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.telegram-link {
  background: linear-gradient(90deg, #06c 0%, #34aadf 100%),
    rgba(0, 102, 204, 0.06);
  background-size: 200% 100%;
  background-position: right center;
  transition: background-position 0.3s ease-in-out;
  color: white;
  padding: 1rem 2rem;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 0;

  &:hover {
    background-position: left center;
  }

  @apply px-3 py-2 rounded-t-lg flex items-center;
}
</style>
