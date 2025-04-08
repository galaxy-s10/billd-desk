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
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui';
import { onMounted } from 'vue';

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

onMounted(() => {
  console.log('当前地址栏', location.href);
  handleRemoveGlobalLoading();
});
</script>

<style lang="scss" scoped></style>

<style lang="scss">
#app {
  user-select: none;
}
</style>
