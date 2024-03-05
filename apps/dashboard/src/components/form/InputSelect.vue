<template>
  <div :class="`mb-${mb}`">
    <label class="form-label">{{ label }}</label>
    <select class="form-select" v-model="model">
      <option v-for="option in options" :value="option.value" :key="option.value" v-text="option.text" />
    </select>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

declare type SelectOptions = { value: any; text: string };

const model = defineModel();

defineProps({
  options: { default: [], type: Array as PropType<SelectOptions[]> },
  label: { default: '', type: String },
  mb: { default: '3', type: String }
});
</script>
