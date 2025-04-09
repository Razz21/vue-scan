<template>
  <div class="bg-white rounded-lg shadow p-6 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-gray-700 font-medium">{{ title }}</h3>
      <span class="text-green-500">
        <svg v-if="icon === 'plus'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="icon === 'document'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="icon === 'chart'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15.414 5a1 1 0 01-1.414 1.414L13 5.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707.707-.707A1 1 0 0112 2zm5.353 5.646a1 1 0 01.351 1.351l-.211.425.569.28a1 1 0 01-.978 1.748l-.569-.28-.299.373a1 1 0 11-1.558-1.246l.299-.374-.125-.524a1 1 0 01.9-1.207l.524.126.211-.425a1 1 0 011.351-.352zM7 14a2 2 0 104 0 2 2 0 00-4 0z" clip-rule="evenodd" />
        </svg>
      </span>
    </div>
    <div class="text-3xl font-bold text-gray-800">{{ value }}</div>
    <div class="text-sm text-gray-500 mt-2">{{ subtext }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtext: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'plus'
  }
});
</script>