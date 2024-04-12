<template>
  <div :class="`mb-${mb}`">
    <label class="form-label">{{ label }}</label>
    <select class="form-select" v-model="model" ref="el" multiple style="display: none">
      <option v-for="option in options" :value="option.value" :key="option.value" v-text="option.text" />
    </select>
  </div>
</template>

<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue';
import TomSelect from 'tom-select';
import { useI18n } from 'vue-i18n';

declare type SelectOptions = { value: any; text: string };

defineProps({
  options: { default: [], type: Array as PropType<SelectOptions[]> },
  label: { default: '', type: String },
  mb: { default: '3', type: String }
});

const model = defineModel();
const el = ref();
const { t } = useI18n();

onMounted(() => {
  new TomSelect(el.value, {
    createOnBlur: true,
    create: true,
    render: {
      option: (data: any, escape: any) => {
        return '<div>' + escape(data.text) + '</div>';
      },
      item: function (data: any, escape: any) {
        return '<div>' + escape(data.text) + '</div>';
      },
      option_create: function (data: any, escape: any) {
        return `<div class="create">${t('Add')} <strong>${escape(data.input)}</strong>&hellip;</div>`;
      },
      no_results: function (data: any, escape: any) {
        return `<div class="no-results">${t('no-results-for')} "${escape(data.input)}"</div>`;
      },
      not_loading: function (data: any, escape: any) {
        // no default content
      },
      loading: function (data: any, escape: any) {
        return '<div class="spinner"></div>';
      },
      dropdown: function () {
        return '<div></div>';
      }
    }
  });
});
</script>
