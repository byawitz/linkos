<template>
  <RouterLink :to="to" class="dropdown-item">
    <slot></slot>
  </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps({
  to: { default: '' }
})
</script>
