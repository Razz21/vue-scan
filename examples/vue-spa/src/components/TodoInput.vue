<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from '../store/todoStore';

const newTodo = ref('');
const todoStore = useTodoStore();

const handleSubmit = () => {
  todoStore.addTodo(newTodo.value);
  newTodo.value = '';
};
</script>

<template>
  <div class="mb-8">
    <form @submit.prevent="handleSubmit" class="flex gap-3">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Add a new task..."
        class="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-violet-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 transition-all duration-200"
      />
      <button
        type="submit"
        class="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all duration-200 font-medium shadow-lg shadow-violet-200"
      >
        Add Task
      </button>
    </form>
  </div>
</template>
