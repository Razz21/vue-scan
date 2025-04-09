<template>
  <div class="border border-gray-200 rounded-lg p-4">
    <h3 class="text-gray-700 mb-3 font-medium">List Component</h3>
    <div class="mb-4">
      <div class="flex mb-2">
        <input 
          v-model="newItem" 
          type="text" 
          placeholder="Add new item" 
          class="flex-grow px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button 
          @click="addItem" 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-lg"
        >
          Add
        </button>
      </div>
      <ul class="max-h-32 overflow-y-auto">
        <li 
          v-for="(item, index) in items" 
          :key="index"
          class="flex justify-between items-center py-1 px-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
        >
          <span>{{ item }}</span>
          <button 
            @click="removeItem(index)" 
            class="text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </li>
      </ul>
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
const items = ref(['Nuxt 3', 'Vue.js', 'Tailwind CSS']);
const newItem = ref('');
const renderCount = ref(0);

const addItem = () => {
  if (newItem.value.trim()) {
    items.value.push(newItem.value);
    newItem.value = '';
    trackRender();
  }
};

const removeItem = (index) => {
  items.value.splice(index, 1);
  trackRender();
};

const trackRender = () => {
  renderCount.value++;
  renderStore.trackRender('list');
};

// Initial render
trackRender();
</script>