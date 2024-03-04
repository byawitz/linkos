<template>
  <template v-if="!isPageLoading">
    <template v-if="user.isLoggedIn">
      <Page>
        <Sidebar />
        <PageWrapper>
          <RouterView />

          <Footer />
        </PageWrapper>
      </Page>
    </template>

    <template v-else> <RouterView /></template>
  </template>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import Page from '@/components/layouts/Page.vue';
import Sidebar from '@/components/view/Sidebar.vue';
import Footer from '@/components/view/Footer.vue';
import PageWrapper from '@/components/layouts/PageWrapper.vue';
import NetworkHelper from '@/heplers/NetworkHelper';

const isPageLoading = ref(true);
const { user } = useUserStore();
const router = useRouter();

onMounted(async () => {
  // TODO: Get saved theme and if not default theme.
  document.querySelector('body')?.setAttribute('data-bs-theme', 'dark');

  document.querySelector('#page-loader')?.remove();
  isPageLoading.value = false;
});
</script>
