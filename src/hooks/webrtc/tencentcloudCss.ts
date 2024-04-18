import { ref } from 'vue';

import { fetchTencentcloudCssPush } from '@/api/tencentcloudCss';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { WebRTCClass } from '@/utils/network/webRTC';

export const useWebRtcTencentcloudCss = () => {
  const userStore = useUserStore();
  const networkStore = useNetworkStore();

  const { maxBitrate, maxFramerate, resolutionRatio } = useRTCParams();
  const currentMaxBitrate = ref(maxBitrate.value[3].value);
  const currentMaxFramerate = ref(maxFramerate.value[2].value);
  const currentResolutionRatio = ref(resolutionRatio.value[3].value);
  const isPk = ref(false);
  const roomId = ref('');
  const canvasVideoStream = ref<MediaStream>();

  function updateWebRtcTencentcloudCssConfig(data: {
    isPk;
    roomId;
    canvasVideoStream;
  }) {
    isPk.value = data.isPk;
    roomId.value = data.roomId;
    canvasVideoStream.value = data.canvasVideoStream;
  }

  const webRtcTencentcloudCss = {
    newWebRtc: (data: {
      sender: string;
      receiver: string;
      videoEl: HTMLVideoElement;
    }) => {
      return new WebRTCClass({
        maxBitrate: currentMaxBitrate.value,
        maxFramerate: currentMaxFramerate.value,
        resolutionRatio: currentResolutionRatio.value,
        isSRS: false,
        roomId: roomId.value,
        videoEl: data.videoEl,
        sender: data.sender,
        receiver: data.receiver,
      });
    },
    /**
     * 主播发offer给观众
     */
    sendOffer: async ({
      sender,
      receiver,
    }: {
      sender: string;
      receiver: string;
    }) => {
      console.log('开始webRtcTencentcloudCss的sendOffer', {
        sender,
        receiver,
      });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = networkStore.rtcMap.get(receiver);
        if (rtc) {
          const liveRooms = userStore.userInfo?.live_rooms;
          const myLiveRoom = liveRooms?.[0];
          if (!myLiveRoom) {
            window.$message.error('你没有开通直播间');
            return;
          }
          const res = await fetchTencentcloudCssPush(myLiveRoom.id!);
          if (res.code === 200) {
            const livePusher = new window.TXLivePusher();
            // https://cloud.tencent.com/document/product/267/92713#1a9164cf-9f99-47d5-9667-ea558886cb9f
            // 使用用户自定义的音视频流。
            await livePusher.startCustomCapture(canvasVideoStream.value);
            livePusher.startPush(res.data.webrtc);
          }
        } else {
          console.error('rtc不存在');
        }
      } catch (error) {
        console.error('webRtcTencentcloudCss的sendOffer错误');
      }
    },
  };

  return { updateWebRtcTencentcloudCssConfig, webRtcTencentcloudCss };
};
