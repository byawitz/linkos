<template>
  <a v-if="isLink" class="btn" :class="{[width]:true,[bType]:true}">
    <slot></slot>
  </a>

  <button v-else class="btn" :class="{[width]:true,[bType]:true}">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import type {PropType} from "vue";

declare type ButtonWidth = 'w-25' | 'w-50' | 'w-75' | 'w-100';
declare type ButtonType = 'btn-primary' | 'btn-secondary' | 'btn-success'
    | 'btn-info' | 'btn-warning' | 'btn-danger' | 'btn-light' | 'btn-dark'
    | 'btn-outline-primary' | 'btn-outline-secondary' | 'btn-outline-success' | 'btn-outline-info' |
    'btn-outline-warning' | 'btn-outline-danger' | 'btn-outline-light' | 'btn-outline-dark' | 'btn-link';

defineProps({
  width : {type: String as PropType<ButtonWidth>, default: 'w-100'},
  bType : {type: String as PropType<ButtonType>},
  isLink: {default: false}
});

</script>

<style scoped>

</style>