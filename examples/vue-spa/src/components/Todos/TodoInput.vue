<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from '../../store/todoStore';

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
      <input v-model="newTodo" type="text" placeholder="Add a new task..."
        class="flex-1 px-4 placeholder-gray-900 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00dc82] transition-all duration-200" />
      <button type="submit" class="btn">
        Add Task
      </button>
    </form>
  </div>
</template>
