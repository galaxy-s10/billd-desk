<template>
  <div class="layout">
    <div
      v-if="useCustomBar"
      class="system-bar"
      :class="{ 'no-drag': !appStore.isMac, drag: appStore.isMac }"
      @mousedown="startMove"
      @mouseup="endMove"
      @mousemove="moving"
      @mouseleave="handleMouseleave"
    >
      <div class="top-left">
        <div class="left">
          <div
            class="ico close"
            @click="handleClose"
          >
            <div class="corss"></div>
          </div>
          <div
            class="ico min"
            @click="handleMin"
          >
            <div class="heng"></div>
          </div>
          <div class="ico max"></div>
        </div>
        <div class="right">v{{ appStore.version }}</div>
      </div>
      <div class="top-right"></div>
    </div>
    <div class="sidebar">
      <div class="user">
        <div class="dot"></div>
      </div>
      <div class="list">
        <div
          class="item"
          :class="{ active: route.name === routerName.remote }"
          @click="router.push({ name: routerName.remote })"
        >
          远程控制
        </div>
        <div
          class="item"
          :class="{ active: route.name === routerName.deviceManage }"
          @click="router.push({ name: routerName.deviceManage })"
        >
          设备列表
        </div>
        <div
          class="item"
          :class="{ active: route.name === routerName.setting }"
          @click="router.push({ name: routerName.setting })"
        >
          高级设置
        </div>
      </div>
    </div>
    <div class="view">
      <RouterView></RouterView>
    </div>
    <div
      class="debug-area"
      @click="handleOpenDebug"
    ></div>
    <div
      class="debug-area-wrap"
      v-if="appStore.showDebug"
    >
      <div
        class="item"
        @click="windowReload"
      >
        刷新
      </div>
      <div
        class="item"
        @click="handleOpenDevTools({ windowId: WINDOW_ID_ENUM.remote })"
      >
        控制台
      </div>
    </div>
    <UpdateModal
      v-if="
        appStore.updateModalInfo &&
        appStore.updateModalInfo?.checkUpdate === 1 &&
        appStore.updateModalInfo?.isUpdate === 1
      "
      @close="appStore.updateModalInfo.isUpdate = 2"
    ></UpdateModal>
    <DisableModal
      v-if="
        appStore.updateModalInfo &&
        appStore.updateModalInfo?.disableList.find(
          (v) => v.version === appStore.version
        )
      "
    ></DisableModal>
  </div>
</template>

