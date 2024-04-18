<template>
  <div class="push-wrap">
    <div
      ref="topRef"
      class="left"
    >
      <div
        ref="containerRef"
        class="container"
      >
        <div
          class="screenshot"
          @click="handleScreenshot"
        >
          <n-popover
            placement="top"
            trigger="hover"
            :flip="false"
          >
            <template #trigger>
              <n-icon
                size="26"
                :color="THEME_COLOR"
              >
                <Camera></Camera>
              </n-icon>
            </template>
            <div class="slider">截屏</div>
          </n-popover>
        </div>
        <div
          class="recording"
          v-if="recording"
        >
          ● REC {{ recordVideoTime }}
        </div>
        <div
          class="record-ico"
          @click="handleRecordVideo"
        >
          <n-popover
            placement="top"
            trigger="hover"
            :flip="false"
          >
            <template #trigger>
              <n-icon
                size="26"
                :color="recording ? 'red' : '#3f7ee8'"
              >
                <Videocam v-if="!recording"></Videocam>
                <VideocamOffSharp v-else></VideocamOffSharp>
              </n-icon>
            </template>
            <div class="slider">{{ !recording ? '开始录制' : '结束录制' }}</div>
          </n-popover>
        </div>
        <canvas
          id="pushCanvasRef"
          ref="pushCanvasRef"
        ></canvas>
        <div
          v-if="appStore.allTrack.filter((item) => !item.hidden).length <= 0"
          class="add-wrap"
        >
          <n-space>
            <n-button
              v-for="(item, index) in allMediaTypeList"
              :key="index"
              class="item"
              @click="handleStartMedia(item)"
            >
              {{ item.txt }}
            </n-button>
          </n-space>
        </div>
      </div>

      <div
        ref="bottomRef"
        class="room-control"
      >
        <div class="info">
          <div
            class="avatar"
            :style="{ backgroundImage: `url(${userStore.userInfo?.avatar})` }"
          ></div>
          <div class="detail">
            <div class="top">
              <n-input-group>
                <n-input
                  v-model:value="roomName"
                  size="small"
                  placeholder="输入房间名"
                  :style="{ width: '50%' }"
                />
                <n-button
                  size="small"
                  type="primary"
                  @click="confirmRoomName"
                >
                  确定
                </n-button>
              </n-input-group>
            </div>
            <div class="bottom">
              <span v-if="NODE_ENV === 'development'">
                {{ mySocketId }}
              </span>
            </div>
          </div>
        </div>
        <div class="rtc">
          <div class="item">
            <div class="txt">码率设置</div>
            <div class="down">
              <n-select
                v-model:value="currentMaxBitrate"
                :options="maxBitrate"
              />
            </div>
          </div>
          <div class="item">
            <div class="txt">帧率设置</div>
            <div class="down">
              <n-select
                v-model:value="currentMaxFramerate"
                :options="maxFramerate"
              />
            </div>
          </div>
          <div class="item">
            <div class="txt">分辨率设置</div>
            <div class="down">
              <n-select
                v-model:value="currentResolutionRatio"
                :options="resolutionRatio"
              />
            </div>
          </div>
        </div>
        <div class="other">
          <div class="top">
            <div class="item">
              <i class="ico"></i>
              <span>
                正在观看：
                {{ liveUserList.length }}
              </span>
            </div>
            <div
              class="item"
              v-if="NODE_ENV === 'development'"
            >
              {{ liveRoomTypeEnumMap[appStore.liveRoomInfo?.type || ''] }}
            </div>
          </div>
          <div class="bottom">
            <n-button
              v-if="!roomLiving"
              type="info"
              size="small"
              @click="handleStartLive"
            >
              开始直播
            </n-button>
            <n-button
              v-else
              type="error"
              size="small"
              @click="handleEndLive"
            >
              结束直播
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="resource-card">
        <div class="title">素材列表</div>
        <div class="list">
          <div
            v-for="(item, index) in appStore.allTrack.filter(
              (item) => !item.hidden
            )"
            :key="index"
            class="item"
            @click="handleActiveObject(item)"
          >
            <div class="item-left">
              <div
                class="control-item"
                @click="handleEye(item)"
              >
                <n-icon
                  size="16"
                  v-if="item.openEye && item.type !== MediaTypeEnum.microphone"
                >
                  <EyeOutline></EyeOutline>
                </n-icon>
                <n-icon
                  size="16"
                  v-else
                >
                  <EyeOffOutline></EyeOffOutline>
                </n-icon>
              </div>
              <div class="name">
                {{ NODE_ENV === 'development' ? item.id : '' }}({{
                  mediaTypeEnumMap[item.type]
                }}){{ item.mediaName }}
              </div>
            </div>

            <div class="control">
              <div
                v-if="item.audio === 1"
                class="control-item"
                @click.stop="handleChangeMuted(item)"
              >
                <n-popover
                  placement="top"
                  trigger="hover"
                  :flip="false"
                >
                  <template #trigger>
                    <n-icon size="16">
                      <VolumeMuteOutline v-if="item.muted"></VolumeMuteOutline>
                      <VolumeHighOutline v-else></VolumeHighOutline>
                    </n-icon>
                  </template>
                  <div class="slider">
                    <n-slider
                      :value="item.volume"
                      :step="1"
                      @update-value="(v) => handleChangeVolume(item, v)"
                    />
                  </div>
                </n-popover>
              </div>
              <div
                class="control-item"
                @click="handleEdit(item)"
              >
                <n-icon size="16">
                  <CreateOutline></CreateOutline>
                </n-icon>
              </div>
              <div
                class="control-item"
                @click.stop="handleDel(item)"
              >
                <n-icon size="16">
                  <Close></Close>
                </n-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <n-button
            size="small"
            type="primary"
            @click="showSelectMediaModalCpt = true"
          >
            添加素材
          </n-button>
        </div>
      </div>
      <div class="danmu-card">
        <div class="title">弹幕互动</div>
        <div class="list-wrap">
          <div
            ref="danmuListRef"
            class="list"
          >
            <div
              v-for="(item, index) in damuList"
              :key="index"
              class="item"
            >
              <template v-if="item.msgType === DanmuMsgTypeEnum.danmu">
                <span class="name">
                  <span v-if="item.userInfo">
                    {{ item.userInfo.username }}[{{
                      item.userInfo.roles?.map((v) => v.role_name).join()
                    }}]
                  </span>
                  <span v-else>{{ item.socket_id }}[游客]</span>
                </span>
                <span>：</span>
                <span
                  class="msg"
                  v-if="item.msgIsFile === WsMessageMsgIsFileEnum.no"
                >
                  {{ item.msg }}
                </span>
                <div
                  class="msg img"
                  v-else
                >
                  <img
                    :src="item.msg"
                    alt=""
                    @load="handleScrollTop"
                  />
                </div>
              </template>
              <template v-else-if="item.msgType === DanmuMsgTypeEnum.otherJoin">
                <span class="name system">系统通知：</span>
                <span class="msg">
                  <span>{{ item.userInfo?.username || item.socket_id }}</span>
                  <span>进入直播！</span>
                </span>
              </template>
              <template
                v-else-if="item.msgType === DanmuMsgTypeEnum.userLeaved"
              >
                <span class="name system">系统通知：</span>
                <span class="msg">
                  <span>{{ item.userInfo?.username || item.socket_id }}</span>
                  <span>离开直播！</span>
                </span>
              </template>
            </div>
          </div>
        </div>
        <div
          class="send-msg"
          v-loading="msgLoading"
        >
          <div class="control">
            <div
              class="emoji-list"
              v-if="showEmoji"
            >
              <div
                class="item"
                v-for="(item, index) in emojiArray"
                :key="index"
                @click="handlePushStr(item)"
              >
                {{ item }}
              </div>
            </div>
            <div
              class="ico face"
              title="表情"
              @click="showEmoji = !showEmoji"
            ></div>
            <div
              class="ico img"
              title="图片"
              @click="mockClick"
            >
              <input
                ref="uploadRef"
                type="file"
                class="input-upload"
                accept=".webp,.png,.jpg,.jpeg,.gif"
                @change="uploadChange"
              />
            </div>
          </div>
          <textarea
            v-model="danmuStr"
            class="ipt"
            @keydown="keydownDanmu"
          ></textarea>
          <div
            class="btn"
            @click="handleSendDanmu"
          >
            发送
          </div>
        </div>
        <!-- <div class="send-msg">
          <input
            v-model="danmuStr"
            class="ipt"
            @keydown="keydownDanmu"
          />
          <n-button
            type="info"
            size="small"
            @click="sendDanmu"
          >
            发送
          </n-button>
        </div> -->
      </div>
    </div>
  </div>
  <div>
    <SelectMediaModalCpt
      v-if="showSelectMediaModalCpt"
      :all-media-type-list="allMediaTypeList"
      @close="showSelectMediaModalCpt = false"
      @ok="handleShowMediaModalCpt"
    ></SelectMediaModalCpt>

    <MediaModalCpt
      v-if="showMediaModalCpt"
      :is-edit="isEdit"
      :media-type="currentMediaType"
      :init-data="currentMediaData"
      @close="showMediaModalCpt = false"
      @add-ok="addMediaOk"
      @edit-ok="editMediaOk"
    ></MediaModalCpt>

    <OpenMicophoneTipCpt
      v-if="showOpenMicophoneTipCpt"
      @close="showOpenMicophoneTipCpt = false"
    ></OpenMicophoneTipCpt>

    <NoLiveTipModalCpt
      v-if="showNoLiveTipModalCpt"
      @close="showNoLiveTipModalCpt = false"
    ></NoLiveTipModalCpt>
  </div>
