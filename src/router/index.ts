import { createRouter, createWebHistory } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';

export const commonRouterName = {};

export const mobileRouterName = {};

export const routerName = {
  home: 'home',
  webrtc: 'webrtc',
  pull: 'pull',
  push: 'push',
  notFound: 'notFound',
  ...mobileRouterName,
  ...commonRouterName,
};

// 默认路由
export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: routerName.home,
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/webrtc',
    name: routerName.webrtc,
    component: () => import('@/views/webrtc/index.vue'),
  },
];

const router = createRouter({
  routes: [
    ...defaultRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: routerName.notFound,
      component: () => import('@/views/notFound.vue'),
    },
  ],
  history: createWebHistory(),
});

export default router;
