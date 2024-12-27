<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider :max="3">
      <n-modal-provider>
        <n-dialog-provider>
          <router-view></router-view>
          <NaiveModal />
          <NaiveMessage />
        </n-dialog-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui';
import { onMounted } from 'vue';

import {
  fetchDeskVersionByVersion,
  fetchDeskVersionCheck,
  fetchDeskVersionLatest,
} from '@/api/deskVersion';
import { APP_BUILD_INFO, WINDOW_ID_ENUM } from '@/constant';
import { useIpcRendererSend } from '@/hooks/use-ipcRendererSend';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { ipcRenderer } from '@/utils';

const appStore = useAppStore();
const cacheStore = usePiniaCacheStore();

const { handlesetAlwaysOnTop, handlesetPowerBootStatus } = useIpcRendererSend();
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#ffd700',
    primaryColorHover: '#ffd700',
  },
};

onMounted(() => {
  console.log('当前地址栏', location.href);
  appStore.version = APP_BUILD_INFO.pkgVersion;
  appStore.lastBuildDate = APP_BUILD_INFO.lastBuildDate;
  handlesetAlwaysOnTop({
    windowId: WINDOW_ID_ENUM.remote,
    flag: cacheStore.isAlwaysOnTop,
  });
  handlesetPowerBootStatus({
    windowId: WINDOW_ID_ENUM.remote,
  }).then((res) => {
    console.log('res', res);
    if (res.code === 0) {
      cacheStore.powerBoot = res.data.open;
    }
  });
  getClient();
  if (ipcRenderer) {
    handleDeskVersionCheck();
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
