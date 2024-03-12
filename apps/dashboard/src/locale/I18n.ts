import { createI18n } from 'vue-i18n';
import en from './languages/en.json';

export type SystemLang = 'en' | 'he';

const LANG_EN: SystemLang = 'en';
const LANG_HE: SystemLang = 'he';

const i18n = createI18n({
  legacy: false,
  fallbackLocale: LANG_EN,
  messages: {
    [LANG_EN]: en
  }
});

export default i18n;
