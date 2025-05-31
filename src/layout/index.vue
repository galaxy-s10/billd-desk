<template>
  <div class="layout">
    <div
      class="system-bar"
      :class="{
        // 一开始以为只是mac控制win时，拖动win窗口会卡主，所以只判断了win的时候，自定义drag
        // 其实win控制mac时，拖动mac窗口也会卡主（我猜的），只是没有实际测试过win控制mac
        // 'no-drag': 1,
        drag: 1,
        // 'no-drag': platform !== ClientEnvEnum.macos,
        // drag: platform === ClientEnvEnum.macos,
      }"
    >
      <div
        v-if="useCustomBar"
        class="top-left"
      >
        <template v-if="platform === ClientEnvEnum.macos">
          <div class="left">
            <div
              class="ico close"
              @click="handleClose"
            ></div>
            <div
              class="ico min"
              @click="handleMin"
            ></div>
            <div class="ico max"></div>
          </div>
        </template>
        <div class="right">v{{ appStore.version }}</div>
      </div>
      <div
        v-else
        class="top-left"
      >
        <div class="right">v{{ appStore.version }}</div>
      </div>
      <div class="top-right">
        <div class="top-right-btn">
          <div
            class="msg"
            title="消息"
            @click="cacheStore.showGlobalMsg.show = true"
          >
            <div
              v-if="cacheStore.showGlobalMsg.red === true"
              class="red-dot"
            ></div>
            <div class="msg-ico"></div>
          </div>
          <div
            v-if="appStore.isMobile || appStore.isIPad"
            class="setting"
            @click="router.push({ name: routerName.setting })"
          >
            <div class="setting-ico"></div>
          </div>
          <div
            v-if="appStore.isMobile || appStore.isIPad"
            class="connect"
            @click="router.push({ name: routerName.remote })"
          >
            <div class="connect-ico"></div>
          </div>
          <template v-if="platform === ClientEnvEnum.windows">
            <div class="fgx"></div>
            <div
              class="system-ico min"
              :class="{
                hover: minHover,
              }"
              @click="handleMin"
              @mousemove="minHover = true"
              @mouseleave="minHover = false"
            >
              <div class="heng"></div>
            </div>
            <div
              class="system-ico close"
              :class="{
                hover: closeHover,
              }"
              @click="handleClose"
              @mousemove="closeHover = true"
              @mouseleave="closeHover = false"
            >
              <div class="cross"></div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="!appStore.isMobile || appStore.isIPad"
      class="sidebar"
    >
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
          class="item"
          :class="{ active: route.name === routerName.screenWall }"
          @click="router.push({ name: routerName.screenWall })"
        >
          屏幕墙
        </div>
        <div
          v-if="!ipcRenderer && cacheStore.deskUserUuid === 'superhss'"
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
    <div
      class="view"
      :class="{
        mobile: appStore.isMobile && !appStore.isIPad,
      }"
    >
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
      v-if="cacheStore.showGlobalMsg.show"
      @close="cacheStore.showGlobalMsg.show = false"
    ></GlobalMsgModal>

    <SelectWebStream
      v-if="showSelectWebStream"
      @close="handleCloseSelectWebStream"
      @confirm="handleConfirmSelectWebStream"
    ></SelectWebStream>

    <FixedPopupWindow v-if="!ipcRenderer && rtcMap.size"></FixedPopupWindow>
  </div>
</template>

<script lang="ts" setup>
import { getRandomString, windowReload } from 'billd-utils';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchDeskUserCreate, fetchDeskUserLogin } from '@/api/deskUser';
import {
  fetchDeskVersionByVersion,
  fetchDeskVersionCheck,
  fetchDeskVersionLatest,
} from '@/api/deskVersion';
import { fetchGlobalMsgGlobal } from '@/api/globalMsg';
import { fetchInviteCreate } from '@/api/inivte';
import { fetchLoginRecordCreate } from '@/api/loginRecord';
import { fetchScreenWallSetImg } from '@/api/screenWall';
import { fetchWsSendMsg } from '@/api/ws';
import { NODE_ENV } from '@/constant';
import { useIpcRendererSend } from '@/hooks/use-ipcRendererSend';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { useTip } from '@/hooks/use-tip';
import { useTodayLock } from '@/hooks/use-today-lock';
import { useWebsocket } from '@/hooks/use-websocket';
import { useWebRtcRemoteDesk } from '@/hooks/webrtc/remoteDesk';
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
import {
  WsBilldDeskBehaviorType,
  WsChangeAudioContentHintType,
  WsChangeMaxBitrateType,
  WsChangeMaxFramerateType,
  WsChangeResolutionRatioType,
  WsChangeVideoContentHintType,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
  WsStartRTCResult,
  WsStartRemoteResult,
} from '@/types/websocket';
import {
  decodeArrayBuffer,
  getClientEnv,
  handleConstraints,
  handleSystem,
  ipcRenderer,
  ipcRendererInvoke,
  ipcRendererOn,
  ipcRendererSend,
  mergeArrayBuffers,
  setAudioTrackContentHints,
  setVideoTrackContentHints,
  streamToBase64,
} from '@/utils';
import { clearPreview, getPreview, setPreview } from '@/utils/localStorage/app';
import { memory } from '@/utils/memory';
import { WebRTCClass } from '@/utils/network/webRTC';
import FixedPopupWindow from '@/views/fixedPopupWindow/index.vue';
import SelectWebStream from '@/views/remote/selectWebStream.vue';

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();
const cacheStore = usePiniaCacheStore();

