<script setup>
import Telegram from "@/public/images/telegram.png";
import Youtube from "@/public/images/youtube.png";
import Facebook from "@/public/images/facebook.png";
import Instagram from "@/public/images/instagram.png";
import TikTok from "@/public/images/tiktok.png";
import X from "@/public/images/x.png";

const socials = [
  {
    id: 1,
    name: "Telegram",
    link: "https://t.me/platinauzb",
    icon: Telegram,
    username: "@platinauzb",
  },
  {
    id: 2,
    name: "YouTube",
    link: "https://www.youtube.com/@platinauz",
    icon: Youtube,
    username: "@platinauz",
  },
  {
    id: 3,
    name: "Facebook",
    link: "https://facebook.com/platinauz",
    icon: Facebook,
    username: "@platinauz",
  },
  {
    id: 4,
    name: "Instagram",
    link: "https://www.instagram.com/platinauzb",
    icon: Instagram,
    username: "@platinauzb",
  },
  {
    id: 5,
    name: "TikTok",
    link: "https://www.tiktok.com/@platinauz",
    icon: TikTok,
    username: "@platinauz",
  },
  {
    id: 6,
    name: "X",
    link: "https://x.com/platinauz",
    icon: X,
    username: "@platinauz",
  },
];
</script>

<template>
  <UContainer class="py-5 max-sm:px-4">
    <div class="grid grid-cols-1 gap-8 max-w-[50.25rem] mx-auto">
      <section class="flex flex-col gap-5">
        <h1 class="text-blue dark:text-white-600 font-bold text-xl">
          {{ $t("footer.reklama") }}
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <NuxtLink
            to="tel:+998970220110"
            class="px-4 py-3 flex items-center gap-3 bg-light-blue-100 dark:bg-white-100 hover:bg-light-blue-300 dark:hover:bg-white-200 transition-colors rounded-lg group"
          >
            <div
              class="rounded-lg bg-white dark:bg-dark-blue p-3 h-full shrink-0 flex-center"
            >
              <IconReklamaPhone />
            </div>

            <div class="px-1 flex flex-col gap-1">
              <h2 class="text-black dark:text-white-600 text-sm">
                {{ $t("reklama.phone") }}
              </h2>
              <p
                class="text-light-blue dark:text-light-blue-dark text-base font-bold"
              >
                +998 97 022 01 10
              </p>
            </div>
          </NuxtLink>
          <NuxtLink
            to="https://t.me/PlatinaPR"
            class="px-4 py-3 flex items-center gap-3 bg-light-blue-100 dark:bg-white-100 hover:bg-light-blue-300 dark:hover:bg-white-200 transition-colors rounded-lg group"
          >
            <div
              class="rounded-lg bg-white dark:bg-dark-blue p-3 h-full shrink-0 flex-center"
            >
              <IconReklamaTelegram />
            </div>

            <div class="px-1 flex flex-col gap-1">
              <h2 class="text-black dark:text-white-600 text-sm">
                {{ $t("reklama.telegram") }}
              </h2>
              <p
                class="text-light-blue dark:text-light-blue-dark text-base font-bold"
              >
                @PlatinaPR
              </p>
            </div>
          </NuxtLink>
        </div>

        <img src="/images/reklama.png" alt="reklama" />
      </section>

      <section class="flex flex-col gap-5">
        <h2 class="text-blue dark:text-white-600 font-bold text-xl">
          {{ $t("soc_media_pages") }}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <NuxtLink
            v-for="item in socials"
            :key="item.id"
            :to="item.link"
            class="rounded-2xl p-4 bg-white hover:bg-light-blue-100 dark:bg-white-100 dark:hover:bg-white-200 flex items-center gap-2 group"
          >
            <img
              :src="item.icon"
              alt=""
              role="presentation"
              class="h-12 shrink-0 group-hover:scale-110 transition-transform will-change-transform"
            />
            <div class="flex flex-col gap-1">
              <h3 class="text-blue dark:text-white-600 font-bold text-base leading-none">
                {{ item.name }}
              </h3>
              <p class="text-sm text-light-blue dark:text-light-blue-dark leading-none">
                {{ item.username }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </UContainer>
</template>
