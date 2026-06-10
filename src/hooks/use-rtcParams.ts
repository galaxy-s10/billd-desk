import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { MediaTypeEnum } from '@/interface';

export const useRTCParams = () => {
  const { t } = useI18n();
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
  const maxFramerate = computed(() => [
    {
      label: t('remote.frameUnit', { count: 1 }),
      value: 1,
      disabled: false,
    },
    {
      label: t('remote.frameUnit', { count: 10 }),
      value: 10,
      disabled: false,
    },
    {
      label: t('remote.frameUnit', { count: 20 }),
      value: 20,
      disabled: false,
    },
    {
      label: t('remote.frameUnit', { count: 30 }),
      value: 30,
      disabled: false,
    },
    {
      label: t('remote.frameUnit', { count: 60 }),
      value: 60,
      disabled: false,
    },
    {
      label: t('remote.frameUnit', { count: 120 }),
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
  const videoContentHint = computed(() => [
    {
      label: t('remote.default'),
      value: '',
      disabled: false,
    },
    {
      label: t('remote.motion'),
      value: 'motion',
      disabled: false,
    },
    {
      label: t('remote.text'),
      value: 'text',
      disabled: false,
    },
    {
      label: t('remote.balanced'),
      value: 'detail',
      disabled: false,
    },
  ]);
  const audioContentHint = computed(() => [
    {
      label: t('remote.default'),
      value: '',
      disabled: false,
    },
    {
      label: t('remote.music'),
      value: 'music',
      disabled: false,
    },
    {
      label: t('remote.speech'),
      value: 'speech',
      disabled: false,
    },
    {
      label: t('remote.speechRecognition'),
      value: 'speech-recognition',
      disabled: false,
    },
  ]);

  const allMediaTypeList = computed<
    Record<string, { type: MediaTypeEnum; txt: string }>
  >(() => ({
      [MediaTypeEnum.camera]: {
        type: MediaTypeEnum.camera,
        txt: t('remote.camera'),
      },
      [MediaTypeEnum.microphone]: {
        type: MediaTypeEnum.microphone,
        txt: t('remote.microphone'),
      },
      [MediaTypeEnum.screen]: {
        type: MediaTypeEnum.screen,
        txt: t('remote.window'),
      },
      [MediaTypeEnum.txt]: {
        type: MediaTypeEnum.txt,
        txt: t('remote.text'),
      },
      [MediaTypeEnum.img]: {
        type: MediaTypeEnum.img,
        txt: t('remote.image'),
      },
      [MediaTypeEnum.media]: {
        type: MediaTypeEnum.media,
        txt: t('remote.video'),
      },
      [MediaTypeEnum.time]: {
        type: MediaTypeEnum.time,
        txt: t('remote.time'),
      },
      [MediaTypeEnum.stopwatch]: {
        type: MediaTypeEnum.stopwatch,
        txt: t('remote.stopwatch'),
      },
    }));

  return {
    maxBitrate,
    maxFramerate,
    resolutionRatio,
    videoContentHint,
    audioContentHint,
    allMediaTypeList,
  };
};
