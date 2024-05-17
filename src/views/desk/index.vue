<template>
  <div>
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
    <div>
      <n-input-group>
        <n-input-group-label>我的设备</n-input-group-label>
        <n-input
          v-model:value="mySocketId"
          :style="{ width: '200px' }"
          disabled
        />
        <n-button @click="handleCopy">复制</n-button>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>被控设备</n-input-group-label>
        <n-input
          :style="{ width: '200px' }"
          placeholder="请输入被控设备"
          v-model:value="receiverId"
        />
        <n-button
          type="error"
          @click="handleClose"
          v-if="appStore.remoteDesk.isRemoteing"
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
      class="wrap"
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
import { copyToClipBoard, getRandomString, openToTarget } from 'billd-utils';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import {
  AXIOS_BASEURL,
  DOWNLOAD_DESK_URL,
  PROJECT_GITHUB,
  WEBSOCKET_URL,
} from '@/constant';
import { usePull } from '@/hooks/use-pull';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { closeUseTip, useTip } from '@/hooks/use-tip';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import {
  RemoteDeskBehaviorEnum,
  WsChangeAudioContentHintType,
  WsChangeMaxBitrateType,
  WsChangeMaxFramerateType,
  WsChangeResolutionRatioType,
  WsChangeVideoContentHintType,
  WsMsgTypeEnum,
  WsRemoteDeskBehaviorType,
  WsStartRemoteDesk,
} from '@/types/websocket';

const num = '123456';
const appStore = useAppStore();
const networkStore = useNetworkStore();
const { videoWrapRef, initPull } = usePull(num);
const {
  maxBitrate,
  maxFramerate,
  resolutionRatio,
  audioContentHint,
  videoContentHint,
} = useRTCParams();

const currentMaxBitrate = ref(maxBitrate.value[3].value);
const currentMaxFramerate = ref(maxFramerate.value[2].value);
const currentResolutionRatio = ref(resolutionRatio.value[3].value);
const currentVideoContentHint = ref(videoContentHint.value[3].value);
const currentAudioContentHint = ref(audioContentHint.value[0].value);
const roomId = ref(num);
const receiverId = ref('');
const remoteVideoRef = ref<HTMLDivElement>();
const isDown = ref(false);
const loopGetSettingsTimer = ref();
const videoSettings = ref<MediaTrackSettings>();
let clickTimer;
let isLongClick = false;
const mySocketId = computed(() => {
  return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
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
});

onMounted(() => {
  initPull({
    isRemoteDesk: true,
  });
  remoteVideoRef.value?.addEventListener('wheel', handleMouseWheel);
  videoWrapRef.value = remoteVideoRef.value;
  window.addEventListener('keydown', handleKeyDown);
  loopGetSettings();
});

function loopGetSettings() {
  clearInterval(loopGetSettingsTimer.value);
  loopGetSettingsTimer.value = setInterval(() => {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.localStream?.getVideoTracks()
      .forEach((item) => {
        videoSettings.value = item.getSettings();
      });
  }, 1000);
}

