<template>
  <div>
    <div class="mask"></div>
    <div
      ref="dragModalEl"
      class="drag-modal"
    >
      <div class="top">
        <div class="title">消息中心</div>
        <div
          class="close"
          @click="emits('close')"
        ></div>
      </div>
      <div class="hr"></div>
      <div class="pc-wrap">
        <div
          v-for="(item, index) in appStore.showGlobalMsg.list"
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
          v-if="!appStore.showGlobalMsg.list.length"
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
import { ref } from 'vue';

import { useAppStore } from '@/store/app';

const appStore = useAppStore();
const dragModalEl = ref<HTMLDivElement>();
// const { style: dragPanelStyle } = useDraggable(dragModalEl, {
//   initialValue: { x: 100, y: 100 },
//   disabled: true,
// });

const emits = defineEmits(['close']);
</script>

<style lang="scss" scoped>
.mask {
  z-index: 90;

  @extend %maskBg;
}
.drag-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 90;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 400px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 2px 20px rgb(0 0 0 / 10%);
  transform: translate(-50%, -50%);
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 8px 20px;
    .title {
      font-weight: 500;
      font-size: 16px;
    }
    .close {
      width: 14px;
      height: 14px;
      cursor: pointer;

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
