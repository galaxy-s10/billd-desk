<template>
  <div>
    <h1>当前是受控方</h1>
    <div>
      <div>
        房间id：{{ roomId }}，我的id：{{ mySocketId }}，<n-button
          @click="copyToClipBoard(mySocketId)"
        >
          复制
        </n-button>
        <n-button @click="testnutjs">nutjs</n-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard } from 'billd-utils';
import { computed, onMounted, ref, watch } from 'vue';

import { useWebsocket } from '@/hooks/use-websocket';
import { useWebRtcRemoteDesk } from '@/hooks/webrtc/remoteDesk';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import {
  RemoteDeskBehaviorEnum,
  WsMsgTypeEnum,
  WsRemoteDeskBehaviorType,
} from '@/types/websocket';
import { createNullVideo } from '@/utils';

const { initWs } = useWebsocket();
const appStore = useAppStore();
const networkStore = useNetworkStore();
const num = '123456';
const roomId = ref(num);
const receiverId = ref('');
const anchorStream = ref<MediaStream>();
const ioFlag = ref(false);

const mySocketId = computed(() => {
  return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
});

watch(
  () => networkStore.rtcMap.get(receiverId.value)?.cbDataChannel,
  (newval) => {
    if (newval) {
      if (ioFlag.value) return;
      ioFlag.value = true;
      const setting = anchorStream.value?.getVideoTracks()[0].getSettings();
      newval.onmessage = (event) => {
        const jsondata: {
          msgType: WsMsgTypeEnum;
          requestId: string;
          data: WsRemoteDeskBehaviorType['data'];
        } = JSON.parse(event.data);
        const { data } = jsondata;
        if (setting) {
          const x = (setting.width || 0) * (data.x / 1000);
          const y = (setting.height || 0) * (data.y / 1000);
          console.log(x, y, data.type, '998888');
          if (data.type === RemoteDeskBehaviorEnum.setPosition) {
            mouseSetPosition(x, y);
          } else if (data.type === RemoteDeskBehaviorEnum.drag) {
            mouseDrag(x, y);
          } else if (data.type === RemoteDeskBehaviorEnum.leftClick) {
            mouseLeftClick(x, y);
          } else if (data.type === RemoteDeskBehaviorEnum.rightClick) {
            mouseRightClick(x, y);
          } else if (data.type === RemoteDeskBehaviorEnum.doubleClick) {
            mouseDoubleClick(x, y);
          }
        }
      };
    }
  }
);

const { updateWebRtcRemoteDeskConfig, webRtcRemoteDesk } =
  useWebRtcRemoteDesk();

watch(
  () => appStore.remoteDesk.startRemoteDesk,
  (newval) => {
    if (newval) {
      handleScreen();
    }
  }
);

watch(
  () => appStore.remoteDesk.sender,
  (newval) => {
    if (newval !== '') {
      receiverId.value = appStore.remoteDesk.sender;
    }
  }
);

onMounted(() => {
  initWs({
    roomId: roomId.value,
    isAnchor: false,
    isRemoteDesk: true,
  });
  window.electronAPI.ipcRenderer.on('getMousePositionRes', (_event, source) => {
    console.log('getMousePositionRes', source);
  });
  window.electronAPI.ipcRenderer.on('mouseDragRes', (_event, source) => {
    console.log('mouseDragRes', source);
  });
  window.electronAPI.ipcRenderer.on('mouseSetPositionRes', (_event, source) => {
    console.log('mouseSetPositionRes', source);
  });
  window.electronAPI.ipcRenderer.on('mouseDoubleClickRes', (_event, source) => {
    console.log('mouseDoubleClickRes', source);
  });
  window.electronAPI.ipcRenderer.on('mouseLeftClickRes', (_event, source) => {
    console.log('mouseLeftClickRes', source);
  });
  window.electronAPI.ipcRenderer.on('mouseRightClickRes', (_event, source) => {
    console.log('mouseRightClickRes', source);
  });
  window.electronAPI.ipcRenderer.on(
    'getScreenStream',
    async (_event, source) => {
      console.log(_event, source);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            // @ts-ignore
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
            },
          },
        });
        anchorStream.value = stream;
        updateWebRtcRemoteDeskConfig({
          roomId: roomId.value,
          anchorStream: anchorStream.value,
        });
        webRtcRemoteDesk.newWebRtc({
          // 因为这里是收到offer，而offer是房主发的，所以此时的data.data.sender是房主；data.data.receiver是接收者；
          // 但是这里的nativeWebRtc的sender，得是自己，不能是data.data.sender，不要混淆
          sender: mySocketId.value,
          receiver: receiverId.value,
          videoEl: createNullVideo(),
        });
        webRtcRemoteDesk.sendOffer({
          sender: mySocketId.value,
          receiver: receiverId.value,
        });
      } catch (err) {
        console.log(err);
      }
    }
  );
});

function handleScreen() {
  window.electronAPI.ipcRenderer.send('getScreenStream');
}

function mouseSetPosition(x, y) {
  window.electronAPI.ipcRenderer.send('mouseSetPosition', x, y);
}
function mouseDrag(x, y) {
  window.electronAPI.ipcRenderer.send('mouseDrag', x, y);
}
function mouseDoubleClick(x, y) {
  window.electronAPI.ipcRenderer.send('mouseDoubleClick', x, y);
}
function mouseLeftClick(x, y) {
  window.electronAPI.ipcRenderer.send('mouseLeftClick', x, y);
}
function mouseRightClick(x, y) {
  window.electronAPI.ipcRenderer.send('mouseRightClick', x, y);
}
function testnutjs() {
  window.electronAPI.ipcRenderer.send('testnutjs');
}
</script>

<style lang="scss" scoped></style>
