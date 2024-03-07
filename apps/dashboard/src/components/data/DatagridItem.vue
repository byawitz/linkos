<template>
  <div class="datagrid-item">
    <div class="datagrid-title">{{ itemTitle }}</div>
    <div class="datagrid-content">{{ value }} <slot></slot></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  itemTitle: { default: '', type: String },
  value: { default: '', type: String }
});
</script>