const {
  handleOpenDevTools,
  handleSetAlwaysOnTop,
  handleSetPowerBootStatus,
  handleGetScreenStream,
  handleRtcBilldDeskBehavior,
} = useIpcRendererSend();

const { ws, socketId, initWs, connectStatus, send } = useWebsocket();
const {
  handleTurnserver,
  dataChannelArr,
  rtcMap,
  removeRtc,
  updateWebRtcRemoteDeskConfig,
  webRtcRemoteDesk,
} = useWebRtcRemoteDesk();

const {
  maxBitrate,
  maxFramerate,
  resolutionRatio,
  audioContentHint,
  videoContentHint,
} = useRTCParams();

const currentMaxBitrate = ref(maxBitrate.value[2].value);
const currentMaxFramerate = ref(maxFramerate.value[4].value);
const currentResolutionRatio = ref(resolutionRatio.value[3].value);
const currentVideoContentHint = ref(videoContentHint.value[3].value);
const currentAudioContentHint = ref(audioContentHint.value[0].value);
const dataChannelOnMsg = ref<string[]>([]);

const remoteStream = ref<MediaStream[]>([]);
const screenInfo = ref<
  {
    id: string;
    streamid: string;
    bounds: {
      width: number;
      height: number;
      x: number;
      y: number;
    };
    scaleFactor: number;
  }[]
>([]);

const electronStreamInfo = ref();

const useCustomBar = ref(true);
const clickNum = ref(1);
const teststr = ref('');
const roomId = ref('');
const platform = ref<ClientEnvEnum>();
const loopGetThumbnailTimer = ref();
const loopfetchScreenWallSetImgTimer = ref();
let timer;
const file: Record<number, any[]> = {};

const showSelectWebStream = ref<{
  sender: string;
  remoteDeskUserUuid: string;
  deskUserUuid: string;
}>();

const minHover = ref(false);
const closeHover = ref(false);

const fixedPopupWindowWidth = 420;
const fixedPopupWindowHeight = 200;

async function handleGlobalMsgMyList() {
  const res = await fetchGlobalMsgGlobal({
    orderName: 'priority',
    orderBy: 'desc',
    show: SwitchEnum.yes,
  });
  if (res.code === 200) {
    const newstr = JSON.stringify(res.data);
    const oldstr = JSON.stringify(cacheStore.showGlobalMsg.list);
    if (newstr !== oldstr) {
      cacheStore.showGlobalMsg.list = [];
      cacheStore.showGlobalMsg.red = true;
      res.data.forEach((item) => {
        cacheStore.showGlobalMsg.list.push(item);
        cacheStore.showGlobalMsg.show = true;
      });
    } else {
      let red = false;
      res.data.forEach((item) => {
        if (item.type === GlobalMsgTypeEnum.alwaysRedMsg) {
          red = true;
        }
      });
      cacheStore.showGlobalMsg.red = red;
    }
  }
}

function handleCloseSelectWebStream() {
  fetchWsSendMsg({
    msgType: WsMsgTypeEnum.message,
    sender: socketId.value,
    receiver: showSelectWebStream.value?.sender,
    data: {
      type: 'userCancelRemote',
      code: 0,
      msg: `设备${cacheStore.deskUserUuid}取消远程`,
    },
  });
  showSelectWebStream.value = undefined;
  window.$message.info(`取消远程`);
}

async function handleConfirmSelectWebStream(data: {
  currentStream: 'userMedia' | 'displayMedia';
}) {
  if (showSelectWebStream.value) {
    const clone = { ...showSelectWebStream.value };
    showSelectWebStream.value = undefined;
    await handleDesktopStreamByWeb(data.currentStream);
    if (clone) {
      if (remoteStream.value.length) {
        handleRTC({
          receiver: clone.sender,
          deskUserUuid: clone.remoteDeskUserUuid,
          remoteDeskUserUuid: clone.deskUserUuid,
        });
      } else {
        fetchWsSendMsg({
          msgType: WsMsgTypeEnum.message,
          sender: socketId.value,
          receiver: clone.sender,
          data: {
            type: 'userCancelRemote',
            code: 0,
            msg: `设备${cacheStore.deskUserUuid}取消远程（视频流）`,
          },
        });
        useTip({
          content: '取消远程',
          hiddenCancel: true,
          hiddenClose: true,
        });
      }
    }
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
  loopGetThumbnailTimer.value = setInterval(async () => {
    if (appStore.deskVersionInfo?.disable === 1) {
      clearInterval(loopGetThumbnailTimer.value);
      return;
    }
    if (getPreview()) {
      return;
    }
    const stream = remoteStream.value[0];
    if (!stream) {
      return;
    }
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
    setPreview(res1.base64);
  }, 1000 * 3);

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
        data: getPreview(),
      });
      clearPreview();
    } catch (error) {
      console.error(error);
    }
  }, 1000 * 5);
}

