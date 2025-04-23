<script setup>
import Hero from "~/components/Section/Main/Hero.vue";
import Articles from "~/components/Section/Main/Articles.vue";
import Popular from "~/components/Section/Main/Popular.vue";
</script>

<template>
  <UContainer>
    <h1 class="sr-only">{{ $t("meta.title") }}</h1>
    <div class="flex flex-col gap-5 sm:py-5">
      <Hero />
      <Articles class="max-md:hidden" />
      <Popular />
    </div>
  </UContainer>
</template>
