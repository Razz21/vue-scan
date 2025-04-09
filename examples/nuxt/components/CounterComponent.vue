<template>
  <div class="border border-gray-200 rounded-lg p-4">
    <h3 class="text-gray-700 mb-3 font-medium">Counter Component</h3>
    <div class="flex items-center space-x-4 mb-4">
      <button 
        @click="decrementCounter" 
        class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg"
      >
        -
      </button>
      <span class="text-2xl font-bold">{{ counter }}</span>
      <button 
        @click="incrementCounter" 
        class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
      >
        +
      </button>
    </div>
    <div class="bg-green-50 text-green-700 text-sm p-2 rounded">
      Renders: {{ renderCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRenderStore } from '~/stores/renderStore';

const renderStore = useRenderStore();
const counter = ref(0);
const renderCount = ref(0);

const incrementCounter = () => {
  counter.value++;
  trackRender();
};

const decrementCounter = () => {
  counter.value--;
  trackRender();
};

const trackRender = () => {
  renderCount.value++;
  renderStore.trackRender('counter');
};

// Initial render
trackRender();
</script>