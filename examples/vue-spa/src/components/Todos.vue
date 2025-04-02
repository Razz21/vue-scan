<script setup lang="ts">
import TodoInput from './TodoInput.vue';
import TodoList from './TodoList.vue';

</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
        Task Manager
      </h1>
      <p class="mt-2 text-gray-600">Stay organized, stay productive</p>
    </div>

    <TodoInput />
    <TodoList />
  </div>
</template>