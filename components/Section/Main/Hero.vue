<script setup>
//
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
    <BaseCard
      transparent
      class="lg:col-span-2"
      :title="$t('pinned')"
      to="/posts/pinned"
      accent
    >
      <GroupFeatured />
    </BaseCard>
    <!-- On lg the rail is taken out of flow so the featured column drives the
         row height; the rail then clips its own list and fades it out. -->
    <div class="lg:relative">
      <GroupSidebar class="lg:absolute lg:inset-0" />
    </div>
  </div>
</template>
