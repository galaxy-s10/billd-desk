<template>
  <div class="layout">
    <div
      class="system-bar"
      :class="{
        'no-drag': platform !== ClientEnvEnum.macos,
        drag: platform === ClientEnvEnum.macos,
      }"
      @mousedown="startMove"
      @mouseup="endMove"
      @mousemove="moving"
      @mouseleave="handleMouseleave"
    >
      <div
        v-if="useCustomBar"
        class="top-left"
      >
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
      <div
        v-else
        class="top-left"
      ></div>
      <div class="top-right">
        <div
          class="msg"
          title="消息"
          @click="appStore.showGlobalMsg.show = true"
        >
          <div class="red-dot"></div>
          <div class="msg-ico"></div>
        </div>
      </div>
    </div>
    <div class="sidebar">
      <div class="user">
        <div
          class="dot"
          :class="{ ok: connectStatus === WsConnectStatusEnum.connect }"
        ></div>
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
          v-if="!ipcRenderer"
          class="item"
          :class="{ active: route.name === routerName.screenWall }"
          @click="router.push({ name: routerName.screenWall })"
        >
          屏幕墙
        </div>
        <div
          v-if="!ipcRenderer && cacheStore.deskUserUuid === 'superadmin'"
          class="item"
          :class="{ active: route.name === routerName.screenWallAdmin }"
          @click="router.push({ name: routerName.screenWallAdmin })"
        >
          屏幕墙（管理员）
        </div>
        <div
          class="item"
          :class="{ active: route.name === routerName.setting }"
          @click="router.push({ name: routerName.setting })"
        >
          高级设置
        </div>
        <div
          class="item"
          :class="{ active: route.name === routerName.download }"
          @click="router.push({ name: routerName.download })"
        >
          客户端下载
        </div>
      </div>
    </div>
    <div class="view">
      <RouterView></RouterView>
    </div>
    <div
      v-if="teststr !== ''"
      class="teststr"
    >
      {{ teststr }}
    </div>
    <div
      class="debug-area"
      @click="handleOpenDebug"
    ></div>
    <div
      v-if="appStore.showDebug || NODE_ENV === 'development'"
      class="debug-area-wrap"
    >
      <div
        class="item"
        @click="windowReload"
      >
        刷新
      </div>
      <div
        class="item"
        @click="handleOpenDevTools({ windowId: WINDOW_ID_MAP.remote })"
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
    <GlobalMsgModal
      v-if="appStore.showGlobalMsg.show"
      @close="appStore.showGlobalMsg.show = false"
    ></GlobalMsgModal>
  </div>
</template>

<script lang="ts" setup>
import { getRandomString, windowReload } from 'billd-utils';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  fetchDeskVersionByVersion,
  fetchDeskVersionCheck,
  fetchDeskVersionLatest,
} from '@/api/deskVersion';
import { fetchGlobalMsgGlobal } from '@/api/globalMsg';
import { fetchInviteCreate } from '@/api/inivte';
import { fetchScreenWallSetImg } from '@/api/screenWall';
import { NODE_ENV } from '@/constant';
import { useIpcRendererSend } from '@/hooks/use-ipcRendererSend';
import { useWebsocket } from '@/hooks/use-websocket';
import {
  ClientEnvEnum,
  DeskConfigTypeEnum,
  GlobalMsgTypeEnum,
  SwitchEnum,
} from '@/interface';
import { IPC_EVENT, WINDOW_ID_MAP } from '@/pure-constant';
import { IIpcRendererData } from '@/pure-interface';
import { routerName } from '@/router';
import { AppRootState, useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { WsConnectStatusEnum } from '@/types/websocket';
import {
  getClientEnv,
  ipcRenderer,
  ipcRendererInvoke,
  ipcRendererOn,
  ipcRendererSend,
  streamToBase64,
} from '@/utils';

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const cacheStore = usePiniaCacheStore();

const {
  handleOpenDevTools,
  handleSetAlwaysOnTop,
  handleGetThumbnail,
  handleSetPowerBootStatus,
} = useIpcRendererSend();
const { connectStatus } = useWebsocket();

// 窗口当前的位置 + 鼠标当前的相对位置 - 鼠标以前的相对位置
const isMoving = ref<boolean>(false);
const lastPoint = reactive({ x: 0, y: 0 });
const useCustomBar = ref(true);
const clickNum = ref(1);
const teststr = ref('');
const platform = ref<ClientEnvEnum>();
const loopGetThumbnailTimer = ref();
const loopfetchScreenWallSetImgTimer = ref();
let base64 = '';
let timer;

async function handleGlobalMsgMyList() {
  const res = await fetchGlobalMsgGlobal({
    orderName: 'priority',
    orderBy: 'desc',
    show: SwitchEnum.yes,
  });

  if (res.code === 200) {
    res.data.forEach((item) => {
      if (item.type === GlobalMsgTypeEnum.notification) {
        appStore.notification.push(item);
      } else {
        appStore.showGlobalMsg.list.push(item);
        appStore.showGlobalMsg.show = true;
        // window.$modal.create({
        //   title: item.title || '提示',
        //   preset: 'dialog',
        //   content: item.content || '',
        // });
      }
    });
  }
}

function loopGetThumbnail() {
  if (appStore.deskVersionInfo?.disable === 1) {
    return;
  }
  if (!ipcRenderer) {
    return;
  }
  clearInterval(loopGetThumbnailTimer.value);
  const isHasStream = false;
  loopGetThumbnailTimer.value = setInterval(async () => {
    if (appStore.deskVersionInfo?.disable === 1) {
      clearInterval(loopGetThumbnailTimer.value);
      return;
    }
    if (isHasStream) {
      return;
    }
    const res = await handleGetThumbnail({
      windowId: WINDOW_ID_MAP.remote,
    });
    // https://github.com/electron/electron/issues/16031
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        // @ts-ignore
        mandatory: {
          // https://www.electronjs.org/zh/docs/latest/api/structures/desktop-capturer-source
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: res.data.id,
        },
      },
    });
    const settings = stream.getVideoTracks()[0].getSettings();
    let scale = 1;
    let quality = 1;
    if (settings.width && settings.height) {
      const all = settings.width * settings.height;
      const normal = 1920 * 1080;
      const num = all / normal;
      if (num <= 1) {
        scale = 0.5;
        quality = 0.2;
      } else if (num < 2) {
        scale = 0.4;
        quality = 0.2;
      } else if (num < 3) {
        scale = 0.3;
        quality = 0.2;
      } else if (num < 4) {
        scale = 0.25;
        quality = 0.2;
      } else if (num < 5) {
        scale = 0.2;
        quality = 0.2;
      } else {
        scale = 0.2;
        quality = 0.2;
      }
    }
    const res1 = (await streamToBase64({ stream, scale, quality })) as any;
    // const res1 = (await streamToUint8Array({ stream, scale })) as any;
    base64 = res1.base64;
  }, 1000 * 5);

  clearInterval(loopfetchScreenWallSetImgTimer.value);
  loopfetchScreenWallSetImgTimer.value = setInterval(() => {
    if (appStore.deskVersionInfo?.disable === 1) {
      clearInterval(loopfetchScreenWallSetImgTimer.value);
      return;
    }
    try {
      fetchScreenWallSetImg({
        uuid: cacheStore.deskUserUuid,
        password: cacheStore.deskUserPassword,
        data: base64,
      });
    } catch (error) {
      console.error(error);
    }
  }, 1000 * 2);
}

