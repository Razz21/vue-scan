<template>
  <div class="space-y-6">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-200">Vue Plugin Showcase</h2>
      <p class="text-gray-400">Test live updates with highlight tracking</p>
    </div>

    <div class="flex justify-center gap-4">
      <button @click="addTile" class="btn">Add Tile</button>
      <button @click="removeTile" class="btn">Remove Tile</button>
      <button @click="toggleVisibility" class="btn">Toggle Visibility</button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <TileItem v-for="index in tileCount" :key="index" :uid="index" />
    </div>

    <HiddenTile v-if="showHidden" />
  </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import HiddenTile from "./HiddenTile.vue";
import TileItem from "./TileItem.vue";

const tileCount = ref(10);
const showHidden = ref(false);

function addTile() {
  tileCount.value++;
}

function removeTile() {
  if (tileCount.value > 0) tileCount.value--;
}

function toggleVisibility() {
  showHidden.value = !showHidden.value;
}
</script>
