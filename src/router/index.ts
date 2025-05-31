import { isIPad, isMobile } from 'billd-utils';
import { createRouter, createWebHashHistory } from 'vue-router';

import Layout from '@/layout/index.vue';

import type { RouteRecordRaw } from 'vue-router';

export const commonRouterName = {
  qrcodeLogin: 'qrcodeLogin',
  notFound: 'notFound',
};

export const mobileRouterName = {
  h5PrivatizationDeployment: 'h5PrivatizationDeployment',
  h5Price: 'h5Price',
};

export const routerName = {
  remote: 'remote',
  home: 'home',
  about: 'about',
  wechatGroup: 'wechatGroup',
  officialGroup: 'officialGroup',
  fixedPopupWindow: 'fixedPopupWindow',
  version: 'version',
  webrtc: 'webrtc',
  deviceManage: 'deviceManage',
  screenWall: 'screenWall',
  screenWallAdmin: 'screenWallAdmin',
  setting: 'setting',
  hi: 'hi',
  privatizationDeployment: 'privatizationDeployment',
  price: 'price',
  invite: 'invite',
  download: 'download',
  release: 'release',

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
        name: routerName.screenWall,
        path: '/screenWall',
        component: () => import('@/views/screenWall/index.vue'),
      },
      {
        name: routerName.screenWallAdmin,
        path: '/screenWallAdmin',
        component: () => import('@/views/screenWallAdmin/index.vue'),
      },
      {
        name: routerName.setting,
        path: '/setting',
        component: () => import('@/views/setting/index.vue'),
      },
      {
        name: routerName.download,
        path: '/download',
        component: () => import('@/views/download/index.vue'),
      },
      {
        name: routerName.release,
        path: '/release',
        component: () => import('@/views/release/index.vue'),
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
    name: routerName.price,
    path: '/price',
    component: () => import('@/views/price/index.vue'),
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
    name: routerName.wechatGroup,
    path: '/wechatGroup',
    component: () => import('@/views/wechatGroup/index.vue'),
  },
  {
    name: routerName.officialGroup,
    path: '/officialGroup',
    component: () => import('@/views/officialGroup/index.vue'),
  },
  {
    name: routerName.fixedPopupWindow,
    path: '/fixedPopupWindow',
    component: () => import('@/views/fixedPopupWindow/index.vue'),
  },
  {
    name: routerName.invite,
    path: '/invite',
    component: () => import('@/views/invite/index.vue'),
  },
  {
    name: mobileRouterName.h5PrivatizationDeployment,
    path: '/h5/privatizationDeployment',
    component: () => import('@/views/h5/privatizationDeployment/index.vue'),
  },
  {
    name: mobileRouterName.h5Price,
    path: '/h5/price',
    component: () => import('@/views/h5/price/index.vue'),
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
          name: routerName.h5PrivatizationDeployment,
        });
      } else if (to.name === routerName.price) {
        return next({
          name: routerName.h5Price,
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
      if (to.name === routerName.h5PrivatizationDeployment) {
        return next({
          name: routerName.privatizationDeployment,
        });
      } else if (to.name === routerName.h5Price) {
        return next({
          name: routerName.price,
        });
      } else {
        return next();
      }
    }
    return next();
  }
});

export default router;
