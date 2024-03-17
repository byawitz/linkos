<template>
  <div :class="`mb-${mb}`">
    <label class="form-label" :class="{ required: required }">{{ label }}</label>
    <input :type="inputType" class="form-control" :class="{ 'is-invalid': isInvalid }" :disabled :placeholder="placeholder" v-model="model" />
    <div class="invalid-feedback" v-if="isInvalid">{{ feedback }}</div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel();

defineProps({
  inputType: { default: 'text', type: String },
  isInvalid: { default: false, type: Boolean },
  required: { default: false, type: Boolean },
  disabled: { default: false, type: Boolean },
  placeholder: { default: '', type: String },
  feedback: { default: '', type: String },
  label: { default: '', type: String },
  mb: { default: '3', type: String }
});
</script>
