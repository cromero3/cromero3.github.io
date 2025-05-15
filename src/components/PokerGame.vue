<template>
  <div class="p-4">
    <!-- Deal / Draw Buttons -->
    <div class="space-x-2 mb-4">
      <button @click="deal":disabled="phase =='draw' "class="px-4 py-2 bg-blue-500 text-white rounded border border-blue-700">
        Deal
        {{ phase === 'results' ? 'New Game' : 'Deal' }}
      </button>
      <button @click="draw":disabled="phase!=='draw' "class="px-4 py-2 bg-green-500 text-white rounded border border-green-700">
        Draw
      </button>
    </div>

    <!-- Credits and Result -->
    <div class="mb-2"><strong>Credits:</strong> {{ credits }}</div>
    <div v-if="result">
      <strong>Result:</strong> {{ result.name }}
      <span v-if="result.payout">(+{{ result.payout }}× bet)</span>
    </div>

    <!-- Card display -->
    <div class="flex space-x-2 mt-4">
      <Card
        v-for="(c, i) in hand"
        :key="i"
        :card="c"
        :held="held[i]"
        @toggle-hold="() => toggleHold(i)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Card from './Card.vue';
import { createDeck, shuffle } from '../game/deck';
import { evaluateHand, payout } from '../game/evaluator';

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

    return { credits, hand, held, phase, result, deal, toggleHold, draw };
  },
});
</script>