<template>
  <div>
    <n-button
      type="primary"
      @click="handleCode"
    >
      生成远程码
    </n-button>
    <div v-if="code">你的远程码：{{ code }}</div>
  </div>
</template>

<script lang="ts" setup>
import { getRandomString } from 'billd-utils';
// import robot from 'robotjs';
import { onMounted, ref } from 'vue';

import { useWebsocket } from '@/hooks/use-websocket';
// import { ipcRenderer } from 'electron';
// const { ipcRenderer } = require('electron');

const { initWs } = useWebsocket();
const code = ref('');

onMounted(() => {
  initWs({
    roomId: '123',
    isAnchor: false,
  });
  // console.log(ipcRenderer);
  console.log(window.versions);
  console.log(window.electron);
  window.electron.ipcRenderer.on('electron:say', (_, args) => {
    console.log(args);
  });
});
function handleCode() {
  code.value = getRandomString(8);
  // robot.moveMouse(100, 100);
  window.electron.ipcRenderer.send('electron:say');
}
</script>

<style lang="scss" scoped></style>