</template>

<script lang="ts" setup>
import {
  Camera,
  Close,
  CreateOutline,
  EyeOffOutline,
  EyeOutline,
  Videocam,
  VideocamOffSharp,
  VolumeHighOutline,
  VolumeMuteOutline,
} from '@vicons/ionicons5';
import { AVRecorder } from '@webav/av-recorder';
import { getRandomString } from 'billd-utils';
import { fabric } from 'fabric';
import {
  Raw,
  markRaw,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { useRoute } from 'vue-router';

import { fetchGetWsMessageList } from '@/api/wsMessage';
import {
  QINIU_RESOURCE,
  THEME_COLOR,
  liveRoomTypeEnumMap,
  mediaTypeEnumMap,
} from '@/constant';
import { emojiArray } from '@/emoji';
import { commentAuthTip, loginTip } from '@/hooks/use-login';
import { usePush } from '@/hooks/use-push';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { useQiniuJsUpload } from '@/hooks/use-upload';
import {
  DanmuMsgTypeEnum,
  MediaTypeEnum,
  WsMessageMsgIsFileEnum,
  WsMessageMsgIsShowEnum,
  WsMessageMsgIsVerifyEnum,
} from '@/interface';
import { AppRootState, useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { WsMsgTypeEnum, WsUpdateLiveRoomCoverImg } from '@/types/websocket';
import {
  base64ToFile,
  createVideo,
  formatDownTime2,
  generateBase64,
  getRandomEnglishString,
  handleUserMedia,
  readFile,
  saveFile,
} from '@/utils';
import { NODE_ENV } from 'script/constant';

import MediaModalCpt from './mediaModal/index.vue';
import NoLiveTipModalCpt from './noLiveTipModal/index.vue';
import OpenMicophoneTipCpt from './openMicophoneTip/index.vue';
import SelectMediaModalCpt from './selectMediaModal/index.vue';

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const networkStore = useNetworkStore();
const cacheStore = usePiniaCacheStore();
const { maxBitrate, maxFramerate, resolutionRatio, allMediaTypeList } =
  useRTCParams();

const {
  confirmRoomName,
  startLive,
  endLive,
  sendDanmu,
  keydownDanmu,
  sendBlob,
  handleSendGetLiveUser,
  roomId,
  msgIsFile,
  mySocketId,
  canvasVideoStream,
  roomLiving,
  currentResolutionRatio,
  currentMaxBitrate,
  currentMaxFramerate,
  danmuStr,
  roomName,
  damuList,
  liveUserList,
} = usePush();

const currentMediaType = ref(MediaTypeEnum.camera);
const currentMediaData = ref<AppRootState['allTrack'][0]>();
const recording = ref(false);
const showOpenMicophoneTipCpt = ref(false);
const showSelectMediaModalCpt = ref(false);
const showMediaModalCpt = ref(false);
const showNoLiveTipModalCpt = ref(false);
const isEdit = ref(false);
const topRef = ref<HTMLDivElement>();
const bottomRef = ref<HTMLDivElement>();
const danmuListRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const pushCanvasRef = ref<HTMLCanvasElement>();
const webaudioVideo = ref<HTMLVideoElement>();
const fabricCanvas = ref<fabric.Canvas>();
const startTime = ref(+new Date());
const initAudioFlag = ref(false);
const msgLoading = ref(false);
const uploadRef = ref<HTMLInputElement>();
const nullAudioStream = ref<MediaStream>();
const showEmoji = ref(false);
const worker = ref<Worker>();
const workerTimerId = ref();
const workerMsrTimerId = ref();
const timeCanvasDom = ref<Raw<fabric.Text>[]>([]);
const stopwatchCanvasDom = ref<Raw<fabric.Text>[]>([]);
const wrapSize = reactive({
  width: 0,
  height: 0,
});
const bodyAppendChildElArr = ref<HTMLElement[]>([]);
const liveType = Number(route.query.liveType);
const recorder = ref<MediaRecorder>();
const bolbId = ref(0);
const msrDelay = ref(1000 * 1);
const msrMaxDelay = ref(1000 * 5);
const suggestedName = ref('');
const recordVideoTimer = ref();
const recordVideoTime = ref('00:00:00');
let avRecorder: AVRecorder | null = null;

watch(
  () => roomLiving.value,
  (newval) => {
    if (!newval) {
      handleEndLive();
      showNoLiveTipModalCpt.value = true;
    } else {
      uploadLivePreview();
    }
  }
);

watch(
  () => currentMaxBitrate.value,
  () => {
    if (liveType === LiveRoomTypeEnum.msr) {
      const stream = pushCanvasRef.value!.captureStream();
      const audioTrack = webaudioVideo
        // @ts-ignore
        .value!.captureStream()
        .getAudioTracks()[0];
      stream.addTrack(audioTrack);
      handleMsr(stream);
    }
  }
);

watch(
  () => currentMaxFramerate.value,
  () => {
    renderFrame();
  }
);

watch(
  () => networkStore.rtcMap,
  (newVal) => {
    newVal.forEach((item) => {
      if (appStore.allTrack.find((v) => v.mediaName === item.receiver)) {
        return;
      }
      // if (lockMap.value.has(item.localStream?.id)) {
      //   return;
      // }
      // if (item.localStream?.id) {
      //   lockMap.value.add(item.localStream?.id);
      // }
      addMediaOk({
        id: getRandomEnglishString(6),
        openEye: true,
        audio: 1,
        video: 1,
        mediaName: item.receiver,
        type: MediaTypeEnum.metting,
        track: item.localStream?.getVideoTracks()[0],
        trackid: item.localStream?.getVideoTracks()[0].id,
        stream: item.localStream || undefined,
        streamid: item.localStream?.id,
        hidden: false,
        muted: false,
        scaleInfo: {},
      });
    });
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => damuList.value.length,
  () => {
    setTimeout(() => {
      handleScrollTop();
    }, 0);
  }
);

function handleSendDanmu() {
  sendDanmu();
}

function handlePushStr(str) {
  danmuStr.value += str;
  showEmoji.value = false;
}

function handleScrollTop() {
  if (danmuListRef.value) {
    danmuListRef.value.scrollTop = danmuListRef.value.scrollHeight + 10000;
  }
}

function handleSendBlob(event: BlobEvent) {
  bolbId.value += 1;
  // const val = bolbId.value;
  // if (val % 3 === 0) {
  //   setTimeout(() => {
  //     sendBlob({
  //       blob: event.data,
  //       blobId: `${val}`,
  //       delay: msrDelay.value,
  //       max_delay: msrMaxDelay.value,
  //     });
  //   }, 1000);
  //   return;
  // }
  sendBlob({
    blob: event.data,
    blobId: `${bolbId.value}`,
    delay: msrDelay.value,
    max_delay: msrMaxDelay.value,
  });
}

function mockClick() {
  if (!loginTip()) {
    return;
  }
  if (!commentAuthTip()) {
    return;
  }
  uploadRef.value?.click();
}

async function uploadChange() {
  const fileList = uploadRef.value?.files;
  if (fileList?.length) {
    try {
      msgLoading.value = true;
      msgIsFile.value = WsMessageMsgIsFileEnum.yes;
      const res = await useQiniuJsUpload({
        prefix: QINIU_RESOURCE.prefix['billd-live/msg-image/'],
        file: fileList[0],
      });
      if (res?.resultUrl) {
        danmuStr.value = res.resultUrl || '错误图片';
        sendDanmu();
      }
    } catch (error) {
      console.log(error);
    } finally {
      msgIsFile.value = WsMessageMsgIsFileEnum.no;
      msgLoading.value = false;
      if (uploadRef.value) {
        uploadRef.value.value = '';
      }
    }
  }
}

function handleMediaRecorderAllType() {
  // const types = [
  //   'video/webm',
  //   'audio/webm',
  //   'video/mpeg',
  //   'video/webm;codecs=vp8',
  //   'video/webm;codecs=vp9',
  //   'video/webm;codecs=daala',
  //   'video/webm;codecs=h264',
  //   'audio/webm;codecs=opus',
  //   'audio/webm;codecs=aac',
  //   'audio/webm;codecs=h264,opus',
  //   'video/webm;codecs=avc1.64001f,opus',
  //   'video/webm;codecs=avc1.4d002a,opus',
  // ];
  // Object.keys(types).forEach((item) => {
  //   console.log(types[item], MediaRecorder.isTypeSupported(types[item]));
  // });
}

function handleMsr(stream: MediaStream) {
  // https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter
  const mimeType = 'video/webm;codecs=avc1.4d002a,opus';
  // const mimeType = 'video/webm;codecs=avc1.64001f,opus'; // b站的参数

  if (!MediaRecorder.isTypeSupported(mimeType)) {
    console.error('不支持', mimeType);
    return;
  } else {
    console.log('支持', mimeType);
  }
  /**
   * 小写的 "kb/s" 表示千比特每秒，而大写的 "KB/s" 表示千字节每秒
   * 例如，当我们说 100 kb/s 时，意思是每秒传输100千比特（比特）的数据。而当我们说 100 KB/s 时，意思是每秒传输100千字节（字节）的数据，相当于800千比特（比特）
   * 千字节（KB）、兆字节（MB）、千兆字节（GB）
   * 8 比特（bits）等于 1 字节（byte）
   * 1 Kbps（千比特每秒）等于 0.125 KB/s（千字节每秒）
   * 1 Mbps（兆比特每秒）等于 0.125 MB/s（兆字节每秒）
   * bit，比特
   * byte，字节
   * videoBitsPerSecond的单位是比特，假设videoBitsPerSecond值是1000*2000，即2000000
   * 2000000比特等于2000000 / 8 / 1000 = 250 KB/s
   */

  recorder.value = new MediaRecorder(stream, {
    mimeType,
    // bitsPerSecond: 1000 * currentMaxBitrate.value,
    videoBitsPerSecond: 1000 * currentMaxBitrate.value, // 单位是比特
    // audioBitsPerSecond: 1000 * 2000,
  });
  recorder.value.ondataavailable = handleSendBlob;
  worker.value?.postMessage({
    type: 'request-clear-loop',
    timer: workerMsrTimerId.value,
  });
  worker.value?.postMessage({
    type: 'request-start-msr-loop',
    delay: msrDelay.value,
  });
  worker.value?.addEventListener('message', (e) => {
    if (e.data.type === 'response-start-msr-loop') {
      workerMsrTimerId.value = e.data.timer;
    } else if (e.data.type === 'response-msr-looping') {
      recorder.value?.stop();
      recorder.value?.start();
    }
  });
}

watch(
  () => roomId.value,
  (newval) => {
    if (newval) {
      handleSendGetLiveUser(Number(newval));
      handleHistoryMsg();
    }
  }
);

onMounted(() => {
  worker.value = new Worker('worker.js');
  setTimeout(() => {
    scrollTo(0, 0);
  }, 100);
  handleMediaRecorderAllType();
  initUserMedia();
  initCanvas();
  handleCache();
});

onUnmounted(() => {
  clearInterval(recordVideoTimer.value);
  recorder.value?.stop();
  bodyAppendChildElArr.value.forEach((el) => {
    el.remove();
  });
  clearFrame();
  worker.value?.terminate();

  appStore.allTrack.forEach((v) => {
    v.videoEl?.pause();
    v.videoEl?.removeAttribute('src');
    v.videoEl?.remove();
    v.stream?.getTracks().forEach((track) => {
      track.stop();
      v.stream?.removeTrack(track);
    });
  });
});

async function initUserMedia() {
  const res1 = await handleUserMedia({ video: true, audio: false });
  console.log('初始化获取摄像头成功');
  const res2 = await handleUserMedia({ video: false, audio: true });
  console.log('初始化获取麦克风成功');
  if (!res1 || !res2) {
    showOpenMicophoneTipCpt.value = true;
  }
}

function renderAll() {
  timeCanvasDom.value.forEach((item) => {
    item.text = new Date().toLocaleString();
  });
  stopwatchCanvasDom.value.forEach((item) => {
    const res = formatDownTime2({
      endTime: +new Date(),
      startTime: startTime.value,
      showMillisecond: true,
      addZero: true,
    });
    item.text = `${res.d}天${res.h}时${res.m}分${res.s}秒${res.ms}毫秒`;
  });
  fabricCanvas.value?.renderAll();
}

function clearFrame() {
  worker.value?.postMessage({
    type: 'request-clear-loop',
    data: {
      timer: workerTimerId.value,
    },
  });
}

function renderFrame() {
  /**
   * 理论情况：
   * currentMaxFramerate等于20，即每秒20帧，即1000 / 20 = 50毫秒轮询一次
   * currentMaxFramerate等于30，即每秒30帧，即1000 / 30 = 33.333毫秒轮询一次
   * currentMaxFramerate等于30，即每秒60帧，即1000 / 60 = 16.666毫秒轮询一次
   * 实际情况：
   * currentMaxFramerate等于20，即50毫秒轮询一次，实际fps是18
   * currentMaxFramerate等于20，希望fps是20，即需要(18/20) * 50 = 45毫秒轮询一次
   */
  let delay = 1000 / currentMaxFramerate.value;
  delay = (18 / 20) * delay;
  worker.value?.postMessage({
    type: 'request-clear-loop',
    timer: workerTimerId.value,
  });
  worker.value?.postMessage({
    type: 'request-start-loop',
    delay,
  });
  worker.value?.addEventListener('message', (e) => {
    if (e.data.type === 'response-start-loop') {
      workerTimerId.value = e.data.timer;
    } else if (e.data.type === 'response-looping') {
      renderAll();
    }
  });
}

function handleNullAudio() {
  // 创建AudioContext对象
  const audioContext = new window.AudioContext();

  // 创建输入和输出节点
  const source = audioContext.createBufferSource();
  const destination = audioContext.createMediaStreamDestination();

  // 连接输入和输出节点
  source.connect(destination);

  // 播放空白音频
  source.start();

  // 获取音频流
  const stream = destination.stream;

  // 检查是否已经获取到音频流
  if (stream) {
    console.log('已创建空的直播音频流');
    const video = createVideo({
      appendChild: false,
    });
    video.srcObject = stream;
    nullAudioStream.value = stream;
  } else {
    console.error('无法创建空的直播音频流');
  }
}

function handleMixedAudio() {
  const allAudioTrack = appStore.allTrack.filter((item) => item.audio === 1);
  const nullAudio = nullAudioStream.value?.getAudioTracks()[0];
  if (nullAudio) {
    allAudioTrack.push({
      openEye: true,
      id: getRandomEnglishString(6),
      audio: 2,
      video: 1,
      mediaName: '占位空音频',
      type: MediaTypeEnum.webAudio,
      track: nullAudio,
      trackid: nullAudio.id,
      stream: nullAudioStream.value,
      streamid: nullAudioStream.value?.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
    });
  }
  const audioCtx = new AudioContext();
  if (canvasVideoStream.value?.getAudioTracks()[0]) {
    canvasVideoStream.value.removeTrack(
      canvasVideoStream.value.getAudioTracks()[0]
    );
  }
  const res: { source: MediaStreamAudioSourceNode; gainNode: GainNode }[] = [];
  allAudioTrack.forEach((item) => {
    if (!audioCtx || !item.stream) return;
    const source = audioCtx.createMediaStreamSource(item.stream);
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = (item.volume || 0) / 100;
    source.connect(gainNode);
    res.push({ source, gainNode });
    // console.log('混流', item.stream?.id, item.stream);
  });
  const destination = audioCtx.createMediaStreamDestination();
  res.forEach((item) => {
    item.source.connect(item.gainNode);
    item.gainNode.connect(destination);
  });
  if (webaudioVideo.value) {
    webaudioVideo.value.remove();
  }
  webaudioVideo.value = createVideo({
    appendChild: false,
    muted: true,
  });
  bodyAppendChildElArr.value.push(webaudioVideo.value);
  webaudioVideo.value.className = 'web-audio-video';
  webaudioVideo.value!.srcObject = destination.stream;
  const resAudio = destination.stream.getAudioTracks()[0];
  canvasVideoStream.value?.addTrack(resAudio);
  networkStore.rtcMap.forEach((rtc) => {
    const sender = rtc.peerConnection
      ?.getSenders()
      .find((sender) => sender.track?.id === resAudio.id);
    if (!sender) {
      rtc.peerConnection
        ?.getSenders()
        ?.find((sender) => sender.track?.kind === 'audio')
        ?.replaceTrack(resAudio);
    }
  });
}

function handleEndLive() {
  worker.value?.postMessage({
    type: 'request-clear-loop',
    timer: workerMsrTimerId.value,
  });
  recorder.value?.removeEventListener('dataavailable', handleSendBlob);
  endLive();
}

async function handleHistoryMsg() {
  try {
    const res = await fetchGetWsMessageList({
      nowPage: 1,
      pageSize: appStore.liveRoomInfo?.history_msg_total || 10,
      orderName: 'created_at',
      orderBy: 'desc',
      live_room_id: Number(roomId.value),
      is_show: WsMessageMsgIsShowEnum.yes,
      is_verify: WsMessageMsgIsVerifyEnum.yes,
    });
    if (res.code === 200) {
      res.data.rows.forEach((v) => {
        damuList.value.unshift({
          ...v,
          live_room_id: v.live_room_id!,
          msg_id: v.id!,
          socket_id: '',
          msgType: v.msg_type!,
          msgIsFile: v.msg_is_file!,
          userInfo: v.user,
          msg: v.content!,
          username: v.username!,
          send_msg_time: Number(v.send_msg_time),
          redbag_send_id: v.redbag_send_id,
        });
      });
      if (
        appStore.liveRoomInfo?.system_msg &&
        appStore.liveRoomInfo?.system_msg !== ''
      ) {
        damuList.value.push({
          live_room_id: Number(roomId.value),
          socket_id: '',
          msgType: DanmuMsgTypeEnum.system,
          msgIsFile: WsMessageMsgIsFileEnum.no,
          msg: appStore.liveRoomInfo.system_msg,
          send_msg_time: Number(+new Date()),
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function handleScreenshot() {
  const url = generateBase64(pushCanvasRef.value!);
  const a = document.createElement('a');
  const event = new MouseEvent('click');
  a.download = `${+new Date()}截屏`;
  a.href = url;
  a.dispatchEvent(event);
}

async function handleRecordVideo() {
  if (!window.VideoDecoder || !window.AudioEncoder) {
    window.$message.warning(`当前环境不支持录制视频`);
    return;
  }
  initAudio();
  try {
    if (!recording.value) {
      suggestedName.value = `billd直播录制-${+new Date()}.mp4`;
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: suggestedName.value,
      });
      const writer = await fileHandle.createWritable();
      avRecorder = new AVRecorder(canvasVideoStream.value!.clone(), {});
      await avRecorder.start();
      const startTime = +new Date();
      recordVideoTimer.value = setInterval(() => {
        const res = formatDownTime2({
          endTime: +new Date(),
          startTime,
          showMillisecond: true,
          addZero: true,
        });
        if (res.d) {
          recordVideoTime.value = `${res.d}天${res.h}:${res.m}:${res.s}`;
        } else {
          recordVideoTime.value = `${res.h}:${res.m}:${res.s}`;
        }
      }, 1000);
      avRecorder.outputStream?.pipeTo(writer).catch(console.error);
    } else {
      clearInterval(recordVideoTimer.value);
      recordVideoTime.value = '00:00:00';
      await avRecorder?.stop();
      window.$message.success(`录制文件: ${suggestedName.value} 已保存到本地`);
      avRecorder = null;
    }
    recording.value = !recording.value;
  } catch (error) {
    console.log(error);
    recording.value = false;
  }
}

function initAudio() {
  if (initAudioFlag.value) return;
  initAudioFlag.value = true;
  handleNullAudio();
  handleMixedAudio();
}

async function uploadLivePreview() {
  const base64 = generateBase64(pushCanvasRef.value!);
  const file = base64ToFile(base64, `tmp.webp`);
  const uploadRes = await useQiniuJsUpload({
    prefix: QINIU_RESOURCE.prefix['billd-live/live-preview/'],
    file,
  });
  if (uploadRes.flag && uploadRes.resultUrl) {
    networkStore.wsMap
      .get(roomId.value)
      ?.send<WsUpdateLiveRoomCoverImg['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.updateLiveRoomCoverImg,
        data: {
          cover_img: uploadRes.resultUrl,
        },
      });
  }
}

function handleStartLive() {
  if (!appStore.allTrack.length) {
    window.$message.warning('至少选择一个素材');
    return;
  }
  initAudio();
  startLive({
    type: liveType,
    msrDelay: msrDelay.value,
    msrMaxDelay: 5000,
  });
  if (liveType === LiveRoomTypeEnum.msr) {
    const stream = pushCanvasRef.value!.captureStream();
    // @ts-ignore
    const audioTrack = webaudioVideo.value!.captureStream().getAudioTracks()[0];
    stream.addTrack(audioTrack);
    handleMsr(stream);
  }
}

function handleScale({ width, height }: { width: number; height: number }) {
  const resolutionHeight = currentResolutionRatio.value;
  const resolutionWidth = currentResolutionRatio.value * appStore.videoRatio;
  let ratio = 1;
  if (width > resolutionWidth) {
    const r1 = resolutionWidth / width;
    ratio = r1;
  }
  if (height > resolutionHeight) {
    const r1 = resolutionHeight / height;
    if (ratio > r1) {
      ratio = r1;
    }
  }
  return ratio;
}

function autoCreateVideo(data: {
  file?: File;
  stream?: MediaStream;
  id: string;
  rect?: { left: number; top: number };
  scaleInfo?: Record<number, { scaleX: number; scaleY: number }>;
  muted?: boolean;
}) {
  const { file, id, rect, scaleInfo, muted } = data;
  let stream = data.stream;
  let videoEl: HTMLVideoElement;
  if (file) {
    const url = URL.createObjectURL(file);
    videoEl = createVideo({
      appendChild: false,
      muted,
    });
    videoEl.src = url;
    // @ts-ignore
    stream = videoEl.captureStream();
  } else {
    videoEl = createVideo({ appendChild: false, muted });
    if (stream) {
      videoEl.srcObject = stream;
    }
  }
  bodyAppendChildElArr.value.push(videoEl);
  videoEl.setAttribute('videoid', id);
  return new Promise<{
    canvasDom: Raw<fabric.Image>;
    videoEl: HTMLVideoElement;
    scale: number;
    stream: MediaStream;
  }>((resolve) => {
    videoEl.onloadedmetadata = () => {
      let canvasDom: Raw<fabric.Image>;
      let ratio;
      function main() {
        const width =
          stream?.getVideoTracks()[0].getSettings().width! ||
          videoEl.videoWidth;
        const height =
          stream?.getVideoTracks()[0].getSettings().height! ||
          videoEl.videoHeight;
        ratio = handleScale({ width, height });
        videoEl.width = width;
        videoEl.height = height;
        const old = appStore.allTrack.find((item) => item.id === id);
        if (canvasDom) {
          fabricCanvas.value?.remove(canvasDom);
          canvasDom = markRaw(
            new fabric.Image(videoEl, {
              top: (old?.rect?.top || rect?.top || 0) / window.devicePixelRatio,
              left:
                (old?.rect?.left || rect?.left || 0) / window.devicePixelRatio,
              width,
              height,
            })
          );
        } else {
          canvasDom = markRaw(
            new fabric.Image(videoEl, {
              top: (old?.rect?.top || rect?.top || 0) / window.devicePixelRatio,
              left:
                (old?.rect?.left || rect?.left || 0) / window.devicePixelRatio,
              width,
              height,
            })
          );
        }
        appStore.allTrack.forEach((item) => {
          if (item.id === id) {
            if (item.canvasDom) {
              item.canvasDom = canvasDom;
            }
          }
        });
        handleMoving({ canvasDom, id });
        handleScaling({ canvasDom, id });
        canvasDom.scale(scaleInfo?.[window.devicePixelRatio]?.scaleX || 1);
        fabricCanvas.value!.add(canvasDom);
        resolve({ canvasDom, scale: ratio, videoEl, stream: stream! });
      }
      main();
      videoEl?.addEventListener('resize', () => {
        main();
      });
    };
  });
}

watch(
  () => currentResolutionRatio.value,
  (newHeight, oldHeight) => {
    changeCanvasAttr({ newHeight, oldHeight });
  }
);

// 容器宽高，1280*720，即720p
// canvas容器宽高，2560*1440，即1440p

// ======
// 容器宽高，960*540，即540p
// dom宽高，640*480
// canvas容器宽高，960*540，即540p
// 将dom绘制到容器里，此时dom的大小就是640*480
// 需求，不管切换多少分辨率，我要看到的dom都是一样大小，即
// 960*540时，dom是640*480
// 1280*720时，dom不能是640*480了，因为这样他就会对比上一个分辨率的dom看起来小了，960/1280=0.75,540/720=0.75，
// 其实就是分辨率变大了，我们就要将图片也变大，即图片的宽是640/0.75=853.4，高是480/0.75=640
// 坐标变化，960*540时，dom坐标是100,100
// 1280*720时，dom的坐标不能再是100，100了，否则对比上一个分辨率看起来偏

function changeCanvasAttr({
  newHeight,
  oldHeight,
}: {
  newHeight: number;
  oldHeight: number;
}) {
  if (fabricCanvas.value) {
    const resolutionHeight =
      currentResolutionRatio.value / window.devicePixelRatio;
    const resolutionWidth =
      (currentResolutionRatio.value / window.devicePixelRatio) *
      appStore.videoRatio;
    fabricCanvas.value.setWidth(resolutionWidth);
    fabricCanvas.value.setHeight(resolutionHeight);
    appStore.allTrack.forEach((iten) => {
      const item = iten.canvasDom;

      if (item) {
        // 分辨率变小了，将图片变小
        if (newHeight < oldHeight) {
          const ratio2 = oldHeight / newHeight;
          item.left = item.left! / ratio2;
          item.top = item.top! / ratio2;
        } else {
          // 分辨率变大了，将图片变大
          const ratio2 = oldHeight / newHeight;
          item.left = item.left! / ratio2;
          item.top = item.top! / ratio2;
        }
      }
    });
    appStore.allTrack.forEach((iten) => {
      const item = iten.canvasDom;

      if (item) {
        // 分辨率变小了，将图片变小
        if (newHeight < oldHeight) {
          const ratio = newHeight / oldHeight;
          const ratio1 = (item.scaleX || 1) * ratio;
          item.scale(ratio1);
        } else {
          // 分辨率变大了，将图片变大
          const ratio = newHeight / oldHeight;
          const ratio1 = (item.scaleX || 1) * ratio;
          item.scale(ratio1);
        }
      }
    });

    changeCanvasStyle();
  }
}

function changeCanvasStyle() {
  // @ts-ignore
  fabricCanvas.value.wrapperEl.style.width = `${wrapSize.width}px`;
  // @ts-ignore
  fabricCanvas.value.wrapperEl.style.height = `${wrapSize.height}px`;
  // @ts-ignore
  fabricCanvas.value.lowerCanvasEl.style.width = `${wrapSize.width}px`;
  // @ts-ignore
  fabricCanvas.value.lowerCanvasEl.style.height = `${wrapSize.height}px`;
  // @ts-ignore
  fabricCanvas.value.upperCanvasEl.style.width = `${wrapSize.width}px`;
  // @ts-ignore
  fabricCanvas.value.upperCanvasEl.style.height = `${wrapSize.height}px`;
}

function initCanvas() {
  const resolutionHeight =
    currentResolutionRatio.value / window.devicePixelRatio;
  const resolutionWidth =
    (currentResolutionRatio.value / window.devicePixelRatio) *
    appStore.videoRatio;
  const wrapWidth = containerRef.value!.getBoundingClientRect().width;
  // const wrapWidth = 1920;
  const ratio = wrapWidth / resolutionWidth;
  const wrapHeight = resolutionHeight * ratio;
  // const wrapHeight = 1080;
  // lower-canvas: 实际的canvas画面，也就是pushCanvasRef
  // upper-canvas: 操作时候的canvas
  const ins = markRaw(new fabric.Canvas(pushCanvasRef.value!));
  ins.setWidth(resolutionWidth);
  ins.setHeight(resolutionHeight);
  ins.setBackgroundColor('black', () => {
    console.log('setBackgroundColor回调');
  });
  wrapSize.width = wrapWidth;
  wrapSize.height = wrapHeight;
  fabricCanvas.value = ins;
  renderFrame();
  changeCanvasStyle();
}

/**
 * 1: {scaleX: 1, scaleY: 1}
 * 2: {scaleX: 0.5, scaleY: 0.5}
 * 3: {scaleX: 0.3333333333333333, scaleY: 0.3333333333333333}
 * 4: {scaleX: 0.25, scaleY: 0.25}
 */

/**
 * 二倍屏即1px里面有2个像素；三倍屏1px里面有3个像素，以此类推
 * 一个图片，宽高都是100px
 * 一倍屏展示：100px等于100个像素，一比一展示
 * 二倍屏展示：100px等于100个像素，二比一展示，即在二倍屏的100px看起来会比一倍屏的100px小一倍
 * 如果需要在一杯和二倍屏幕的时候看的大小都一样：
 * 1，在二倍屏的时候，需要将100px放大一倍，即200px；
 * 2，在一倍屏的时候，需要将100px缩小一倍，即50px；
 */
function handleScaling({ canvasDom, id }) {
  canvasDom.on('scaling', () => {
    appStore.allTrack.forEach((item) => {
      if (id === item.id) {
        item.scaleInfo[window.devicePixelRatio] = {
          scaleX: canvasDom.scaleX || 1,
          scaleY: canvasDom.scaleY || 1,
        };
        Object.keys(item.scaleInfo).forEach((iten) => {
          if (window.devicePixelRatio !== Number(iten)) {
            if (window.devicePixelRatio > Number(iten)) {
              item.scaleInfo[iten] = {
                scaleX:
                  item.scaleInfo[window.devicePixelRatio].scaleX *
                  window.devicePixelRatio,
                scaleY:
                  item.scaleInfo[window.devicePixelRatio].scaleY *
                  window.devicePixelRatio,
              };
            } else {
              if (window.devicePixelRatio === 1) {
                item.scaleInfo[iten] = {
                  scaleX: item.scaleInfo[1].scaleX / Number(iten),
                  scaleY: item.scaleInfo[1].scaleY / Number(iten),
                };
              } else {
                item.scaleInfo[iten] = {
                  scaleX: item.scaleInfo[1].scaleX * Number(iten),
                  scaleY: item.scaleInfo[1].scaleY * Number(iten),
                };
              }
            }
          }
        });
      }
    });
    cacheStore.setResourceList(appStore.allTrack);
  });
}
function handleMoving({
  canvasDom,
  id,
}: {
  canvasDom: fabric.Image | fabric.Text;
  id: string;
}) {
  canvasDom.on('moving', () => {
    appStore.allTrack.forEach((item) => {
      if (id === item.id) {
        item.rect = {
          top: (canvasDom.top || 0) * window.devicePixelRatio,
          left: (canvasDom.left || 0) * window.devicePixelRatio,
        };
      }
    });
    cacheStore.setResourceList(appStore.allTrack);
  });
}

async function handleDisplayMedia({ video, audio }) {
  try {
    const event = await navigator.mediaDevices.getDisplayMedia({
      video,
      audio,
    });
    return event;
  } catch (error) {
    console.log(error);
  }
}

async function handleCache() {
  const res: AppRootState['allTrack'] = [];
  const err: string[] = [];
  const queue: any[] = [];
  cacheStore['resource-list'].forEach((item) => {
    // @ts-ignore
    const obj: AppRootState['allTrack'][0] = {};
    obj.openEye = item.openEye;
    obj.audio = item.audio;
    obj.video = item.video;
    obj.id = item.id;
    obj.deviceId = item.deviceId;
    obj.type = item.type;
    obj.hidden = item.hidden;
    obj.mediaName = item.mediaName;
    obj.muted = item.muted;
    obj.volume = item.volume;
    obj.rect = item.rect;
    obj.scaleInfo = item.scaleInfo;
    obj.stopwatchInfo = item.stopwatchInfo;

    async function handleMediaVideo() {
      const { code, file } = await readFile(item.id);
      if (code === 1 && file) {
        const { videoEl, stream, canvasDom } = await autoCreateVideo({
          file,
          id: obj.id,
          muted: item.muted,
          rect: item.rect,
          scaleInfo: item.scaleInfo,
        });
        if (obj.volume !== undefined) {
          videoEl.volume = obj.volume / 100;
        }
        obj.videoEl = videoEl;
        obj.canvasDom = canvasDom;
        obj.stream = stream;
        obj.streamid = stream.id;
        obj.track = stream.getVideoTracks()[0];
        obj.trackid = stream.getVideoTracks()[0].id;
      } else {
        console.error('读取文件失败');
      }
    }

    async function handleImg() {
      const { code, file } = await readFile(item.id);
      if (code === 1 && file) {
        const imgEl = await new Promise<HTMLImageElement>((resolve) => {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            function () {
              const img = document.createElement('img');
              img.src = reader.result as string;
              img.onload = () => {
                resolve(img);
              };
            },
            false
          );
          if (file) {
            reader.readAsDataURL(file);
          }
        });
        if (fabricCanvas.value) {
          const canvasDom = markRaw(
            new fabric.Image(imgEl, {
              top: (item.rect?.top || 0) / window.devicePixelRatio,
              left: (item.rect?.left || 0) / window.devicePixelRatio,
              width: imgEl.width,
              height: imgEl.height,
            })
          );
          handleMoving({ canvasDom, id: obj.id });
          handleScaling({ canvasDom, id: obj.id });
          canvasDom.scale(
            item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1
          );
          canvasDom.opacity = item.openEye ? 1 : 0;
          fabricCanvas.value.add(canvasDom);
          obj.canvasDom = canvasDom;
        }
      } else {
        console.error('读取文件失败');
      }
    }

    async function handleScreen() {
      try {
        const event = await handleDisplayMedia({
          video: true,
          audio: true,
        });
        if (!event) return;
        const videoEl = createVideo({ appendChild: false });
        bodyAppendChildElArr.value.push(videoEl);
        videoEl.setAttribute('videoid', obj.id);
        videoEl.srcObject = event;
        await new Promise((resolve) => {
          videoEl.onloadedmetadata = () => {
            const stream = videoEl
              // @ts-ignore
              .captureStream();
            const width = stream.getVideoTracks()[0].getSettings().width!;
            const height = stream.getVideoTracks()[0].getSettings().height!;
            videoEl.width = width;
            videoEl.height = height;

            const canvasDom = markRaw(
              new fabric.Image(videoEl, {
                top: (item.rect?.top || 0) / window.devicePixelRatio,
                left: (item.rect?.left || 0) / window.devicePixelRatio,
                width,
                height,
              })
            );
            handleMoving({ canvasDom, id: item.id });
            handleScaling({ canvasDom, id: item.id });
            canvasDom.scale(
              item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1
            );
            canvasDom.opacity = item.openEye ? 1 : 0;
            fabricCanvas.value!.add(canvasDom);
            obj.videoEl = videoEl;
            obj.canvasDom = canvasDom;
            resolve({ videoEl, canvasDom });
          };
        });
      } catch (error) {
        console.error(error);
        handleDel(obj);
        err.push(obj.id);
      }
    }

    async function handleMicrophone() {
      const event = await handleUserMedia({
        video: false,
        audio: { deviceId: obj.deviceId },
      });
      if (!event) return;
      const videoEl = createVideo({ appendChild: false, muted: true });
      bodyAppendChildElArr.value.push(videoEl);
      videoEl.setAttribute('videoid', obj.id);
      videoEl.srcObject = event;
      if (obj.volume !== undefined) {
        videoEl.volume = obj.muted ? 0 : obj.volume / 100;
      }
      obj.videoEl = videoEl;
      obj.stream = event;
      obj.streamid = event.id;
      obj.track = event.getAudioTracks()[0];
      obj.trackid = event.getAudioTracks()[0].id;
    }

    async function handleCamera() {
      const event = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: obj.deviceId },
        audio: false,
      });
      const videoEl = createVideo({ appendChild: false });
      bodyAppendChildElArr.value.push(videoEl);
      videoEl.setAttribute('videoid', obj.id);
      videoEl.srcObject = event;
      await new Promise((resolve) => {
        videoEl.onloadedmetadata = () => {
          const stream = videoEl
            // @ts-ignore
            .captureStream();
          const width = stream.getVideoTracks()[0].getSettings().width!;
          const height = stream.getVideoTracks()[0].getSettings().height!;
          videoEl.width = width;
          videoEl.height = height;

          const canvasDom = markRaw(
            new fabric.Image(videoEl, {
              top: (item.rect?.top || 0) / window.devicePixelRatio,
              left: (item.rect?.left || 0) / window.devicePixelRatio,
              width,
              height,
            })
          );
          handleMoving({ canvasDom, id: item.id });
          handleScaling({ canvasDom, id: item.id });
          canvasDom.scale(
            item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1
          );
          canvasDom.opacity = item.openEye ? 1 : 0;
          fabricCanvas.value!.add(canvasDom);
          obj.videoEl = videoEl;
          obj.canvasDom = canvasDom;
          resolve({ videoEl, canvasDom });
        };
      });
    }

    if ([MediaTypeEnum.metting, MediaTypeEnum.pk].includes(obj.type)) {
      err.push(obj.id);
    }

    if (item.type === MediaTypeEnum.media && item.video === 1) {
      queue.push(handleMediaVideo());
    } else if (item.type === MediaTypeEnum.screen) {
      queue.push(handleScreen());
    } else if (item.type === MediaTypeEnum.camera) {
      queue.push(handleCamera());
    } else if (item.type === MediaTypeEnum.microphone) {
      queue.push(handleMicrophone());
    } else if (item.type === MediaTypeEnum.img) {
      queue.push(handleImg());
    } else if (item.type === MediaTypeEnum.txt) {
      obj.txtInfo = item.txtInfo;
      obj.scaleInfo = item.scaleInfo;
      if (fabricCanvas.value) {
        const canvasDom = markRaw(
          new fabric.Text(item.txtInfo?.txt || '', {
            top: (item.rect?.top || 0) / window.devicePixelRatio,
            left: (item.rect?.left || 0) / window.devicePixelRatio,
            fill: item.txtInfo?.color,
          })
        );
        handleMoving({ canvasDom, id: obj.id });
        handleScaling({ canvasDom, id: obj.id });
        // fabric.Text类型不能除以分辨率
        canvasDom.scale(item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1);
        canvasDom.opacity = item.openEye ? 1 : 0;
        fabricCanvas.value.add(canvasDom);
        obj.canvasDom = canvasDom;
      }
    } else if (item.type === MediaTypeEnum.time) {
      obj.timeInfo = item.timeInfo;
      obj.scaleInfo = item.scaleInfo;
      if (fabricCanvas.value) {
        const canvasDom = markRaw(
          new fabric.Text(new Date().toLocaleString(), {
            top: (item.rect?.top || 0) / window.devicePixelRatio,
            left: (item.rect?.left || 0) / window.devicePixelRatio,
            fill: item.timeInfo?.color,
          })
        );
        timeCanvasDom.value.push(canvasDom);
        handleMoving({ canvasDom, id: obj.id });
        handleScaling({ canvasDom, id: obj.id });
        // fabric.Text类型不能除以分辨率
        canvasDom.scale(item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1);
        canvasDom.opacity = item.openEye ? 1 : 0;
        fabricCanvas.value.add(canvasDom);
        obj.canvasDom = canvasDom;
      }
    } else if (item.type === MediaTypeEnum.stopwatch) {
      obj.stopwatchInfo = item.stopwatchInfo;
      obj.scaleInfo = item.scaleInfo;
      if (fabricCanvas.value) {
        const canvasDom = markRaw(
          new fabric.Text('00天00时00分00秒000毫秒', {
            top: (item.rect?.top || 0) / window.devicePixelRatio,
            left: (item.rect?.left || 0) / window.devicePixelRatio,
            fill: item.stopwatchInfo?.color,
          })
        );
        stopwatchCanvasDom.value.push(canvasDom);
        handleMoving({ canvasDom, id: obj.id });
        handleScaling({ canvasDom, id: obj.id });
        // fabric.Text类型不能除以分辨率
        canvasDom.scale(item.scaleInfo?.[window.devicePixelRatio]?.scaleX || 1);
        canvasDom.opacity = item.openEye ? 1 : 0;
        fabricCanvas.value.add(canvasDom);
        obj.canvasDom = canvasDom;
      }
    }
    res.push(obj);
  });
  await Promise.all(queue);

  canvasVideoStream.value = pushCanvasRef.value!.captureStream();
  appStore.setAllTrack(res.filter((v) => !err.includes(v.id)));
}

function handleShowMediaModalCpt(val: MediaTypeEnum) {
  isEdit.value = false;
  currentMediaData.value = undefined;
  showMediaModalCpt.value = true;
  showSelectMediaModalCpt.value = false;
  currentMediaType.value = val;
}

function handleEdit(item: AppRootState['allTrack'][0]) {
  currentMediaType.value = item.type;
  currentMediaData.value = item;
  isEdit.value = true;
  showMediaModalCpt.value = true;
}

function setScaleInfo({ track, canvasDom, scale = 1 }) {
  [1, 2, 3, 4].forEach((devicePixelRatio) => {
    track.scaleInfo[devicePixelRatio] = {
      scaleX: (1 / devicePixelRatio) * scale,
      scaleY: (1 / devicePixelRatio) * scale,
    };
  });
  if (window.devicePixelRatio !== 1) {
    const ratio = (1 / window.devicePixelRatio) * scale;
    canvasDom.scale(ratio);
    track.scaleInfo[window.devicePixelRatio] = {
      scaleX: ratio,
      scaleY: ratio,
    };
  }
}

async function addMediaOk(val: AppRootState['allTrack'][0]) {
  showMediaModalCpt.value = false;
  if (val.type === MediaTypeEnum.screen) {
    const event = await handleDisplayMedia({
      video: {
        deviceId: val.deviceId,
        // displaySurface: 'monitor', // browser默认标签页;window默认窗口;monitor默认整个屏幕
      },
      audio: true,
    });
    if (!event) return;
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.screen,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
      rect: { left: 0, top: 0 },
    };

    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream: event,
      id: videoTrack.id,
      rect: videoTrack.rect,
      scaleInfo: videoTrack.scaleInfo,
    });
    setScaleInfo({ canvasDom, track: videoTrack, scale });
    videoTrack.videoEl = videoEl;
    videoTrack.canvasDom = canvasDom;

    const audio = event.getAudioTracks();
    if (audio.length) {
      videoTrack.audio = 1;
      videoTrack.volume = appStore.normalVolume;
      const audioTrack: AppRootState['allTrack'][0] = {
        openEye: true,
        id: videoTrack.id,
        audio: 1,
        video: 2,
        mediaName: val.mediaName,
        type: MediaTypeEnum.screen,
        track: event.getAudioTracks()[0],
        trackid: event.getAudioTracks()[0].id,
        stream: event,
        streamid: event.id,
        hidden: true,
        muted: false,
        volume: videoTrack.volume,
        scaleInfo: {},
      };
      const res = [...appStore.allTrack, videoTrack, audioTrack];
      appStore.setAllTrack(res);
      cacheStore.setResourceList(res);
      handleMixedAudio();
    } else {
      const res = [...appStore.allTrack, videoTrack];
      appStore.setAllTrack(res);
      cacheStore.setResourceList(res);
    }
    console.log('获取窗口成功');
  } else if (val.type === MediaTypeEnum.camera) {
    const event = await handleUserMedia({
      video: {
        deviceId: val.deviceId,
      },
      audio: false,
    });
    if (!event) return;
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      deviceId: val.deviceId,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.camera,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
      rect: { left: 0, top: 0 },
    };
    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream: event,
      id: videoTrack.id,
      rect: videoTrack.rect,
      scaleInfo: videoTrack.scaleInfo,
    });
    setScaleInfo({ canvasDom, track: videoTrack, scale });
    videoTrack.videoEl = videoEl;
    videoTrack.canvasDom = canvasDom;

    const res = [...appStore.allTrack, videoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    console.log('获取摄像头成功');
  } else if (val.type === MediaTypeEnum.pk) {
    const event = val.stream;
    if (!event) return;
    const videoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      deviceId: val.deviceId,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.pk,
      track: event.getVideoTracks()[0],
      trackid: event.getVideoTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      scaleInfo: {},
      rect: { left: 0, top: 0 },
    };
    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream: event,
      id: videoTrack.id,
      rect: videoTrack.rect,
      scaleInfo: videoTrack.scaleInfo,
    });
    setScaleInfo({ canvasDom, track: videoTrack, scale });
    videoTrack.videoEl = videoEl;
    videoTrack.canvasDom = canvasDom;

    const res = [...appStore.allTrack, videoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    console.log('获取pk成功');
  } else if (val.type === MediaTypeEnum.metting) {
    const stream = val.stream;

    if (!stream) return;
    const mettingVideoTrack = val;
    mettingVideoTrack.rect = { left: 0, top: 0 };
    const { canvasDom, videoEl, scale } = await autoCreateVideo({
      stream,
      id: mettingVideoTrack.id,
      rect: mettingVideoTrack.rect,
      scaleInfo: mettingVideoTrack.scaleInfo,
    });
    setScaleInfo({ canvasDom, track: mettingVideoTrack, scale });
    mettingVideoTrack.videoEl = videoEl;
    mettingVideoTrack.canvasDom = canvasDom;

    const res = [...appStore.allTrack, mettingVideoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    console.log('获取会议成功');
    if (stream.getAudioTracks()[0]) {
      console.log('会议有音频');
      mettingVideoTrack.audio = 1;
      mettingVideoTrack.volume = appStore.normalVolume;
      const audioTrack: AppRootState['allTrack'][0] = {
        id: mettingVideoTrack.id,
        openEye: true,
        audio: 1,
        video: 2,
        mediaName: val.mediaName,
        type: MediaTypeEnum.media,
        track: stream.getAudioTracks()[0],
        trackid: stream.getAudioTracks()[0].id,
        stream,
        streamid: stream.id,
        hidden: true,
        muted: false,
        volume: mettingVideoTrack.volume,
        scaleInfo: {},
      };
      const res = [...appStore.allTrack, audioTrack];
      appStore.setAllTrack(res);
      cacheStore.setResourceList(res);
      handleMixedAudio();
    }
  } else if (val.type === MediaTypeEnum.microphone) {
    const event = await handleUserMedia({
      video: false,
      audio: { deviceId: val.deviceId },
    });
    if (!event) return;
    const microphoneVideoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      deviceId: val.deviceId,
      audio: 1,
      video: 2,
      mediaName: val.mediaName,
      type: MediaTypeEnum.microphone,
      track: event.getAudioTracks()[0],
      trackid: event.getAudioTracks()[0].id,
      stream: event,
      streamid: event.id,
      hidden: false,
      muted: false,
      volume: appStore.normalVolume,
      scaleInfo: {},
    };
    const videoEl = createVideo({ appendChild: false, muted: true });
    bodyAppendChildElArr.value.push(videoEl);
    videoEl.setAttribute('videoid', microphoneVideoTrack.id);
    videoEl.srcObject = event;
    microphoneVideoTrack.videoEl = videoEl;
    const res = [...appStore.allTrack, microphoneVideoTrack];
    appStore.setAllTrack(res);
    cacheStore.setResourceList(res);
    handleMixedAudio();
    console.log('获取麦克风成功');
  } else if (val.type === MediaTypeEnum.txt) {
    const txtTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.txt,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      const canvasDom = markRaw(
        new fabric.Text(val.txtInfo?.txt || '', {
          top: 0,
          left: 0,
          fill: val.txtInfo?.color,
        })
      );
      handleMoving({ canvasDom, id: txtTrack.id });
      handleScaling({ canvasDom, id: txtTrack.id });
      txtTrack.txtInfo = val.txtInfo;
      if (window.devicePixelRatio !== 1) {
        const ratio = 1 / window.devicePixelRatio;
        canvasDom.scale(ratio);
        txtTrack.scaleInfo[window.devicePixelRatio] = {
          scaleX: ratio,
          scaleY: ratio,
        };
      } else {
        txtTrack.scaleInfo[window.devicePixelRatio] = { scaleX: 1, scaleY: 1 };
      }
      txtTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, txtTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取文字成功');
  } else if (val.type === MediaTypeEnum.time) {
    const timeTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.time,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      const canvasDom = markRaw(
        new fabric.Text(new Date().toLocaleString(), {
          top: 0,
          left: 0,
          fill: val.timeInfo?.color,
        })
      );
      setScaleInfo({ canvasDom, track: timeTrack });
      timeCanvasDom.value.push(canvasDom);
      handleMoving({ canvasDom, id: timeTrack.id });
      handleScaling({ canvasDom, id: timeTrack.id });
      timeTrack.timeInfo = val.timeInfo;
      timeTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, timeTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取时间成功');
  } else if (val.type === MediaTypeEnum.stopwatch) {
    const stopwatchTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.stopwatch,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };
    if (fabricCanvas.value) {
      const canvasDom = markRaw(
        new fabric.Text('00天00时00分00秒000毫秒', {
          top: 0,
          left: 0,
          fill: val.stopwatchInfo?.color,
          // editable: true,
        })
      );
      setScaleInfo({ canvasDom, track: stopwatchTrack });
      stopwatchCanvasDom.value.push(canvasDom);
      handleMoving({ canvasDom, id: stopwatchTrack.id });
      handleScaling({ canvasDom, id: stopwatchTrack.id });
      stopwatchTrack.stopwatchInfo = val.stopwatchInfo;
      stopwatchTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, stopwatchTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取秒表成功');
  } else if (val.type === MediaTypeEnum.img) {
    const imgTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.img,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
    };

    if (fabricCanvas.value) {
      if (!val.imgInfo) return;
      const file = val.imgInfo[0].file!;
      const { code } = await saveFile({ file, fileName: imgTrack.id });
      if (code !== 1) return;
      const imgEl = await new Promise<HTMLImageElement>((resolve) => {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          function () {
            const img = document.createElement('img');
            img.src = reader.result as string;
            img.onload = () => {
              resolve(img);
            };
          },
          false
        );
        if (file) {
          reader.readAsDataURL(file);
        }
      });

      const canvasDom = markRaw(
        new fabric.Image(imgEl, {
          top: 0,
          left: 0,
          width: imgEl.width,
          height: imgEl.height,
        })
      );
      const scale = handleScale({ width: imgEl.width, height: imgEl.height });
      setScaleInfo({ canvasDom, track: imgTrack, scale });
      handleMoving({ canvasDom, id: imgTrack.id });
      handleScaling({ canvasDom, id: imgTrack.id });
      imgTrack.canvasDom = canvasDom;
      fabricCanvas.value.add(canvasDom);
    }

    const res = [...appStore.allTrack, imgTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取图片成功');
  } else if (val.type === MediaTypeEnum.media) {
    const mediaVideoTrack: AppRootState['allTrack'][0] = {
      id: getRandomEnglishString(6),
      openEye: true,
      audio: 2,
      video: 1,
      mediaName: val.mediaName,
      type: MediaTypeEnum.media,
      track: undefined,
      trackid: undefined,
      stream: undefined,
      streamid: undefined,
      hidden: false,
      muted: false,
      scaleInfo: {},
      rect: { left: 0, top: 0 },
    };
    if (fabricCanvas.value) {
      if (!val.mediaInfo) return;
      const file = val.mediaInfo[0].file!;
      const { code } = await saveFile({ file, fileName: mediaVideoTrack.id });
      if (code !== 1) return;
      const { videoEl, canvasDom, scale, stream } = await autoCreateVideo({
        file,
        id: mediaVideoTrack.id,
        muted: mediaVideoTrack.muted,
        rect: mediaVideoTrack.rect,
        scaleInfo: mediaVideoTrack.scaleInfo,
      });
      setScaleInfo({ canvasDom, track: mediaVideoTrack, scale });
      mediaVideoTrack.videoEl = videoEl;
      mediaVideoTrack.canvasDom = canvasDom;
      mediaVideoTrack.stream = stream;
      mediaVideoTrack.streamid = stream.id;
      mediaVideoTrack.track = stream.getVideoTracks()[0];
      mediaVideoTrack.trackid = stream.getVideoTracks()[0].id;

      if (stream.getAudioTracks()[0]) {
        console.log('视频有音频');
        mediaVideoTrack.audio = 1;
        mediaVideoTrack.volume = appStore.normalVolume;
        const audioTrack: AppRootState['allTrack'][0] = {
          id: mediaVideoTrack.id,
          openEye: true,
          audio: 1,
          video: 2,
          mediaName: val.mediaName,
          type: MediaTypeEnum.media,
          track: stream.getAudioTracks()[0],
          trackid: stream.getAudioTracks()[0].id,
          stream,
          streamid: stream.id,
          hidden: true,
          muted: false,
          volume: mediaVideoTrack.volume,
          scaleInfo: {},
        };
        const res = [...appStore.allTrack, audioTrack];
        appStore.setAllTrack(res);
        cacheStore.setResourceList(res);
        handleMixedAudio();
      }
    }
    const res = [...appStore.allTrack, mediaVideoTrack];
    // @ts-ignore
    appStore.setAllTrack(res);
    // @ts-ignore
    cacheStore.setResourceList(res);
    console.log('获取视频成功');
  }
}

