import { createI18n } from 'vue-i18n';
import en from './languages/en.json';
import he from './languages/he.json';

type SystemLang = 'en' | 'he';

const LANG_EN: SystemLang = 'en';
const LANG_HE: SystemLang = 'he';

const DEFAULT_LANG: SystemLang = 'en';

const RTL_LANGUAGES = ['he', 'ar'];

const isRTL = (lang: SystemLang) => RTL_LANGUAGES.includes(lang);

const i18n = createI18n({
  locale: LANG_EN,
  legacy: false,
  fallbackLocale: LANG_EN,
  messages: {
    [LANG_EN]: en,
    [LANG_HE]: he
  }
});

const allLanguages = [
  { lang: LANG_EN, title: 'English' },
  { lang: LANG_HE, title: 'Hebrew' }
];

export { type SystemLang, LANG_EN, LANG_HE, DEFAULT_LANG, isRTL, allLanguages };

export default i18n;
