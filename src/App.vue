<template>
  <div
    class="h-screen overflow-hidden flex items-center justify-center bg-blue-900 p-4">
    <div
      class="w-full max-w-3xl mx-auto">
      <PokerGame />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PokerGame from './components/PokerGame.vue';

export default defineComponent({
  name: 'App',
  components: { PokerGame },
});
</script>