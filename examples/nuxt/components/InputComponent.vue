<template>
  <div class="border border-gray-200 rounded-lg p-4">
    <h3 class="text-gray-700 mb-3 font-medium">Input Component</h3>
    <div class="mb-4">
      <input 
        v-model="inputValue" 
        type="text" 
        placeholder="Type something..."
        class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
    <div class="bg-green-50 text-green-700 text-sm p-2 rounded">
      Renders: {{ renderCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRenderStore } from '~/stores/renderStore';

const renderStore = useRenderStore();
const inputValue = ref('');
const renderCount = ref(0);

watch(inputValue, () => {
  trackRender();
});

const trackRender = () => {
  renderCount.value++;
  renderStore.trackRender('input');
};

// Initial render
trackRender();
</script>