<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider :max="3">
      <n-modal-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <router-view></router-view>
            <NaiveModal />
            <NaiveMessage />
            <NaiveNotification />
          </n-notification-provider>
        </n-dialog-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { getRandomString } from 'billd-utils';
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui';
import { onMounted } from 'vue';

import {
  fetchDeskVersionByVersion,
  fetchDeskVersionCheck,
  fetchDeskVersionLatest,
} from '@/api/deskVersion';
import { WINDOW_ID_ENUM } from '@/constant';
import { IPC_EVENT } from '@/event';
import { useIpcRendererSend } from '@/hooks/use-ipcRendererSend';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import {
  getClientEnv,
  getPlatform,
  ipcRenderer,
  ipcRendererInvoke,
  ipcRendererSend,
} from '@/utils';

import { fetchInviteCreate, fetchInviteKeepAlive } from './api/inivte';

const appStore = useAppStore();
const cacheStore = usePiniaCacheStore();

const {
  handleSetAlwaysOnTop,
  handleSetPowerBootStatus,
  handleGetAllWindowName,
} = useIpcRendererSend();
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#ffd700',
    primaryColorHover: '#ffd700',
  },
};

function handleRemoveGlobalLoading() {
  const el = document.querySelector('.b-global-loading') as HTMLDivElement;
  el.style.display = 'none';
}

onMounted(async () => {
  console.log('当前地址栏', location.href);

  ipcRendererSend({
    windowId: WINDOW_ID_ENUM.remote,
    channel: IPC_EVENT.workAreaSize,
    requestId: getRandomString(8),
    data: {},
  });

  const res1 = await ipcRendererInvoke({
    windowId: WINDOW_ID_ENUM.remote,
    channel: IPC_EVENT.getArch,
    requestId: getRandomString(8),
    data: {},
  });
  if (res1?.code === 0) {
    appStore.arch = res1.data.arch;
  }

  const res2 = await ipcRendererInvoke({
    windowId: WINDOW_ID_ENUM.remote,
    channel: IPC_EVENT.scaleFactor,
    requestId: getRandomString(8),
    data: {},
  });
  if (res2?.code === 0) {
    if (getPlatform() !== 'darwin') {
      appStore.scaleFactor = res2.data.scaleFactor;
    }
  }

  const re3 = await ipcRendererInvoke({
    windowId: WINDOW_ID_ENUM.remote,
    channel: IPC_EVENT.getPrimaryDisplaySize,
    requestId: getRandomString(8),
    data: {},
  });
  if (re3?.code === 0) {
    appStore.primaryDisplaySize.width = re3.data.width;
    appStore.primaryDisplaySize.height = re3.data.height;
  }
  const appInfo = process.env.BilldHtmlWebpackPlugin as any;
  const res = await fetchInviteCreate({
    roomId: cacheStore.deskUserUuid,
    uuid: cacheStore.deskUserUuid,
    pwd: cacheStore.deskUserPassword,
    client_env: getClientEnv(),
    client_version: appInfo?.pkgVersion,
  });
  if (res.code === 200) {
    appStore.inviteId = res.data.id;
  }
  setInterval(() => {
    fetchInviteKeepAlive({ id: appStore.inviteId });
  }, 1000 * 5);

  handleRemoveGlobalLoading();

  handleSetAlwaysOnTop({
    windowId: WINDOW_ID_ENUM.remote,
    flag: cacheStore.isAlwaysOnTop,
  });

  getClient();

  if (ipcRenderer) {
    handleGetAllWindowName({
      windowId: WINDOW_ID_ENUM.remote,
    });
    handleDeskVersionCheck();
    handleSetPowerBootStatus({
      windowId: WINDOW_ID_ENUM.remote,
    }).then((res) => {
      if (res.code === 0) {
        cacheStore.powerBoot = res.data.open;
      }
    });
  }
});

async function handleDeskVersionCheck() {
  const res = await fetchDeskVersionCheck(appStore.version);
  if (res.code === 200 && res.data) {
    appStore.updateModalInfo = res.data;
  }
}

async function getClient() {
  let res;
  if (ipcRenderer) {
    res = await fetchDeskVersionByVersion(appStore.version);
  } else {
    res = await fetchDeskVersionLatest();
  }
  if (res.code === 200 && res.data) {
    appStore.deskVersionInfo = res.data;
  }
}
</script>

<style lang="scss" scoped></style>

<style lang="scss">
#app {
  user-select: none;
}
</style>
