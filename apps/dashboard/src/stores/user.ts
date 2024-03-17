import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import NetworkHelper from '@/heplers/NetworkHelper';
import UserModel from '@@/db/UserModel';
import { DEFAULT_LANG, type SystemLang } from '@/locale/I18n';

type SystemTheme = 'dark' | 'light' | 'system';

interface Server {
  host: string;
  lang: SystemLang;
}

interface LinkosApp {
  lang: SystemLang | null;
  theme: SystemTheme;
}

const useAppStore = defineStore('user', () => {
  const user: Ref<UserModel> = ref(new UserModel());
  const server: Ref<Server> = ref({ host: '', lang: '' });
  const app: Ref<LinkosApp> = ref({ lang: null, theme: 'system' });

  async function loadUser() {
    await loadServerData();

    const res = await NetworkHelper.get(NetworkHelper.whoAmI);

    if (res.success) {
      user.value = UserModel.fromJSON(res.data.user);

      if (user.value.dark_theme !== null) {
        app.value.theme = user.value.dark_theme ? 'dark' : 'light';
      }
    }
  }

  async function loadServerData() {
    const res = await NetworkHelper.get(NetworkHelper.server);

    if (res.success) {
      server.value.lang = res.data.server.lang ?? DEFAULT_LANG;
      server.value.host = res.data.server.host ?? null;
    }
  }

  return { user, loadUser, server, app };
});

export { useAppStore, type SystemTheme };
