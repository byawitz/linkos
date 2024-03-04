import { ref, computed, type Ref } from 'vue';
import { defineStore } from 'pinia';
import NetworkHelper from '@/heplers/NetworkHelper';

interface User {
  isLoggedIn: boolean;
}

export const useUserStore = defineStore('user', () => {
  const user: Ref<User> = ref({ isLoggedIn: false });

  async function loadUser() {
    const loggedInUser = await NetworkHelper.get(NetworkHelper.whoAmI);

    if (loggedInUser.success) {
      user.value.isLoggedIn = true;
    }
  }

  return { user, loadUser };
});
