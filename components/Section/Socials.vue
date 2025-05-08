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
          <h3
            class="text-blue dark:text-white-600 font-bold text-base leading-none"
          >
            {{ item.name }}
          </h3>
          <p
            class="text-sm text-light-blue dark:text-light-blue-dark leading-none"
          >
            {{ item.username }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
