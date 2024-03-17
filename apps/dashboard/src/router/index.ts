import { createRouter, createWebHashHistory } from 'vue-router';
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
import { useAppStore } from '@/stores/user';
import ProfileView from '@/views/ProfileView.vue';
import LinkFormView from '@/views/LinkFormView.vue';
import TagsView from '@/views/TagsView.vue';
import LinkView from '@/views/LinkView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { authorizedOnly: true } },
    { path: '/login', name: 'login', component: LoginView, meta: { authorizedOnly: false } },
    { path: '/forgot', name: 'forgot', component: ForgotView, meta: { authorizedOnly: false } },
    { path: '/links', name: 'links', component: LinksView, meta: { authorizedOnly: true } },
    { path: '/tags', name: 'tags', component: TagsView, meta: { authorizedOnly: true } },
    { path: '/links/add', name: 'add-link', component: LinkFormView, meta: { authorizedOnly: true } },
    { path: '/links/:id', name: 'view-link', component: LinkView, meta: { authorizedOnly: true } },
    { path: '/links/:id/edit', name: 'edit-link', component: LinkFormView, meta: { authorizedOnly: true } },
    { path: '/campaigns', name: 'campaigns', component: CampaignsView, meta: { authorizedOnly: true } },
    { path: '/domains', name: 'domains', component: DomainsView, meta: { authorizedOnly: true } },
    { path: '/importer', name: 'importer', component: ImporterView, meta: { authorizedOnly: true } },
    { path: '/tokens', name: 'tokens', component: TokensView, meta: { authorizedOnly: true } },
    { path: '/backups', name: 'backups', component: BackupsView, meta: { authorizedOnly: true } },
    { path: '/users', name: 'users', component: UsersView, meta: { authorizedOnly: true } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { authorizedOnly: true } }
  ]
});

router.beforeEach((to, from, next) => {
  const { user } = useAppStore();

  if (to.meta.authorizedOnly && !user.isLoggedIn) {
    next('/login');
  } else {
    if (!to.meta.authorizedOnly && user.isLoggedIn) {
      next('/');
    } else {
      next();
    }
  }
});

export default router;
