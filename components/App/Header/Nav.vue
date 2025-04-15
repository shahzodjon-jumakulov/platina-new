<script setup>
//
</script>

<template>
  <div class="max-lg:hidden flex justify-between items-end">
    <!-- categories -->
    <div class=""></div>

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
  transition: background-position 0.5s ease-in-out;
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