onMounted(async () => {
  if (!ipcRenderer) {
    useCustomBar.value = false;
  }
  if (ipcRenderer) {
    handleDeskVersionCheck();
    handleSetPowerBootStatus({
      windowId: WINDOW_ID_MAP.remote,
    }).then((res) => {
      if (res.code === 0) {
        cacheStore.powerBoot = res.data.open;
      }
    });
    const res1 = await ipcRendererInvoke({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.getArch,
      requestId: getRandomString(8),
      data: {},
    });
    if (res1?.code === 0) {
      appStore.arch = res1.data.arch;
    }
  }
  handleGlobalMsgMyList();
  await handleVersion();
  handleInviteInfo();
  loopGetThumbnail();

  platform.value = getClientEnv();

  handleSetAlwaysOnTop({
    windowId: WINDOW_ID_MAP.remote,
    flag: cacheStore.isAlwaysOnTop,
  });
});

watch(
  () => appStore.deskVersionInfo,
  (newval) => {
    if (newval) {
      const clientList: AppRootState['clientList'] = [];
      Object.keys(newval).forEach((item) => {
        if (item.indexOf('download_linux') !== -1) {
          const arr = item.split('_');
          const ext = arr[3] === 'appimage' ? 'app' : arr[3];
          const platform = arr[1];
          const arch = arr[2];
          clientList.push({
            ver: newval.show_version || '',
            platform,
            arch,
            label: `${platform}(${arch})`,
            ext,
            url: newval[item],
          });
        }
        if (item.indexOf('download_windows') !== -1) {
          const arr = item.split('_');
          const platform = arr[1];
          const arch = arr[2];
          clientList.push({
            ver: newval.show_version || '',
            platform,
            arch,
            label: `${platform}(${arch})`,
            ext: arr[3],
            url: newval[item],
          });
        }
        if (item.indexOf('download_macos') !== -1) {
          const arr = item.split('_');
          const platform = arr[1];
          const arch = arr[2];
          clientList.push({
            ver: newval.show_version || '',
            platform,
            arch,
            label: `${platform}(${arch})`,
            ext: arr[3],
            url: newval[item],
          });
        }
      });
      appStore.clientList = clientList;
    }
  },
  { immediate: true, deep: true }
);

