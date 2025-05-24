<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-blue-900 p-4">
    <div class="w-full max-w-3xl mx-auto">

      <!-- Status -->
      <div class="text-center space-y-1">
        <p v-if="result" class="text-lg sm:text-xl md:text-2xl text-yellow-400">
          <strong> {{ result.name }} </strong>
        </p>
      </div>

      <!-- Card row: blank backs in 'bet', faces in 'draw'/'results' -->
      <div class="grid grid-cols-5 gap-4 mb-6">
        <Card
          v-for="i in 5"
          :key="i"
          :face-down="phase === 'bet'"
          :card="phase === 'bet' ? undefined : hand[i - 1]"
          :held="phase !== 'bet' && held[i - 1]"
          @toggle-hold="() => toggleHold(i - 1)"
        />
      </div>

      <!-- Controls: Bet+1, Deal/Draw/New Game, Max Bet -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
        <button
          @click="increaseBet"
          :disabled="phase !== 'bet' || betAmount >= 5"
          :class="betButtonClasses"
          class="order-1 sm:order-1 w-full sm:w-auto"
        >
          Bet {{ betAmount }}×
        </button>

        <button
          @click="handleAction"
          :class="actionClasses"
          class="order-2 sm:order-2 w-full sm:w-auto"
        >
          {{ buttonLabel }}
        </button>

        <button
          @click="maxBet"
          :disabled="phase !== 'bet' || betAmount >= 5"
          :class="betButtonClasses"
          class="order-3 sm:order-3 w-full sm:w-auto"
        >
          Max Bet
        </button>
        <div class="text-center space-y-1">
          <p class="text-lg sm:text-xl md:text-2xl text-yellow-400">
          <strong>Credits:</strong> {{ credits }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Card from './Card.vue';
import type { Card as CardType } from '../game/deck';
import { createDeck, shuffle } from '../game/deck';
import { evaluateHand } from '../game/evaluator';

export default defineComponent({
  name: 'PokerGame',
  components: { Card },
  setup() {
    const credits = ref(100);
    const betAmount = ref(1);
    const deck = ref<CardType[]>([]);
    const hand = ref<CardType[]>([]);
    const held = ref<boolean[]>([false, false, false, false, false]);
    // three phases: bet → draw → results → back to bet
    const phase = ref<'bet' | 'draw' | 'results'>('bet');
    const result = ref<{ name: string; payout: number } | null>(null);

    function deal() {
      // only callable in 'bet' phase
      if (credits.value < betAmount.value) return;
      credits.value -= betAmount.value;
      deck.value = shuffle(createDeck());
      hand.value = deck.value.splice(0, 5);
      held.value = [false, false, false, false, false];
      result.value = null;
      phase.value = 'draw';
    }

    function draw() {
      // only callable in 'draw' phase
      hand.value = hand.value.map((card, i) =>
        held.value[i] ? card : deck.value.shift()!
      );
      const r = evaluateHand(hand.value);
      result.value = r;
      credits.value += (r.payout || 0) * betAmount.value;
      betAmount.value = 1;         // reset bet for next round
      phase.value = 'results';
    }

    function toggleHold(i: number) {
      if (phase.value !== 'draw') return;
      held.value[i] = !held.value[i];
    }

    function handleAction() {
      // Deal / Draw / New Game behavior based on phase
      if (phase.value === 'bet') {
        deal();
      } else if (phase.value === 'draw') {
        draw();
      } else /* results */ {
        // go back to betting for the next hand
        phase.value = 'bet';
        result.value = null;
      }
    }

    const buttonLabel = computed(() => {
      if (phase.value === 'bet') return 'Deal';
      if (phase.value === 'draw') return 'Draw';
      return 'New Game';
    });

    const actionClasses = computed(() => [
      'w-full sm:w-auto px-4 py-2 rounded font-semibold text-lg sm:text-xl md:text-2xl text-white disabled:opacity-50 disabled:cursor-not-allowed',
      phase.value === 'draw'
        ? 'bg-green-500 border border-green-700'
        : 'bg-blue-500 border border-blue-700'
    ]);

    const betButtonClasses = computed(() => [
      'w-full sm:w-auto px-4 py-2 rounded font-medium text-base sm:text-lg bg-gray-200 text-gray-800 border border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed'
    ]);

    function increaseBet() {
      if (phase.value !== 'bet') return;
      if (betAmount.value < 5) betAmount.value++;
    }

    function maxBet() {
      if (phase.value !== 'bet') return;
      betAmount.value = 5;
    }

    return {
      credits,
      betAmount,
      hand,
      held,
      phase,
      result,
      toggleHold,
      buttonLabel,
      actionClasses,
      betButtonClasses,
      increaseBet,
      maxBet,
      handleAction,
    };
  },
});
</script>