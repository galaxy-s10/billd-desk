<template>
  <NMessageProvider :max="3">
    <ContentCpt></ContentCpt>
  </NMessageProvider>
</template>

<script lang="ts">
export default {
  name: 'naiveuiMessage',
};
</script>

<script lang="ts" setup>
import { NMessageProvider } from 'naive-ui';

import ContentCpt from './content/index.vue';
</script>

<style lang="scss" scoped></style>