function handleMouseWheel(e: WheelEvent) {
  if (!appStore.remoteDesk.isRemoteing) {
    return;
  }
  // console.log('handleMouseWheel', e);
  e.preventDefault();
  if (e.deltaY > 0) {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.remoteDeskBehavior,
        data: {
          roomId: roomId.value,
          sender: mySocketId.value,
          receiver: receiverId.value,
          type: RemoteDeskBehaviorEnum.scrollDown,
          keyboardtype: 0,
          x: 0,
          y: 0,
          amount: Math.abs(e.deltaY),
        },
      });
  } else if (e.deltaY < 0) {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.remoteDeskBehavior,
        data: {
          roomId: roomId.value,
          sender: mySocketId.value,
          receiver: receiverId.value,
          type: RemoteDeskBehaviorEnum.scrollUp,
          keyboardtype: 0,
          x: 0,
          y: 0,
          amount: Math.abs(e.deltaY),
        },
      });
  }
  if (e.deltaX > 0) {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.remoteDeskBehavior,
        data: {
          roomId: roomId.value,
          sender: mySocketId.value,
          receiver: receiverId.value,
          type: RemoteDeskBehaviorEnum.scrollRight,
          keyboardtype: 0,
          x: 0,
          y: 0,
          amount: Math.abs(e.deltaX),
        },
      });
  } else if (e.deltaX < 0) {
    networkStore.rtcMap
      .get(receiverId.value)
      ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.remoteDeskBehavior,
        data: {
          roomId: roomId.value,
          sender: mySocketId.value,
          receiver: receiverId.value,
          type: RemoteDeskBehaviorEnum.scrollLeft,
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
  () => appStore.remoteDesk.isClose,
  (newval) => {
    if (newval) {
      handleClose();
      useTip({
        content: '远程连接断开',
        hiddenCancel: true,
        hiddenClose: true,
      }).catch();
    } else {
      loopGetSettings();
      closeUseTip();
    }
  }
);

function handleCopy() {
  copyToClipBoard(mySocketId.value);
  window.$message.success('复制成功！');
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

  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.remoteDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        type: RemoteDeskBehaviorEnum.keyboardType,
        keyboardtype: keyMap[e.code] || e.key,
        x: 0,
        y: 0,
        amount: 0,
      },
    });
}

function handleDoublelclick() {
  if (!appStore.remoteDesk.isRemoteing) {
    return;
  }
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.remoteDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        type: RemoteDeskBehaviorEnum.doubleClick,
        keyboardtype: 0,
        x: 0,
        y: 0,
        amount: 0,
      },
    });
}

function handleContextmenu() {
  if (!appStore.remoteDesk.isRemoteing) {
    return;
  }
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.remoteDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        type: RemoteDeskBehaviorEnum.rightClick,
        keyboardtype: 0,
        x: 0,
        y: 0,
        amount: 0,
      },
    });
}

function handleMouseDown(event: MouseEvent) {
  if (!appStore.remoteDesk.isRemoteing) {
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
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.remoteDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        keyboardtype: 0,
        type: isLongClick
          ? RemoteDeskBehaviorEnum.pressButtonLeft
          : RemoteDeskBehaviorEnum.pressButtonLeft,
        x,
        y,
        amount: 0,
      },
    });
}

function handleMouseMove(event: MouseEvent) {
  if (!appStore.remoteDesk.isRemoteing) {
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
  console.log('handleMouseMove', x, y, xInsideElement, yInsideElement);
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.remoteDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        type: RemoteDeskBehaviorEnum.mouseMove,
        keyboardtype: 0,
        x,
        y,
        amount: 0,
      },
    });
}

function handleMouseUp(event: MouseEvent) {
  if (!appStore.remoteDesk.isRemoteing) {
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
  console.log('handleMouseUp', x, y, xInsideElement, yInsideElement);
  networkStore.rtcMap
    .get(receiverId.value)
    ?.dataChannelSend<WsRemoteDeskBehaviorType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.remoteDeskBehavior,
      data: {
        roomId: roomId.value,
        sender: mySocketId.value,
        receiver: receiverId.value,
        keyboardtype: 0,
        type: isLongClick
          ? RemoteDeskBehaviorEnum.releaseButtonLeft
          : RemoteDeskBehaviorEnum.releaseButtonLeft,
        x,
        y,
        amount: 0,
      },
    });
  isLongClick = false;
}

function handleClose() {
  networkStore.removeRtc(receiverId.value);
  appStore.remoteDesk.isClose = true;
  clearInterval(loopGetSettingsTimer.value);
  videoSettings.value = undefined;
}

function handleRemote() {
  networkStore.wsMap.get(roomId.value)?.send<WsStartRemoteDesk['data']>({
    requestId: getRandomString(8),
    msgType: WsMsgTypeEnum.startRemoteDesk,
    data: {
      roomId: roomId.value,
      sender: mySocketId.value,
      receiver: receiverId.value,
      maxBitrate: currentMaxBitrate.value,
      maxFramerate: currentMaxFramerate.value,
      resolutionRatio: currentResolutionRatio.value,
      videoContentHint: currentVideoContentHint.value,
      audioContentHint: currentAudioContentHint.value,
    },
  });
}
</script>

<style lang="scss" scoped>
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
}
</style>
