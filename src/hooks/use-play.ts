import '@/assets/css/videojs.scss';
import { getRandomString } from 'billd-utils';
import md5 from 'crypto-js/md5';
import mpegts from 'mpegts.js';
import videoJs from 'video.js';
import Player from 'video.js/dist/types/player';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { SRS_CB_URL_PARAMS } from '@/constant';
import { useAppStore } from '@/store/app';
import { usePiniaCacheStore } from '@/store/cache';
import { useUserStore } from '@/store/user';
import { createVideo } from '@/utils';

export * as flvJs from 'flv.js';

function handlePlayUrl(url: string) {
  const userStore = useUserStore();
  const userInfo = userStore.userInfo;
  const userToken = md5(userStore.token) as string;
  return !userInfo
    ? `${url}?${SRS_CB_URL_PARAMS.randomId}=${getRandomString(8)}`
    : `${url}?${SRS_CB_URL_PARAMS.userToken}=${userToken}&${
        SRS_CB_URL_PARAMS.userId
      }=${userInfo.id!}&${SRS_CB_URL_PARAMS.randomId}=${getRandomString(8)}`;
}

let pipVideo;

function closePip() {
  try {
    const appStore = useAppStore();
    appStore.videoControlsValue.pipMode = false;
    // 直接play貌似会有延迟
    setTimeout(() => {
      pipVideo.play?.();
    }, 50);
  } catch (error) {
    console.error('closePip错误');
    console.error(error);
  }
}

export async function usePictureInPicture(el, parentEl) {
  try {
    pipVideo = el;
    if (el?.tagName?.toLowerCase() === 'video') {
      await el.requestPictureInPicture();
      el.addEventListener('leavepictureinpicture', closePip);
    } else {
      // 打开一个与播放器大小相同的画中画窗口。
      // @ts-ignore
      const pipWindow = await documentPictureInPicture.requestWindow({
        width: el.clientWidth,
        height: el.clientHeight,
      });
      pipWindow.document.body.append(el);
      // 当画中画窗口关闭时，将播放器移回原位置。
      pipWindow.addEventListener('pagehide', () => {
        parentEl?.append(el);
        closePip();
      });
    }
  } catch (error) {
    console.error('usePictureInPicture失败');
    console.log(error);
  }
}

export function useFullScreen(video) {
  if (video.requestFullscreen) {
    console.log('requestFullscreen-1');
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    console.log('mozRequestFullScreen-2');
    // Firefox
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    console.log('webkitRequestFullscreen-3');
    // Chrome, Safari和Opera
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    console.log('msRequestFullscreen-4');
    // IE/Edge
    video.msRequestFullscreen();
  } else if (video.webkitEnterFullscreen) {
    console.log('webkitEnterFullscreen-4');
    // IOS
    video.webkitEnterFullscreen();
  } else {
    console.log('不支持全屏');
  }
}

