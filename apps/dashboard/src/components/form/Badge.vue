<template>
  <span class="badge" :class="{ [bType]: true }"><slot></slot></span>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

declare type BadgeType =
  | 'blue'
  | 'azure'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'bg-blue-lt'
  | 'bg-azure-lt'
  | 'bg-indigo-lt'
  | 'bg-purple-lt'
  | 'bg-pink-lt'
  | 'bg-red-lt'
  | 'bg-orange-lt'
  | 'bg-yellow-lt'
  | 'bg-lime-lt'
  | 'bg-green-lt'
  | 'bg-teal-lt'
  | 'bg-cyan-lt';

defineProps({
  bType: { type: String as PropType<BadgeType>, default: 'bg-azure-lt' }
});
</script>

<style scoped></style>
