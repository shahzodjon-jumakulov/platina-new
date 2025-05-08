<script setup>
import {
  IconBurgerAbout as About,
  IconBurgerReklama as Reklama,
  IconBurgerTeam as Team,
} from "#components";

const { t } = useI18n();
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
  base: "overflow-auto ",
  background: "bg-[#f5f9fd] dark:bg-dark-blue",
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

const route = useRoute();
watch(
  () => route.path,
  () => {
    isOpen.value = false;
  }
);

const categoriesStore = useCategories();
const categories = computed(() => categoriesStore.categories.value.categories);

const links = computed(() => [
  {
    id: 1,
    text: t("footer.about"),
    to: "/about",
    icon: About,
  },
  {
    id: 2,
    text: t("footer.reklama"),
    to: "/reklama",
    icon: Reklama,
  },
  {
    id: 3,
    text: t("footer.team"),
    to: "/our-team",
    icon: Team,
  },
]);
</script>

<template>
  <div class="max-sm:p-2 inline-flex">
    <button @click="isOpen = true">
      <IconBurger />
    </button>

    <USlideover v-model="isOpen" side="left" :ui="ui" :overlay="false">
      <UContainer class="w-full pb-4">
        <div class="flex flex-col sm:gap-4">
          <header
            class="px-2 w-full flex items-center justify-between rounded-b-2xl bg-white dark:bg-white-100 border-b border-light-blue-200 h-14"
          >
            <button class="p-1" @click="isOpen = false">
              <IconClose class="size-8" />
            </button>
            <h2 class="text-xl font-bold text-blue dark:text-white-600">
              {{ $t("menu") }}
            </h2>
            <button class="p-2" @click="isSearchOpen = true">
              <IconSearch />
            </button>
          </header>

          <div class="flex flex-col gap-4">
            <section
              class="bg-white dark:bg-white-100 rounded-2xl pt-4 flex flex-col"
            >
              <h3
                class="px-4 pb-1 text-lg text-blue dark:text-white-600 font-bold"
              >
                {{ $t("ruknlar") }}
              </h3>

              <div
                class="flex flex-col px-4 hover:bg-blue-100 dark:hover:bg-white-100 active:bg-blue-100 dark:active:bg-white-100 rounded-xl"
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
                  <span
                    class="text-base text-black dark:text-white-600 font-medium"
                  >
                    {{ item.name }}
                  </span>
                </NuxtLinkLocale>
              </div>
            </section>

            <section
              class="bg-white dark:bg-white-100 rounded-2xl pt-4 flex flex-col"
            >
              <h3
                class="px-4 pb-1 text-lg text-blue dark:text-white-600 font-bold"
              >
                {{ $t("settings") }}
              </h3>
              <div>
                <SectionSettingsLang />
                <SectionSettingsColor />
              </div>
            </section>

            <section
              class="bg-white dark:bg-white-100 rounded-2xl pt-4 flex flex-col"
            >
              <h3
                class="px-4 pb-1 text-lg text-blue dark:text-white-600 font-bold"
              >
                {{ $t("footer.about") }}
              </h3>
              <div class="px-4 py-3 flex flex-col gap-3">
                <NuxtLinkLocale
                  v-for="item in links"
                  :key="item.id"
                  :to="item.to"
                  class="p-4 flex items-center justify-between rounded-lg border border-light-blue-200 dark:border-light-blue-dark-200 hover:bg-blue-100 dark:hover:bg-white-100 active:bg-blue-100 dark:active:bg-white-100"
                >
                  <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-2">
                      <component :is="item.icon" />
                      <span class="text-black dark:text-white-600 text-base">
                        {{ item.text }}
                      </span>
                    </div>

                    <IconArrowRight />
                  </div>
                </NuxtLinkLocale>
              </div>
            </section>
          </div>
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
