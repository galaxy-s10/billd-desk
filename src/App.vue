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
import { onMounted, onUnmounted, watch } from 'vue';

import { usePiniaCacheStore } from '@/store/cache';
import { setAxiosBaseUrl } from '@/utils/localStorage/app';

import { useAppStore } from './store/app';
import { memory } from './utils/memory';

const appStore = useAppStore();
const cacheStore = usePiniaCacheStore();

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

watch(
  () => cacheStore.customApi,
  () => {
    setAxiosBaseUrl(cacheStore.customApi);
  },
  { immediate: true, deep: true }
);

watch(
  () => cacheStore.customTurnServer,
  () => {
    memory.customTurnserver = cacheStore.customTurnServer;
  },
  { immediate: true, deep: true }
);

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
