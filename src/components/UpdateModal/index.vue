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
      <!-- eslint-disable -->
      <div
        class="update-content"
        v-html="appStore.updateModalInfo?.updateContent"
      ></div>
      <!--eslint-enable-->
      <div class="other">
        <div>版本号：{{ appStore.updateModalInfo?.show_version }}</div>
        <div>更新时间：{{ appStore.updateModalInfo?.updateDate }}</div>
      </div>
      <div
        class="btn"
        @click="handleUpdate"
      >
        立即更新
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useIpcRendererSend } from '@/hooks/use-ipcRendererSend';
import { ClientEnvEnum } from '@/interface';
import { WINDOW_ID_MAP } from '@/pure-constant';
import { useAppStore } from '@/store/app';
import { getClientEnv } from '@/utils';

const appStore = useAppStore();

const { handleOpenExternal } = useIpcRendererSend();

const emits = defineEmits(['confirm', 'close']);

function handleUpdate() {
  if (appStore.updateModalInfo) {
    let url = '';
    let errmsg = '';
    const val = getClientEnv();
    if (val === ClientEnvEnum.windows) {
      if (appStore.arch === 'arm') {
        url = appStore.updateModalInfo.download.download_windows_arm_exe || '';
      } else if (appStore.arch === 'arm64') {
        url =
          appStore.updateModalInfo.download.download_windows_arm64_exe || '';
      } else if (appStore.arch === 'x64') {
        url = appStore.updateModalInfo.download.download_windows_x64_exe || '';
      } else {
        errmsg = `未适配${val}(${appStore.arch})架构`;
      }
    } else if (val === ClientEnvEnum.macos) {
      if (appStore.arch === 'arm') {
        url = appStore.updateModalInfo.download.download_macos_arm_dmg || '';
      } else if (appStore.arch === 'arm64') {
        url = appStore.updateModalInfo.download.download_macos_arm64_dmg || '';
      } else if (appStore.arch === 'x64') {
        url = appStore.updateModalInfo.download.download_macos_x64_dmg || '';
      } else {
        errmsg = `未适配${val}(${appStore.arch})架构`;
      }
    } else if (val === ClientEnvEnum.linux) {
      if (appStore.arch === 'arm') {
        url =
          appStore.updateModalInfo.download.download_linux_arm_appimage || '';
      } else if (appStore.arch === 'arm64') {
        url =
          appStore.updateModalInfo.download.download_linux_arm64_appimage || '';
      } else if (appStore.arch === 'x64') {
        url =
          appStore.updateModalInfo.download.download_linux_x64_appimage || '';
      } else {
        errmsg = `未适配${val}(${appStore.arch})架构`;
      }
    }
    if (errmsg !== '') {
      window.$message.warning(errmsg);
      return;
    }
    if (url === '') {
      window.$message.warning('未配置url');
      return;
    }
    handleOpenExternal({
      windowId: WINDOW_ID_MAP.remote,
      url,
    });
  } else {
    window.$message.warning('没有更新信息');
  }
}
</script>

<style lang="scss" scoped>
.update-modal-wrap {
  position: relative;
  z-index: 100;
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

      user-select: text;
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
