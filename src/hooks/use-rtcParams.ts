import { ref } from 'vue';

import { MediaTypeEnum } from '@/interface';

export const useRTCParams = () => {
  const maxBitrate = ref([
    {
      label: '1',
      value: 1,
    },
    {
      label: '10',
      value: 10,
    },
    {
      label: '1000',
      value: 1000,
    },
    {
      label: '2000',
      value: 2000,
    },
    {
      label: '3000',
      value: 3000,
    },
    {
      label: '4000',
      value: 4000,
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
    },
    {
      label: '10帧',
      value: 10,
    },
    {
      label: '20帧',
      value: 20,
    },
    {
      label: '30帧',
      value: 30,
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
    },
    {
      label: '540P',
      value: 540,
    },
    {
      label: '720P',
      value: 720,
    },
    {
      label: '1080P',
      value: 1080,
    },
    {
      label: '1440P',
      value: 1440,
      disabled: true,
    },
  ]);
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
