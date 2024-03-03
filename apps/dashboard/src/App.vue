<template>
  <RouterView/>
</template>

<script setup lang="ts">
import {RouterView} from 'vue-router'
import {onMounted} from "vue";
import {useUserStore} from "@/stores/user";

const {user} = useUserStore();

onMounted(() => {
  document.querySelector('#page-loader')?.remove()
});
</script>
