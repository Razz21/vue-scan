<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-200">Task Manager</h2>
      <p class="text-gray-400">Test live updates with highlight tracking</p>
    </div>

    <TodoInput />
    <TodoList />
  </div>
</template>

<script setup lang="ts">
import TodoInput from './TodoInput.vue';
import TodoList from './TodoList.vue';
</script>