export function useFlvPlay() {
  const cacheStore = usePiniaCacheStore();
  const appStore = useAppStore();
  // const flvPlayer = ref<flvJs.Player>();
  const flvPlayer = ref<mpegts.Player>();
  const flvVideoEl = ref<HTMLVideoElement>();
  const initRetryMax = 120;
  const retryMax = ref(initRetryMax);
  const retry = ref(0);
  const retryTimer = ref();
  const retrying = ref(false);
  const flvIsPlaying = ref(false);

  onUnmounted(() => {
    destroyFlv();
  });

  function destroyFlv() {
    if (flvPlayer.value) {
      flvPlayer.value.destroy();
      flvPlayer.value = undefined;
    }
    appStore.videoControlsValue.kbs = undefined;
    appStore.videoControlsValue.fps = undefined;
    flvIsPlaying.value = false;
    appStore.playing = false;
    flvVideoEl.value?.remove();
    flvVideoEl.value = undefined;
    clearInterval(retryTimer.value);
    retryMax.value = initRetryMax;
  }

  function setMuted(val) {
    if (flvVideoEl.value) {
      flvVideoEl.value.muted = val;
    }
    if (flvPlayer.value) {
      flvPlayer.value.muted = val;
    }
  }
  function setVolume(val: number) {
    if (flvVideoEl.value) {
      flvVideoEl.value.volume = val / 100;
    }
    if (flvPlayer.value) {
      flvPlayer.value.volume = val / 100;
    }
  }
  function setPlay() {
    try {
      console.log(`开始播放flv，muted:${cacheStore.muted}`);
      flvVideoEl.value?.play();
      flvPlayer.value?.play();
    } catch (error) {
      console.error('flv播放失败');
      console.log(error);
    }
  }

  watch(
    () => flvIsPlaying.value,
    (newVal) => {
      appStore.playing = newVal;
    }
  );

  watch(
    () => cacheStore.muted,
    (newVal) => {
      setMuted(newVal);
    }
  );

  watch(
    () => cacheStore.volume,
    (newVal) => {
      setVolume(newVal);
    }
  );

  watch(
    () => appStore.playing,
    (newVal) => {
      if (newVal) {
        setPlay();
      }
    }
  );

  function startFlvPlay(data: { flvurl: string }) {
    return new Promise((resolve) => {
      function main() {
        destroyFlv();
        // mseLivePlayback，指示 HTTP MPEG2-TS/FLV 直播流是否可以在您的浏览器上运行。
        // msePlayback，与 相同mpegts.isSupported()，表示基本播放是否可以在您的浏览器上运行。
        if (
          mpegts.getFeatureList().mseLivePlayback &&
          mpegts.getFeatureList().msePlayback
        ) {
          flvPlayer.value = mpegts.createPlayer({
            type: 'flv', // could also be mpegts, m2ts, flv
            isLive: true,
            url: handlePlayUrl(data.flvurl),
          });
          const videoEl = createVideo({});
          videoEl.addEventListener('play', () => {
            console.log('flv-play');
          });
          videoEl.addEventListener('playing', () => {
            console.log('flv-playing');
            flvIsPlaying.value = true;
            retry.value = 0;
            setMuted(cacheStore.muted);
            setVolume(cacheStore.volume);
            flvVideoEl.value = videoEl;
            resolve('');
          });
          videoEl.addEventListener('loadedmetadata', () => {
            console.log('flv-loadedmetadata');
          });
          flvPlayer.value.attachMediaElement(videoEl);
          flvPlayer.value.load();
          flvPlayer.value.on(mpegts.Events.ERROR, () => {
            console.error('mpegts消息：mpegts.Events.ERROR');
            if (retry.value < retryMax.value && !retrying.value) {
              retrying.value = true;
              destroyFlv();
              retryTimer.value = setTimeout(() => {
                console.error(
                  '播放flv错误，重新加载，剩余次数：',
                  retryMax.value - retry.value
                );
                retry.value += 1;
                retrying.value = false;
                main();
              }, 1000);
            }
          });
          flvPlayer.value.on(mpegts.Events.MEDIA_INFO, (data) => {
            console.log('mpegts.Events.MEDIA_INFO', data);
            appStore.videoControlsValue.fps = data?.fps?.toFixed(2);
          });
          flvPlayer.value.on(mpegts.Events.STATISTICS_INFO, (data) => {
            appStore.videoControlsValue.kbs = data?.speed?.toFixed(2);
          });
          setPlay();
        } else {
          console.error('不支持flv');
        }
      }
      main();
    });
  }

  return { flvPlayer, flvVideoEl, flvIsPlaying, startFlvPlay, destroyFlv };
}

