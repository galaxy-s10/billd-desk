<template>
  <div class="wrap">
    <h1>视频帧截图(webcodec)</h1>
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
import MP4Box from 'mp4box';
import { nextTick, onMounted, ref } from 'vue';

import { formatDownTime2, generateBase64 } from '@/utils';

const uploadRef = ref<HTMLInputElement>();
const loading = ref(false);
const currentDuation = ref(0);
const videoDuration = ref(0);
const height = ref(0);
const fileList = ref<{ name: string; data: string }[]>([]);
const imgList = ref<any[]>([]);
const imgListRef = ref<HTMLImageElement[]>([]);
const listRef = ref<HTMLDivElement>();

const mp4box = MP4Box.createFile();

// 这个是额外的处理方法，不需要关心里面的细节
const getExtradata = () => {
  // 生成VideoDecoder.configure需要的description信息
  const entry = mp4box.moov.traks[0].mdia.minf.stbl.stsd.entries[0];

  const box = entry.avcC ?? entry.hvcC ?? entry.vpcC;
  if (box != null) {
    const stream = new MP4Box.DataStream(
      undefined,
      0,
      MP4Box.DataStream.BIG_ENDIAN
    );
    box.write(stream);
    // slice()方法的作用是移除moov box的header信息
    return new Uint8Array(stream.buffer.slice(8));
  }
};

// 视频轨道，解码用
let videoTrack: any = null;
let videoDecoder: any = null;
// 这个就是最终解码出来的视频画面序列文件
const videoFrames: any[] = [];

let nbSampleTotal = 0;
let countSample = 0;

mp4box.onReady = function (info) {
  console.log('onReady', info); // 记住视频轨道信息，onSamples匹配的时候需要
  videoTrack = info.videoTracks[0];
  videoDuration.value = Math.ceil(info.duration / 1000);
  if (videoTrack != null) {
    mp4box.setExtractionOptions(videoTrack.id, 'video', {
      nbSamples: 100,
    });
  }

  // 视频的宽度和高度
  const videoW = videoTrack.track_width;
  const videoH = videoTrack.track_height;
  let num = 0;
  // 设置视频解码器
  videoDecoder = new VideoDecoder({
    output: (videoFrame: VideoFrame) => {
      num += 1;
      if (num % 10 !== 0) return;
      currentDuation.value += 1;
      const res = formatDownTime2({
        startTime: +new Date(),
        endTime: +new Date() + num * 100,
        addZero: true,
      });
      let time = '';
      if (res.d) {
        time = `${res.d}天${res.h}:${res.m}:${res.s}`;
      } else {
        time = `${res.h}:${res.m}:${res.s}`;
      }
      imgList.value.push(time);
      createImageBitmap(videoFrame).then((img) => {
        // 在画布上显示解码后的帧
        // const canvas = canvasRef.value!;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imgEl = imgListRef.value[imgListRef.value.length - 1];
        if (imgEl) {
          const str = generateBase64(canvas);
          imgEl.src = str;
          fileList.value.push({
            name: `${num}.webp`,
            data: str.split(';base64,')[1],
          });
        }
        videoFrame.close();
      });
    },
    error: (err) => {
      console.error('videoDecoder错误：', err);
    },
  });

  nbSampleTotal = videoTrack.nb_samples;

  videoDecoder.configure({
    codec: videoTrack.codec,
    codedWidth: videoW,
    codedHeight: videoH,
    description: getExtradata(),
  });

  mp4box.start();
};

mp4box.onSamples = function (trackId, ref, samples) {
  console.log('onSamples', trackId, ref, samples);
  // samples其实就是采用数据了
  if (videoTrack.id === trackId) {
    mp4box.stop();

    countSample += samples.length;

    // eslint-disable-next-line
    for (const sample of samples) {
      const type = sample.is_sync ? 'key' : 'delta';

      const chunk = new EncodedVideoChunk({
        type,
        timestamp: sample.cts,
        duration: sample.duration,
        data: sample.data,
      });

      videoDecoder.decode(chunk);
    }

    if (countSample === nbSampleTotal) {
      videoDecoder.flush();
    }
  }
};

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

async function playHEVCStream() {
  if (!window.VideoDecoder) {
    console.error('不支持Webcodecs');
    return;
  }
  // 获取视频源
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const videoTrack = stream.getVideoTracks()[0];
  const videoStream = new MediaStream([videoTrack]);

  // 创建WebCodecs编解码器
  const codec = new VideoDecoder({
    output: (frame) => {
      // 在画布上显示解码后的帧
      // const canvas = canvasRef.value!;
      // const ctx = canvas.getContext('2d')!;
      // canvas.width = frame.displayWidth;
      // canvas.height = frame.displayHeight;
      // // 创建ImageBitmap
      // const imageBitmap = await createImageBitmap(frame);
      // ctx.drawImage(imageBitmap, 0, 0);
      console.log(frame);
      frame.close();
    },
    error() {},
  });

  codec.configure({ codec: 'hevc' });
  // 构造一个输入数据示例
  const encodedVideoChunk = new EncodedVideoChunk({
    type: 'key', // 或者 'delta'，取决于帧类型
    timestamp: performance.now(), // 提供一个时间戳
    data: new Uint8Array(), // 这是编码视频帧的数据
  });
  codec.decode(encodedVideoChunk);
}

function uploadChange() {
  if (loading.value) return;
  loading.value = true;
  imgList.value = [];
  currentDuation.value = 0;
  videoDuration.value = 0;
  nextTick(async () => {
    const file = uploadRef.value?.files?.[0];

    if (!file) return;
    const buffer = await file.arrayBuffer();
    // @ts-ignore
    buffer.fileStart = 0;
    mp4box.appendBuffer(buffer);
    mp4box.flush();
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
