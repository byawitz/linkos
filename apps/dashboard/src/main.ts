import './assets/scss/tabler.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bootstrap';

import App from './App.vue';
import router from './router';
import { useUserStore } from '@/stores/user';

const app = createApp(App);

app.use(createPinia());

await useUserStore().loadUser();

app.use(router);
app.mount('#app');
