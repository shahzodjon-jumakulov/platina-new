<template>
  <NuxtLink
    to="https://tcm.uz"
    target="_blank"
    rel="noopener"
    aria-label="Tashkent Content Market"
    class="tcm-banner group"
  >
    <img
      src="~/assets/icons/tcm.svg"
      alt="Tashkent Content Market"
      class="h-[25.83px] w-[70.25px] shrink-0"
    />

    <div class="tcm-pill">
      <div class="flex items-center gap-[4.17px] pl-[10.6px] pr-[6px]">
        <img
          src="~/assets/icons/calendar.svg"
          alt=""
          role="presentation"
          class="shrink-0"
        />
        <span class="tcm-text">4-5.02.2027</span>
      </div>

      <span class="tcm-button">
        <span class="tcm-text">{{ $t("tcm_more") }}</span>
        <span class="size-[9.53px] flex items-center justify-center">
          <img
            src="~/assets/icons/arrow.svg"
            alt=""
            role="presentation"
            class="transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px"
          />
        </span>
      </span>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss">
.tcm-banner {
  background: linear-gradient(to top, #041e41 1.08%, #003b78 98.84%);
  // -mb-px lets the banner cover the header's 1px bottom border
  @apply h-[46px] px-[13px] -mb-px shrink-0 flex items-center gap-[8px] rounded-t-[9px] overflow-hidden;
}

.tcm-pill {
  @apply h-[20.24px] flex items-center justify-between border-[0.6px] border-solid border-[#1eaaeb] rounded-[5.95px];
}

.tcm-button {
  @apply -mr-[0.6px] h-[19.04px] px-[7.91px] flex items-center gap-[1.19px] bg-[#1eaaeb] rounded-[5.95px] transition-colors duration-200;
}

.group:hover .tcm-button {
  @apply bg-[#0c97d8];
}

.tcm-text {
  @apply text-[8.34px] leading-[11.11px] font-medium text-white uppercase whitespace-nowrap;
}
</style>
