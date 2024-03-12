import { createI18n } from 'vue-i18n';
import en from './languages/en.json';
import he from './languages/he.json';

export type SystemLang = 'en' | 'he';

const LANG_EN: SystemLang = 'en';
const LANG_HE: SystemLang = 'he';

const i18n = createI18n({
  locale: LANG_EN,
  legacy: false,
  fallbackLocale: LANG_EN,
  messages: {
    [LANG_EN]: en,
    [LANG_HE]: he
  }
});

export default i18n;
