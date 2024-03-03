<template>
  <li class="nav-item" :class="{ dropdown: withDropDown, active: isThisPageActive }">
    <RouterLink
      class="nav-link"
      :to="href"
      :class="{ 'dropdown-toggle': withDropDown }"
      :data-bs-toggle="withDropDown ? 'dropdown' : ''"
      :data-bs-auto-close="withDropDown ? 'false' : ''"
      :role="withDropDown ? 'button' : ''"
    >
      <span class="nav-link-icon d-md-none d-lg-inline-block"><slot name="icon"></slot></span>
      <span class="nav-link-title">{{ text }}</span>
    </RouterLink>

    <div class="dropdown-menu" v-if="withDropDown">
      <slot name="dropdown"></slot>
    </div>
  </li>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { computed, onMounted } from 'vue';

const props = defineProps({
  href: { default: '' },
  text: { default: '' },
  withDropDown: { default: false }
});
const isThisPageActive = computed(() => router.currentRoute.value.path === props.href);
const router = useRouter();
</script>
