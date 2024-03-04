<template>
  <div class="page-header d-print-none">
    <div class="container-xl">
      <div class="row g-2 align-items-center">
        <div class="col">
          <div class="page-pretitle">{{ subTitle }}</div>
          <h2 class="page-title">{{ title }}</h2>
        </div>

        <div class="col-auto ms-auto d-print-none">
          <div class="btn-list">
            <slot name="buttons"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/form/Button.vue';

defineProps({
  title: { type: String },
  subTitle: { type: String, default: '' }
});
</script>
