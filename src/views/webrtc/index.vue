<template>
  <div class="webrtc-wrap">
    <div
      class="drag"
      :style="style"
      ref="dragEl"
    >
      <span
        class="txt"
        @click="showDetail = !showDetail"
      >
        连接详情
      </span>
      <div
        class="info"
        :class="{ show: showDetail }"
      >
        <div>wss：{{ WEBSOCKET_URL }}</div>
        <div>axios：{{ AXIOS_BASEURL }}</div>
        <n-button @click="windowReload">刷新页面</n-button>
        <n-button @click="handleDebug">打开调试</n-button>
        <div>
          <span class="item">
            分辨率：<span v-if="videoSettings?.width">
              {{ videoSettings?.width || '-' }}x{{
                videoSettings?.height || '-'
              }}
            </span>
            <span v-else>-</span>
          </span>
          <span class="item">
            帧率：{{ videoSettings?.frameRate?.toFixed(2) || '-' }}
          </span>
        </div>
        <n-input-group>
          <n-input-group-label>roomId</n-input-group-label>
          <n-input
            v-model:value="roomId"
            :style="{ width: '200px' }"
            disabled
            placeholder=""
          />
        </n-input-group>

        <n-input-group>
          <n-input-group-label>主控uuid</n-input-group-label>
          <n-input
            v-model:value="deskUserUuid"
            :style="{ width: '200px' }"
            disabled
            placeholder=""
          />
        </n-input-group>
        <n-input-group>
          <n-input-group-label>被控uuid</n-input-group-label>
          <n-input
            v-model:value="remoteDeskUserUuid"
            :style="{ width: '200px' }"
            disabled
            placeholder=""
          />
        </n-input-group>
        <n-input-group>
          <n-button>我的设备</n-button>
          <n-input
            v-model:value="mySocketId"
            :style="{ width: '200px' }"
            disabled
            placeholder=""
          />
          <n-button @click="handleCopy(mySocketId)">复制</n-button>
        </n-input-group>

        <n-input-group>
          <n-button>控制设备</n-button>
          <n-input
            v-model:value="receiverId"
            :style="{ width: '200px' }"
            disabled
            placeholder=""
          />
          <n-button @click="handleCopy(receiverId)">复制</n-button>
        </n-input-group>
        <div class="rtc-info">
          <span class="item">
            分辨率：<span v-if="videoSettings?.width">
              {{ videoSettings?.width || '-' }}x{{
                videoSettings?.height || '-'
              }}
            </span>
            <span v-else>-</span>
          </span>
          <span class="item">
            帧率：{{ videoSettings?.frameRate?.toFixed(2) || '-' }}
          </span>
          <span class="item">延迟：{{ rtcRtt || '-' }}</span>
          <span class="item">丢包：{{ rtcLoss || '-' }}</span>
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
      </div>
    </div>

    <div
      :class="{ wrap: 1, watch: isWatchMode === 'on' }"
      ref="videoWrapRef"
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
import { useDraggable } from '@vueuse/core';
import {
  computeBox,
  copyToClipBoard,
  getRandomString,
  windowReload,
} from 'billd-utils';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { AXIOS_BASEURL, WEBSOCKET_URL } from '@/constant';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { closeUseTip, useTip } from '@/hooks/use-tip';
import { useWebsocket } from '@/hooks/use-websocket';
import { useWebRtcRemoteDesk } from '@/hooks/webrtc/remoteDesk';
import { useAppStore } from '@/store/app';
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
  videoFullBox,
} from '@/utils';
import { WebRTCClass } from '@/utils/network/webRTC';

const roomId = ref('');
const route = useRoute();
const appStore = useAppStore();
const networkStore = useNetworkStore();
const {
  initWs,
  remoteDeskUserUuid,
  deskUserUuid,
  deskUserPassword,
  connectStatus,
} = useWebsocket();
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

const showDetail = ref(true);
const dragEl = ref<HTMLDivElement>();
const { style } = useDraggable(dragEl, {
  initialValue: { x: 40, y: 40 },
});

const currentMaxBitrate = ref(maxBitrate.value[3].value);
const currentMaxFramerate = ref(maxFramerate.value[4].value);
const currentResolutionRatio = ref(resolutionRatio.value[3].value);
const currentVideoContentHint = ref(videoContentHint.value[3].value);
const currentAudioContentHint = ref(audioContentHint.value[0].value);
const loopBilldDeskUpdateUserTimer = ref();
const receiverId = ref('');
const videoWrapRef = ref<HTMLDivElement>();
const isDown = ref(false);
const loopGetSettingsTimer = ref();
const videoSettings = ref<MediaTrackSettings>();
let clickTimer;
let isLongClick = false;
const videoMap = ref(new Map());
const showLoading = ref(true);
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

function handleDebug() {}

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  videoWrapRef.value?.removeEventListener('wheel', handleMouseWheel);
  handleClose();
  clearInterval(loopBilldDeskUpdateUserTimer.value);
});

