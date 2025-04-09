<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    <StatsCard 
      title="Total Renders" 
      :value="renderStore.totalRenders" 
      subtext="Since page load" 
      icon="plus"
    />
    <StatsCard 
      title="Active Components" 
      :value="renderStore.activeComponents" 
      subtext="Tracked on this page" 
      icon="document"
    />
    <StatsCard 
      title="Render Frequency" 
      :value="`${renderStore.renderFrequency}/s`" 
      subtext="Average last 10 seconds" 
      icon="chart"
    />
  </div>
</template>

<script setup lang="ts">
import { useRenderStore } from '~/stores/renderStore';

const renderStore = useRenderStore();
</script>