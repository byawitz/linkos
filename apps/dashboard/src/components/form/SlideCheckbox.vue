<template>
  <label class="form-check form-switch">
    <input class="form-check-input" type="checkbox" v-model="model" />
    <span class="form-check-label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
const model = defineModel();

defineProps({
  label: { default: '', type: String }
});
</script>