function editMediaOk(val: AppRootState['allTrack'][0]) {
  showMediaModalCpt.value = false;
  const res = appStore.allTrack.map((item) => {
    if (item.id === val.id) {
      item.mediaName = val.mediaName;
      item.timeInfo = val.timeInfo;
      item.stopwatchInfo = val.stopwatchInfo;
      item.txtInfo = val.txtInfo;
      if (
        [
          MediaTypeEnum.txt,
          MediaTypeEnum.time,
          MediaTypeEnum.stopwatch,
        ].includes(val.type)
      ) {
        if (item.canvasDom) {
          // @ts-ignore
          item.canvasDom.set(
            'fill',
            val.txtInfo?.color ||
              val.timeInfo?.color ||
              val.stopwatchInfo?.color
          );
        }
      }
      if (val.type === MediaTypeEnum.txt) {
        if (item.canvasDom) {
          // @ts-ignore
          item.canvasDom.set('text', val.txtInfo?.txt);
        }
      }
      if (val.openEye) {
        if (item.canvasDom) {
          item.canvasDom.opacity = 1;
        }
      } else {
        if (item.canvasDom) {
          item.canvasDom.opacity = 0;
        }
      }
    }
    return item;
  });
  appStore.setAllTrack(res);
  cacheStore.setResourceList(res);
}

