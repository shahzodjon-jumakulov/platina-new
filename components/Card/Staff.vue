<script setup>
defineProps({
  staff: Object,
});
</script>

<template>
  <div class="group flex flex-col cursor-pointer">
    <div class="-mb-[5.625rem] z-[1] relative w-fit self-center">
      <IconHexStroke class="mx-auto z-[1] relative" />
      <IconHexTeam class="absolute-center" />
      <div
        class="[mask-image:url('~/assets/team/team-hexagon.svg')] [mask-size:cover] absolute-center w-[calc(100%-1rem)] h-[calc(100%-1rem)]"
      >
        <img
          class="absolute -bottom-1.5 left-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1.5 transition-all duration-300"
          :src="staff.shadow"
          alt=""
          role="presentation"
        />
        <img
          class="w-full h-full object-cover translate-y-2.5 group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform duration-300"
          :src="staff.image"
          :alt="staff.name"
        />
      </div>
    </div>
    <div
      class="bg-white dark:bg-white-100 rounded-3xl p-6 pt-[5.8125rem] relative"
    >
      <div class="flex flex-col items-center gap-1.5">
        <p
          v-hover-transition
          class="text-black dark:text-white-600 group-hover:text-light-blue group-hover:dark:text-light-blue-dark text-base md:text-2xl font-bold w-min text-center"
        >
          {{ staff.name }}
        </p>
        <p class="text-light-blue dark:text-light-blue-dark text-xs md:text-lg">
          {{ staff.position }}
        </p>
      </div>
    </div>
  </div>
</template>
