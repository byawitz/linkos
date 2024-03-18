<template>
  <Container :isXL="true" class="mt-3">
    <div class="row">
      <div class="col d-flex justify-content-between">
        <Button @click="hasPrev && emit('prev')" width="w-25" :class="{ disabled: !hasPrev }">{{ $t('tr-Prev') }}</Button>
        <Button @click="hasNext && emit('next')" width="w-25" :class="{ disabled: !hasNext }">{{ $t('tr-Next') }}</Button>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/layouts/Container.vue';
import Button from '@/components/form/Button.vue';

const emit = defineEmits(['prev', 'next']);

defineProps({
  hasPrev: { default: false, type: Boolean },
  hasNext: { default: true, type: Boolean }
});
</script>