function handleChangeMuted(item: AppRootState['allTrack'][0]) {
  if (item.videoEl) {
    const res = !item.muted;
    item.volume = res ? 0 : appStore.normalVolume;
    item.muted = res;
    if (item.type) {
      if (item.type !== MediaTypeEnum.microphone) {
        item.videoEl.muted = res;
      }
      item.videoEl.volume = res ? 0 : appStore.normalVolume / 100;
    }
    cacheStore.setResourceList(appStore.allTrack);
    handleMixedAudio();
  }
}

function handleChangeVolume(item: AppRootState['allTrack'][0], v) {
  const res = appStore.allTrack.map((iten) => {
    if (iten.id === item.id) {
      if (item.volume !== undefined) {
        iten.volume = v;
        iten.muted = v === 0;
        if (iten.videoEl && item.type) {
          iten.videoEl.volume = v / 100;
          if (item.type !== MediaTypeEnum.microphone) {
            iten.videoEl.muted = v === 0;
          }
        }
      }
    }
    return iten;
  });
  appStore.setAllTrack(res);
  cacheStore.setResourceList(res);
  handleMixedAudio();
}

function handleEye(item: AppRootState['allTrack'][0]) {
  let current;
  appStore.allTrack.forEach((iten) => {
    if (iten.id === item.id) {
      iten.openEye = !iten.openEye;
      current = iten;
    }
  });
  if (current) {
    editMediaOk(current);
  }
  cacheStore.setResourceList(appStore.allTrack);
}

