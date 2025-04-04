<template>
  <div class="bg-white rounded-lg shadow">
    <div class="border-b border-gray-200 px-6 py-4">
      <h2 class="text-lg font-medium text-gray-800">Real-time Render Visualization</h2>
      <p class="text-gray-500 text-sm">Visual representation of component render activity</p>
    </div>
    <div class="p-6">
      <!-- Timeline -->
      <div class="relative h-20 bg-gray-100 rounded-lg mb-6">
        <div 
          v-for="(render, index) in renderStore.renderTimeline" 
          :key="index" 
          class="absolute w-1 rounded-full"
          :style="{
            height: `${render.height}px`, 
            backgroundColor: render.color,
            left: `${render.position}%`,
            bottom: '0'
          }"
        ></div>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span class="text-sm text-gray-600">Counter</span>
        </div>
        <div class="flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          <span class="text-sm text-gray-600">Toggle</span>
        </div>
        <div class="flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
          <span class="text-sm text-gray-600">Input</span>
        </div>
        <div class="flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
          <span class="text-sm text-gray-600">List</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRenderStore } from '~/stores/renderStore';

const renderStore = useRenderStore();
</script>