import { ref, watch } from 'vue';

import { DEFAULT_AUTH_INFO } from '@/constant';
import { MediaTypeEnum } from '@/interface';
import { useUserStore } from '@/store/user';

export const useRTCParams = () => {
  const userStore = useUserStore();
  const maxBitrate = ref([
    {
      label: '1',
      value: 1,
      disabled: false,
    },
    {
      label: '10',
      value: 10,
      disabled: false,
    },
    {
      label: '1000',
      value: 1000,
      disabled: false,
    },
    {
      label: '2000',
      value: 2000,
      disabled: false,
    },
    {
      label: '3000',
      value: 3000,
      disabled: false,
    },
    {
      label: '4000',
      value: 4000,
      disabled: true,
    },
    {
      label: '5000',
      value: 5000,
      disabled: true,
    },
    {
      label: '6000',
      value: 6000,
      disabled: true,
    },
    {
      label: '7000',
      value: 7000,
      disabled: true,
    },
    {
      label: '8000',
      value: 8000,
      disabled: true,
    },
  ]);
  const maxFramerate = ref([
    {
      label: '1帧',
      value: 1,
      disabled: false,
    },
    {
      label: '10帧',
      value: 10,
      disabled: false,
    },
    {
      label: '20帧',
      value: 20,
      disabled: false,
    },
    {
      label: '30帧',
      value: 30,
      disabled: false,
    },
    {
      label: '60帧',
      value: 60,
      disabled: true,
    },
    {
      label: '120帧',
      value: 120,
      disabled: true,
    },
  ]);
  const resolutionRatio = ref([
    {
      label: '360P',
      value: 360,
      disabled: false,
    },
    {
      label: '540P',
      value: 540,
      disabled: false,
    },
    {
      label: '720P',
      value: 720,
      disabled: false,
    },
    {
      label: '1080P',
      value: 1080,
      disabled: false,
    },
    {
      label: '1440P',
      value: 1440,
      disabled: true,
    },
    {
      label: '2160P',
      value: 2160,
      disabled: true,
    },
  ]);
  watch(
    () => userStore.userInfo,
    (newval) => {
      if (newval) {
        if (
          userStore.userInfo?.auths?.find(
            (v) => v.auth_value === DEFAULT_AUTH_INFO.LIVE_PULL_SVIP.auth_value
          )
        ) {
          maxBitrate.value = maxBitrate.value.map((item) => {
            item.disabled = false;
            return item;
          });
          maxFramerate.value = maxFramerate.value.map((item) => {
            item.disabled = false;
            return item;
          });
          resolutionRatio.value = resolutionRatio.value.map((item) => {
            item.disabled = false;
            return item;
          });
        }
      }
    },
    { immediate: true }
  );
  const allMediaTypeList: Record<string, { type: MediaTypeEnum; txt: string }> =
    {
      [MediaTypeEnum.camera]: {
        type: MediaTypeEnum.camera,
        txt: '摄像头',
      },
      [MediaTypeEnum.microphone]: {
        type: MediaTypeEnum.microphone,
        txt: '麦克风',
      },
      [MediaTypeEnum.screen]: {
        type: MediaTypeEnum.screen,
        txt: '窗口',
      },
      [MediaTypeEnum.txt]: {
        type: MediaTypeEnum.txt,
        txt: '文字',
      },
      [MediaTypeEnum.img]: {
        type: MediaTypeEnum.img,
        txt: '图片',
      },
      [MediaTypeEnum.media]: {
        type: MediaTypeEnum.media,
        txt: '视频',
      },
      [MediaTypeEnum.time]: {
        type: MediaTypeEnum.time,
        txt: '时间',
      },
      [MediaTypeEnum.stopwatch]: {
        type: MediaTypeEnum.stopwatch,
        txt: '秒表',
      },
    };

  return { maxBitrate, maxFramerate, resolutionRatio, allMediaTypeList };
};
