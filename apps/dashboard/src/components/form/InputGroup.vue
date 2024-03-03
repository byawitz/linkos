<template>
  <label class="input-group" :class="{'input-group-flat':isFlat}">
    <slot></slot>

  </label>
</template>

<script setup lang="ts">
defineProps<{
  isFlat?: boolean,
}>();
</script>
