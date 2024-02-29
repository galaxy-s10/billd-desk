import { createRouter, createWebHashHistory } from 'vue-router';

import type { RouteRecordRaw } from 'vue-router';

export const commonRouterName = {
  qrcodeLogin: 'qrcodeLogin',
};

export const mobileRouterName = {
  h5: 'h5',
  h5Room: 'h5Room',
  h5Area: 'h5Area',
  h5Rank: 'h5Rank',
  h5Profile: 'h5Profile',
  ...commonRouterName,
};

export const routerName = {
  home: 'home',
  about: 'about',
  area: 'area',
  areaDetail: 'areaDetail',
  rank: 'rank',
  sponsors: 'sponsors',
  privatizationDeployment: 'privatizationDeployment',
  videoTools: 'videoTools',
  frameScreenshotByCanvas: 'frameScreenshotByCanvas',
  frameScreenshotByWebcodec: 'frameScreenshotByWebcodec',
  support: 'support',
  order: 'order',
  wallet: 'wallet',
  shop: 'shop',
  link: 'link',
  ad: 'ad',
  faq: 'faq',
  team: 'team',
  oauth: 'oauth',
  release: 'release',
  pushStreamDifferent: 'pushStreamDifferent',
  notFound: 'notFound',
  group: 'group',
  profile: 'profile',

  pull: 'pull',
  push: 'push',
  ...mobileRouterName,
};

// 默认路由
export const defaultRoutes: RouteRecordRaw[] = [
  {
    name: routerName.home,
    path: '/',
    component: () => import('@/views/home/index.vue'),
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
  history: createWebHashHistory(),
});

export default router;
