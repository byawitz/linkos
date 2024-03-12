<script setup lang="ts">
import PageHeader from '@/components/layouts/PageHeader.vue';
import StillInWork from '@/components/view/StillInWork.vue';
</script>

<template>
  <PageHeader :title="$t('Domains')"></PageHeader>
  <StillInWork />
</template>
