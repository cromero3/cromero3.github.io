<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div
      class="w-full max-w-full sm:max-w-3xl transform origin-top scale-100 sm:scale-110">
      <PokerGame />
    </div>
  </div>
</template>

<script>
import PokerGame from './components/PokerGame.vue';
export default { components: { PokerGame } };
</script>