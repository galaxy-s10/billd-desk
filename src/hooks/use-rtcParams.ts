import { ref } from 'vue';

import { MediaTypeEnum } from '@/interface';

export const useRTCParams = () => {
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
      disabled: false,
    },
    // {
    //   label: '5000',
    //   value: 5000,
    //   disabled: false,
    // },
    // {
    //   label: '6000',
    //   value: 6000,
    //   disabled: false,
    // },
    // {
    //   label: '7000',
    //   value: 7000,
    //   disabled: false,
    // },
    // {
    //   label: '8000',
    //   value: 8000,
    //   disabled: false,
    // },
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
      disabled: false,
    },
    {
      label: '120帧',
      value: 120,
      disabled: false,
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
      disabled: false,
    },
    {
      label: '2160P',
      value: 2160,
      disabled: false,
    },
  ]);
  const videoContentHint = ref([
    {
      label: '默认',
      value: '',
      disabled: false,
    },
    {
      label: '运动',
      value: 'motion',
      disabled: false,
    },
    {
      label: '文本',
      value: 'text',
      disabled: false,
    },
    {
      label: '平衡',
      value: 'detail',
      disabled: false,
    },
  ]);
  const audioContentHint = ref([
    {
      label: '默认',
      value: '',
      disabled: false,
    },
    {
      label: '音乐',
      value: 'music',
      disabled: false,
    },
    {
      label: '语言',
      value: 'speech',
      disabled: false,
    },
    {
      label: '语音识别',
      value: 'speech-recognition',
      disabled: false,
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

  return {
    maxBitrate,
    maxFramerate,
    resolutionRatio,
    videoContentHint,
    audioContentHint,
    allMediaTypeList,
  };
};
