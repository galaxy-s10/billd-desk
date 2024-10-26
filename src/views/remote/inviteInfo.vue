<template>
  <div>
    <textarea
      ref="inviteInfo"
      class="invite-info"
    >
BilldDesk:
设备代码:{{ cacheStore.deskUserUuid }}
临时密码:{{ cacheStore.deskUserPassword }}
</textarea
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { usePiniaCacheStore } from '@/store/cache';

const cacheStore = usePiniaCacheStore();

const inviteInfo = ref<HTMLTextAreaElement>();

defineExpose({ handleCopyRemoteInfo });

function handleCopyRemoteInfo() {
  const textArea = inviteInfo.value;
  if (!textArea) return;
  // @ts-ignore
  const str = String(textArea.value).trim();
  // @ts-ignore
  textArea.select(); // 选择文本
  // @ts-ignore
  textArea.setSelectionRange(0, 99999); // 对于移动设备
  // 使用剪贴板 API 复制文本
  navigator.clipboard
    .writeText(str)
    .then(() => {
      window.$message.success('已复制邀请信息！');
    })
    .catch((err) => {
      console.log(err);
      window.$message.error('复制邀请信息失败！');
    });
}
</script>

<style lang="scss" scoped>
.invite-info {
  visibility: hidden;
  width: 0;
  height: 0;
}
</style>
