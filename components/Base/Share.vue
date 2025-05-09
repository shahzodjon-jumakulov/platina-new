<script setup>
// import tgicon from "~/assets/icons/telegramShare.svg";
// import fbicon from "~/assets/icons/facebook.svg";
// import twicon from "~/assets/icons/twitter.svg";
// import linkicon from "~/assets/icons/link.svg";
import {
  IconShareTelegram as TgIcon,
  IconShareFacebook as FbIcon,
  IconShareX as XIcon,
  IconShareCopy as CopyIcon,
  IconShareCopied as CopiedIcon,
} from "#components";

const { t } = useI18n();
const { text, copy, copied, isSupported } = useClipboard({
  copiedDuring: 3000,
  legacy: true,
});

const props = defineProps({
  short: {
    required: true,
  },
  title: {
    required: true,
    type: String,
  },
});
const url = ref("https://platina.uz/");
const isOpen = ref(false);
const dropdown = ref(null);
onClickOutside(dropdown, () => (isOpen.value = false));

const share = (social) => {
  let href;
  if (social === "tg") {
    href = `https://t.me/share/url?url=${encodeURIComponent(
      url.value
    )}&text=${encodeURIComponent(props.title)}`;
  } else if (social === "fb") {
    href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url.value
    )}`;
  } else if (social === "tw") {
    href = `https://x.com/intent/tweet?url=${encodeURIComponent(
      url.value
    )}&text=${encodeURIComponent(props.title)}`;
  }
  window.open(href, "_blank");
};

const items = ref([
  {
    id: 1,
    label: "Telegram",
    icon: TgIcon,
    click: () => {
      share("tg");
      isOpen.value = false;
    },
  },
  {
    id: 2,
    label: "Facebook",
    icon: FbIcon,
    click: () => {
      share("fb");
      isOpen.value = false;
    },
  },
  {
    id: 3,
    label: "Twitter",
    icon: XIcon,
    click: () => {
      share("tw");
      isOpen.value = false;
    },
  },
  {
    id: 4,
    label: t("copy"),
    icon: CopyIcon,
    isCopy: true,
    click: () => copy(url.value),
  },
]);

watch(copied, (val) => {
  if (val) {
    items.value[items.value.length - 1].icon = CopiedIcon;
    items.value[items.value.length - 1].label = t("copied");
  } else {
    items.value[items.value.length - 1].icon = CopyIcon;
    items.value[items.value.length - 1].label = t("copy");
    isOpen.value = false;
  }
});

onMounted(() => {
  if (props.short) url.value = "https://platina.uz/" + props.short;
  else url.value = window.location.href;
});
</script>

<template>
  <div
    class="px-3 py-4 rounded-xl bg-white dark:bg-white-100 flex flex-col gap-2 absolute left-[calc(100%+1.25rem)] top-0 max-lg:hidden"
  >
    <button
      v-for="item in items"
      :key="item.id"
      @click="item.click()"
      class="bg-light-blue-100 dark:bg-light-blue-dark-100 hover:bg-light-blue-300 dark:hover:bg-light-blue-dark-300 active:bg-light-blue-400 dark:active:bg-light-blue-dark-400 transition-colors rounded-md flex-center size-6 group"
      :class="{ '!bg-[#2DA85B]/30': item.isCopy && copied }"
    >
      <component :is="item.icon" />
    </button>
  </div>
  <div class="relative -my-2.5 z-10 lg:hidden" ref="dropdown">
    <button class="flex items-center gap-1.5 group" @click="isOpen = !isOpen">
      <IconShare />
      <span
        class="text-xs font-medium text-blue-400 dark:text-white-400 group-hover:text-blue-600 dark:group-hover:text-white-600 transition-colors"
      >
        {{ $t("share") }}
      </span>
    </button>

    <Transition name="fade-300">
      <div
        v-if="isOpen"
        class="bg-white dark:bg-dark-blue rounded-lg border border-black-100 dark:border-white-100 py-1 shadow-400 flex flex-col gap-1.5 absolute right-0 top-[calc(100%+0.31rem)] shadow-lg"
      >
        <button
          v-for="item in items"
          :key="item.id"
          @click="item.click()"
          class="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer hover:bg-[#737C981A] active:bg-[#737C9833] transition-colors group"
          :class="{ '!bg-[#2DA85B]/30': item.isCopy && copied }"
        >
          <span class="h-4 w-4 flex-center">
            <component :is="item.icon" />
          </span>
          <span class="text-blue dark:text-white text-xs whitespace-nowrap">
            {{ item.label }}
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@keyframes fade-300 {
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.fade-300-enter-active {
  animation: fade-300 0.2s ease-in-out;
}

.fade-300-leave-active {
  animation: fade-300 0.2s ease-in-out reverse;
}
</style>
