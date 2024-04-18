<template>
  <p class="footer-wrap">最近更新：{{ billd.lastBuildDate }}</p>
</template>

<script lang="ts" setup>
import { BilldHtmlWebpackPluginLog } from '@/interface';

// @ts-ignore
const billd: BilldHtmlWebpackPluginLog = process.env.BilldHtmlWebpackPlugin;
</script>

<style lang="scss" scoped>
.footer-wrap {
  position: fixed;
  bottom: 0;
  left: 50%;
  width: 100%;
  text-align: center;
  transform: translateX(-50%);
}
</style>
