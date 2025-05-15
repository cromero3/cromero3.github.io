<template>
  <div @click="$emit('toggle-hold')" class="cursor-pointer">
    <div
      class="
        w-full aspect-[5/7] bg-white border rounded-lg shadow-lg
        p-2 flex flex-col items-center justify-center overflow-hidden
      "
    >
      <span class="text-2xl sm:text-3xl md:text-4xl">{{ card.rank }}</span>
      <span
        :class="suitClass(card.suit)"
        class="leading-none text-2xl sm:text-3xl md:text-4xl"
      >
        {{ card.suit }}
      </span>
    </div>
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
// **import the public Card type** instead of declaring a new interface
import type { Card as CardType } from '../game/deck'

const props = defineProps({
  card:  { type: Object as PropType<CardType>, required: true },
  held:  { type: Boolean,            required: true },
})

// helper stays the same
const suitClass = (s: CardType['suit']) =>
  s === '♥' || s === '♦' ? 'text-red-600' : 'text-gray-900'
</script>