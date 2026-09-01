<template>
  <div>
    <!-- eslint-disable -->
    <textarea
      ref="inviteInfo"
      class="invite-info"
    >
BilldDesk:
{{ t('remote.deviceCode') }}:{{ cacheStore.deskUserUuid }}
{{ t('remote.temporaryPassword') }}:{{ cacheStore.deskUserPassword }}
    </textarea>
    <!--eslint-enable-->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { usePiniaCacheStore } from '@/store/cache';

const cacheStore = usePiniaCacheStore();
const { t } = useI18n();

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
      window.$message.success(t('remote.inviteInfoCopied'));
    })
    .catch((err) => {
      console.log(err);
      window.$message.error(t('remote.inviteInfoCopyFailed'));
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
