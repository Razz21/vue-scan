<script setup lang="ts">
import Grid from './components/Grid/Grid.vue';
import Tiles from './components/Tiles/Tiles.vue';
import Todos from './components/Todos/Todos.vue';
import Navigation from './components/ui/Navigation.vue';
</script>

<template>
  <div class="max-w-screen-lg mx-auto p-6">
    <Navigation :tabs="[
      { label: 'Tiles', value: 'tiles' },
      { label: 'Todos', value: 'todos' },
      { label: 'Grid', value: 'grid' },
    ]">
      <template #tiles>
        <Tiles />
      </template>
      <template #grid>
        <Grid />
      </template>
      <template #todos>
        <Todos />
      </template>
    </Navigation>
  </div>
</template>

<style>
.btn {
  @apply px-4 py-2 bg-[#00dc82] font-semibold text-[#2f4858] rounded-lg shadow-md hover:bg-[#01a15f] transition whitespace-nowrap;
}
</style>
