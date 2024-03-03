<template>
  <div class="card" :class="cardSize">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
declare type CardSizes = "card-md" | "card-sm" | "card-lg";

defineProps<{
  cardSize?: CardSizes,
}>()
</script>