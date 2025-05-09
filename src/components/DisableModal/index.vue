<template>
  <div class="disable-modal-wrap">
    <div class="mask"></div>
    <div class="content">
      <div class="top">
        <div class="title">提示</div>
        <div></div>
      </div>
      <!-- eslint-disable -->
      <div
        class="update-content"
        v-html="
          appStore.updateModalInfo?.disableList.find(
            (v) => v.version === appStore.version
          )?.msg
        "
      ></div>
      <!--eslint-enable-->
      <div class="other">
        <div>发布时间：{{ appStore.updateModalInfo?.updateDate }}</div>
      </div>
      <div
        class="btn"
        @click="handleClose"
      >
        确定
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getRandomString } from 'billd-utils';

import { IPC_EVENT, WINDOW_ID_MAP } from '@/pure-constant';
import { useAppStore } from '@/store/app';
import { ipcRendererSend } from '@/utils';

const appStore = useAppStore();

function handleClose() {
  ipcRendererSend({
    windowId: WINDOW_ID_MAP.remote,
    channel: IPC_EVENT.closeAllWindow,
    requestId: getRandomString(8),
    data: { windowId: WINDOW_ID_MAP.remote },
  });
}
</script>

<style lang="scss" scoped>
.disable-modal-wrap {
  position: relative;
  z-index: 100;
  .mask {
    background-color: rgba($color: #000000, $alpha: 0.3) !important;

    @extend %maskBg;
  }
  .content {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 100;
    box-sizing: border-box;
    padding: 15px 20px;
    width: 320px;
    // height: 350px;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 2px 20px rgb(0 0 0 / 20%);
    transform: translate(-50%, -50%);
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-weight: 500;
        font-size: 16px;
      }
    }
    .update-content {
      overflow: scroll;
      padding-top: 10px;
      max-height: 200px;
      font-size: 16px;

      user-select: text;
      @extend %customScrollbarHide;
      &:hover {
        @extend %customScrollbar;
      }
    }
    .other {
      margin-top: 10px;
      color: #666;
      text-align: right;
      font-size: 12px;
    }
    .btn {
      margin-top: 10px;
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background-color: $theme-color-gold;
      color: white;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
