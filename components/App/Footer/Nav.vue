<script setup>
import Main from "@/components/Icon/Footer/Main.vue";
import Latest from "@/components/Icon/Footer/Latest.vue";
import Popular from "@/components/Icon/Footer/Popular.vue";
import Articles from "~/components/Icon/Footer/Articles.vue";
import Videos from "~/components/Icon/Footer/Videos.vue";

const nav = [
  {
    id: 1,
    name: "footer.sticky.main",
    icon: Main,
    href: "/",
  },
  {
    id: 2,
    name: "footer.sticky.latest",
    icon: Latest,
    href: "/latest",
  },
  {
    id: 3,
    name: "footer.sticky.popular",
    icon: Popular,
    href: "/popular",
  },
  {
    id: 4,
    name: "articles",
    icon: Articles,
    href: "/category/maqola",
  },
  {
    id: 5,
    name: "videos",
    icon: Videos,
    href: "/category/video",
  },
];
</script>

<template>
  <nav
    class="sticky bottom-0 z-[49] md:hidden rounded-t-2xl bg-white dark:bg-[#13142D] border-t border-dark-blue-200 dark:border-white-100 h-16 px-2"
  >
    <div class="grid grid-cols-5">
      <NuxtLinkLocale
        v-for="item in nav"
        :key="item.id"
        :to="item.href"
        class="p-4 pt-2 flex flex-col gap-1 items-center hover:bg-dark-blue-100 dark:hover:bg-white-100"
        active-class="bg-dark-blue-100 dark:bg-white-100"
      >
        <component :is="item.icon" />
        <span class="text-xs font-medium text-dark-blue-500 dark:text-white">
          {{ $t(item.name) }}
        </span>
      </NuxtLinkLocale>
    </div>
  </nav>
</template>
