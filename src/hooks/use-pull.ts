import { getRandomString } from 'billd-utils';
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { commentAuthTip, loginTip } from '@/hooks/use-login';
import { useFlvPlay, useHlsPlay } from '@/hooks/use-play';
import { useWebsocket } from '@/hooks/use-websocket';
import {
  DanmuMsgTypeEnum,
  LiveLineEnum,
  LiveRenderEnum,
  WsMessageMsgIsFileEnum,
} from '@/interface';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { useNetworkStore } from '@/store/network';
import { ILiveRoom, LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { WsMessageType, WsMsgTypeEnum } from '@/types/websocket';
import { videoFullBox, videoToCanvas } from '@/utils';

export function usePull(roomId: string) {
  const route = useRoute();
  const networkStore = useNetworkStore();
  const cacheStore = usePiniaCacheStore();
  const appStore = useAppStore();
  const danmuStr = ref('');
  const msgIsFile = ref(WsMessageMsgIsFileEnum.no);
  const danmuMsgType = ref<DanmuMsgTypeEnum>(DanmuMsgTypeEnum.danmu);
  const autoplayVal = ref(false);
  const videoLoading = ref(false);
  const isPlaying = ref(false);
  const showPlayBtn = ref(false);
  const flvurl = ref('');
  const hlsurl = ref('');
  const videoWrapRef = ref<HTMLDivElement>();
  const videoResolution = ref();
  const isRemoteDesk = ref(false);
  const videoElArr = ref<HTMLVideoElement[]>([]);
  const remoteVideo = ref<HTMLElement[]>([]);
  const {
    mySocketId,
    initWs,
    roomLiving,
    anchorInfo,
    liveUserList,
    damuList,
    handleSendGetLiveUser,
  } = useWebsocket();
  const { flvVideoEl, flvIsPlaying, startFlvPlay, destroyFlv } = useFlvPlay();
  const { hlsVideoEl, hlsIsPlaying, startHlsPlay, destroyHls } = useHlsPlay();
  const stopDrawingArr = ref<any[]>([]);
  let changeWrapSizeFn;

  onUnmounted(() => {
    handleStopDrawing();
  });

  function handleStopDrawing() {
    destroyFlv();
    destroyHls();
    changeWrapSizeFn = undefined;
    stopDrawingArr.value.forEach((cb) => cb());
    stopDrawingArr.value = [];
    remoteVideo.value.forEach((el) => el.remove());
    remoteVideo.value = [];
    if (isRemoteDesk.value && videoWrapRef.value) {
      videoWrapRef.value.removeAttribute('style');
    }
  }

  function handleVideoWrapResize() {
    nextTick(() => {
      if (videoWrapRef.value) {
        const rect = videoWrapRef.value.getBoundingClientRect();
        changeWrapSizeFn?.({ width: rect.width, height: rect.height });
      }
    });
  }

  function videoPlay(videoEl: HTMLVideoElement) {
    stopDrawingArr.value = [];
    stopDrawingArr.value.forEach((cb) => cb());
    if (appStore.videoControls.renderMode === LiveRenderEnum.canvas) {
      if (videoEl && videoWrapRef.value) {
        const rect = videoWrapRef.value.getBoundingClientRect();
        const { canvas, stopDrawing, changeWrapSize } = videoToCanvas({
          wrapSize: {
            width: rect.width,
            height: rect.height,
          },
          videoEl,
          videoResize: ({ w, h }) => {
            videoResolution.value = `${w}x${h}`;
          },
        });
        changeWrapSizeFn = changeWrapSize;
        stopDrawingArr.value.push(stopDrawing);
        remoteVideo.value.push(canvas);
        videoElArr.value.push(videoEl);
        videoLoading.value = false;
      }
    } else if (appStore.videoControls.renderMode === LiveRenderEnum.video) {
      if (videoEl && videoWrapRef.value) {
        const rect = videoWrapRef.value.getBoundingClientRect();
        const { changeWrapSize } = videoFullBox({
          wrapSize: {
            width: rect.width,
            height: rect.height,
          },
          videoEl,
          videoResize: ({ w, h }) => {
            videoResolution.value = `${w}x${h}`;
          },
        });
        changeWrapSizeFn = changeWrapSize;
        remoteVideo.value.push(videoEl);
        videoElArr.value.push(videoEl);
        videoLoading.value = false;
      }
    }
  }

  watch(hlsVideoEl, (newval) => {
    if (newval) {
      videoPlay(newval);
    }
  });

  watch(flvVideoEl, (newval) => {
    if (newval) {
      videoPlay(newval);
    }
  });

  watch(
    () => appStore.videoControlsValue.pageFullMode,
    () => {
      handleVideoWrapResize();
    }
  );

  watch(
    () => appStore.videoControls.renderMode,
    () => {
      if (appStore.liveRoomInfo) {
        handlePlay(appStore.liveRoomInfo);
      }
    }
  );

  watch(
    () => networkStore.rtcMap,
    (newVal) => {
      if (newVal.size) {
        roomLiving.value = true;
        videoLoading.value = false;
        appStore.playing = true;
        cacheStore.muted = false;
      }
      if (
        isRemoteDesk.value ||
        appStore.liveRoomInfo?.type === LiveRoomTypeEnum.wertc_meeting_one ||
        appStore.liveRoomInfo?.type === LiveRoomTypeEnum.wertc_live ||
        appStore.liveRoomInfo?.type === LiveRoomTypeEnum.pk ||
        appStore.liveRoomInfo?.type === LiveRoomTypeEnum.tencent_css_pk
      ) {
        newVal.forEach((item) => {
          if (appStore.allTrack.find((v) => v.mediaName === item.receiver)) {
            return;
          }
          const rect = videoWrapRef.value?.getBoundingClientRect();
          if (rect) {
            videoFullBox({
              wrapSize: {
                width: rect.width,
                height: rect.height,
              },
              videoEl: item.videoEl,
              videoResize: ({ w, h }) => {
                videoResolution.value = `${w}x${h}`;
              },
            });
            remoteVideo.value.push(item.videoEl);
            videoElArr.value.push(item.videoEl);
          }
        });
        nextTick(() => {
          if (isRemoteDesk.value && videoWrapRef.value) {
            if (newVal.size) {
              videoWrapRef.value.style.display = 'inline-block';
            } else {
              videoWrapRef.value.style.removeProperty('display');
            }
          }
        });
      }
    },
    {
      deep: true,
      immediate: true,
    }
  );

  watch(
    () => remoteVideo.value,
    (newval) => {
      newval.forEach((videoEl) => {
        videoWrapRef.value?.appendChild(videoEl);
      });
    },
    {
      deep: true,
      immediate: true,
    }
  );

  function handleHlsPlay(url: string) {
    console.log('handleHlsPlay', url);
    handleStopDrawing();
    videoLoading.value = true;
    appStore.setLiveLine(LiveLineEnum.hls);
    startHlsPlay({
      hlsurl: url,
    });
  }

  function handleFlvPlay() {
    console.log('handleFlvPlay', flvurl.value);
    handleStopDrawing();
    videoLoading.value = true;
    appStore.setLiveLine(LiveLineEnum.flv);
    startFlvPlay({
      flvurl: flvurl.value,
    });
  }

  function handlePlay(data: ILiveRoom) {
    roomLiving.value = true;
    flvurl.value = data.flv_url!;
    hlsurl.value = data.hls_url!;
    function play() {
      if (appStore.liveLine === LiveLineEnum.flv) {
        handleFlvPlay();
      } else if (appStore.liveLine === LiveLineEnum.hls) {
        handleHlsPlay(data.hls_url!);
      }
    }
    if (LiveRoomTypeEnum.pk === data.type && !route.query.pkKey) {
      play();
    } else if (
      [
        LiveRoomTypeEnum.system,
        LiveRoomTypeEnum.srs,
        LiveRoomTypeEnum.obs,
        LiveRoomTypeEnum.msr,
        LiveRoomTypeEnum.pk,
        LiveRoomTypeEnum.forward_bilibili,
        LiveRoomTypeEnum.forward_huya,
        LiveRoomTypeEnum.forward_all,
      ].includes(data.type!)
    ) {
      play();
    } else if (
      [
        LiveRoomTypeEnum.wertc_live,
        LiveRoomTypeEnum.wertc_meeting_one,
        LiveRoomTypeEnum.wertc_meeting_two,
      ].includes(data.type!)
    ) {
      appStore.setLiveLine(LiveLineEnum.rtc);
    }
  }

  watch(
    [() => roomLiving.value, () => appStore.liveRoomInfo],
    ([val, liveRoomInfo]) => {
      if (val && liveRoomInfo) {
        showPlayBtn.value = false;
        if (
          [
            LiveRoomTypeEnum.system,
            LiveRoomTypeEnum.msr,
            LiveRoomTypeEnum.srs,
            LiveRoomTypeEnum.obs,
            LiveRoomTypeEnum.tencent_css,
            LiveRoomTypeEnum.tencent_css_pk,
            LiveRoomTypeEnum.forward_bilibili,
            LiveRoomTypeEnum.forward_huya,
            LiveRoomTypeEnum.forward_all,
          ].includes(liveRoomInfo.type!)
        ) {
          handlePlay(liveRoomInfo!);
        } else if (LiveRoomTypeEnum.pk === liveRoomInfo.type!) {
          if (!route.query.pkKey) {
            handlePlay(liveRoomInfo!);
          }
        }
      }
      if (!roomLiving.value) {
        closeRtc();
        handleStopDrawing();
      }
    },
    {
      deep: true,
      immediate: true,
    }
  );

  watch(
    () => appStore.liveLine,
    (newVal) => {
      console.log('liveLine变了', newVal);
      if (!roomLiving.value) {
        return;
      }
      switch (newVal) {
        case LiveLineEnum.flv:
          handleFlvPlay();
          break;
        case LiveLineEnum.hls:
          handleHlsPlay(hlsurl.value);
          break;
        case LiveLineEnum.rtc:
          break;
      }
    }
  );

  watch(
    () => cacheStore.muted,
    (newVal) => {
      videoElArr.value.forEach((el) => {
        el.muted = newVal;
      });
      if (!newVal) {
        cacheStore.setVolume(cacheStore.volume || appStore.normalVolume);
      } else {
        cacheStore.setVolume(0);
      }
    }
  );

  watch(
    () => cacheStore.volume,
    (newVal) => {
      videoElArr.value.forEach((el) => {
        el.volume = newVal / 100;
      });
      if (!newVal) {
        cacheStore.setMuted(true);
      } else {
        cacheStore.setMuted(false);
      }
    }
  );

  watch(
    () => appStore.playing,
    (newVal) => {
      videoElArr.value.forEach((el) => {
        if (newVal) {
          el.play();
        } else {
          el.pause();
        }
      });
    }
  );

  watch(
    () => hlsIsPlaying.value,
    (newVal) => {
      isPlaying.value = newVal;
    }
  );

  watch(
    () => flvIsPlaying.value,
    (newVal) => {
      isPlaying.value = newVal;
    }
  );

  watch(
    () => appStore.remoteDesk.isClose,
    (newval) => {
      if (newval) {
        handleStopDrawing();
      }
    }
  );

  function initPull(data: { autolay?: boolean; isRemoteDesk?: boolean }) {
    if (data.autolay === undefined) {
      autoplayVal.value = true;
    } else {
      autoplayVal.value = data.autolay;
    }
    if (autoplayVal.value) {
      videoLoading.value = true;
    }
    isRemoteDesk.value = !!data.isRemoteDesk;
    initWs({
      isRemoteDesk: data.isRemoteDesk,
      roomId,
      isAnchor: false,
    });
  }

  function closeWs() {
    networkStore.wsMap.forEach((ws) => {
      networkStore.removeWs(ws.roomId);
    });
  }

  function closeRtc() {
    networkStore.rtcMap.forEach((rtc) => {
      networkStore.removeRtc(rtc.receiver);
    });
  }

  function keydownDanmu(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    if (key === 'enter') {
      event.preventDefault();
      danmuMsgType.value = DanmuMsgTypeEnum.danmu;
      sendDanmu();
    }
  }

  function sendDanmu() {
    if (!loginTip()) {
      return;
    }
    if (!commentAuthTip()) {
      return;
    }
    if (!danmuStr.value.trim().length) {
      window.$message.warning('请输入弹幕内容！');
      return;
    }
    const instance = networkStore.wsMap.get(roomId);
    if (!instance) return;
    const requestId = getRandomString(8);
    console.log(danmuMsgType.value, 2221);
    const messageData: WsMessageType['data'] = {
      socket_id: '',
      msg: danmuStr.value,
      msgType: danmuMsgType.value,
      live_room_id: Number(roomId),
      msgIsFile: msgIsFile.value,
      send_msg_time: +new Date(),
      user_agent: navigator.userAgent,
    };
    instance.send({
      requestId,
      msgType: WsMsgTypeEnum.message,
      data: messageData,
    });

    danmuStr.value = '';
  }

  return {
    videoWrapRef,
    handlePlay,
    handleStopDrawing,
    initPull,
    closeWs,
    closeRtc,
    keydownDanmu,
    sendDanmu,
    handleSendGetLiveUser,
    showPlayBtn,
    danmuMsgType,
    isPlaying,
    msgIsFile,
    mySocketId,
    videoResolution,
    remoteVideo,
    roomLiving,
    autoplayVal,
    videoLoading,
    damuList,
    liveUserList,
    danmuStr,
    anchorInfo,
  };
}
