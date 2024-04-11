<template>
  <div class="col-sm-6 col-lg-3">
    <div class="card card-sm">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-auto">
            <span class="text-white avatar" :class="iconType">
              <component :is="icon" />
            </span>
          </div>
          <div class="col">
            <div class="font-weight-medium">{{ number }} {{ title }}</div>
            <div class="text-secondary">{{ subTitle }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

declare type iconType = 'bg-primary' | 'bg-green' | 'bg-red' | 'bg-blue' | 'bg-cyan';

defineProps({
  title: { type: String, default: '' },
  number: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  icon: { type: Object, default: {} },
  iconType: { type: String as PropType<iconType>, default: 'bg-primary' }
});
</script>
