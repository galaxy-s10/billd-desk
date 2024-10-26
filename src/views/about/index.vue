<template>
  <div class="about-wrap">
    <div class="item logo"></div>
    <div class="item name">{{ PRODUCT_NAME }}</div>
    <div class="item version">v{{ appStore.version }}</div>
    <div class="copyright">
      Copyright © 2023-2024
      <span
        class="link"
        @click="handleClick()"
        >Galaxy-s10</span
      >. All rights reserved.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AUTHOR_INFO, PRODUCT_NAME, WINDOW_ID_ENUM } from '@/constant';
import { useIpcRendererSend } from '@/hooks/use-ipcRendererSend';
import { useAppStore } from '@/store/app';

const { handleOpenExternal } = useIpcRendererSend();
const appStore = useAppStore();

function handleClick() {
  handleOpenExternal({
    windowId: WINDOW_ID_ENUM.about,
    url: AUTHOR_INFO.github,
  });
}
</script>

<style lang="scss" scoped>
.about-wrap {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  color: #666;
  font-size: 16px;
  .item {
    margin: 0 auto;
    text-align: center;
  }
  .logo {
    margin-top: 50px;
    width: 100px;
    height: 100px;
    border-radius: 10px;

    @include setBackground('@/assets/img/logo.png');
  }
  .name {
    padding-top: 15px;
    font-size: 16px;
  }
  .version {
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 14px;
  }
  .copyright {
    position: absolute;
    bottom: 30px;
    left: 50%;
    width: 100vw;
    color: #888;
    text-align: center;
    font-size: 14px;
    transform: translate(-50%, 0%);
  }

  .link {
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
