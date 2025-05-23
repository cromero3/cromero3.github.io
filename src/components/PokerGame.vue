<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-3xl mx-auto">
      <!-- Card row: exactly 5 equal columns with gap -->
      <div class="grid grid-cols-5 gap-4 mb-6">
        <Card
          v-for="(c, i) in hand"
          :key="i"
          :card="c"
          :held="held[i]"
          @toggle-hold="() => toggleHold(i)"
        />
      </div>

      <!-- controls -->
      <div class="flex justify-center mb-4">
        <button
          @click="handleAction"
          :disabled="(phase === 'draw' && buttonLabel === 'Deal')"
          class="
            px-4 py-2 rounded font-semibold
            text-lg sm:text-xl md:text-2xl
            bg-blue-500 text-white border border-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {{ buttonLabel }}
        </button>
      </div>

      <!-- Status -->
      <div class="text-center space-y-1">
        <p class="text-lg sm:text-xl md:text-2xl">
          <strong>Credits:</strong> {{ credits }}
        </p>
        <p v-if="result" class="text-lg sm:text-xl md:text-2xl">
          <strong>Result:</strong> {{ result.name }}
          <span v-if="result.payout">(+{{ result.payout }}× bet)</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Card from './Card.vue';
import { createDeck, shuffle } from '../game/deck';
import { evaluateHand } from '../game/evaluator';

export default defineComponent({
  name: 'PokerGame',
  components: { Card },
  setup() {
    const credits = ref(100);
    const bet = 1;
    const deck = ref<{ rank: string; suit: string }[]>([]);
    const hand = ref<{ rank: string; suit: string }[]>([]);
    const held = ref<boolean[]>([false, false, false, false, false]);
    const phase = ref<'bet'|'draw'|'results'>('bet');
    const result = ref<{ name: string; payout: number }|null>(null);

    function deal() {
      phase.value = 'bet';
      if (credits.value < bet) return;
      credits.value -= bet;
      deck.value = shuffle(createDeck());
      hand.value = deck.value.splice(0, 5);
      held.value = [false, false, false, false, false];
      phase.value = 'draw';
      result.value = null;
    }

    function toggleHold(i: number) {
      if (phase.value !== 'draw') return;
      held.value[i] = !held.value[i];
    }

    function draw() {
      hand.value = hand.value.map((card, i) =>
        held.value[i] ? card : deck.value.shift()!
      );
      const r = evaluateHand(hand.value);
      result.value = r;
      credits.value += r.payout * bet;
      phase.value = 'results';
    }

    const buttonLabel = computed(() => {
      if (phase.value === 'bet') return 'Deal';
      if (phase.value === 'draw') return 'Draw';
      return 'New Game';
    });

    function handleAction() {
      if (phase.value === 'bet' || phase.value === 'results') {
        deal();
      } else {
        draw();
      }
    }

    return {
      credits,
      hand,
      held,
      phase,
      result,
      toggleHold,
      buttonLabel,
      handleAction,
    };
  },
});
</script>