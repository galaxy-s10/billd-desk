<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <router-view></router-view>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script lang="ts">
export default {
  name: 'MainApp',
};
</script>

<script lang="ts" setup>
import { isMobile } from 'billd-utils';
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui';
import { onMounted } from 'vue';

import { THEME_COLOR, appBuildInfo } from '@/constant';
import { useCheckUpdate } from '@/hooks/use-common';
import { usePiniaCacheStore } from '@/store/cache';
import { getHostnameUrl } from '@/utils';
import { getLastBuildDate, setLastBuildDate } from '@/utils/localStorage/app';

const { checkUpdate } = useCheckUpdate();
const cacheStore = usePiniaCacheStore();

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: THEME_COLOR,
    primaryColorHover: THEME_COLOR,
  },
};

onMounted(() => {
  checkUpdate({
    htmlUrl: getHostnameUrl(),
  });
  handleUpdate();
  cacheStore.muted = true;
  cacheStore.volume = 0;

  // 启用vconsole
  // import('vconsole')
  //   .then((VConsole) => {
  //     // eslint-disable-next-line
  //     new VConsole.default();
  //   })
  //   .catch(() => {});
  if (isMobile()) {
    const metaEl = document.querySelector('meta[name="viewport"]');
    metaEl?.setAttribute(
      'content',
      'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'
    );
  }
});

function handleUpdate() {
  const old = getLastBuildDate();
  if (appBuildInfo.lastBuildDate !== old) {
    localStorage.clear();
  }
  setLastBuildDate(appBuildInfo.lastBuildDate);
}
</script>

<style lang="scss">
body {
  font-size: 16px;
  // naive的message会影响全局line-height
  line-height: initial;
}
</style>
<style lang="scss" scoped></style>
