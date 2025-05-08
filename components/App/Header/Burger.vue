<script setup>
const isOpen = ref(false);
const isSearchOpen = useSearchModal();
const ui = {
  wrapper: "fixed inset-0 flex z-50",
  overlay: {
    base: "fixed inset-0 transition-opacity",
    transition: {
      enter: "ease-in-out duration-500",
      enterFrom: "opacity-0",
      enterTo: "opacity-100",
      leave: "ease-in-out duration-500",
      leaveFrom: "opacity-100",
      leaveTo: "opacity-0",
    },
  },
  base: "relative flex-1 flex flex-col w-full focus:outline-none",
  background: "bg-[#f5f9fd]",
  ring: "",
  rounded: "",
  padding: "",
  shadow: "shadow-xl",
  width: "w-screen max-w-screen",
  height: "h-screen max-h-96",
  translate: {
    base: "translate-x-0",
    left: "-translate-x-full rtl:translate-x-full",
    right: "translate-x-full rtl:-translate-x-full",
    top: "-translate-y-full",
    bottom: "translate-y-full",
  },
  transition: {
    enter: "transform transition ease-in-out duration-300",
    leave: "transform transition ease-in-out duration-200",
  },
};

const categoriesStore = useCategories();
const categories = computed(() => categoriesStore.categories.value.categories);
</script>

<template>
  <div class="max-sm:p-2">
    <button @click="isOpen = true">
      <IconBurger />
    </button>

    <USlideover v-model="isOpen" side="left" :ui="ui">
      <UContainer class="w-full">
        <div class="flex flex-col gap-4">
          <header
            class="px-2 w-full flex items-center justify-between rounded-b-2xl bg-white dark:bg-white-100 border-b border-light-blue-200"
          >
            <button class="p-2" @click="isOpen = false">
              <IconClose />
            </button>
            <h2 class="text-xl font-bold text-blue dark:text-white py-4">
              {{ $t("menu") }}
            </h2>
            <button class="p-2" @click="isSearchOpen = true">
              <IconSearch />
            </button>
          </header>

          <section class="bg-white dark:bg-white-100 rounded-2xl pt-4 flex flex-col">
            <h3 class="px-4 pb-1 text-lg text-blue dark:text-white font-bold">
              {{ $t("ruknlar") }}
            </h3>

            <div
              class="flex flex-col px-4 hover:bg-blue-100 rounded-xl"
              v-for="(item, index) in categories"
              :key="item.id"
            >
              <UDivider v-if="index !== 0" />
              <NuxtLinkLocale
                class="py-4 flex items-center gap-2"
                :to="`/category/${item.slug}`"
              >
                <img 
                  :src="item.icon"
                  alt=""
                  role="presentation"
                  class="size-7 svg-blue"
                />
                <span class="text-base text-black dark:text-white font-medium">
                  {{ item.name }}
                </span>
              </NuxtLinkLocale>
            </div>
          </section>
        </div>
      </UContainer>
    </USlideover>
  </div>
</template>

<style scoped lang="scss">
.svg-blue {
  filter: invert(41%) sepia(96%) saturate(7465%) hue-rotate(199deg)
    brightness(93%) contrast(101%);
}
</style>
