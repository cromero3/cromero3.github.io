<template>
  <div @click="$emit('toggle-hold')" class="cursor-pointer">
    <div class="w-20 h-28 border rounded-lg flex flex-col items-center justify-center">
      <span class="text-xl">{{ card.rank }}</span>
      <span class="text-2xl">{{ card.suit }}</span>
    </div>
    <div v-if="held" class="mt-1 text-sm text-green-600">HELD</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'Card',
  props: {
    card: {
      type: Object as PropType<{ rank: string; suit: string }>,
      required: true,
    },
    held: {
      type: Boolean,
      required: true,
    },
  },
});
</script>