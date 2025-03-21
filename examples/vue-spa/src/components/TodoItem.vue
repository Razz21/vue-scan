<script setup lang="ts">
import { type Todo, useTodoStore } from '../store/todoStore';

defineProps<{
  todo: Todo;
}>();
const todoStore = useTodoStore();
</script>

<template>
  <li
    class="group flex items-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-transparent hover:border-violet-200 transition-all duration-200 shadow-sm"
  >
    <label class="flex gap-3 items-center cursor-pointer">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="todoStore.toggleTodo(todo)"
        class="w-5 h-5 rounded-md border-2 border-violet-300 text-violet-500 focus:ring-violet-200 transition-colors duration-200"
      />
      <span
        :class="{
          'flex-1 transition-all duration-200': true,
          'text-gray-900': !todo.completed,
          'line-through text-gray-400': todo.completed,
        }"
      >
        {{ todo.text }}
      </span>
    </label>
    <button
      @click="todoStore.removeTodo(todo.id)"
      class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 ml-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </li>
</template>