onMounted(() => {
  console.log(route.query);
  if (route.query['roomId'] !== undefined) {
    // @ts-ignore
    roomId.value = route.query['roomId'];
  }
  if (route.query['maxBitrate'] !== undefined) {
    // @ts-ignore
    currentMaxBitrate.value = route.query['maxBitrate'];
  }
  if (route.query['maxFramerate'] !== undefined) {
    // @ts-ignore
    currentMaxFramerate.value = route.query['maxFramerate'];
  }
  if (route.query['resolutionRatio'] !== undefined) {
    // @ts-ignore
    currentResolutionRatio.value = route.query['resolutionRatio'];
  }
  if (route.query['videoContentHint'] !== undefined) {
    // @ts-ignore
    currentVideoContentHint.value = route.query['videoContentHint'];
  }
  if (route.query['audioContentHint'] !== undefined) {
    // @ts-ignore
    currentAudioContentHint.value = route.query['audioContentHint'];
  }
  if (route.query['deskUserUuid'] !== undefined) {
    // @ts-ignore
    deskUserUuid.value = route.query['deskUserUuid'];
  }
  if (route.query['deskUserPassword'] !== undefined) {
    // @ts-ignore
    deskUserPassword.value = route.query['deskUserPassword'];
  }
  if (route.query.remoteDeskUserUuid !== undefined) {
    remoteDeskUserUuid.value = `${route.query.remoteDeskUserUuid as string}`;
  } else {
    window.$message.error('remoteDeskUserUuid为空');
    return;
  }
  handleInit();
});

function handleInit() {
  handleLoopBilldDeskUpdateUserTimer();
  initWs({
    roomId: roomId.value,
    isAnchor: false,
    isRemoteDesk: true,
  });
  videoWrapRef.value?.addEventListener('wheel', handleMouseWheel);
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
        receiver: '',
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        videoContentHint: currentVideoContentHint.value,
        audioContentHint: currentAudioContentHint.value,
        deskUserUuid: deskUserUuid.value,
        deskUserPassword: deskUserPassword.value,
        remoteDeskUserUuid: remoteDeskUserUuid.value,
      },
    });
  }, 1000 * 2);
}

watch(
  () => networkStore.rtcMap,
  (newVal) => {
    newVal.forEach((item) => {
      if (videoWrapRef.value) {
        if (videoMap.value.has(item.receiver)) {
          return;
        }
        videoMap.value.set(item.receiver, 1);
        item.videoEl.addEventListener('loadedmetadata', () => {
          if (!videoWrapRef.value) return;
          const rect = videoWrapRef.value.getBoundingClientRect();
          const res = computeBox({
            width: item.videoEl.videoWidth,
            height: item.videoEl.videoHeight,
            maxHeight: rect.height,
            minHeight: rect.height,
            maxWidth: rect.width,
            minWidth: rect.width,
          });
          videoFullBox({
            wrapSize: {
              width: res.width,
              height: res.height,
            },
            videoEl: item.videoEl,
          });

          showLoading.value = false;
        });
        videoWrapRef.value.appendChild(item.videoEl);
      }
    });
    nextTick(() => {
      if (videoWrapRef.value) {
        if (newVal.size) {
          videoWrapRef.value.style.display = 'inline-block';
        } else {
          videoWrapRef.value.style.removeProperty('display');
        }
      }
    });
  },
  {
    deep: true,
    immediate: true,
  }
);

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
  // 收到billdDeskStartRemoteResult
  ws?.socketIo?.on(
    WsMsgTypeEnum.billdDeskStartRemoteResult,
    (data: WsBilldDeskStartRemoteResult['data']) => {
      console.log('收到billdDeskStartRemoteResult', data);
      if (data.code !== 0) {
        useTip({
          content: data.msg,
          hiddenCancel: true,
          hiddenClose: true,
        });
      } else {
        if (data.data) {
          receiverId.value = data.data.receiver;
          appStore.remoteDesk.set(data.data.receiver, {
            audioContentHint: data.data.audioContentHint,
            videoContentHint: data.data.videoContentHint,
            sender: data.data.sender,
            isClose: false,
            maxBitrate: data.data.maxBitrate,
            maxFramerate: data.data.maxFramerate,
            resolutionRatio: data.data.resolutionRatio,
          });
        }
      }
    }
  );
  ws?.send<WsBilldDeskStartRemote['data']>({
    requestId: getRandomString(8),
    msgType: WsMsgTypeEnum.billdDeskStartRemote,
    data: {
      roomId: roomId.value,
      sender: mySocketId.value,
      receiver: '',
      maxBitrate: currentMaxBitrate.value,
      maxFramerate: currentMaxFramerate.value,
      resolutionRatio: currentResolutionRatio.value,
      videoContentHint: currentVideoContentHint.value,
      audioContentHint: currentAudioContentHint.value,
      deskUserUuid: deskUserUuid.value,
      deskUserPassword: deskUserPassword.value,
      remoteDeskUserUuid: remoteDeskUserUuid.value,
    },
  });
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
  e.preventDefault();
  const requestId = getRandomString(8);
  if (e.deltaY > 0) {
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
  console.log('handleMouseDown', x, y, xInsideElement, yInsideElement);
  if (event.button === 2) {
    console.log('handleMouseDown-当前是鼠标右键');
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
  console.log(appStore.remoteDesk.size, 'appStore.remoteDesk.size');
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
  console.log(
    'handleMouseUp',
    receiverId,
    x,
    y,
    xInsideElement,
    yInsideElement
  );
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
</script>

<style lang="scss" scoped>
.webrtc-wrap {
  .drag {
    position: fixed;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: white;
    box-shadow:
      rgba(0, 0, 0, 0.15) 0px 15px 25px,
      rgba(0, 0, 0, 0.05) 0px 5px 10px;
    .txt {
      cursor: pointer;

      user-select: none;
    }
    .info {
      position: absolute;
      top: 100%;
      left: 0;
      display: none;
      padding: 10px;
      background-color: white;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      &.show {
        display: block;
      }
      .input-upload {
        opacity: 0;
      }
    }
  }
  .wrap {
    width: 100vw;
    height: 100vh;
    line-height: 0;
    // cursor: none;
    &.watch {
      // pointer-events: none;
    }
  }
}
</style>
