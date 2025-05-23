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

      <!-- Controls: Bet+1, Action, Max Bet -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
        <!-- Main action button (center on desktop, top on mobile) -->
        <button
          @click="handleAction"
          :class="actionClasses"
          class="order-1 sm:order-2 w-full sm:w-auto"
        >
          {{ buttonLabel }}
        </button>
        <!-- Bet +1 button (left on desktop, middle on mobile) -->
        <button
          @click="increaseBet"
          :disabled="phase === 'draw' || betAmount >= 5"
          :class="betButtonClasses"
          class="order-2 sm:order-1 w-full sm:w-auto"
        >
          Bet {{ betAmount }}x
        </button>
        <!-- Max Bet button (right on desktop, bottom on mobile) -->
        <button
          @click="maxBet"
          :disabled="phase === 'draw' || betAmount >= 5"
          :class="betButtonClasses"
          class="order-3 sm:order-3 w-full sm:w-auto"
        >
          Max Bet
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
    const betAmount = ref(1);
    const deck = ref<{ rank: string; suit: string }[]>([]);
    const hand = ref<{ rank: string; suit: string }[]>([]);
    const held = ref<boolean[]>([false, false, false, false, false]);
    const phase = ref<'bet' | 'draw' | 'results'>('bet');
    const result = ref<{ name: string; payout: number } | null>(null);

    function deal() {
      phase.value = 'bet';
      // betAmount remains whatever user set
      if (credits.value < betAmount.value) return;
      credits.value -= betAmount.value;
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
      credits.value += (r.payout || 0) * betAmount.value;
      phase.value = 'results';
      // reset bet after round completion
      betAmount.value = 1;
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
      // only disable during draw, allow in results phase
      if (phase.value === 'draw') return;
      if (betAmount.value < 5) betAmount.value++;
    }

    function maxBet() {
      if (phase.value === 'draw') return;
      betAmount.value = 5;
    }

    function handleAction() {
      if (phase.value === 'bet' || phase.value === 'results') {
        deal();
      } else {
        draw();
      }
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
      increaseBet,
      maxBet,
      betButtonClasses,
      handleAction,
    };
  },
});
</script>