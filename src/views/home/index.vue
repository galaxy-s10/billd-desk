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
import { WsMsgTypeEnum, WsRemoteDeskMoveMsgType } from '@/types/websocket';
import { createNullVideo } from '@/utils';

const { initWs } = useWebsocket();
const appStore = useAppStore();
const networkStore = useNetworkStore();
const num = '123456';
const roomId = ref(num);
const receiverId = ref('');
const anchorStream = ref<MediaStream>();
const ioFlag = ref(false);
const pos = ref({ x: 0, y: 0 });

const mySocketId = computed(() => {
  return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
});

watch(
  () => networkStore.wsMap.get(roomId.value)?.socketIo,
  (newval) => {
    if (newval) {
      if (ioFlag.value) return;
      ioFlag.value = true;
      newval.on(
        WsMsgTypeEnum.remoteDeskMoveMsg,
        (data: WsRemoteDeskMoveMsgType['data']) => {
          console.log('收到remoteDeskMoveMsg---', data);
          const setting = anchorStream.value?.getVideoTracks()[0].getSettings();
          if (setting) {
            pos.value.x += 0.95;
            pos.value.y += 0.95;
            console.log(setting.width || 0, (setting.width || 0) * pos.value.x);
            changeMousePosition(
              (setting.width || 0) * pos.value.x,
              (setting.height || 0) * pos.value.y
            );
          }
        }
      );
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
    console.log('getMousePositionRes', source.point);
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

function changeMousePosition(x, y) {
  window.electronAPI.ipcRenderer.send('changeMousePosition', x, y);
}
function testnutjs() {
  window.electronAPI.ipcRenderer.send('testnutjs');
}
</script>

<style lang="scss" scoped></style>