function handleActiveObject(item: AppRootState['allTrack'][0]) {
  let current: AppRootState['allTrack'][0] | undefined;
  appStore.allTrack.forEach((iten) => {
    if (iten.id === item.id) {
      current = iten;
    }
  });
  if (current?.canvasDom) {
    fabricCanvas.value?.setActiveObject(current.canvasDom);
  }
}

function handleDel(item: AppRootState['allTrack'][0]) {
  if (item.canvasDom !== undefined) {
    fabricCanvas.value?.remove(item.canvasDom);
  }
  const delItem = appStore.allTrack.filter((iten) => iten.id === item.id);

  delItem.forEach((v) => {
    v.videoEl?.pause();
    v.videoEl?.removeAttribute('src');
    v.videoEl?.remove();
    v.stream?.getTracks().forEach((track) => {
      track.stop();
      v.stream?.removeTrack(track);
    });
  });
  bodyAppendChildElArr.value.forEach((el) => {
    const videoid = el.getAttribute('videoid');
    if (item.id === videoid) {
      el.remove();
    }
  });
  const res = appStore.allTrack.filter((iten) => iten.id !== item.id);
  appStore.setAllTrack(res);
  cacheStore.setResourceList(res);
  handleMixedAudio();
}

function handleStartMedia(item: { type: MediaTypeEnum; txt: string }) {
  currentMediaType.value = item.type;
  showMediaModalCpt.value = true;
}
</script>

