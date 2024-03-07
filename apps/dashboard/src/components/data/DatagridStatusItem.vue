<template>
  <div class="datagrid-item">
    <div class="datagrid-title">{{ itemTitle }}</div>
    <div class="datagrid-content">
      <span class="status" :class="status"> {{ value ? 'On' : 'Off' }} </span>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

declare type StatusType =
  | 'status-primary'
  | 'status-secondary'
  | 'status-success'
  | 'status-info'
  | 'status-warning'
  | 'status-danger'
  | 'status-light'
  | 'status-dark'
  | 'status-muted'
  | 'status-blue'
  | 'status-azure'
  | 'status-indigo'
  | 'status-purple'
  | 'status-pink'
  | 'status-red'
  | 'status-orange'
  | 'status-yellow'
  | 'status-lime'
  | 'status-green'
  | 'status-teal'
  | 'status-cyan'
  | 'status-facebook'
  | 'status-twitter'
  | 'status-linkedin'
  | 'status-google'
  | 'status-youtube'
  | 'status-vimeo'
  | 'status-dribbble'
  | 'status-github'
  | 'status-instagram'
  | 'status-pinterest'
  | 'status-vk'
  | 'status-rss'
  | 'status-flickr'
  | 'status-bitbucket';

defineProps({
  itemTitle: { default: '', type: String },
  value: { default: false, type: Boolean },
  status: { default: 'status-green', type: String as PropType<StatusType> }
});
</script>
