// import 'bootstrap';
import './assets/js/tabler.js';
import './assets/scss/tabler.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useUserStore } from '@/stores/user';
import VueSweetalert2 from 'vue-sweetalert2';

const app = createApp(App);

app.use(createPinia());
app.use(VueSweetalert2);

useUserStore()
  .loadUser()
  .then(() => {
    app.use(router);
    app.mount('#app');
  });
