<template>
  <div>
    <div>
      我的id：{{ mySocketId }}，<n-button @click="copyToClipBoard(mySocketId)">
        复制
      </n-button>
    </div>
    <n-button
      type="primary"
      @click="handleScreen"
    >
      捕获屏幕
    </n-button>
    <video
      controls
      muted
      autoplay
      ref="videoRef"
    ></video>
  </div>
</template>

<script lang="ts" setup>
import { copyToClipBoard } from 'billd-utils';
import { computed, onMounted, ref, watch } from 'vue';

import { useWebsocket } from '@/hooks/use-websocket';
import { useWebRtcRemoteDesk } from '@/hooks/webrtc/remoteDesk';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { createNullVideo } from '@/utils';

const { initWs } = useWebsocket();
const appStore = useAppStore();
const networkStore = useNetworkStore();
const roomId = ref('101');
const receiverId = ref('');
const anchorStream = ref<MediaStream>();

const videoRef = ref<HTMLVideoElement>();

const mySocketId = computed(() => {
  return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
});

const { updateWebRtcRemoteDeskConfig, webRtcRemoteDesk } =
  useWebRtcRemoteDesk();

watch(
  () => appStore.startRemoteDesk,
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
  });
  // setInterval(() => {
  //   window.electronAPI.ipcRenderer.send('getMousePosition');
  // }, 1000);
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
        // videoRef.value!.srcObject = stream;
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

// function changeMousePosition() {
//   window.electronAPI.ipcRenderer.send('changeMousePosition');
// }
</script>

<style lang="scss" scoped></style>
