<template>
  <NNotificationProvider>
    <NMessageProvider :max="2">
      <ContentCpt></ContentCpt>
    </NMessageProvider>
  </NNotificationProvider>
</template>

<script lang="ts">
export default {
  name: 'naiveuiMessage',
};
</script>

<script lang="ts" setup>
import { NMessageProvider, NNotificationProvider } from 'naive-ui';

import ContentCpt from './content/index.vue';
</script>

<style lang="scss" scoped></style>
