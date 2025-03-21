<script setup lang="ts">
import { useTodoStore } from '../store/todoStore';
import TodoInput from './TodoInput.vue';
import TodoItem from './TodoItem.vue';

const todoStore = useTodoStore();
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="text-center mb-12">
      <h1
        class="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"
      >
        Task Manager
      </h1>
      <p class="mt-2 text-gray-600">Stay organized, stay productive</p>
    </div>

    <TodoInput />
    <div class="space-y-6">
      <section>
        <h2 class="text-lg font-semibold text-gray-700 mb-3">Active Tasks</h2>
        <ul class="space-y-2">
          <TodoItem
            v-for="todo in todoStore.activeTodos.value"
            :key="todo?.id"
            :todo="todo"
          />
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-semibold text-gray-700 mb-3">
          Completed Tasks
        </h2>
        <ul class="space-y-2">
          <TodoItem
            v-for="todo in todoStore.completedTodos.value"
            :key="todo?.id"
            :todo="todo"
          />
        </ul>
      </section>

      <p
        v-if="todoStore.todos.value.length === 0"
        class="text-center py-8 text-gray-500 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200"
      >
        No tasks yet. Add one above to get started!
      </p>
    </div>
  </div>
</template>
