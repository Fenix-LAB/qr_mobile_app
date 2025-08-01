import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import store from './store';

const privateRoute: RouteRecordRaw['beforeEnter'] = function(to, from, next) {
  if (!store.state.user.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/tutorial',
    name: 'tutorial',
    component: () => import('@/views/Tutorial.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/Account.vue'),
    beforeEnter: privateRoute
  },
  {
    path: '/support',
    name: 'support',
    component: () => import('@/views/Support.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Signup.vue')
  },
  {
    path: '/tutorial',
    name: 'Tutorial',
    component: () => import('@/views/Tutorial.vue')
  },
  {
    path: '/tabs',
    component: () => import('@/views/Tabs.vue'),
    children: [
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import('@/views/Scanner.vue')
      },
      {
        name: 'session-detail',
        path: 'schedule/session/:sessionId',
        component: () => import('@/views/SessionDetail.vue')
      },

      {
        path: 'speakers',
        name: 'speakers',
        component: () => import('@/views/History.vue')
      },
      {
        path: 'speakers/speaker/:speakerId',
        name: 'speaker-detail',
        component: () => import('@/views/SpeakerDetail.vue')
      },
      {
        path: 'speakers/session/:sessionId',
        name: 'speaker-session-detail',
        component: () => import('@/views/SessionDetail.vue')
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/Admin.vue')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/About.vue')
      },
      {
        path: 'superadmin',
        name: 'superadmin',
        component: () => import('@/views/SuperAdmin.vue'),
      },
      {
        path: 'createfrac',
        name: 'createfrac',
        component: () => import('@/views/CreateFrac.vue')
      },
      {
        path: 'newfrac',
        name: 'newfrac',
        component: () => import('@/views/NewFrac.vue')
      },
      {
        path: 'newaccess/:fraccId',
        name: 'newaccess',
        component: () => import('@/views/NewAccess.vue')
      },
      {
        path: 'newdevice',
        name: 'newdevice',
        component: () => import('@/views/NewDevice.vue')
      },
      {
        path: 'fraccionamiento/:id',
        name: 'fraccionamiento-details',
        component: () => import('@/views/FracDetails.vue')
      }
    ]
  },
  { path: '/', redirect: 'tutorial' }
];

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;