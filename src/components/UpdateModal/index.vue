<template>
  <div class="update-modal-wrap">
    <div class="mask"></div>
    <div class="content">
      <div class="top">
        <div class="title">版本更新</div>
        <div
          v-if="appStore.updateModalInfo?.forceUpdate !== 1"
          class="close"
          @click="emits('close')"
        ></div>
      </div>
      <div
        class="update-content"
        v-html="appStore.updateModalInfo?.updateContent"
      ></div>
      <div class="other">
        <div>版本号：{{ appStore.updateModalInfo?.show_version }}</div>
        <div>更新时间：{{ appStore.updateModalInfo?.updateDate }}</div>
      </div>
      <div
        class="btn"
        @click="
          handleOpenExternal({
            windowId: WINDOW_ID_ENUM.remote,
            url: appStore.updateModalInfo?.download.macos_dmg,
          })
        "
      >
        立即更新
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useIpcRendererSend } from '@/hooks/use-ipcRendererSend';
import { WINDOW_ID_ENUM } from '@/pure-constant';
import { useAppStore } from '@/store/app';

const appStore = useAppStore();

const { handleOpenExternal } = useIpcRendererSend();

const emits = defineEmits(['confirm', 'close']);
</script>

<style lang="scss" scoped>
.update-modal-wrap {
  position: relative;
  z-index: 20;
  .mask {
    background-color: rgba($color: #000000, $alpha: 0.3) !important;

    @extend %maskBg;
  }
  .content {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 99;
    box-sizing: border-box;
    padding: 15px 20px;
    width: 320px;
    // height: 350px;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0 2px 20px rgb(0 0 0 / 20%);
    transform: translate(-50%, -50%);
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
    .update-content {
      overflow: scroll;
      padding-top: 10px;
      max-height: 200px;
      font-size: 16px;

      @extend %customScrollbarHide;
      &:hover {
        @extend %customScrollbar;
      }
    }
    .other {
      margin-top: 10px;
      color: #666;
      text-align: right;
      font-size: 12px;
    }
    .btn {
      margin-top: 10px;
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background-color: $theme-color-gold;
      color: white;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