<style lang="scss" scoped>
.slider {
  width: 80px;
}
.push-wrap {
  display: flex;
  justify-content: space-between;
  margin: 15px auto 0;
  width: $w-1250;
  .left {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: $w-960;
    height: 100%;
    border-radius: 6px;
    background-color: white;
    color: #9499a0;
    vertical-align: top;

    .container {
      position: relative;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.5);
      line-height: 0;
      .recording {
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 100;
        color: red;
        font-size: 12px;
        line-height: 1;
      }
      .record-ico {
        position: absolute;
        top: 0;
        left: -10px;
        cursor: pointer;
        transform: translateX(-100%);
      }
      .screenshot {
        position: absolute;
        top: 30px;
        left: -10px;
        cursor: pointer;
        transform: translateX(-100%);
      }

      .add-wrap {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 10px 20px;
        width: 50%;
        border-radius: 6px;
        background-color: white;
        transform: translate(-50%, -50%);
      }
    }
    .room-control {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      background-color: papayawhip;

      .info {
        display: flex;
        align-items: center;

        .avatar {
          margin-right: 20px;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
        }
        .detail {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          width: 200px;
          text-align: initial;
          .top {
            margin-bottom: 10px;
            color: #18191c;
          }
          .bottom {
            font-size: 14px;
          }
        }
      }
      .rtc {
        display: flex;
        align-items: center;
        flex: 1;
        font-size: 14px;
        .item {
          display: flex;
          align-items: center;
          flex: 1;
          .txt {
            flex-shrink: 0;
            width: 80px;
          }
          .down {
            width: 90px;

            user-select: none;
          }
        }
      }
      .other {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
        .top {
        }
        .bottom {
          margin-top: 10px;
        }
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    margin-left: 10px;
    width: $w-300;
    border-radius: 6px;
    background-color: white;
    color: #9499a0;

    .resource-card {
      position: relative;
      box-sizing: border-box;
      margin-bottom: 10px;
      padding: 10px;
      width: 100%;
      height: 290px;
      border-radius: 6px;
      background-color: papayawhip;
      .title {
        text-align: initial;
      }
      .list {
        overflow: scroll;
        width: calc(100% + 5px);
        height: 218px;

        @extend %customScrollbar;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 5px 0;
          font-size: 14px;
          cursor: pointer;

          user-select: none;
          .item-left {
            display: flex;
            align-items: center;
            height: 100%;
            .control-item {
              height: 100%;
              line-height: 0;
              cursor: pointer;
              &:not(:last-child) {
                margin-right: 6px;
              }
            }
          }
          .control {
            display: flex;
            align-items: center;
            .control-item {
              line-height: 0;
              cursor: pointer;
              &:not(:last-child) {
                margin-right: 6px;
              }
            }
          }
        }
      }

      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 10px;
      }
    }
    .danmu-card {
      position: relative;
      flex: 1;
      box-sizing: border-box;
      padding: 10px 10px 0px;
      width: 100%;
      border-radius: 6px;
      background-color: papayawhip;
      text-align: initial;
      .title {
        margin-bottom: 10px;
      }
      .list {
        overflow: scroll;
        height: 266px;

        @extend %customScrollbar;

        .item {
          box-sizing: border-box;
          margin-bottom: 4px;
          padding: 2px 0;
          white-space: normal;
          word-wrap: break-word;
          font-size: 13px;

          .name {
            color: #9499a0;
            cursor: pointer;
            &.system {
              color: red;
            }
          }
          .msg {
            margin-top: 4px;
            color: #61666d;
            &.img {
              img {
                width: 80%;
              }
            }
          }
        }
      }
      .send-msg {
        position: relative;
        box-sizing: border-box;
        padding: 4px 0;
        width: 100%;
        .control {
          display: flex;
          margin: 4px 0;
          .emoji-list {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            overflow: scroll;
            box-sizing: border-box;
            padding: 3px;
            padding-right: 0;
            height: 160px;
            background-color: #fff;
            transform: translateY(-100%);

            @extend %customScrollbar;
            .item {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
              width: 14%;
              height: 18%;
              border: 1px solid #f8f8f8;
              font-size: 20px;
              cursor: pointer;
            }
          }
          .ico {
            margin-right: 6px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            .input-upload {
              width: 0;
              height: 0;
              opacity: 0;
            }
            &.face {
              @include setBackground('@/assets/img/msg-face.webp');
            }
            &.img {
              @include setBackground('@/assets/img/msg-img.webp');
            }
          }
        }
        .ipt {
          display: block;
          box-sizing: border-box;
          margin: 0 auto;
          padding: 10px;
          width: 100%;
          height: 60px;
          outline: none;
          border: 1px solid hsla(0, 0%, 60%, 0.2);
          border-radius: 4px;
          background-color: #f1f2f3;
          font-size: 14px;
        }
        .btn {
          box-sizing: border-box;
          margin-top: 10px;
          margin-left: auto;
          padding: 4px;
          width: 70px;
          border-radius: 4px;
          background-color: $theme-color-gold;
          color: white;
          text-align: center;
          font-size: 12px;
          cursor: pointer;
        }
      }

      // .send-msg {
      //   display: flex;
      //   align-items: center;
      //   box-sizing: border-box;
      //   width: calc(100% - 20px);
      //   .ipt {
      //     display: block;
      //     box-sizing: border-box;
      //     margin: 0 auto;
      //     margin-right: 10px;
      //     padding: 10px;
      //     width: 80%;
      //     height: 30px;
      //     outline: none;
      //     border: 1px solid hsla(0, 0%, 60%, 0.2);
      //     border-radius: 4px;
      //     background-color: #f1f2f3;
      //     font-size: 14px;
      //   }
      // }
    }
  }
}

// 屏幕宽度大于1500的时候
@media screen and (min-width: $w-1500) {
  .push-wrap {
    width: $w-1475;
    .left {
      width: $w-1150;
    }
    .right {
      width: $w-300;
    }
  }
}
</style>