export function useHlsPlay() {
  const cacheStore = usePiniaCacheStore();
  const appStore = useAppStore();
  const hlsPlayer = ref<Player>();
  const hlsVideoEl = ref<HTMLVideoElement>();
  const initRetryMax = 120;
  const retryMax = ref(initRetryMax);
  const retry = ref(0);
  const retryTimer = ref();
  const retrying = ref(false);
  const hlsIsPlaying = ref(false);

  onMounted(() => {});

  onUnmounted(() => {
    destroyHls();
  });

  function destroyHls() {
    if (hlsPlayer.value) {
      hlsPlayer.value.dispose();
      hlsPlayer.value = undefined;
    }
    appStore.videoControlsValue.kbs = undefined;
    appStore.videoControlsValue.fps = undefined;
    hlsIsPlaying.value = false;
    appStore.playing = false;
    hlsVideoEl.value?.remove();
    hlsVideoEl.value = undefined;
    clearInterval(retryTimer.value);
    retryMax.value = initRetryMax;
  }

  function setMuted(val: boolean) {
    if (hlsVideoEl.value) {
      hlsVideoEl.value.muted = val;
    }
    if (hlsPlayer.value) {
      hlsPlayer.value.muted(val);
    }
  }
  function setVolume(val: number) {
    if (hlsVideoEl.value) {
      hlsVideoEl.value.volume = val / 100;
    }
    if (hlsPlayer.value) {
      hlsPlayer.value.volume(val / 100);
    }
  }

  function setPlay() {
    try {
      console.log(`开始播放hls，muted:${cacheStore.muted}`);
      hlsVideoEl.value?.play();
      hlsPlayer.value?.play();
    } catch (error) {
      console.error('hls播放失败');
      console.log(error);
    }
  }

  watch(
    () => hlsIsPlaying.value,
    (newVal) => {
      appStore.playing = newVal;
    }
  );

  watch(
    () => cacheStore.muted,
    (newVal) => {
      setMuted(newVal);
    }
  );

  watch(
    () => cacheStore.volume,
    (newVal) => {
      setVolume(newVal);
    }
  );

  watch(
    () => appStore.playing,
    (newVal) => {
      if (newVal) {
        setPlay();
      }
    }
  );

  function startHlsPlay(data: { hlsurl: string }) {
    return new Promise((resolve) => {
      function main() {
        console.log('startHlsPlay', data.hlsurl);
        destroyHls();
        const videoEl = createVideo({
          muted: cacheStore.muted,
          autoplay: true,
        });
        hlsPlayer.value = videoJs(
          videoEl,
          {
            sources: [
              {
                src: handlePlayUrl(data.hlsurl),
                type: 'application/x-mpegURL',
              },
            ],
          },
          function () {
            setPlay();
          }
        );
        hlsPlayer.value?.on('error', () => {
          console.log('hls-error');
          if (retry.value < retryMax.value && !retrying.value) {
            retrying.value = true;
            retryTimer.value = setTimeout(() => {
              console.error(
                '播放hls错误，重新加载，剩余次数：',
                retryMax.value - retry.value
              );
              retry.value += 1;
              retrying.value = false;
              main();
            }, 1000);
          }
        });
        hlsPlayer.value?.on('play', () => {
          console.log('hls-play');
          // console.log(hlsPlayer.value?.videoHeight()); // 获取到的是0！
        });
        hlsPlayer.value?.on('playing', () => {
          console.log('hls-playing');
          hlsIsPlaying.value = true;
          setMuted(cacheStore.muted);
          setVolume(cacheStore.volume);
          retry.value = 0;
          // console.log(hlsPlayer.value?.videoHeight()); // 获取到的是正确的！
          const childNodes = hlsPlayer.value?.el().childNodes;
          if (childNodes) {
            childNodes.forEach((item) => {
              if (item.nodeName.toLowerCase() === 'video') {
                // @ts-ignore
                hlsVideoEl.value = item;
              }
            });
          }
          resolve('');
        });
        hlsPlayer.value?.on('loadedmetadata', () => {
          console.log('hls-loadedmetadata');
        });
      }
      main();
    });
  }

  return { hlsPlayer, hlsVideoEl, hlsIsPlaying, startHlsPlay, destroyHls };
}