ipcRendererOn(
  IPC_EVENT.response_powerMonitorSuspend,
  responsePowerMonitorSuspend
);

ipcRendererOn(
  IPC_EVENT.response_powerMonitorResume,
  responsePowerMonitorResume
);

ipcRendererOn(
  IPC_EVENT.response_powerMonitorLockScreen,
  responsePowerMonitorLockScreen
);

ipcRendererOn(
  IPC_EVENT.response_powerMonitorUnLockScreen,
  responsePowerMonitorUnLockScreen
);

function responsePowerMonitorSuspend(_event, data: IIpcRendererData) {
  console.log('response_powerMonitorSuspend', data);
  console.log('当系统挂起时触发。', new Date().toLocaleString('zh-CN'));
}

function responsePowerMonitorResume(_event, data: IIpcRendererData) {
  console.log('response_powerMonitorResume', data);
  console.log('当系统恢复时触发。', new Date().toLocaleString('zh-CN'));
}

function responsePowerMonitorLockScreen(_event, data: IIpcRendererData) {
  console.log('responsePowerMonitorLockScreen', data);
  console.log('当系统即将锁定屏幕时触发。', new Date().toLocaleString('zh-CN'));
  appStore.refreshStream = +new Date();
}

function responsePowerMonitorUnLockScreen(_event, data: IIpcRendererData) {
  console.log('responsePowerMonitorUnLockScreen', data);
  console.log('当系统屏幕解锁，立即触发。', new Date().toLocaleString('zh-CN'));
}

ipcRendererOn(IPC_EVENT.response_open_url, (_event, data: IIpcRendererData) => {
  console.log('response_open_url', data);
  if (data.data.url) {
    console.log(data.data.url);
    const urlstr = data.data.url.split('//')[1] as string;
    const type = urlstr.split('?')[0];
    const params = urlstr.split('?')[1];
    console.log('urlstr', urlstr);
    console.log('type', type);
    console.log('params', params);
    if (type === 'remote' || type === 'remote/') {
      const obj = new URLSearchParams(params);
      const inviteId = obj.get('id');
      router.push({
        name: routerName.remote,
        query: {
          inviteId,
        },
      });
    }
  }
});

