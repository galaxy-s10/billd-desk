<template>
  <div class="desk-wrap">
    <div>
      <!-- <div v-if="NODE_ENV === 'development'"> -->
      <div>version：-</div>
      <div>wss：{{ WEBSOCKET_URL }}</div>
      <div>axios：{{ AXIOS_BASEURL }}</div>
      <div>
        github：<span
          class="link"
          @click="openToTarget(PROJECT_GITHUB)"
        >
          {{ PROJECT_GITHUB }}
        </span>
      </div>
      <div>
        客户端下载：<span
          class="link"
          @click="openToTarget(DOWNLOAD_DESK_URL)"
        >
          {{ DOWNLOAD_DESK_URL }}
        </span>
      </div>
    </div>
    <div>
      <n-input-group>
        <n-input-group-label>roomId</n-input-group-label>
        <n-input
          v-model:value="roomId"
          :style="{ width: '200px' }"
          disabled
          placeholder=""
        />
        <n-button @click="handleCopy(roomId)">复制</n-button>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>socketId</n-input-group-label>
        <n-input
          v-model:value="mySocketId"
          :style="{ width: '200px' }"
          disabled
          placeholder=""
        />
        <n-button @click="handleCopy(mySocketId)">复制</n-button>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>主控uuid</n-input-group-label>
        <n-input
          v-model:value="cacheStore.deskUserUuid"
          :style="{ width: '200px' }"
          disabled
          placeholder=""
        />
        <n-button @click="handleCopy(cacheStore.deskUserUuid)">复制</n-button>
        <n-button @click="handleResetDeskuuid">重置</n-button>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>主控密码</n-input-group-label>
        <n-input
          v-model:value="cacheStore.deskUserPassword"
          :style="{ width: '200px' }"
          @blur="handleUpdatePassword"
          placeholder=""
        />
        <n-button @click="handleCopy(cacheStore.deskUserPassword)">
          复制
        </n-button>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>被控uuid</n-input-group-label>
        <n-input
          :style="{ width: '200px' }"
          placeholder=""
          v-model:value="cacheStore.remoteDeskUserUuid"
        />
        <n-button
          type="error"
          @click="handleClose"
          v-if="appStore.remoteDesk.size"
        >
          结束远程
        </n-button>
        <n-button
          v-else
          type="primary"
          @click="handleRemote"
        >
          开始远程
        </n-button>
      </n-input-group>
    </div>
    <div class="rtc-config">
      <div class="item">
        <div class="txt">码率：</div>
        <div class="down">
          <n-select
            size="small"
            v-model:value="currentMaxBitrate"
            :options="maxBitrate"
          />
        </div>
      </div>
      <div class="item">
        <div class="txt">帧率：</div>
        <div class="down">
          <n-select
            size="small"
            v-model:value="currentMaxFramerate"
            :options="maxFramerate"
          />
        </div>
      </div>
      <div class="item">
        <div class="txt">分辨率：</div>
        <div class="down big">
          <n-select
            size="small"
            v-model:value="currentResolutionRatio"
            :options="resolutionRatio"
          />
        </div>
      </div>
      <div class="item">
        <div class="txt">视频内容：</div>
        <div class="down">
          <n-select
            size="small"
            v-model:value="currentVideoContentHint"
            :options="videoContentHint"
          />
        </div>
      </div>
      <div class="item">
        <div class="txt">音频内容：</div>
        <div class="down big">
          <n-select
            size="small"
            v-model:value="currentAudioContentHint"
            :options="audioContentHint"
          />
        </div>
      </div>
    </div>
    <div class="rtc-config">
      <div class="item">
        <div class="txt">模式：</div>
        <n-radio
          :checked="isWatchMode === 'on'"
          value="on"
          name="basic-demo"
          @change="handleChange"
        >
          观看模式
        </n-radio>
        <n-radio
          :checked="isWatchMode === 'off'"
          value="off"
          name="basic-demo"
          @change="handleChange"
        >
          控制模式
        </n-radio>
      </div>
    </div>
    <div class="info">
      <span class="item">
        分辨率：<span v-if="videoSettings?.width">
          {{ videoSettings?.width || '-' }}x{{ videoSettings?.height || '-' }}
        </span>
        <span v-else>-</span>
      </span>
      <span class="item">
        帧率：{{ videoSettings?.frameRate?.toFixed(2) || '-' }}
      </span>
      <span class="item">延迟：{{ rtcRtt || '-' }}</span>
      <span class="item">丢包：{{ rtcLoss || '-' }}</span>
    </div>
    <div
      :class="{ wrap: 1, watch: isWatchMode === 'on' }"
      ref="remoteVideoRef"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @dblclick="handleDoublelclick"
      @contextmenu="handleContextmenu"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { Key } from '@nut-tree/shared';
