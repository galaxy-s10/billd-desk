<template>
  <div>
    <div
      class="mask"
      @click="emits('close')"
    ></div>
    <div
      ref="dragModalEl"
      class="drag-modal"
      :class="{
        mobile: appStore.isMobile,
        ipad: appStore.isIPad,
      }"
    >
      <div class="top drag">
        <div class="title">消息中心</div>
        <div
          class="close"
          @click="emits('close')"
        ></div>
      </div>
      <div class="hr"></div>
      <div class="pc-wrap">
        <div
          v-for="(item, index) in cacheStore.showGlobalMsg.list"
          :key="index"
          class="item"
        >
          <div class="time">{{ item.show_date }}</div>
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="msg"
            v-html="item.content"
          ></div>
          <!-- eslint-enable -->
        </div>
        <div
          v-if="!cacheStore.showGlobalMsg.list.length"
          class="null"
        >
          暂无消息
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { useDraggable } from '@vueuse/core';
import { onUnmounted, ref } from 'vue';

import { GlobalMsgTypeEnum } from '@/interface';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';

const appStore = useAppStore();
const cacheStore = usePiniaCacheStore();
const dragModalEl = ref<HTMLDivElement>();
// const { style: dragPanelStyle } = useDraggable(dragModalEl, {
//   initialValue: { x: 100, y: 100 },
//   disabled: true,
// });

const emits = defineEmits(['close']);

onUnmounted(() => {
  if (
    cacheStore.showGlobalMsg.list.find(
      (v) => v.type === GlobalMsgTypeEnum.alwaysRedMsg
    )
  ) {
    cacheStore.showGlobalMsg.red = true;
  } else {
    cacheStore.showGlobalMsg.red = false;
  }
});
</script>

<style lang="scss" scoped>
.mask {
  z-index: 900;

  @extend %maskBg;
}
.drag-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 901;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  box-sizing: border-box;
  width: 400px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 2px 20px rgb(0 0 0 / 10%);
  transform: translate(-50%, -50%);
  &.mobile {
    width: 80vw;
  }
  &.ipad {
    width: 400px;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 8px 20px;
    &.drag {
      -webkit-app-region: drag;
    }
    .title {
      font-weight: 500;
      font-size: 16px;
    }
    .close {
      width: 14px;
      height: 14px;
      cursor: pointer;

      -webkit-app-region: no-drag;
      @include cross(#666, 2px);
    }
  }
  .hr {
    border-bottom: 1px solid #f0f0f0;
  }
  .pc-wrap {
    overflow: scroll;
    box-sizing: border-box;
    padding-top: 10px;
    max-height: 250px;

    @extend %customScrollbarHide;
    &:hover {
      @extend %customScrollbar;
    }
    .item {
      display: flex;
      flex-direction: column;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      .time {
        display: inline-block;
        box-sizing: border-box;
        margin: 0 auto;
        padding: 0 10px;
        height: 24px;
        border-radius: 4px;
        background: #0000000d;
        color: #787b80;
        font-size: 12px;
        line-height: 24px;
      }
      .msg {
        box-sizing: border-box;
        padding: 16px;
        border-radius: 8px;
        background-color: white;
        color: #303133;
        word-break: break-all;
        font-size: 14px;

        user-select: text;
      }
    }
  }
}
</style>
