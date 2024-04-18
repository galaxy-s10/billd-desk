<template>
  <div class="list">
    <div
      class="item"
      @click.prevent="router.push({ name: routerName.frameScreenshotByCanvas })"
    >
      视频帧截图(canvas)
    </div>
    <div
      class="item"
      @click.prevent="
        router.push({ name: routerName.frameScreenshotByWebcodec })
      "
    >
      视频帧截图(webcodec)
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { routerName } from '@/router';

const router = useRouter();
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-left: 30px;
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    margin-bottom: 15px;
    width: 200px;
    height: 100px;
    border-radius: 10px;
    background-color: rgba($color: $theme-color-gold, $alpha: 0.8);
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
