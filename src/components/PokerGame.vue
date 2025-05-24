<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-blue-900 p-4">
    <div class="w-full max-w-4xl mx-auto">

    <!-- Payouts Table -->
    <div class="overflow-x-auto mb-6">
      <table class="w-full table-auto border-collapse border border-yellow-300 text-white text-sm">
        <thead>
          <tr class="bg-blue-800">
            <th class="px-3 py-4 text-left">Hand</th>
            <th
              v-for="b in bets"
              :key="b"
              :class="[
                'px-3 py-3 text-center',
                b === betAmount ? 'bg-red-600 text-white' : ''
              ]"
            >
              Bet {{ b }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in payoutRows"
            :key="row.name"
            class="even:bg-blue-800"
          >
          <td class="px-3 py-2 font-medium">{{ row.name }}</td>
          <td
            v-for="(val, idx) in row.values"
            :key="idx"
            :class="[
              'px-3 py-2 text-center text-yellow-300 font-bold',
              bets[idx] === betAmount ? 'bg-red-600' : ''
            ]"
          >
            {{ val }}
          </td>
          </tr>
        </tbody>
      </table>
    </div>

      <!-- Status -->
      <div class="text-center space-y-1 mb-4 min-h-[3rem]">
        <p
          v-if="result"
          :class="[
            'text-4xl sm:text-4xl md:text-4xl font-semibold',
            result.payout > 0 ? 'text-yellow-300' : 'text-red-400'
          ]"
        >
        {{ result.name }}
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

        <div class="text-center space-y-1 mb-4">
          <p class="text-3xl sm:text-3xl md:text-3xl text-yellow-300 font-semibold">
            Credits: {{ credits }}
          </p>
        </div>

      <!-- Controls: Bet+1, Deal/Draw/New Game, Max Bet -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
        <button
          @click="increaseBet"
          :disabled="phase !== 'bet' || betAmount >= 5"
          :class="betButtonClasses"
          class="w-full sm:w-auto"
        >
          Bet {{ betAmount }}×
        </button>

        <button
          @click="handleAction"
          :class="actionClasses"
          class="w-full sm:w-auto"
        >
          {{ buttonLabel }}
        </button>

        <button
          @click="maxBet"
          :disabled="phase !== 'bet' || betAmount >= 5"
          :class="betButtonClasses"
          class="w-full sm:w-auto"
        >
          Max Bet
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Card from './Card.vue';
import type { Card as CardType } from '../game/deck';
import { createDeck, shuffle } from '../game/deck';
import { evaluateHand, payouts } from '../game/evaluator';

export default defineComponent({
  name: 'PokerGame',
  components: { Card },
  setup() {
    const credits = ref(100);
    const betAmount = ref(1);
    const deck = ref<CardType[]>([]);
    const hand = ref<CardType[]>([]);
    const held = ref<boolean[]>([false, false, false, false, false]);
    const phase = ref<'bet' | 'draw' | 'results'>('bet');
    const result = ref<{ name: string; payout: number } | null>(null);

    // for table headers
    const bets = [1, 2, 3, 4, 5] as const;

    // build rows: only show hands with a non-zero base payout
    const payoutRows = computed(() =>
      Object.entries(payouts)
        .filter(([, base]) => base > 0)
        .map(([name, base]) => ({
          name,
          values: bets.map(b => base * b),
        }))
    );

    function deal() {
      if (credits.value < betAmount.value) return;
      credits.value -= betAmount.value;
      deck.value = shuffle(createDeck());
      hand.value = deck.value.splice(0, 5);
      held.value = [false, false, false, false, false];
      result.value = null;
      phase.value = 'draw';
    }

    function draw() {
      hand.value = hand.value.map((card, i) =>
        held.value[i] ? card : deck.value.shift()!
      );
      const r = evaluateHand(hand.value);
      result.value = r;
      credits.value += r.payout * betAmount.value;
      betAmount.value = 1;
      phase.value = 'results';
    }

    function toggleHold(i: number) {
      if (phase.value !== 'draw') return;
      held.value[i] = !held.value[i];
    }

    function handleAction() {
      if (phase.value === 'bet') deal();
      else if (phase.value === 'draw') draw();
      else phase.value = 'bet';
    }

    const buttonLabel = computed(() =>
      phase.value === 'bet' ? 'Deal' :
      phase.value === 'draw' ? 'Draw' : 'New Game'
    );

    const actionClasses = computed(() => [
      'px-4 py-2 rounded font-semibold text-lg sm:text-xl md:text-2xl text-white',
      phase.value === 'draw'
        ? 'bg-green-500 border border-green-700'
        : 'bg-blue-500 border border-blue-700'
    ]);

    const betButtonClasses = [
      'px-4 py-2 rounded font-medium text-base sm:text-lg',
      'bg-gray-200 text-gray-800 border border-gray-400',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    ];

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
      bets,
      payoutRows,
      toggleHold,
      handleAction,
      buttonLabel,
      actionClasses,
      betButtonClasses,
      increaseBet,
      maxBet,
    };
  },
});
</script>