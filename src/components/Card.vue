<template>
  <div @click="emitToggleHold" class="cursor-pointer">
    <!-- card back -->
    <div
      v-if="faceDown"
      class="card-back"
    ></div>

    <!-- card front (unchanged) -->
    <div
      v-else
      class="w-full aspect-[5/7] bg-white border rounded-lg shadow-lg p-2 flex flex-col items-center justify-center overflow-hidden"
    >
      <span class="text-2xl sm:text-3xl md:text-4xl">{{ card!.rank }}</span>
      <span
        :class="suitClass(card!.suit)"
        class="leading-none text-2xl sm:text-3xl md:text-4xl"
      >
        {{ card!.suit }}
      </span>
    </div>

    <!-- HELD badge -->
    <div class="mt-1 min-h-[1.5rem] text-center">
      <span 
        v-if="!faceDown && held"
        class="mt-1 text-sm sm:text-base md:text-lg text-green-400 font-bold text-center"
      >
        HELD
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Card as CardType } from '../game/deck';

const props = defineProps<{
  faceDown?: boolean;
  card?: CardType;
  held?: boolean;
}>();
const emit = defineEmits(['toggle-hold']);
function emitToggleHold() {
  if (!props.faceDown) emit('toggle-hold');
}
const suitClass = (s: CardType['suit']) =>
  s === '♥' || s === '♦' ? 'text-red-600' : 'text-gray-900';
</script>

<style scoped>
.card-back {
  width: 100%;
  aspect-ratio: 5 / 7;

  /* white frame */
  border: 4px solid white;
  border-radius: 0.5rem;

  /* inner shadow + outer black outline */
  box-shadow:
    inset 0 0 4px rgba(0, 0, 0, 0.1),
    0 0 0 2px rgba(0, 0, 0, 1);

  /* red background + crosshatch pattern */
  background-color: #c00;
  background-image:
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.2) 0 2px,
      transparent 2px 12px
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(255,255,255,0.2) 0 2px,
      transparent 2px 12px
    );
  background-size: 12px 12px;
}
</style>