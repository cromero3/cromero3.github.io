<template>
    <div @click="$emit('toggle-hold')" class="cursor-pointer">
      <div class="w-20 h-28 border rounded-lg flex flex-col items-center justify-center">
        <span class="text-xl">{{ card.rank }}</span>
        <span class="text-2xl">{{ card.suit }}</span>
      </div>
      <div v-if="held" class="mt-1 text-sm text-green-600">HELD</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Card',
    props: {
      card: Object,
      held: Boolean,
    },
  };
  </script>