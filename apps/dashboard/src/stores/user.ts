import { ref, computed, type Ref } from 'vue';
import { defineStore } from 'pinia';
import NetworkHelper from '@/heplers/NetworkHelper';

interface User {
  isLoggedIn: boolean;
  created_at: Date;
  /*  updated_at: Date;
    email: string;
    id: string;
    level: string;*/
}

interface Server {
  host: string;
}

export const useUserStore = defineStore('user', () => {
  const user: Ref<User> = ref({ isLoggedIn: false, created_at: new Date() });
  const server: Ref<Server> = ref({ host: '' });

  async function loadUser() {
    const res = await NetworkHelper.get(NetworkHelper.whoAmI);

    if (res.success) {
      user.value.isLoggedIn = true;
      server.value.host = res.data.server.host;
    }
  }

  return { user, loadUser, server };
});
