<script setup>
//
</script>

<template>
  <NuxtLink
    to="https://t.me/platinauzb"
    target="_blank"
    class="max-sm:mx-4 flex max-md:flex-row-reverse items-center justify-between px-5 py-4 rounded-lg bg-gradient-to-r from-light-blue to-[#34AADF] h-[3.25rem] md:h-[3.75rem] overflow-hidden group"
  >
    <div class="size-[4.375rem] md:size-[7.25rem] relative transition-transform duration-300 group-hover:scale-110 group-active:scale-105">
      <img
        src="/images/telegram-round.png"
        alt=""
        role="presentation"
        class="z-[1] relative transition-transform duration-300 group-hover:rotate-[5deg] animate-float"
      />
      <img
        src="/images/telegram-round.png"
        alt=""
        role="presentation"
        class="h-[2.5625rem] md:size-12 absolute -right-6 top-1/2 -translate-y-1/2 opacity-50 -rotate-6 blur-[2px] transition-all duration-300 group-hover:opacity-70 group-hover:-rotate-12 group-hover:scale-110 animate-float-delayed"
      />
    </div>
    <span class="text-white text-base font-bold">
      {{ $t("follow_telegram") }}
    </span>
    <IconLogo class="dark h-7 w-auto max-md:hidden" />
  </NuxtLink>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(2px);
  }
  50% {
    transform: translateY(-2px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(-60%);
  }
  50% {
    transform: translateY(-40%);
  }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite;
  animation-delay: 0.3s;
}
</style>
