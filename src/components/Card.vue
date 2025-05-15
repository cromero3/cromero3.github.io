<template>
  <div @click="$emit('toggle-hold')" class="cursor-pointer">
    <!-- fluid card box, exactly 1/5 width of container, 5:7 ratio -->
    <div
      class="
        w-full
        aspect-[5/7]
        bg-white border rounded-lg shadow-lg
        p-2
        flex flex-col items-center justify-center
        overflow-hidden
      "
    >
      <!-- rank and suit, capped sizes -->
      <span class="text-2xl sm:text-3xl md:text-4xl">
        {{ card.rank }}
      </span>
      <span
        :class="suitClass(card.suit)"
        class="leading-none text-2xl sm:text-3xl md:text-4xl"
      >
        {{ card.suit }}
      </span>
    </div>

    <!-- held label -->
    <div
      v-if="held"
      class="mt-1 text-sm sm:text-base md:text-lg text-green-600 text-center"
    >
      HELD
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface Card { rank: string; suit: string }

const props = defineProps({
  card: { type: Object as PropType<Card>, required: true },
  held: { type: Boolean, required: true },
})

const suitClass = (s: Card['suit']) =>
  s === '♥' || s === '♦' ? 'text-red-600' : 'text-gray-900'
</script>

<style scoped>
/* nothing else needed */
</style>