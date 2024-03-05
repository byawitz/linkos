<template>
  <div :class="`mb-${mb}`">
    <label class="form-label">{{ label }}</label>
    <input class="form-control mb-2" :placeholder="placeholder" id="datepicker-default" v-model="model" ref="date" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Litepicker } from 'litepicker';

const model = defineModel();
const date = ref();

defineProps({
  inputType: { default: 'text', type: String },
  placeholder: { default: '', type: String },
  label: { default: '', type: String },
  mb: { default: '3', type: String }
});
onMounted(() => {
  const picker = new Litepicker({
    element: date.value,
    format: 'MM/DD/YYYY'
  });

  picker.on('selected', (d1) => {
    model.value = date.value.value;
  });
});
</script>
