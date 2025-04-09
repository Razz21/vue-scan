<template>
  <footer class="bg-white border-t border-gray-200 mt-8">
    <div class="container mx-auto px-4 py-6">
      <div class="flex justify-between items-center">
        <p class="text-gray-600 text-sm">Vue Scan Module for Nuxt 3</p>
        <div class="flex items-center">
          <button 
            @click="resetStats" 
            class="text-sm text-green-600 hover:text-green-800 font-medium"
          >
            Reset Stats
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useRenderStore } from '~/stores/renderStore';

const renderStore = useRenderStore();

const resetStats = () => {
  renderStore.resetStats();
};
</script>