<template>
  <div :class="`mb-${mb}`">
    <label class="form-label">
      {{ label }} <span class="form-label-description" v-if="limit !== 0">{{ model?.length }}/{{ limit }}</span>
    </label>
    <textarea class="form-control" :rows="rows" :placeholder="placeholder" v-model="model"></textarea>
  </div>
</template>

<script setup lang="ts">
import { type ModelRef, watch } from 'vue';

const model: ModelRef<string | undefined> = defineModel();

const props = defineProps({
  placeholder: { default: '', type: String },
  label: { default: '', type: String },
  rows: { default: '6', type: String },
  mb: { default: '3', type: String },
  limit: { default: 0, type: Number }
});

watch(model, () => {
  if (props.limit === 0 || !model.value) {
    return;
  }

  if (model.value.length >= props.limit) {
    model.value = model.value.slice(0, props.limit);
  }
});
</script>
