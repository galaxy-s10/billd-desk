import { isIPad, isMobile } from 'billd-utils';
import { createRouter, createWebHashHistory } from 'vue-router';

import Layout from '@/layout/index.vue';

import type { RouteRecordRaw } from 'vue-router';

export const commonRouterName = {
  qrcodeLogin: 'qrcodeLogin',
  notFound: 'notFound',
};

export const mobileRouterName = {
  h5privatizationDeployment: 'h5privatizationDeployment',
};

export const routerName = {
  remote: 'remote',
  home: 'home',
  about: 'about',
  version: 'version',
  webrtc: 'webrtc',
  deviceManage: 'deviceManage',
  setting: 'setting',
  hi: 'hi',
  privatizationDeployment: 'privatizationDeployment',

  pull: 'pull',
  push: 'push',
  ...mobileRouterName,
  ...commonRouterName,
};

// 默认路由
export const defaultRoutes: RouteRecordRaw[] = [
  {
    name: routerName.home,
    path: '/',
    component: Layout,
    redirect: routerName.remote,
    children: [
      {
        name: routerName.remote,
        path: '/remote',
        component: () => import('@/views/remote/index.vue'),
      },
      {
        name: routerName.deviceManage,
        path: '/deviceManage',
        component: () => import('@/views/deviceManage/index.vue'),
      },
      {
        name: routerName.setting,
        path: '/setting',
        component: () => import('@/views/setting/index.vue'),
      },
      {
        name: routerName.hi,
        path: '/hi',
        component: () => import('@/views/hi/index.vue'),
      },
    ],
  },
  {
    name: routerName.privatizationDeployment,
    path: '/privatizationDeployment',
    component: () => import('@/views/privatizationDeployment/index.vue'),
  },
  {
    name: routerName.webrtc,
    path: '/webrtc',
    component: () => import('@/views/webrtc/index.vue'),
  },
  {
    name: routerName.about,
    path: '/about',
    component: () => import('@/views/about/index.vue'),
  },
  {
    name: routerName.version,
    path: '/version',
    component: () => import('@/views/version/index.vue'),
  },
  {
    name: mobileRouterName.h5privatizationDeployment,
    path: '/h5/privatizationDeployment',
    component: () => import('@/views/h5/privatizationDeployment/index.vue'),
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

router.beforeEach((to, _from, next) => {
  if (Object.keys(commonRouterName).includes(to.name as string)) {
    // 跳转通用路由
    return next();
  } else if (isMobile() && !isIPad()) {
    console.log('当前是移动端', to.name);
    if (!Object.keys(mobileRouterName).includes(to.name as string)) {
      console.log('当前移动端，但是跳转了非移动端路由');
      if (to.name === routerName.privatizationDeployment) {
        return next({
          name: mobileRouterName.h5privatizationDeployment,
        });
      } else {
        return next();
      }
    } else {
      return next();
    }
  } else {
    if (Object.keys(mobileRouterName).includes(to.name as string)) {
      console.log('当前非移动端，但是跳转了移动端路由', to.name);
      if (to.name === mobileRouterName.h5privatizationDeployment) {
        return next({
          name: routerName.privatizationDeployment,
        });
      } else {
        return next();
      }
    }
    return next();
  }
});

export default router;