async function handleVersion() {
  try {
    let res;
    if (ipcRenderer) {
      res = await fetchDeskVersionByVersion({
        version: appStore.version,
        type: DeskConfigTypeEnum.electronVersionConfig,
      });
    } else {
      res = await fetchDeskVersionLatest({
        type: DeskConfigTypeEnum.electronVersionConfig,
      });
    }
    const res1 = await fetchDeskVersionLatest({
      type: DeskConfigTypeEnum.flutterVersionConfig,
    });
    if (res.code === 200 && res.data) {
      appStore.deskVersionInfo = res.data;
    }
    if (res1.code === 200 && res1.data) {
      appStore.deskAppVersionInfo = res1.data;
    }
  } catch (error) {
    console.error(error);
  }
}

async function handleDeskVersionCheck() {
  const res = await fetchDeskVersionCheck({
    version: appStore.version,
    type: DeskConfigTypeEnum.electronVersionConfig,
  });
  if (res.code === 200 && res.data) {
    appStore.updateModalInfo = res.data;
  }
}

function handleInviteInfo() {
  if (appStore.deskVersionInfo?.disable === 1) {
    return;
  }
  async function main() {
    if (cacheStore.deskUserUuid && cacheStore.deskUserPassword) {
      const res = await fetchInviteCreate({
        roomId: cacheStore.deskUserUuid,
        uuid: cacheStore.deskUserUuid,
        password: cacheStore.deskUserPassword,
      });
      if (res.code === 200) {
        clearInterval(timer);
        appStore.inviteId = res.data.id;
      }
    }
  }
  main();
  timer = setInterval(() => {
    if (appStore.deskVersionInfo?.disable === 1) {
      clearInterval(timer);
      return;
    }
    if (appStore.inviteId) {
      clearInterval(timer);
      return;
    }
    main();
  }, 1000);
}

ipcRendererOn(
  IPC_EVENT.response_closeWindowed,
  (_event, data: IIpcRendererData) => {
    console.log('response_closeWindowed', data);
    if (data.data?.windowId === WINDOW_ID_MAP.about) {
      appStore.createAboutWindows = false;
    }
  }
);

ipcRendererOn(
  IPC_EVENT.response_open_about,
  (_event, data: IIpcRendererData) => {
    console.log('response_open_about', data);
    if (appStore.createAboutWindows) {
      handleSetAlwaysOnTop({
        windowId: WINDOW_ID_MAP.about,
        flag: true,
      });
      return;
    }
    appStore.createAboutWindows = true;
    ipcRendererSend({
      windowId: 0,
      channel: IPC_EVENT.createWindow,
      requestId: getRandomString(8),
      data: {
        windowId: WINDOW_ID_MAP.about,
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
  async (_event, data: IIpcRendererData) => {
    console.log('response_open_version', data);
    const res = await fetchDeskVersionCheck({
      version: appStore.version,
      type: DeskConfigTypeEnum.electronVersionConfig,
    });
    if (res.code === 200 && res.data) {
      appStore.updateModalInfo = res.data;
      if (appStore.updateModalInfo?.checkUpdate === 2) {
        window.$message.success('当前不需要更新');
      } else if (appStore.updateModalInfo?.isUpdate === 2) {
        window.$message.success('当前是最新版本');
      }
    }
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
    windowId: WINDOW_ID_MAP.remote,
    channel: IPC_EVENT.closeAllWindow,
    requestId: getRandomString(8),
    data: {},
  });
}

function handleMin() {
  ipcRendererSend({
    windowId: WINDOW_ID_MAP.remote,
    channel: IPC_EVENT.windowMinimize,
    requestId: getRandomString(8),
    data: {},
  });
}

const startMove = (e: MouseEvent) => {
  if (!useCustomBar.value) return;
  if (platform.value === ClientEnvEnum.macos) {
    return;
  }
  isMoving.value = true;
  lastPoint.x = e.clientX;
  lastPoint.y = e.clientY;
};

const endMove = () => {
  if (!useCustomBar.value) return;
  if (platform.value === ClientEnvEnum.macos) {
    return;
  }
  isMoving.value = false;
};

const handleMouseleave = () => {
  if (!useCustomBar.value) return;
  if (platform.value === ClientEnvEnum.macos) {
    return;
  }
  isMoving.value = false;
};

const moving = (e: MouseEvent) => {
  if (!useCustomBar.value) return;
  if (platform.value === ClientEnvEnum.macos) {
    return;
  }
  if (isMoving.value) {
    ipcRendererInvoke({
      windowId: WINDOW_ID_MAP.remote,
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
    z-index: 888;
    display: flex;
    box-sizing: border-box;
    width: 100vw;
    height: $top-system-bar-height;

    user-select: none;
    &.drag {
      -webkit-app-region: drag;
    }
    &.no-drag {
      -webkit-app-region: no-drag;
    }
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
      position: relative;
      width: calc(100vw - $sidebar-width);

      .msg {
        position: absolute;
        top: 50%;
        right: 20px;
        cursor: pointer;
        transform: translateY(-50%);

        -webkit-app-region: no-drag;

        .red-dot {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: red;
        }
        .msg-ico {
          width: 20px;
          height: 20px;

          @include setBackground('@/assets/img/message.png');
        }
      }
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
        background-color: #f8af2d;

        &.ok {
          background-color: #6cdd5b;
        }
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
  .teststr {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 300;
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
