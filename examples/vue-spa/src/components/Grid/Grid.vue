<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-200">Elements Grid</h2>
      <p class="text-gray-400">Test live updates with highlight tracking</p>
    </div>

    <div class="flex gap-4 p-4 w-full flex-wrap">
      <button class="btn" :class="filter ? '' : '!bg-neutral-400 hover:!bg-neutral-500'" @click="toggleOddVisibility">
        Remove 5th elements
      </button>
      <button class="btn" :class="isFunctional ? '' : '!bg-neutral-400 !hover:bg-neutral-500'"
        @click="toggleFunctionality">
        Functional Component
      </button>
      <button class="btn bg-neutral-400 hover:bg-neutral-500" @click="addItems">
        Add 1000 Items
      </button>
      <button class="btn bg-neutral-400 hover:bg-neutral-500" @click="removeItems">
        Remove 1000 Items
      </button>
    </div>
    <div class="text-center">
      <p class="text-gray-400">Rendered elements: {{ filteredElements.length }}</p>
    </div>
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-4 p-4 w-full text-neutral-200 max-h-[50vh] overflow-auto">
      <Component :is="gridItemComponent" v-for="element in filteredElements" :key="element">{{ element }}</Component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import GridItem from './GridItemComponent.vue';
import GridItemFunctional from './GridItemFunctional';

const filter = ref(false);
const isFunctional = ref(false); // Functional style for tiles
const length = ref(10); // Default to 1000 tiles

const gridItemComponent = computed(() => {
  return isFunctional.value ? GridItemFunctional : GridItem;
});

const filteredElements = computed(() => {
  return Array.from({ length: length.value }, (_, i) => i + 1).filter((i) =>
    filter.value ? i % 5 !== 0 : true
  );
});

const toggleOddVisibility = () => {
  filter.value = !filter.value;
};

const toggleFunctionality = () => {
  isFunctional.value = !isFunctional.value;
};

// Add or remove 1000 items
const addItems = () => {
  length.value += 1000;
};

const removeItems = () => {
  length.value = Math.max(1, length.value - 1000);
};
</script>

<style>
.grid-item {
  @apply overflow-hidden whitespace-nowrap text-sm text-ellipsis w-8 h-8 p-1 border rounded bg-gray-800 shadow-md;
}
</style>