function initCache() {
  try {
    if (!['exit', 'mini'].includes(cacheStore.closeMainWindow)) {
      cacheStore.closeMainWindow = 'mini';
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleInitStream() {
  if (remoteStream.value.length) {
    return remoteStream.value;
  }
  const res = await handleGetScreenStream({
    windowId: WINDOW_ID_MAP.remote,
  });
  console.log('reshandleGetScreenStream', res);
  if (res.code !== 0) {
    window.$message.error(res.msg || '');
    return;
  }
  electronStreamInfo.value = res.data.info;
  const queue: any[] = [];
  res.data.info.forEach((item) => {
    queue.push(handleDesktopStreamByElectron(item));
  });
  await Promise.all(queue);
}

onMounted(async () => {
  if (!ipcRenderer) {
    useCustomBar.value = false;
  }
  if (ipcRenderer) {
    // handleOpenDevTools({ windowId: WINDOW_ID_MAP.remote });
    // setInterval(async () => {
    //   const res = await handleGetScreenStream({
    //     windowId: WINDOW_ID_MAP.remote,
    //   });
    //   console.log('reshandleGetScreenStream', JSON.stringify(res.data.info));
    //   setTimeout(() => {
    //     remoteStream.value.forEach((stream) => {
    //       console.log('视频流是否活跃', stream.active);
    //       if (stream.active === false) {
    //         appStore.refreshStream = +new Date();
    //         // windowReload();
    //       }
    //     });
    //   }, 1000);
    // }, 2000);
    // window.$notification.warning({
    //   content: JSON.stringify(res),
    // });
    // const res = await ipcRendererInvoke({
    //   windowId: WINDOW_ID_MAP.remote,
    //   channel: IPC_EVENT.windowManager,
    //   requestId: getRandomString(8),
    //   data: {},
    // });
    // const res = await ipcRendererInvoke({
    //   windowId: WINDOW_ID_MAP.remote,
    //   channel: IPC_EVENT.debugInfo,
    //   requestId: getRandomString(8),
    //   data: {},
    // });
    // window.$notification.warning({
    //   content: JSON.stringify(res),
    // });
    handleInitStream();
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
      data: { windowId: WINDOW_ID_MAP.remote },
    });
    if (res1?.code === 0) {
      appStore.arch = res1.data.arch;
    }
    const res2 = await ipcRendererInvoke({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.getSystemInfo,
      requestId: getRandomString(8),
      data: { windowId: WINDOW_ID_MAP.remote },
    });
    if (res2?.code === 0) {
      appStore.systemInfo = res2.data;
      console.log(handleSystem(appStore.systemInfo), 'dddd');
    }
  }
  initCache();
  handleTurnserver();
  handleGlobalMsgMyList();
  await handleVersion();
  handleInviteInfo();
  loopGetThumbnail();

  platform.value = getClientEnv();

  handleSetAlwaysOnTop({
    windowId: WINDOW_ID_MAP.remote,
    flag: cacheStore.isAlwaysOnTop,
  });
  await initDeskUser();
  handleLoginRecord();
  initWs({
    roomId: cacheStore.deskUserUuid,
    deskUserUuid: cacheStore.deskUserUuid,
    errorCallBack(err) {
      window.$notification.warning({
        content: err.noSupportWs,
        duration: 5000,
      });
    },
  });
});

function handleLoginRecord() {
  try {
    const flag = useTodayLock();
    if (flag) {
      return;
    }
    const ua = appStore.systemInfo;
    if (ua) {
      ua.cpus = ua.cpus?.[0]?.['model'];
    }
    const system = handleSystem(appStore.systemInfo);
    let model = '';
    if (system.indexOf('windows')) {
      model = 'windows-pc';
    } else if (system.indexOf('macos')) {
      model = 'macos-pc';
    } else if (system.indexOf('linux')) {
      model = 'linux-pc';
    } else {
      model = `${system[0]}-pc`;
    }
    fetchLoginRecordCreate({
      uuid: cacheStore.deskUserUuid,
      user_agent: JSON.stringify(ua),
      system,
      brand: ipcRenderer ? model : 'web',
      model: ipcRenderer ? model : 'web',
    });
  } catch (error) {
    console.error('handleLoginRecord失败');
    console.log(error);
  }
}

async function handleDesktopStreamByElectron(item) {
  const chromeMediaSourceId = item.id;
  try {
    if (remoteStream.value.length) {
      return remoteStream.value;
    }
    // https://github.com/electron/electron/issues/16031
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        // @ts-ignore
        mandatory: {
          // https://www.electronjs.org/zh/docs/latest/api/structures/desktop-capturer-source
          chromeMediaSource: 'desktop',
          chromeMediaSourceId,
        },
      },
    });

    screenInfo.value.push({
      streamid: stream.id,
      id: chromeMediaSourceId,
      bounds: item.bounds,
      scaleFactor: item.scaleFactor || 1,
    });
    remoteStream.value.push(stream);
  } catch (error) {
    console.error('handleDesktopStream失败');
    console.log(error);
  }
}

async function handleDesktopStreamByWeb(
  currentStream: 'userMedia' | 'displayMedia'
) {
  try {
    if (remoteStream.value.length) {
      return remoteStream.value;
    }
    let stream: MediaStream;
    if (currentStream === 'userMedia') {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    } else {
      stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: {
          // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_shared_screen_tracks
          // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/displaySurface
          displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
        },
      });
    }
    const setting = stream.getVideoTracks()[0].getSettings();
    screenInfo.value.push({
      streamid: stream.id,
      id: stream.id,
      bounds: {
        width: setting.width || 300,
        height: setting.height || 300,
        x: 0,
        y: 0,
      },
      scaleFactor: 1,
    });
    remoteStream.value.push(stream);
  } catch (error) {
    window.$message.warning('web获取stream失败');
    console.log(error);
  }
}

async function initDeskUser() {
  if (!cacheStore.deskUserUuid || !cacheStore.deskUserPassword) {
    const res = await fetchDeskUserCreate();
    if (res.code === 200) {
      cacheStore.deskUserUuid = res.data.uuid!;
      cacheStore.deskUserPassword = res.data.password!;
      // originalPassword.value = res.data.password!;
      // roomId.value = cacheStore.deskUserUuid;
    }
  } else {
    const res = await fetchDeskUserLogin({
      uuid: cacheStore.deskUserUuid,
      password: cacheStore.deskUserPassword,
    });
    if (res.code === 200) {
      // originalPassword.value = cacheStore.deskUserPassword;
      roomId.value = cacheStore.deskUserUuid;
    }
  }
}

