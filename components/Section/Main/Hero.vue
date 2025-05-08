<script setup>
//
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
    <BaseCard class="lg:col-span-2" :title="$t('pinned')">
      <GroupFeatured />
    </BaseCard>
    <BaseCard class="sm:gap-5 !flex flex-col" :title="$t('latest')">
      <GroupSidebar />
    </BaseCard>
  </div>
</template>
