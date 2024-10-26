<template>
  <div class="setting-wrap">
    <div class="nav"></div>
    <div class="container">
      <div class="label">最近连接</div>
      <div v-if="!cacheStore.linkDeviceList.length">暂无记录</div>
      <div
        v-else
        class="link-device-list"
      >
        <div
          class="link-device-item"
          v-for="(item, index) in cacheStore.linkDeviceList"
          :key="index"
        >
          <div class="left">{{ item.remoteDeskUserUuid }}</div>
          <div class="right">
            <div
              class="del"
              @click="handleDelLinkDeviceList(item)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePiniaCacheStore } from '@/store/cache';

const cacheStore = usePiniaCacheStore();

function handleDelLinkDeviceList(item) {
  cacheStore.linkDeviceList = cacheStore.linkDeviceList.filter(
    (v) => v.remoteDeskUserUuid !== item.remoteDeskUserUuid
  );
}
</script>

<style lang="scss" scoped>
.setting-wrap {
  box-sizing: border-box;
  height: 100vh;
  .nav {
    height: $top-system-bar-height;
  }
  .container {
    overflow: scroll;
    padding: 0 40px;
    height: calc(100vh - $top-system-bar-height);

    @extend %customScrollbarHide;
    &:hover {
      @extend %customScrollbar;
    }

    .label {
      margin-bottom: 10px;
      font-weight: 500;
      font-size: 16px;
    }

    .link-device-list {
      position: relative;
      overflow: scroll;
      box-sizing: border-box;
      max-height: 200px;
      width: 100%;
      border: 1px solid rgba(153, 153, 153, 0.2);
      border-radius: 2px;
      background-color: #fff;

      @extend %hideScrollbar;
      .link-device-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 15px;
        width: 100%;
        height: 40px;
        &:hover {
          background-color: #f8f8fb;
        }
        .left {
          font-size: 16px;
        }
        .right {
          .del {
            width: 15px;
            height: 15px;
            cursor: pointer;

            @include cross(#666, 1px);
          }
        }
      }
    }
  }
}
</style>