watch(
  () => dataChannelArr.value,
  (val) => {
    val.forEach((v) => {
      if (dataChannelOnMsg.value.includes(v)) {
        return;
      }
      dataChannelOnMsg.value.push(v);
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => connectStatus.value,
  (newval) => {
    if (newval === WsConnectStatusEnum.connect) {
      handleWsMsg();
    }
  },
  { immediate: true }
);

watch(
  () => appStore.refreshStream,
  () => {
    // remoteStream.value = [];
    // handleInitStream();
    // const receiverArr: any[] = [];
    // rtcMap.value.forEach((item) => {
    //   receiverArr.push(item.receiver);
    //   handleDel({
    //     receiver: item.receiver,
    //     deskUserUuid: item.deskUserUuid,
    //     remoteDeskUserUuid: item.remoteDeskUserUuid,
    //   });
    // });
    // rtcMap.value.clear();
    // remoteStream.value = [];
    // receiverArr.forEach((v) => {
    //   fetchWsSendMsg({
    //     msgType: WsMsgTypeEnum.message,
    //     sender: socketId.value,
    //     receiver: v,
    //     data: {
    //       type: 'reconnect',
    //       code: 0,
    //       msg: '',
    //     },
    //   });
    // });
  }
);

function handleWsMsg() {
  ws.value?.on(
    WsMsgTypeEnum.startRtcResult,
    async (data: WsStartRTCResult['data']) => {
      console.log('收到startRtcResult', data);
      if (data.code !== 0) {
        useTip({
          content: data.msg,
          hiddenCancel: true,
          hiddenClose: true,
        });
      } else {
        if (data.data) {
          currentMaxFramerate.value = data.data.maxFramerate;
          currentResolutionRatio.value = data.data.resolutionRatio;
          currentMaxBitrate.value = data.data.maxBitrate;
          currentAudioContentHint.value = data.data.audioContentHint;
          currentVideoContentHint.value = data.data.videoContentHint;
          if (!ipcRenderer) {
            showSelectWebStream.value = {
              sender: data.data.sender,
              remoteDeskUserUuid: data.data.remoteDeskUserUuid,
              deskUserUuid: data.data.deskUserUuid,
            };
          } else {
            await handleInitStream();
            handleRTC({
              receiver: data.data?.sender,
              deskUserUuid: data.data.remoteDeskUserUuid,
              remoteDeskUserUuid: data.data.deskUserUuid,
            });
          }
        } else {
          window.$message.error('data.data为空');
          console.error('data.data为空');
        }
      }
    }
  );
  ws.value?.on(
    WsMsgTypeEnum.startRemoteResult,
    (data: WsStartRemoteResult['data']) => {
      console.log('收到startRemoteResult', data);
      if (data.code !== 0) {
        useTip({
          content: data.msg,
          hiddenCancel: true,
          hiddenClose: true,
        });
      }
    }
  );
  ws.value?.on(WsMsgTypeEnum.message, (data) => {
    console.log('收到message', data);
    if (data.data?.type === 'verifyTurnserver') {
      const urls = memory.customTurnserver.open
        ? memory.customTurnserver.urls
        : memory.turnserver.urls;

      fetchWsSendMsg({
        msgType: WsMsgTypeEnum.message,
        sender: socketId.value,
        receiver: data.sender,
        data:
          urls === data.data.turnserverUrls
            ? {
                type: 'verifyTurnserverResult',
                code: 0,
                msg: '验证成功',
              }
            : {
                type: 'verifyTurnserverResult',
                code: 1,
                msg: '验证失败',
              },
      });
    }
  });
  ws.value?.on(WsMsgTypeEnum.leaveRemoteResult, (data) => {
    console.log('收到leaveRemoteResult', data);
    dataChannelOnMsg.value = dataChannelOnMsg.value.filter(
      (v) => v !== data.remoteDeskUserUuid
    );
    window.$notification.warning({
      content: `${data.remoteDeskUserUuid}断开控制`,
      duration: 3000,
    });
    removeRtc(data.remoteDeskUserUuid);
  });
}

async function handleRTC({
  receiver,
  deskUserUuid,
  remoteDeskUserUuid,
}: {
  receiver: string;
  deskUserUuid: string;
  remoteDeskUserUuid: string;
}) {
  if (!remoteStream.value) return;
  try {
    remoteStream.value.forEach((stream) => {
      setVideoTrackContentHints(stream, currentVideoContentHint.value as any);
    });
    remoteStream.value.forEach((stream) => {
      setAudioTrackContentHints(stream, currentAudioContentHint.value as any);
    });
    const queue: any[] = [];
    remoteStream.value.forEach((stream) => {
      queue.push(
        handleConstraints({
          frameRate: currentMaxFramerate.value,
          height: currentResolutionRatio.value,
          stream,
        })
      );
    });
    await Promise.all(queue);
    console.log('updateWebRtcRemoteDeskConfig', remoteStream.value);
    updateWebRtcRemoteDeskConfig({
      roomId: roomId.value,
      deskUserUuid,
      remoteDeskUserUuid,
      anchorStream: remoteStream.value,
    });
    webRtcRemoteDesk.newWebRtc({
      sender: socketId.value || '',
      receiver,
      deskUserUuid,
      remoteDeskUserUuid,
      channelOnmessage: handleChannelOnmessage,
    });
    webRtcRemoteDesk.sendOffer({
      sender: socketId.value || '',
      receiver,
    });
  } catch (error) {
    console.log(error);
  }
}

function handleChannelOnmessage(data: {
  event: MessageEvent;
  instance: WebRTCClass;
}) {
  const { event, instance } = data;
  if (typeof event.data === 'string') {
    // console.log(event, event.data);
    const jsondata: {
      msgType: WsMsgTypeEnum;
      requestId: string;
      data: any;
    } = JSON.parse(event.data);
    console.log('jsondata', jsondata);
    const { msgType } = jsondata;
    if (msgType === WsMsgTypeEnum.fileTransfer) {
      const res = file[jsondata.data.key]
        ?.sort((a, b) => {
          return a.index - b.index;
        })
        .map((v) => v.buffer);
      if (!res) return;
      const mergeres = mergeArrayBuffers(res);
      if (mergeres) {
        ipcRendererInvoke({
          windowId: WINDOW_ID_MAP.remote,
          channel: IPC_EVENT.writeFile,
          requestId: getRandomString(8),
          data: {
            fileName: jsondata.data.name,
            fileData: mergeres,
          },
        });
      }
    } else if (msgType === WsMsgTypeEnum.changeMaxBitrate) {
      const { data }: { data: WsChangeMaxBitrateType['data'] } = jsondata;
      currentMaxBitrate.value = data.val;
      instance.handleMaxBitrate(currentMaxBitrate.value);
    } else if (msgType === WsMsgTypeEnum.changeMaxFramerate) {
      const { data }: { data: WsChangeMaxFramerateType['data'] } = jsondata;
      console.log(currentResolutionRatio.value, data.val);
      remoteStream.value.forEach((stream) => {
        currentMaxFramerate.value = data.val;
        instance.handleConstraints({
          frameRate: data.val,
          height: currentResolutionRatio.value,
        });
        handleConstraints({
          stream,
          frameRate: data.val,
          height: currentResolutionRatio.value,
        });
      });
    } else if (msgType === WsMsgTypeEnum.changeResolutionRatio) {
      const { data }: { data: WsChangeResolutionRatioType['data'] } = jsondata;
      remoteStream.value.forEach((stream) => {
        currentResolutionRatio.value = data.val;
        instance.handleConstraints({
          frameRate: currentMaxFramerate.value,
          height: data.val,
        });
        handleConstraints({
          stream,
          frameRate: currentMaxFramerate.value,
          height: data.val,
        });
      });
    } else if (msgType === WsMsgTypeEnum.changeVideoContentHint) {
      const { data }: { data: WsChangeVideoContentHintType['data'] } = jsondata;
      remoteStream.value.forEach(() => {
        currentVideoContentHint.value = data.val;
        // @ts-ignore
        instance.handleVideoTrackContentHint(data.val);
      });
    } else if (msgType === WsMsgTypeEnum.changeAudioContentHint) {
      const { data }: { data: WsChangeAudioContentHintType['data'] } = jsondata;
      remoteStream.value.forEach(() => {
        currentAudioContentHint.value = data.val;
        // @ts-ignore
        instance.handleAudioTrackContentHint(data.val);
      });
    } else if (msgType === WsMsgTypeEnum.billdDeskBehavior) {
      const { data }: { data: WsBilldDeskBehaviorType['data'] } = jsondata;
      handleRtcBilldDeskBehavior(WINDOW_ID_MAP.remote, data);
    } else if (msgType === WsMsgTypeEnum.screenInfo) {
      instance.dataChannelSend({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.screenInfoResult,
        data: {
          res: screenInfo.value,
        },
      });
    } else if (msgType === WsMsgTypeEnum.videoLoadedmetadataResult) {
      rtcMap.value.forEach((rtc) => {
        if (rtc.receiver === instance.receiver) {
          rtc.videoLoadedmetadata = true;
        }
      });
    }
  } else {
    const res = decodeArrayBuffer(event.data);
    const { decodedString } = res;
    const json = JSON.parse(decodedString);
    if (!file[json.key]) {
      file[json.key] = [res];
    } else {
      file[json.key].push(res);
    }
  }
}

watch(
  () => rtcMap.value,
  async (newval) => {
    console.log('rtcMap', newval);
    const res: any[] = [];
    rtcMap.value.forEach((item) => {
      res.push({
        receiver: item.receiver,
        deskUserUuid: item.deskUserUuid,
        remoteDeskUserUuid: item.remoteDeskUserUuid,
        videoLoadedmetadata: item.videoLoadedmetadata,
      });
    });
    if (res.length) {
      if (ipcRenderer) {
        const allWindowMap = await ipcRendererInvoke({
          windowId: WINDOW_ID_MAP.remote,
          channel: IPC_EVENT.getAllWindowMap,
          requestId: getRandomString(8),
          data: { windowId: WINDOW_ID_MAP.remote },
        });
        if (!allWindowMap.data?.includes(WINDOW_ID_MAP.fixedPopupWindow)) {
          const res = await ipcRendererInvoke({
            windowId: WINDOW_ID_MAP.remote,
            channel: IPC_EVENT.getPrimaryDisplay,
            requestId: getRandomString(8),
            data: { windowId: WINDOW_ID_MAP.remote },
          });
          if (res.data) {
            const primaryDisplayWidth = res.data.width;
            const primaryDisplayHeight = res.data.height;
            const primaryDisplayY = res.data.y;
            const windowX = primaryDisplayWidth - fixedPopupWindowWidth;
            const windowY =
              primaryDisplayHeight + primaryDisplayY - fixedPopupWindowHeight;
            ipcRendererSend({
              windowId: WINDOW_ID_MAP.remote,
              channel: IPC_EVENT.createWindow,
              requestId: getRandomString(8),
              data: {
                windowId: WINDOW_ID_MAP.fixedPopupWindow,
                movable: false,
                alwaysOnTop: true,
                roundedCorners: false,
                transparent: true,
                width: fixedPopupWindowWidth,
                height: fixedPopupWindowHeight,
                x: windowX,
                y: windowY,
                minWidth: 0,
                minHeight: 0,
                route: routerName.fixedPopupWindow,
                query: {},
                useWorkAreaSize: false,
                frame: false,
                resizable: false,
              },
            });
          }
        }
        ipcRendererSend({
          windowId: WINDOW_ID_MAP.remote,
          channel: IPC_EVENT.message,
          requestId: getRandomString(8),
          data: {
            windowId: WINDOW_ID_MAP.fixedPopupWindow,
            type: 'response_rtcMap',
            data: res,
          },
        });
      }
    } else {
      ipcRendererSend({
        windowId: WINDOW_ID_MAP.remote,
        channel: IPC_EVENT.closeWindow,
        requestId: getRandomString(8),
        data: { windowId: WINDOW_ID_MAP.fixedPopupWindow },
      });
    }
  },
  { immediate: true, deep: true }
);

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

ipcRendererOn(IPC_EVENT.message, async (_event, data: IIpcRendererData) => {
  console.log('message', data);
  if (data.data?.type === 'request_rtcMap') {
    const res: any[] = [];
    rtcMap.value.forEach((item) => {
      res.push({
        receiver: item.receiver,
        deskUserUuid: item.deskUserUuid,
        remoteDeskUserUuid: item.remoteDeskUserUuid,
        videoLoadedmetadata: item.videoLoadedmetadata,
      });
    });
    ipcRendererSend({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.message,
      requestId: getRandomString(8),
      data: {
        toWindowId: data.data.fromWindowId,
        type: 'response_rtcMap',
        data: res,
      },
    });
  } else if (data.data?.type === 'request_del_rtc') {
    handleDel(data.data.data);
  } else if (data.data?.type === 'request_del_all_rtc') {
    rtcMap.value.forEach((item) => {
      handleDel({
        receiver: item.receiver,
        deskUserUuid: item.deskUserUuid,
        remoteDeskUserUuid: item.remoteDeskUserUuid,
      });
    });
    rtcMap.value.clear();
  } else if (data.data?.type === 'request_fixedPopupWindow_closeFold') {
    ipcRendererSend({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.setWindowBounds,
      requestId: getRandomString(8),
      data: {
        windowId: data.data.fromWindowId,
        width: data.data.width,
        height: data.data.height,
      },
    });
    const res = await ipcRendererInvoke({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.getPrimaryDisplay,
      requestId: getRandomString(8),
      data: { windowId: WINDOW_ID_MAP.remote },
    });
    if (res.data) {
      const primaryDisplayWidth = res.data.width;
      const primaryDisplayHeight = res.data.height;
      const primaryDisplayY = res.data.y;
      const windowX = primaryDisplayWidth - data.data.width;
      const windowY =
        primaryDisplayHeight + primaryDisplayY - fixedPopupWindowHeight;
      ipcRendererInvoke({
        windowId: WINDOW_ID_MAP.remote,
        channel: IPC_EVENT.setWindowPosition,
        requestId: getRandomString(8),
        data: {
          windowId: data.data.fromWindowId,
          x: windowX,
          y: windowY,
        },
      });
    }
  } else if (data.data?.type === 'request_fixedPopupWindow_openFold') {
    ipcRendererSend({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.setWindowBounds,
      requestId: getRandomString(8),
      data: {
        windowId: data.data.fromWindowId,
        width: data.data.width,
        height: data.data.height,
      },
    });
    const res = await ipcRendererInvoke({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.getPrimaryDisplay,
      requestId: getRandomString(8),
      data: { windowId: WINDOW_ID_MAP.remote },
    });
    if (res.data) {
      const primaryDisplayWidth = res.data.width;
      const primaryDisplayHeight = res.data.height;
      const primaryDisplayY = res.data.y;
      const windowX = primaryDisplayWidth - fixedPopupWindowWidth;
      const windowY =
        primaryDisplayHeight + primaryDisplayY - fixedPopupWindowHeight;
      ipcRendererInvoke({
        windowId: WINDOW_ID_MAP.remote,
        channel: IPC_EVENT.setWindowPosition,
        requestId: getRandomString(8),
        data: {
          windowId: data.data.fromWindowId,
          x: windowX,
          y: windowY,
        },
      });
    }
  }
});

function handleDel(data) {
  console.log(data, 'handleDel');
  const { remoteDeskUserUuid, deskUserUuid } = data;
  send({
    requestId: getRandomString(8),
    msgType: WsMsgTypeEnum.breakRemote,
    data: {
      receiver: data.receiver,
      remoteDeskUserUuid: deskUserUuid,
    },
  });

  removeRtc(remoteDeskUserUuid);
}

ipcRendererOn(
  IPC_EVENT.response_closeWindowed,
  (_event, data: IIpcRendererData) => {
    console.log('response_closeWindowed', data);
  }
);

ipcRendererOn(
  IPC_EVENT.response_open_about,
  async (_event, data: IIpcRendererData) => {
    console.log('response_open_about', data);
    const res = await ipcRendererInvoke({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.getAllWindowMap,
      requestId: getRandomString(8),
      data: { windowId: WINDOW_ID_MAP.remote },
    });
    if (res.data?.includes(WINDOW_ID_MAP.about)) {
      handleSetAlwaysOnTop({
        windowId: WINDOW_ID_MAP.about,
        flag: true,
      });
      return;
    }
    ipcRendererSend({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.createWindow,
      requestId: getRandomString(8),
      data: {
        windowId: WINDOW_ID_MAP.about,
        movable: true,
        alwaysOnTop: false,
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
  closeHover.value = false;
  if (cacheStore.closeMainWindow === 'exit') {
    ipcRendererSend({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.closeAllWindow,
      requestId: getRandomString(8),
      data: { windowId: WINDOW_ID_MAP.remote },
    });
  } else {
    ipcRendererInvoke({
      windowId: WINDOW_ID_MAP.remote,
      channel: IPC_EVENT.windowHide,
      requestId: getRandomString(8),
      data: {
        windowId: WINDOW_ID_MAP.remote,
      },
    });
  }
}

function handleMin() {
  minHover.value = false;
  ipcRendererSend({
    windowId: WINDOW_ID_MAP.remote,
    channel: IPC_EVENT.windowMinimize,
    requestId: getRandomString(8),
    data: { windowId: WINDOW_ID_MAP.remote },
  });
}
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
      padding: 15px 10px 0 15px;
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

          &:hover {
            &.close {
              @include setBackground('@/assets/img/system-close.png');
            }
            &.min {
              @include setBackground('@/assets/img/system-min.png');
            }
          }
          &.close {
            background-color: #e86c62;
          }
          &.min {
            background-color: #f0b754;
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

      .top-right-btn {
        position: absolute;
        top: 50%;
        right: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transform: translateY(-50%);

        -webkit-app-region: no-drag;
        .setting {
          margin-left: 12px;
          width: 20px;
          height: 20px;

          .setting-ico {
            width: 20px;
            height: 20px;
            cursor: pointer;

            @include setBackground('@/assets/img/setting.png');
          }
        }
        .connect {
          margin-left: 12px;
          width: 20px;
          height: 20px;

          .connect-ico {
            width: 20px;
            height: 20px;
            cursor: pointer;

            @include setBackground('@/assets/img/connect.png');
          }
        }
        .msg {
          position: relative;
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
            cursor: pointer;

            @include setBackground('@/assets/img/message.png');
          }
        }
        .fgx {
          margin: 0 10px;
          height: 20px;
          width: 2px;
          background-color: #eee;
        }
        .system-ico {
          width: 32px;
          height: 26px;
          border-radius: 4px;
          cursor: pointer;
          &:not(:last-child) {
            margin-right: 4px;
          }

          &.hover {
            background-color: #eee;
            &.close {
              background-color: #e66d65;
              .cross {
                @include cross(white, 1px);
              }
            }
          }
          &.min {
            display: flex;
            align-items: center;
            justify-content: center;
            .heng {
              width: 50%;
              height: 1px;
              border-radius: 4px;
              background-color: #181818;
            }
          }
          &.close {
            display: flex;
            align-items: center;
            justify-content: center;
            .cross {
              width: 14px;
              height: 14px;
              @include cross(#181818, 1px);
            }
          }
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

      @include setBackground('@/assets/img/logo.png');
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
    &.mobile {
      width: 100vw;
    }
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
    bottom: 60px;
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
