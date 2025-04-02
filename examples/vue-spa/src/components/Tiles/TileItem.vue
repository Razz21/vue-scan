<template>
  <div
    class="select-none p-4 border rounded-xl bg-gray-800 flex flex-col items-center justify-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-105"
    @click="count++">
    <p class="text-sm text-gray-300">ID: {{ uid }}</p>
    <p class="text-lg font-semibold text-white">Count: {{ count }}</p>
    <p class="text-xs text-gray-500">Click to increase</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps(["uid"]);
const count = ref(0);

</script>
