<template>
  <div class="bg-white rounded-lg shadow mb-8">
    <div class="border-b border-gray-200 px-6 py-4">
      <h2 class="text-lg font-medium text-gray-800">Interactive Demo</h2>
      <p class="text-gray-500 text-sm">Trigger component re-renders through different interactions</p>
    </div>
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CounterComponent />
        <ToggleComponent />
        <InputComponent />
        <ListComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Just a container for the interactive components
</script>