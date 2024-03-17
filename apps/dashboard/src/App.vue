<template>
  <template v-if="!isPageLoading">
    <template v-if="store.user.isLoggedIn">
      <Page>
        <Sidebar />
        <PageWrapper>
          <RouterView />

          <Footer />
        </PageWrapper>
      </Page>
    </template>

    <template v-else>
      <RouterView />
    </template>
  </template>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { type SystemTheme, useAppStore } from '@/stores/user';
import Page from '@/components/layouts/Page.vue';
import Sidebar from '@/components/view/Sidebar.vue';
import Footer from '@/components/view/Footer.vue';
import PageWrapper from '@/components/layouts/PageWrapper.vue';
import { isRTL, type SystemLang } from '@/locale/I18n';
import { useI18n } from 'vue-i18n';

const isPageLoading = ref(true);
const store = useAppStore();
const router = useRouter();
const i18n = useI18n();

function setTheme(theme: SystemTheme) {
  if (theme === 'system') {
    theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.querySelector('body')?.setAttribute('data-bs-theme', theme);
}

function setLanguage(lang: SystemLang | null) {
  if (lang === null) return;

  document.querySelector('html')?.setAttribute('lang', lang);
  document.querySelector('html')?.setAttribute('dir', isRTL(lang) ? 'rtl' : 'ltr');

  i18n.locale.value = lang;
}

watch(
  () => store.app.theme,
  () => setTheme(store.app.theme)
);

watch(
  () => store.app.lang,
  () => setLanguage(store.app.lang)
);

onMounted(async () => {
  setTheme(store.app.theme);

  setLanguage(store.user.lang ?? store.server.lang);

  document.querySelector('#page-loader')?.remove();
  isPageLoading.value = false;
});
</script>
