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
import { isIPad, isMobile } from 'billd-utils';
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui';
import { onMounted, onUnmounted } from 'vue';

import { getApi, getTurn, getWss } from '@/utils/localStorage/app';

import { useAppStore } from './store/app';
import { handleAtob } from './utils';
import { memory } from './utils/memory';

const appStore = useAppStore();

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

function handleCustomApi() {
  const val = getApi();
  if (val) {
    memory.customApi.open = val.open;
    memory.customApi.url = val.url;
  }
}
function handleCustomWss() {
  const val = getWss();
  if (val) {
    memory.customWss.open = val.open;
    memory.customWss.url = val.url;
  }
}

function handleCustomTurnserver() {
  const val = getTurn();
  if (val) {
    memory.customTurnserver.open = val.open;
    memory.customTurnserver.data = val.data;
    const { err, msg } = handleAtob(val.data);
    if (!err) {
      try {
        if (msg === '') return;
        const json = JSON.parse(msg);
        memory.customTurnserver.urls = json.urls;
        memory.customTurnserver.username = json.username;
        memory.customTurnserver.credential = json.credential;
      } catch (error) {
        console.log(error);
      }
    }
  }
}

function handleResize() {
  if (isMobile()) {
    appStore.isMobile = true;
  } else {
    appStore.isMobile = false;
  }
  appStore.isIPad = isIPad();
}

onMounted(() => {
  console.log('当前地址栏', location.href);
  handleRemoveGlobalLoading();
  handleResize();
  handleCustomWss();
  handleCustomApi();
  handleCustomTurnserver();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped></style>

<style lang="scss">
#app {
  user-select: none;
}
</style>
