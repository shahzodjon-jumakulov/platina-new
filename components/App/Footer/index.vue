<script setup>
import {
  LazyIconSocialTg as Telegram,
  LazyIconSocialIg as Instagram,
  LazyIconSocialFb as Facebook,
  LazyIconSocialYt as YouTube,
  LazyIconSocialX as X,
  LazyIconSocialTt as TikTok,
} from "#components";

const { t } = useI18n();
const links = computed(() => [
  {
    id: 1,
    text: t("footer.about"),
    to: "/about",
  },
  {
    id: 2,
    text: t("footer.reklama"),
    to: "/reklama",
  },
  {
    id: 3,
    text: t("footer.team"),
    to: "/our-team",
  },
]);

const socials = [
  {
    id: 1,
    name: "Telegram",
    link: "https://t.me/platinauzb",
    component: Telegram,
  },
  {
    id: 2,
    name: "Instagram",
    link: "https://www.instagram.com/platinauzb/",
    component: Instagram,
  },
  {
    id: 3,
    name: "Facebook",
    link: "https://facebook.com/platinauz",
    component: Facebook,
  },
  {
    id: 4,
    name: "YouTube",
    link: "https://www.youtube.com/@platinauz",
    component: YouTube,
  },
  {
    id: 5,
    name: "X",
    link: "https://x.com/platinauz",
    component: X,
  },
  {
    id: 6,
    name: "TikTok",
    link: "https://www.tiktok.com/@platinauz",
    component: TikTok,
  },
];

const texts = computed(() => [
  {
    id: 1,
    text: `© ${new Date().getFullYear()}` + t("footer.info[0]"),
  },
  {
    id: 2,
    text: t("footer.info[1]"),
  },
  {
    id: 3,
    text: t("footer.info[2]", {
      name: `<a href="https://platina.uz/" target="_blank">Platina.uz</a>`,
      phone: `<a href="tel:+998 97 022 01 10" target="_blank">+998 97 022 01 10</a>`,
      telegram: `<a href="https://t.me/PlatinaPR" target="_blank">Platina PR</a>`,
      email: `<a href="mailto:info@platina.uz" target="_blank">info@platina.uz</a>`,
    }),
  },
]);
</script>

<template>
  <AppFooterNav />
  
  <footer class="bg-white dark:bg-white-100 max-md:hidden">
    <UContainer class="py-7">
      <div class="flex flex-col gap-5">
        <div class="flex items-center justify-between gap-5 flex-wrap">
          <div class="flex items-center gap-10">
            <IconLogo />
            <div class="flex">
              <NuxtLinkLocale
                class="nav-link"
                v-for="item in links"
                :key="item.id"
                :to="item.to"
              >
                {{ item.text }}
              </NuxtLinkLocale>
            </div>
          </div>

          <div class="flex gap-3">
            <NuxtLink
              v-for="item in socials"
              :key="item.id"
              :to="item.link"
              class="group"
            >
              <component
                :is="item.component"
                class="size-8 pointer-events-none"
              ></component>
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-8 content">
          <div
            class="text-black-500 dark:text-white-500 text-sm leading-[normal]"
            v-for="item in texts"
            :key="item.id"
            v-html="item.text"
          ></div>
        </div>

        <UDivider />

        <div class="flex items-center justify-between">
          <div class="relative hexagon">
            <IconHexagonLg />
            <span class="absolute-center">18+</span>
          </div>

          <AppFooterAppLinks />
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<style scoped lang="scss">
.nav-link {
  @apply px-5 py-3.5 rounded-lg text-black dark:text-white font-medium hover:bg-black-100 dark:hover:bg-white-100;
}

.content:deep(a) {
  @apply whitespace-nowrap text-light-blue hover:text-light-blue-600 dark:text-light-blue-dark dark:hover:text-light-blue-dark-600 transition-colors;
}

.hexagon span {
  @apply text-sm text-blue-500 dark:text-white-500 font-semibold leading-[normal];
}
</style>
