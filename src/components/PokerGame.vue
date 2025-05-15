<template>
    <div class="p-4">
      <div class="flex space-x-2 mb-4">
        <Card
          v-for="(c, i) in hand"
          :key="i"
          :card="c"
          :held="held[i]"
          @toggle-hold="() => toggleHold(i)"
        />
      </div>
  
      <div class="space-x-2 mb-4">
        <button
          @click="deal"
          :disabled="phase !== 'bet'"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >Deal</button>
        <button
          @click="draw"
          :disabled="phase !== 'draw'"
          class="px-4 py-2 bg-green-500 text-white rounded"
        >Draw</button>
      </div>
  
      <div class="mb-2">
        <strong>Credits:</strong> {{ credits }}
      </div>
      <div v-if="result">
        <strong>Result:</strong> {{ result.name }}
        <span v-if="result.payout">(+{{ result.payout }}× bet)</span>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { createDeck, shuffle } from '../game/deck';
  import { evaluateHand, payouts } from '../game/evaluator';
  
  export default {
    name: 'PokerGame',
    components: { Card: () => import('./Card.vue') },
  
    setup() {
      const credits = ref(100);
      const bet = 1;
      const deck = ref([]);
      const hand = ref([]);
      const held = ref([false, false, false, false, false]);
      const phase = ref('bet'); // 'bet' → 'draw' → 'results'
      const result = ref(null);
  
      function deal() {
        if (credits.value < bet) return;
        credits.value -= bet;
        deck.value = shuffle(createDeck());
        hand.value = deck.value.splice(0, 5);
        held.value = [false, false, false, false, false];
        phase.value = 'draw';
        result.value = null;
      }
  
      function toggleHold(i) {
        if (phase.value !== 'draw') return;
        held.value[i] = !held.value[i];
      }
  
      function draw() {
        // replace unheld cards
        hand.value = hand.value.map((card, i) =>
          held.value[i] ? card : deck.value.shift()
        );
        // evaluate
        const r = evaluateHand(hand.value);
        result.value = r;
        credits.value += r.payout * bet;
        phase.value = 'results';
      }
  
      return { credits, hand, held, phase, result, deal, draw, toggleHold };
    },
  };
  </script>