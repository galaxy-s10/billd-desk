<template>
  <div class="wrap">
    <h1>视频帧截图(canvas)</h1>
    <n-button
      :loading="loading"
      type="primary"
      @click.stop="handleVideoFrame"
    >
      选择视频
      <input
        ref="uploadRef"
        type="file"
        class="input-upload"
        @change="uploadChange"
      />
    </n-button>
    <span>
      进度：{{
        currentDuation ? ((currentDuation / videoDuration) * 100).toFixed() : 0
      }}%
    </span>
    <n-button
      v-if="currentDuation && currentDuation - videoDuration === 0"
      type="success"
      @click="handleDownload"
    >
      下载
    </n-button>
    <div
      ref="listRef"
      class="frame-list"
      :style="{ height: height + 'px' }"
    >
      <div
        v-for="(item, index) in imgList"
        :key="index"
        class="item"
      >
        <img ref="imgListRef" />
        <div class="time">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import JSZip from 'jszip';
import { nextTick, onMounted, ref } from 'vue';

import { createVideo, formatDownTime2, generateBase64 } from '@/utils';

const uploadRef = ref<HTMLInputElement>();
const loading = ref(false);
const currentDuation = ref(0);
const videoDuration = ref(0);
const height = ref(0);
const fileList = ref<{ name: string; data: string }[]>([]);
const imgList = ref<any[]>([]);
const imgListRef = ref<HTMLImageElement[]>([]);
const listRef = ref<HTMLDivElement>();

function handleDownload() {
  // 初始化一个zip打包对象
  const zip = new JSZip();
  // 创建一个被用来打包的名为Hello.txt的文件
  fileList.value.forEach((file) => {
    zip.file(file.name, file.data, { base64: true });
  });
  // 把打包内容异步转成blob二进制格式
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    // 创建隐藏的可下载链接
    const eleLink = document.createElement('a');
    eleLink.download = '视频帧截图.zip';
    eleLink.style.display = 'none';
    // 下载内容转变成blob地址
    eleLink.href = URL.createObjectURL(content);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  });
}

function uploadChange() {
  if (loading.value) return;
  loading.value = true;
  imgList.value = [];
  currentDuation.value = 0;
  videoDuration.value = 0;
  nextTick(() => {
    const file = uploadRef.value?.files?.[0];

    if (!file) return;
    const url = URL.createObjectURL(file);
    const videoEl = createVideo({
      appendChild: false,
    });
    videoEl.src = url;

    let currentTime = 0;

    function captureFrame() {
      const res = formatDownTime2({
        startTime: +new Date(),
        endTime: +new Date() + (currentTime + 1) * 1000,
        addZero: true,
      });
      let time = '';
      if (res.d) {
        time = `${res.d}天${res.h}:${res.m}:${res.s}`;
      } else {
        time = `${res.h}:${res.m}:${res.s}`;
      }
      imgList.value.push(time);
      nextTick(() => {
        // 确保视频已足够加载以获取当前帧
        const img = imgListRef.value[imgListRef.value.length - 1];
        if (img) {
          const str = generateBase64(videoEl);
          img.src = str;
          fileList.value.push({
            name: `${currentTime}.webp`,
            data: str.split(';base64,')[1],
          });
          currentDuation.value = currentDuation.value + 1;
          if (videoDuration.value > currentTime) {
            // 移动到下一帧
            videoEl.currentTime += 1;
            currentTime += 1;
          }
        }
      });
    }

    videoEl.onloadeddata = () => {
      currentTime = videoEl.currentTime;
      videoDuration.value = Math.ceil(videoEl.duration);
      captureFrame();
    };

    videoEl.onseeked = () => {
      if (currentTime < videoDuration.value) {
        captureFrame();
      } else {
        loading.value = false;
        if (uploadRef.value) {
          uploadRef.value.value = '';
        }
      }
    };
  });
}

function handleVideoFrame() {
  uploadRef.value?.click();
}

function getHeight() {
  const h =
    document.documentElement.clientHeight -
    (listRef.value?.getBoundingClientRect().top || 0);
  height.value = h;
}

onMounted(() => {
  getHeight();
});
</script>

<style lang="scss" scoped>
.wrap {
  padding-top: 10px;
  padding-left: 30px;
  .input-upload {
    width: 0;
    height: 0;
    opacity: 0;
  }
  .frame-list {
    display: flex;
    overflow: scroll;
    align-content: baseline;
    flex-wrap: wrap;
    margin-top: 10px;

    @extend %customScrollbar;

    .item {
      position: relative;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 3px;
      width: 200px;
      height: fit-content;
      border: 1px solid black;
      border-radius: 5px;
      .time {
        position: absolute;
        right: 3px;
        bottom: 3px;
        padding: 3px 4px;
        border-radius: 3px;
        background-color: rgba($color: #000000, $alpha: 0.5);
        color: white;
        font-size: 13px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
