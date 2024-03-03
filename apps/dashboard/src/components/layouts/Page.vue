<template>
  <div class="page" :class="{'page-center': isCenter}">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isCenter?: boolean,
}>()
</script>