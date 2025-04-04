<template>
  <div class="border border-gray-200 rounded-lg p-4">
    <h3 class="text-gray-700 mb-3 font-medium">Toggle Component</h3>
    <div class="flex items-center justify-between mb-4">
      <span class="text-gray-700">Enable feature</span>
      <button 
        @click="toggleFeature" 
        class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
        :class="featureEnabled ? 'bg-green-500' : 'bg-gray-300'"
      >
        <span 
          class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full" 
          :class="featureEnabled ? 'translate-x-6' : 'translate-x-1'"
        ></span>
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
const featureEnabled = ref(false);
const renderCount = ref(0);

const toggleFeature = () => {
  featureEnabled.value = !featureEnabled.value;
  trackRender();
};

const trackRender = () => {
  renderCount.value++;
  renderStore.trackRender('toggle');
};

// Initial render
trackRender();
</script>