<script lang="ts" setup>
import { getRandomString, windowReload } from 'billd-utils';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { WINDOW_ID_ENUM } from '@/constant';
import { IPC_EVENT } from '@/event';
import { useIpcRendererSend } from '@/hooks/use-ipcRendererSend';
import { IIpcRendererData } from '@/interface';
import { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import {
  ipcRenderer,
  ipcRendererInvoke,
  ipcRendererOn,
  ipcRendererSend,
} from '@/utils';

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();

const { handleOpenDevTools } = useIpcRendererSend();

// 窗口当前的位置 + 鼠标当前的相对位置 - 鼠标以前的相对位置
const isMoving = ref<boolean>(false);
const lastPoint = reactive({ x: 0, y: 0 });
const useCustomBar = ref(true);
const clickNum = ref(1);

onMounted(() => {
  if (!ipcRenderer) {
    useCustomBar.value = false;
  }
  init();
});

async function init() {
  const res = await ipcRendererInvoke({
    windowId: WINDOW_ID_ENUM.remote,
    channel: IPC_EVENT.getPlatform,
    requestId: getRandomString(8),
    data: {},
  });
  if (res?.code === 0) {
    if (res?.data?.platform === 'darwin') {
      appStore.isMac = true;
    }
  }
}

ipcRendererOn(
  IPC_EVENT.response_open_about,
  (_event, data: IIpcRendererData) => {
    console.log('response_open_about', data);
    ipcRendererSend({
      windowId: 0,
      channel: IPC_EVENT.createWindow,
      requestId: getRandomString(8),
      data: {
        windowId: WINDOW_ID_ENUM.about,
        width: 550,
        height: 380,
        route: routerName.about,
        query: {},
        useWorkAreaSize: false,
        frame: true,
      },
    });
  }
);

ipcRendererOn(
  IPC_EVENT.response_open_version,
  (_event, data: IIpcRendererData) => {
    console.log('response_open_version', data);
    ipcRendererSend({
      windowId: 0,
      channel: IPC_EVENT.createWindow,
      requestId: getRandomString(8),
      data: {
        windowId: WINDOW_ID_ENUM.version,
        width: 300,
        height: 300,
        route: routerName.version,
        query: {},
        useWorkAreaSize: false,
        frame: true,
      },
    });
  }
);

function handleOpenDebug() {
  if (clickNum.value < 5) {
    clickNum.value += 1;
    setTimeout(() => {
      clickNum.value = 1;
    }, 3000);
  } else {
    appStore.showDebug = true;
  }
}

function handleClose() {
  ipcRendererSend({
    windowId: WINDOW_ID_ENUM.remote,
    channel: IPC_EVENT.closeAllWindow,
    requestId: getRandomString(8),
    data: {},
  });
}

function handleMin() {
  ipcRendererSend({
    windowId: WINDOW_ID_ENUM.remote,
    channel: IPC_EVENT.windowMinimize,
    requestId: getRandomString(8),
    data: {},
  });
}

const startMove = (e: MouseEvent) => {
  if (appStore.isMac) {
    return;
  }
  isMoving.value = true;
  lastPoint.x = e.clientX;
  lastPoint.y = e.clientY;
};

const endMove = () => {
  if (appStore.isMac) {
    return;
  }
  isMoving.value = false;
};

const handleMouseleave = () => {
  if (appStore.isMac) {
    return;
  }
  isMoving.value = false;
};

const moving = (e: MouseEvent) => {
  if (appStore.isMac) {
    return;
  }
  if (isMoving.value) {
    ipcRendererInvoke({
      windowId: WINDOW_ID_ENUM.remote,
      channel: IPC_EVENT.setWindowPosition,
      requestId: getRandomString(8),
      data: {
        x: e.screenX - lastPoint.x,
        y: e.screenY - lastPoint.y,
      },
    });
  }
};
</script>

<style lang="scss" scoped>
$sidebar-width: 160px;
.layout {
  display: flex;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  .system-bar {
    position: fixed;
    top: 0;
    z-index: 999;
    display: flex;
    box-sizing: border-box;
    width: 100vw;
    height: $top-system-bar-height;
    &.drag {
      -webkit-app-region: drag;
    }
    &.no-drag {
      -webkit-app-region: no-drag;
    }

    user-select: none;
    .top-left {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 10px 8px 0 12px;
      width: $sidebar-width;
      .left {
        display: flex;
        align-items: center;

        .ico {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          font-size: 12px;
          cursor: pointer;

          -webkit-app-region: no-drag;
          .corss {
            width: 7px;
            height: 7px;

            @include cross(black, 1px);
          }
          .heng {
            width: 7px;
            height: 1px;
            background-color: black;
          }
          &.close {
            background-color: #f7564d;
          }
          &.min {
            background-color: #f6c84e;
          }
          &.max {
            background-color: #dedede;
            cursor: auto;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        color: #666;
        font-size: 12px;
      }
    }
    .top-right {
      display: flex;
      align-items: center;
      width: calc(100vw - $sidebar-width);
    }
  }
  .sidebar {
    box-sizing: border-box;
    padding: 60px 10px 0;
    width: $sidebar-width;
    height: 100vh;
    background-color: rgba($color: #fffa65, $alpha: 0.15);
    .user {
      position: relative;
      margin: 0 auto;
      width: 50px;
      height: 50px;
      border-radius: 50%;

      @include setBackground('@/assets/img/billd.jpg');
      .dot {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background-color: #6cdd5b;
      }
    }
    .list {
      padding-top: 20px;
      .item {
        margin-bottom: 5px;
        padding: 0 10px;
        height: 35px;
        border-radius: 4px;
        color: #666;
        font-size: 14px;
        line-height: 35px;
        cursor: pointer;
        &.active,
        &:hover {
          background-color: rgba($color: $theme-color-gold, $alpha: 0.2);
          color: $theme-color-gold;
        }
      }
    }
  }
  .view {
    box-sizing: border-box;
    width: calc(100vw - $sidebar-width);
  }
  .debug-area {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 30px;
    height: 30px;
  }
  .debug-area-wrap {
    position: fixed;
    bottom: 40px;
    left: 0;
    z-index: 300;
    display: flex;
    .item {
      margin-right: 4px;
      color: red;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