import {
  copyToClipBoard,
  getRandomString,
  openToTarget,
  windowReload,
} from 'billd-utils';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import {
  fetchDeskUserCreate,
  fetchDeskUserLogin,
  fetchDeskUserUpdateByUuid,
} from '@/api/deskUser';
import {
  AXIOS_BASEURL,
  DOWNLOAD_DESK_URL,
  PROJECT_GITHUB,
  WEBSOCKET_URL,
} from '@/constant';
import { usePull } from '@/hooks/use-pull';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { closeUseTip, useTip } from '@/hooks/use-tip';
import { useWebRtcRemoteDesk } from '@/hooks/webrtc/remoteDesk';
import router, { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { useNetworkStore } from '@/store/network';
import {
  BilldDeskBehaviorEnum,
  WsBilldDeskBehaviorType,
  WsBilldDeskStartRemote,
  WsBilldDeskStartRemoteResult,
  WsChangeAudioContentHintType,
  WsChangeMaxBitrateType,
  WsChangeMaxFramerateType,
  WsChangeResolutionRatioType,
  WsChangeVideoContentHintType,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
} from '@/types/websocket';
import {
  createNullVideo,
  handlConstraints,
  setAudioTrackContentHints,
  setVideoTrackContentHints,
} from '@/utils';
import { WebRTCClass } from '@/utils/network/webRTC';

const roomId = ref('');
const appStore = useAppStore();
const networkStore = useNetworkStore();
const cacheStore = usePiniaCacheStore();
const { videoWrapRef, initPull, connectStatus, initRoomId } = usePull();
const {
  maxBitrate,
  maxFramerate,
  resolutionRatio,
  audioContentHint,
  videoContentHint,
} = useRTCParams();

const { updateWebRtcRemoteDeskConfig, webRtcRemoteDesk } =
  useWebRtcRemoteDesk();

const anchorStream = ref<MediaStream>();
const rtc = ref<WebRTCClass>();

const isWatchMode = ref<'on' | 'off'>('on');

const currentMaxBitrate = ref(maxBitrate.value[3].value);
const currentMaxFramerate = ref(maxFramerate.value[4].value);
const currentResolutionRatio = ref(resolutionRatio.value[3].value);
const currentVideoContentHint = ref(videoContentHint.value[3].value);
const currentAudioContentHint = ref(audioContentHint.value[0].value);
const loopBilldDeskUpdateUserTimer = ref();
const receiverId = ref('');
const remoteVideoRef = ref<HTMLDivElement>();
const isDown = ref(false);
const loopGetSettingsTimer = ref();
const videoSettings = ref<MediaTrackSettings>();
const originalPassword = ref('');

let clickTimer;
let isLongClick = false;
const mySocketId = computed(() => {
  return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '';
});

const rtcRtt = computed(() => {
  const arr: string[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${rtc.rtt}ms`);
  });
  return arr.join();
});

const rtcLoss = computed(() => {
  const arr: string[] = [];
  networkStore.rtcMap.forEach((rtc) => {
    arr.push(`${Number(rtc.loss.toFixed(2))}%`);
  });
  return arr.join();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  remoteVideoRef.value?.removeEventListener('wheel', handleMouseWheel);
  handleClose();
  clearInterval(loopBilldDeskUpdateUserTimer.value);
});

onMounted(() => {
  handleInit();
});

function handleInit() {
  handleLoopBilldDeskUpdateUserTimer();
  initUser();
  remoteVideoRef.value?.addEventListener('wheel', handleMouseWheel);
  videoWrapRef.value = remoteVideoRef.value;
  window.addEventListener('keydown', handleKeyDown);
  loopGetSettings();
}

function handleLoopBilldDeskUpdateUserTimer() {
  clearInterval(loopBilldDeskUpdateUserTimer.value);
  loopBilldDeskUpdateUserTimer.value = setInterval(() => {
    networkStore.wsMap.get(roomId.value)?.send<WsBilldDeskStartRemote['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.billdDeskUpdateUser,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        videoContentHint: currentVideoContentHint.value,
        audioContentHint: currentAudioContentHint.value,
        deskUserUuid: cacheStore.deskUserUuid,
        deskUserPassword: cacheStore.deskUserPassword,
        remoteDeskUserUuid: cacheStore.remoteDeskUserUuid,
      },
    });
  }, 1000 * 2);
}

watch(
  () => connectStatus.value,
  (newval) => {
    if (newval === WsConnectStatusEnum.connect) {
      handleWsMsg();
    }
  },
  {
    immediate: true,
  }
);

function handleWsMsg() {
  const ws = networkStore.wsMap.get(roomId.value);
  if (!ws?.socketIo) return;
  // 收到billdDeskStartRemoteResult
  ws.socketIo.on(
    WsMsgTypeEnum.billdDeskStartRemoteResult,
    async (data: WsBilldDeskStartRemoteResult['data']) => {
      console.log('收到billdDeskStartRemoteResult', data);
      if (data.code !== 0) {
        useTip({
          content: data.msg,
          hiddenCancel: true,
          hiddenClose: true,
        });
      } else {
        if (!data.data) return;
        if (data.data.receiver === mySocketId.value) {
          if (data.data.maxBitrate !== undefined) {
            currentMaxBitrate.value = data.data.maxBitrate;
          }
          if (data.data.maxFramerate !== undefined) {
            currentMaxFramerate.value = data.data.maxFramerate;
          }
          if (data.data.resolutionRatio !== undefined) {
            currentResolutionRatio.value = data.data.resolutionRatio;
          }
          if (data.data.videoContentHint !== undefined) {
            currentVideoContentHint.value = data.data.videoContentHint;
          }
          if (data.data.audioContentHint !== undefined) {
            currentAudioContentHint.value = data.data.audioContentHint;
          }
          const stream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: true,
          });
          anchorStream.value = stream;
          appStore.remoteDesk.set(data.data.sender, {
            sender: data.data.sender,
            isClose: false,
            maxBitrate: data.data.maxBitrate,
            maxFramerate: data.data.maxFramerate,
            resolutionRatio: data.data.resolutionRatio,
            videoContentHint: data.data.videoContentHint,
            audioContentHint: data.data.audioContentHint,
          });
          handleRTC(data.data.sender);
        } else {
          console.warn('不是和我远程');
        }
      }
    }
  );
}

async function handleRTC(receiver) {
  if (!anchorStream.value) return;
  try {
    await handlConstraints({
      frameRate: currentMaxFramerate.value,
      height: currentResolutionRatio.value,
      stream: anchorStream.value,
    });
    setVideoTrackContentHints(
      anchorStream.value,
      videoContentHint.value as any
    );
    setAudioTrackContentHints(
      anchorStream.value,
      audioContentHint.value as any
    );
    updateWebRtcRemoteDeskConfig({
      roomId: roomId.value,
      anchorStream: anchorStream.value,
    });
    rtc.value = webRtcRemoteDesk.newWebRtc({
      // 因为这里是收到offer，而offer是房主发的，所以此时的data.data.sender是房主；data.data.receiver是接收者；
      // 但是这里的nativeWebRtc的sender，得是自己，不能是data.data.sender，不要混淆
      sender: mySocketId.value,
      receiver,
      videoEl: createNullVideo(),
    });
    webRtcRemoteDesk.sendOffer({
      sender: mySocketId.value,
      receiver,
    });
  } catch (err) {
    console.log(err);
  }
}

function handleChange(e) {
  isWatchMode.value = e.target.value;
}

function loopGetSettings() {
  clearInterval(loopGetSettingsTimer.value);
  loopGetSettingsTimer.value = setInterval(() => {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.localStream?.getVideoTracks()
      .forEach((item) => {
        videoSettings.value = item.getSettings();
        console.log(JSON.stringify(videoSettings.value));
      });
  }, 1000);
}

function handleMouseWheel(e: WheelEvent) {
  if (!appStore.remoteDesk.size) {
    return;
  }
  // console.log('handleMouseWheel', e);
  e.preventDefault();
  if (e.deltaY > 0) {
    const requestId = getRandomString(8);
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
        requestId,
        msgType: WsMsgTypeEnum.billdDeskBehavior,
        data: {
          roomId: roomId.value,
          sender: mySocketId.value,
          receiver: receiverId.value,
          type: BilldDeskBehaviorEnum.scrollDown,
          keyboardtype: 0,
          x: 0,
          y: 0,
          amount: Math.abs(e.deltaY),
        },
      });
  } else if (e.deltaY < 0) {
    const requestId = getRandomString(8);
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
        requestId,
        msgType: WsMsgTypeEnum.billdDeskBehavior,
        data: {
          roomId: roomId.value,
          sender: mySocketId.value,
          receiver: receiverId.value,
          type: BilldDeskBehaviorEnum.scrollUp,
          keyboardtype: 0,
          x: 0,
          y: 0,
          amount: Math.abs(e.deltaY),
        },
      });
  }
  if (e.deltaX > 0) {
    const requestId = getRandomString(8);
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
        requestId,
        msgType: WsMsgTypeEnum.billdDeskBehavior,
        data: {
          roomId: roomId.value,
          sender: mySocketId.value,
          receiver: receiverId.value,
          type: BilldDeskBehaviorEnum.scrollRight,
          keyboardtype: 0,
          x: 0,
          y: 0,
          amount: Math.abs(e.deltaX),
        },
      });
  } else if (e.deltaX < 0) {
    const requestId = getRandomString(8);
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
        requestId,
        msgType: WsMsgTypeEnum.billdDeskBehavior,
        data: {
          roomId: roomId.value,
          sender: mySocketId.value,
          receiver: receiverId.value,
          type: BilldDeskBehaviorEnum.scrollLeft,
          keyboardtype: 0,
          x: 0,
          y: 0,
          amount: Math.abs(e.deltaX),
        },
      });
  }
}

watch(
  () => currentMaxBitrate.value,
  (newval) => {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsChangeMaxBitrateType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.changeMaxBitrate,
        data: {
          live_room_id: Number(roomId.value),
          val: newval,
        },
      });
  }
);
watch(
  () => currentMaxFramerate.value,
  (newval) => {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsChangeMaxFramerateType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.changeMaxFramerate,
        data: {
          live_room_id: Number(roomId.value),
          val: newval,
        },
      });
  }
);
watch(
  () => currentResolutionRatio.value,
  (newval) => {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsChangeResolutionRatioType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.changeResolutionRatio,
        data: {
          live_room_id: Number(roomId.value),
          val: newval,
        },
      });
  }
);
watch(
  () => currentVideoContentHint.value,
  (newval) => {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsChangeVideoContentHintType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.changeVideoContentHint,
        data: {
          live_room_id: Number(roomId.value),
          val: newval,
        },
      });
  }
);
watch(
  () => currentAudioContentHint.value,
  (newval) => {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsChangeAudioContentHintType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.changeAudioContentHint,
        data: {
          live_room_id: Number(roomId.value),
          val: newval,
        },
      });
  }
);

watch(
  () => appStore.remoteDesk,
  (newval) => {
    newval.forEach((item) => {
      if (item.isClose) {
        window.$notification.warning({
          content: `${item.sender}远程连接断开`,
          duration: 2000,
        });
        appStore.remoteDesk.delete(item.sender);
        handleClose();
        return;
      } else {
        loopGetSettings();
        closeUseTip();
      }
    });
  },
  {
    deep: true,
  }
);

async function handleResetDeskuuid() {
  cacheStore.deskUserUuid = '';
  cacheStore.deskUserPassword = '';
  await initUser();
  windowReload();
}

async function initUser() {
  if (!cacheStore.deskUserUuid || !cacheStore.deskUserPassword) {
    console.log('生成账号');
    const res = await fetchDeskUserCreate();
    if (res.code === 200) {
      cacheStore.deskUserUuid = res.data.uuid!;
      cacheStore.deskUserPassword = res.data.password!;
      originalPassword.value = res.data.password!;
      roomId.value = cacheStore.deskUserUuid;
      initRoomId(roomId.value);
      initPull({
        isRemoteDesk: true,
      });
    }
  } else {
    const res = await fetchDeskUserLogin({
      uuid: cacheStore.deskUserUuid,
      password: cacheStore.deskUserPassword,
    });
    if (res.code === 200) {
      roomId.value = cacheStore.deskUserUuid;
      initRoomId(roomId.value);

      initPull({
        isRemoteDesk: true,
      });
    }
  }
}

async function handleUpdatePassword() {
  if (
    cacheStore.deskUserPassword &&
    cacheStore.deskUserPassword.length > 6 &&
    cacheStore.deskUserPassword.length < 12
  ) {
    await fetchDeskUserUpdateByUuid({
      uuid: cacheStore.deskUserUuid!,
      password: originalPassword.value,
      new_password: cacheStore.deskUserPassword!,
    });
    window.$message.success('更新密码成功！');
  } else {
    window.$message.warning('密码长度要求6-12位！');
  }
}

function handleCopy(str) {
  copyToClipBoard(str);
  window.$message.success('复制成功');
}

function handleKeyDown(e: KeyboardEvent) {
  // console.log(e.key, e.code);
  const keyMap = {
    Delete: Key.Delete,
    Enter: Key.Enter,
    Space: Key.Space,
    Backspace: Key.Backspace,
    ShiftLeft: Key.LeftShift,
    ShiftRight: Key.RightShift,
    AltLeft: Key.LeftAlt,
    AltRight: Key.RightAlt,
    Tab: Key.Tab,
    Backquote: Key.Quote,
    Backslash: Key.Backslash,
    ArrowUp: Key.Up,
    ArrowDown: Key.Down,
    ArrowLeft: Key.Left,
    ArrowRight: Key.Right,
    CapsLock: Key.CapsLock,
    ControlLeft: Key.LeftControl,
    ControlRight: Key.RightControl,
    MetaLeft: Key.LeftCmd,
    LeftWin: Key.LeftCmd,
    MetaRight: Key.RightCmd,
    RightWin: Key.RightCmd,
    Fn: Key.Fn,
    F1: Key.F1,
    F2: Key.F2,
    F3: Key.F3,
    F4: Key.F4,
    F5: Key.F5,
    F6: Key.F6,
    F7: Key.F7,
    F8: Key.F8,
    F9: Key.F9,
    F10: Key.F10,
    F11: Key.F11,
    F12: Key.F12,
    F13: Key.F13,
    F14: Key.F14,
    F15: Key.F15,
    F16: Key.F16,
    F17: Key.F17,
    F18: Key.F18,
    F19: Key.F19,
    F20: Key.F20,
    F21: Key.F21,
    F22: Key.F22,
    F23: Key.F23,
    F24: Key.F24,
  };
  const requestId = getRandomString(8);
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
      requestId,
      msgType: WsMsgTypeEnum.billdDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        type: BilldDeskBehaviorEnum.keyboardType,
        keyboardtype: keyMap[e.code] || e.key,
        x: 0,
        y: 0,
        amount: 0,
      },
    });
}

function handleDoublelclick() {
  if (!appStore.remoteDesk.size) {
    return;
  }
  const requestId = getRandomString(8);
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
      requestId,
      msgType: WsMsgTypeEnum.billdDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        type: BilldDeskBehaviorEnum.doubleClick,
        keyboardtype: 0,
        x: 0,
        y: 0,
        amount: 0,
      },
    });
}

function handleContextmenu() {
  if (!appStore.remoteDesk.size) {
    return;
  }
  const requestId = getRandomString(8);
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
      requestId,
      msgType: WsMsgTypeEnum.billdDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        type: BilldDeskBehaviorEnum.rightClick,
        keyboardtype: 0,
        x: 0,
        y: 0,
        amount: 0,
      },
    });
}

function handleMouseDown(event: MouseEvent) {
  if (!appStore.remoteDesk.size) {
    return;
  }
  isDown.value = true;
  clickTimer = setTimeout(function () {
    console.log('长按');
    isLongClick = true;
    clearTimeout(clickTimer);
  }, 300);
  // 获取点击相对于视窗的位置
  const clickX = event.clientX;
  const clickY = event.clientY;

  // 获取目标元素的位置和尺寸信息
  // @ts-ignore
  const rect: DOMRect = event.target.getBoundingClientRect();
  // 计算点击位置相对于元素的坐标
  const xInsideElement = clickX - rect.left;
  const yInsideElement = clickY - rect.top;
  const x = (xInsideElement / rect.width) * 1000;
  const y = (yInsideElement / rect.height) * 1000;
  const requestId = getRandomString(8);
  console.log(
    'handleMouseDown',
    requestId,
    x,
    y,
    xInsideElement,
    yInsideElement
  );
  if (event.button === 2) {
    console.log('handleMouseDown-当前是鼠标右键');
    return;
  }
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
      requestId,
      msgType: WsMsgTypeEnum.billdDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        keyboardtype: 0,
        type: isLongClick
          ? BilldDeskBehaviorEnum.pressButtonLeft
          : BilldDeskBehaviorEnum.pressButtonLeft,
        x,
        y,
        amount: 0,
      },
    });
}

function handleMouseMove(event: MouseEvent) {
  if (!appStore.remoteDesk.size) {
    return;
  }
  // 获取点击相对于视窗的位置
  const clickX = event.clientX;
  const clickY = event.clientY;

  // 获取目标元素的位置和尺寸信息
  // @ts-ignore
  const rect: DOMRect = event.target.getBoundingClientRect();
  // 计算点击位置相对于元素的坐标
  const xInsideElement = clickX - rect.left;
  const yInsideElement = clickY - rect.top;
  const x = (xInsideElement / rect.width) * 1000;
  const y = (yInsideElement / rect.height) * 1000;
  const requestId = getRandomString(8);
  console.log(
    'handleMouseMove',
    requestId,
    x,
    y,
    xInsideElement,
    yInsideElement
  );
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
      requestId,
      msgType: WsMsgTypeEnum.billdDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        type: BilldDeskBehaviorEnum.mouseMove,
        keyboardtype: 0,
        x,
        y,
        amount: 0,
      },
    });
}

function handleMouseUp(event: MouseEvent) {
  if (!appStore.remoteDesk.size) {
    return;
  }
  if (clickTimer) {
    clearTimeout(clickTimer);
  }
  isDown.value = false;
  // 获取点击相对于视窗的位置
  const clickX = event.clientX;
  const clickY = event.clientY;

  // 获取目标元素的位置和尺寸信息
  // @ts-ignore
  const rect: DOMRect = event.target.getBoundingClientRect();
  // 计算点击位置相对于元素的坐标
  const xInsideElement = clickX - rect.left;
  const yInsideElement = clickY - rect.top;
  const x = (xInsideElement / rect.width) * 1000;
  const y = (yInsideElement / rect.height) * 1000;
  const requestId = getRandomString(8);
  console.log('handleMouseUp', requestId, x, y, xInsideElement, yInsideElement);
  if (event.button === 2) {
    console.log('handleMouseUp-当前是鼠标右键');
    return;
  }
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsBilldDeskBehaviorType['data']>({
      requestId,
      msgType: WsMsgTypeEnum.billdDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        keyboardtype: 0,
        type: isLongClick
          ? BilldDeskBehaviorEnum.releaseButtonLeft
          : BilldDeskBehaviorEnum.releaseButtonLeft,
        x,
        y,
        amount: 0,
      },
    });
  isLongClick = false;
}

function handleClose() {
  networkStore.removeRtc(receiverId.value);
  clearInterval(loopGetSettingsTimer.value);
  videoSettings.value = undefined;
}

function handleRemote() {
  if (cacheStore.remoteDeskUserUuid === '') {
    window.$message.warning('请输入被控uuid');
    return;
  }
  if (!cacheStore.deskUserUuid || !cacheStore.deskUserPassword) {
    window.$message.warning('deskUserUuid或deskUserPassword错误');
    return;
  }
  networkStore.removeAllRtc();
  networkStore.removeAllWs();
  setTimeout(() => {
    router.push({
      name: routerName.webrtc,
      query: {
        roomId: cacheStore.remoteDeskUserUuid,
        deskUserUuid: cacheStore.deskUserUuid,
        deskUserPassword: cacheStore.deskUserPassword,
        remoteDeskUserUuid: cacheStore.remoteDeskUserUuid,
        receiverId: receiverId.value,
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        audioContentHint: currentAudioContentHint.value,
        videoContentHint: currentVideoContentHint.value,
      },
    });
  }, 300);
}
</script>

<style lang="scss" scoped>
.desk-wrap {
  padding: 5px 15px;
  .info {
    .item {
      margin-right: 10px;
    }
  }
  .rtc-config {
    display: flex;
    .item {
      display: flex;
      align-items: center;
      padding-right: 10px;

      .down {
        width: 150px;
      }
    }
  }
  .link {
    color: $theme-color-gold;
    cursor: pointer;
  }
  .wrap {
    line-height: 0;
    cursor: none;
    &.watch {
      pointer-events: none;
    }
  }
}
</style>
