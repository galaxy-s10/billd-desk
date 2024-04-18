<template>
  <div class="download-wrap">
    <div class="content">
      <h1 class="title">远程桌面客户端下载</h1>
      <div class="hr"></div>
      <div class="list">
        <div class="item">
          <h2>Electron</h2>
          <span>
            代码仓库：<span
              class="link"
              @click="
                openToTarget(COMMON_URL.download.remoteDesktop.electron.github)
              "
            >
              {{ COMMON_URL.download.remoteDesktop.electron.github }}
            </span>
          </span>
          <h3>Windows</h3>
          <div>
            <span>最新版本：<span>自行构建</span></span>
          </div>
          <h3>macOS</h3>
          <div>
            <span>最新版本：<span>自行构建</span></span>
          </div>
          <h3>Linux</h3>
          <div>
            <span>最新版本：<span>自行构建</span></span>
          </div>
        </div>
        <div class="hr"></div>
        <div class="item">
          <h2>Flutter</h2>
          <span>
            代码仓库：<span
              class="link"
              @click="
                openToTarget(COMMON_URL.download.remoteDesktop.flutter.github)
              "
            >
              {{ COMMON_URL.download.remoteDesktop.flutter.github }}
            </span>
          </span>
          <h3>安卓</h3>
          <div>
            <span>最新版本：<span>todo</span></span>
          </div>
          <h3>苹果</h3>
          <div>
            <span>最新版本：<span>todo</span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="title">本页目录</div>
      <div class="item h1">Electron</div>
      <div class="item h2">Windows</div>
      <div class="item h2">macOS</div>
      <div class="item h2">Linux</div>
      <div class="item h1">Flutter</div>
      <div class="item h2">安卓</div>
      <div class="item h2">苹果</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { openToTarget } from 'billd-utils';
import { onMounted, ref } from 'vue';

import { fetchServerInfo } from '@/api/other';
import { COMMON_URL } from '@/constant';
import { IServerInfo } from '@/interface';

const serverInfo = ref<IServerInfo>();
const loading = ref(false);

async function handleFetchServerInfo() {
  try {
    loading.value = true;
    const res = await fetchServerInfo();
    if (res.code === 200) {
      serverInfo.value = res.data;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  handleFetchServerInfo();
});
</script>

<style lang="scss" scoped>
.download-wrap {
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: 50px;
  padding-bottom: 10px;
  width: 960px;
  color: rgb(33, 53, 71);
  .link {
    color: $theme-color-gold;
    cursor: pointer;
  }

  .content {
    flex: 1;
    .title {
      margin: 0;
      margin-bottom: 20px;
      font-weight: 500;
      font-size: 40px;
    }
    .hr {
      margin: 60px 0 20px 0;
      width: 100%;
      height: 1px;
      background-color: #e7e7e7;
    }
    .list {
      h2 {
        font-weight: 600;
      }
      .item {
        position: relative;
        font-size: 16px;
      }
    }
  }

  .aside {
    padding-left: 90px;
    width: 150px;

    .title {
      margin-bottom: 8px;
      color: rgb(33, 53, 71);
      font-weight: 700;
      font-size: 12px;
    }
    .item {
      margin-bottom: 8px;
      color: rgba(60, 60, 60, 0.7);
      font-size: 13px;
      cursor: pointer;
      &:hover {
        color: #213547;
      }
      &.h1 {
      }
      &.h2 {
        margin-left: 10px;
      }
    }
  }
}
</style>
