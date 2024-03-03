<template>
  <div class="container" :class="{'container-tight': isTight}">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isTight?: boolean,
}>()
</script>