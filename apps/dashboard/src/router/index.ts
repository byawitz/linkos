import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import ForgotView from '@/views/ForgotView.vue';
import CampaignsView from '@/views/CampaignsView.vue';
import DomainsView from '@/views/DomainsView.vue';
import ImporterView from '@/views/ImporterView.vue';
import TokensView from '@/views/TokensView.vue';
import BackupsView from '@/views/BackupsView.vue';
import UsersView from '@/views/UsersView.vue';
import LinksView from '@/views/LinksView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/forgot', name: 'forgot', component: ForgotView },
    { path: '/links', name: 'links', component: LinksView },
    { path: '/campaigns', name: 'campaigns', component: CampaignsView },
    { path: '/domains', name: 'domains', component: DomainsView },
    { path: '/importer', name: 'importer', component: ImporterView },
    { path: '/tokens', name: 'tokens', component: TokensView },
    { path: '/backups', name: 'backups', component: BackupsView },
    { path: '/users', name: 'users', component: UsersView }
  ]
});

export default router;
