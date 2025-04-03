<template>
  <div class="flex flex-col p-6">
    <div class="flex gap-4 mb-12">
      <label v-for="tab in tabs" :key="tab.value" class="cursor-pointer">
        <input type="radio" v-model="activeTab" :value="tab.value" class="hidden" />
        <span class="text-[#00dc82] uppercase p-2 border rounded"
          :class="[activeTab === tab.value ? 'border-current' : 'border-transparent']">
          {{ tab.label }}
        </span>
      </label>
    </div>
    <div class="size-full">
      <slot :name="activeTab"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Tab">
import { ref } from 'vue';

export interface Tab {
  label: string;
  value: string;
}

interface Props {
  tabs: T[];
}
const props = defineProps<Props>();

const activeTab = ref(props.tabs[0].value);

</script>
