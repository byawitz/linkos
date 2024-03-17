<template>
  <AccountView>
    <form @submit.prevent="save">
      <div class="card-body">
        <h2 class="mb-4">{{ $t('Profile') }}</h2>

        <h3 class="card-title mt-4">{{ $t('user-details') }}</h3>
        <div class="row g-3">
          <div class="col-md">
            <InputText v-model="store.user.fullname" :label="$t('Name')" :disabled="true" />
          </div>

          <div class="col-md">
            <InputText v-model="store.user.email" :label="$t('Email')" :disabled="true" />
          </div>

          <small>
            <i>{{ $t('data-is-available-to-edit-in-your-appwrite') }}</i>
          </small>
        </div>

        <h3 class="card-title mt-4">{{ $t('preferences') }}</h3>
        <div class="row g-4">
          <div class="col-md">
            <InputSelect :label="$t('Theme')" v-model="theme" :options="themeOptions" />
          </div>

          <div class="col-md">
            <InputSelect :label="$t('Language')" v-model="language" :options="languageOptions" />
          </div>
        </div>
      </div>

      <div class="card-footer bg-transparent mt-auto">
        <div class="btn-list justify-content-end">
          <button class="btn btn-primary" :class="{ 'btn-loading': saving }">{{ $t('Save') }}</button>
        </div>
      </div>
    </form>
  </AccountView>
</template>

<script setup lang="ts">
import { type SystemTheme, useAppStore } from '@/stores/user';
import InputSelect from '@/components/form/InputSelect.vue';
import { computed, onMounted, type Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { allLanguages, DEFAULT_LANG, type SystemLang } from '@/locale/I18n';
import AccountView from '@/views/sub-views/AccountView.vue';
import InputText from '@/components/form/InputText.vue';
import NetworkHelper from '@/heplers/NetworkHelper';

const store = useAppStore();
const { t } = useI18n();

const languageOptions = computed(() =>
  allLanguages.map((lang) => {
    return { value: lang.lang, text: t(lang.title) };
  })
);

const themeOptions = computed(() => [
  { value: 'system', text: t('system-default') },
  { value: 'dark', text: t('dark') },
  { value: 'light', text: t('light') }
]);

const saving: Ref<boolean> = ref(false);
const theme: Ref<SystemTheme> = ref('system');
const language: Ref<SystemLang> = ref(DEFAULT_LANG);

async function save() {
  saving.value = true;
  const newTheme = theme.value === 'system' ? null : theme.value === 'dark';

  const res = await NetworkHelper.post(NetworkHelper.updateProfile, {
    theme: newTheme,
    lang: language.value
  });

  if (res.success) {
    await store.loadUser();
    store.app.theme = theme.value;
    store.app.lang = language.value;
  } else {
    // TODO: Toast
  }

  saving.value = false;
}

onMounted(() => {
  if (store.user.dark_theme !== null) {
    theme.value = store.user.dark_theme ? 'dark' : 'light';
  }
  language.value = store.user.lang ?? DEFAULT_LANG;
});
</script>
