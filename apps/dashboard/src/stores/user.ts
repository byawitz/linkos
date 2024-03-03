import {ref, computed, type Ref} from 'vue'
import {defineStore} from 'pinia'

interface User {
    isLoggedIn: boolean
}

export const useUserStore = defineStore('user', () => {
    const user: Ref<User> = ref({isLoggedIn: false});

    return {user}
})
