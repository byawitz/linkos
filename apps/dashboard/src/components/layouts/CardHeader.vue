<template>
  <div class="card-header">
    <h3 class="card-title">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { default: '' }
});
</script>
