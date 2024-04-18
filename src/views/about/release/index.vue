<template>
  <div class="release-wrap">
    <div class="content">
      <h1 class="title">版本发布</h1>
      <div class="hr"></div>
      <div class="list">
        <div class="item">
          <h2>前端版本</h2>
          <p>提交日期：{{ billd.committerDate }}</p>
          <p>提交哈希：{{ billd.commitHash }}</p>
          <p>最后构建：{{ billd.lastBuildDate }}</p>
        </div>
        <div class="hr"></div>
        <div
          v-loading="loading"
          class="item"
        >
          <h2>后端版本</h2>
          <p>提交日期：{{ serverInfo?.billd.committerDate }}</p>
          <p>提交哈希：{{ serverInfo?.billd.commitHash }}</p>
          <p>最后构建：{{ serverInfo?.billd.lastBuildDate }}</p>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="title">本页目录</div>
      <div class="item">前端版本</div>
      <div class="item">后端版本</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { fetchServerInfo } from '@/api/other';
import { BilldHtmlWebpackPluginLog, IServerInfo } from '@/interface';
// @ts-ignore
const billd: BilldHtmlWebpackPluginLog = process.env.BilldHtmlWebpackPlugin;

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
.release-wrap {
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  padding-top: 50px;
  width: 960px;
  color: rgb(33, 53, 71);

  .content {
    flex: 1;
    .title {
      margin: 0;
      font-weight: 500;
      font-size: 40px;
      margin-bottom: 20px;
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
      color: rgb(33, 53, 71);
      font-weight: 700;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .item {
      margin-bottom: 8px;
      color: rgba(60, 60, 60, 0.7);
      font-size: 13px;
      cursor: pointer;
      &:hover {
        color: #213547;
      }
    }
  }
}
</style>
