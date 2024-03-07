<template>
  <div class="container" :class="{ 'container-tight': isTight, 'container-xl': isXL, 'container-fluid': isFluid }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isTight?: boolean;
  isXL?: boolean;
  isFluid?: boolean;
}>();
</script>
