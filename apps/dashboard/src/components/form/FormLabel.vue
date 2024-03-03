<template>
  <label class="form-label">
    {{ label }}

    <span v-if="withDescription" class="form-label-description"><slot></slot></span>

    <template v-else><slot></slot></template>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label?: string,
  withDescription?: boolean
}>();
</script>
