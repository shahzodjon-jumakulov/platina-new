<script setup>
import Hero from "~/components/Section/Main/Hero.vue";
// The Articles / Interview / Popular / "tahlil" CardSlider sections are
// switched off below; their imports and the "tahlil" fetch that fed the
// slider (an extra browser request per visit whose result was never shown)
// were removed with them. Restore from git history if they come back.

const { webpageSchema } = useSchemaProperties();

useSchemaOrg(webpageSchema);

// White ground for the home page only (see `body.main-page` in main.scss).
useHead({ bodyAttrs: { class: "main-page" } });
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-12 sm:py-12 max-sm:pb-4">
    <UContainer>
      <h1 class="sr-only">{{ $t("meta.title") }}</h1>
      <Hero />
    </UContainer>
    <GroupTvSlider />

    <GroupCategoryGrid category="jamiyat" />
    <GroupCategoryGrid category="siyosat" />
    <GroupCategoryFeature category="maqola" />
    <GroupCategoryGrid category="jahon" />
    <GroupCategoryGrid category="iqtisod" />
    <GroupCategoryFeature category="tahlil" />
    <GroupCategoryGrid category="sport" />
    <GroupCategoryGrid category="madaniyat" />

    <!-- <Articles class="max-md:hidden" />
    <Interview />
    <GroupCardSlider :title="news[0]?.category.name" to="/category/tahlil" :news="news" color="light" />
    <Popular /> -->

    <UContainer>
      <GroupBusiness transparent-bg />
    </UContainer>
  </div>
</template>
