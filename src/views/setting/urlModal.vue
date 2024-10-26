<template>
  <div class="pwd-wrap">
    <div class="mask"></div>
    <div class="content">
      <div class="top">
        <div class="title">接口配置</div>
        <div
          class="close"
          @click="emits('close')"
        ></div>
      </div>
      <div class="api-config">
        <div class="api-config-item">
          <div class="label">wss：</div>
          <div class="ipt-wrap">
            <input
              type="text"
              class="ipt"
              v-model="wssUrl"
              ref="iptRef"
              placeholder="请输入wss地址"
            />
          </div>
        </div>
        <div class="api-config-item">
          <div class="label">axios：</div>
          <div class="ipt-wrap">
            <input
              type="text"
              class="ipt"
              v-model="axiosBaseUrl"
              ref="iptRef"
              placeholder="请输入axios地址"
            />
          </div>
        </div>
        <div class="api-config-item">
          <div class="label">coturn：</div>
          <div class="ipt-wrap">
            <input
              type="text"
              class="ipt"
              v-model="coturnUrl"
              ref="iptRef"
              placeholder="请输入coturn地址"
            />
          </div>
        </div>
      </div>

      <div
        class="btn"
        @click="handleConfirm"
      >
        确定
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { AXIOS_BASEURL, COTURN_URL, WEBSOCKET_URL } from '@/constant';
import {
  getAxiosBaseUrl,
  getCoturnUrl,
  getWssUrl,
  setAxiosBaseUrl,
  setCoturnUrl,
  setWssUrl,
} from '@/utils/localStorage/app';

const wssUrl = ref('');
const axiosBaseUrl = ref('');
const coturnUrl = ref('');
const iptRef = ref<HTMLInputElement>();

const emits = defineEmits(['confirm', 'close']);

onMounted(() => {
  axiosBaseUrl.value = getAxiosBaseUrl() || AXIOS_BASEURL;
  wssUrl.value = getWssUrl() || WEBSOCKET_URL;
  coturnUrl.value = getCoturnUrl() || COTURN_URL;
});

function handleConfirm() {
  setAxiosBaseUrl(axiosBaseUrl.value);
  setWssUrl(wssUrl.value);
  setCoturnUrl(coturnUrl.value);
  window.$message.success('设置成功！');
}
</script>

<style lang="scss" scoped>
.pwd-wrap {
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
    box-sizing: border-box;
    padding: 15px 20px;
    width: 320px;
    height: 250px;
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
    .api-config {
      margin-top: 20px;
      .api-config-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .label {
          width: 54px;
          color: #666;
          text-align: right;
        }
        .ipt-wrap {
          position: relative;
          width: 220px;
          .ipt {
            box-sizing: border-box;
            padding: 0 15px;
            width: 100%;
            height: 36px;
            outline: none;
            border: 1px solid rgba(153, 153, 153, 0.2);
            border-radius: 4px;
            color: #666;
            font-size: 16px;
            &::placeholder {
              color: #c2c2c2;
              font-size: 14px;
            }
            &:focus {
              border: 1px solid $theme-color-gold;
            }
          }
        }
      }
    }

    .btn {
      margin-top: 15px;
      margin-left: auto;
      width: 80px;
      height: 32px;
      border-radius: 4px;
      background-color: $theme-color-gold;
      color: white;
      text-align: center;
      font-size: 14px;
      line-height: 32px;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
