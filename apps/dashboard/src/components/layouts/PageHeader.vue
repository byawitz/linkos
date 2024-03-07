<template>
  <div class="page-header d-print-none">
    <Container :isXL="true">
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
    </Container>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/form/Button.vue';
import Container from '@/components/layouts/Container.vue';

defineProps({
  title: { type: String },
  subTitle: { type: String, default: '' }
});
</script>
