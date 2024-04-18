import { getRandomString } from 'billd-utils';
import { ref } from 'vue';

import { useRTCParams } from '@/hooks/use-rtcParams';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { WsAnswerType, WsMsgTypeEnum, WsOfferType } from '@/types/websocket';
import { WebRTCClass } from '@/utils/network/webRTC';

export const useWebRtcMeetingPk = () => {
  const appStore = useAppStore();
  const networkStore = useNetworkStore();

  const { maxBitrate, maxFramerate, resolutionRatio } = useRTCParams();
  const currentMaxBitrate = ref(maxBitrate.value[3].value);
  const currentMaxFramerate = ref(maxFramerate.value[2].value);
  const currentResolutionRatio = ref(resolutionRatio.value[3].value);
  const roomId = ref('');
  const anchorStream = ref<MediaStream>();
  const userStream = ref<MediaStream>();

  function updateWebRtcMeetingPkConfig(data: {
    roomId;
    anchorStream;
    userStream?;
  }) {
    roomId.value = data.roomId;
    anchorStream.value = data.anchorStream;
    userStream.value = data.userStream;
  }

  const webRtcMeetingPk = {
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
      console.log('meetingPk的sendOffer', {
        sender,
        receiver,
      });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = networkStore.rtcMap.get(receiver);
        if (rtc) {
          anchorStream.value?.getTracks().forEach((track) => {
            if (anchorStream.value) {
              console.log('meetingPk的sendOffer插入track', track.kind, track);
              rtc.peerConnection?.addTrack(track, anchorStream.value);
            }
          });
          const offerSdp = await rtc.createOffer();
          if (!offerSdp) {
            console.error('meetingPk的offerSdp为空');
            return;
          }
          await rtc.setLocalDescription(offerSdp!);
          networkStore.wsMap.get(roomId.value)?.send<WsOfferType['data']>({
            requestId: getRandomString(8),
            msgType: WsMsgTypeEnum.nativeWebRtcOffer,
            data: {
              live_room: appStore.liveRoomInfo!,
              live_room_id: appStore.liveRoomInfo!.id!,
              sender,
              receiver,
              sdp: offerSdp,
            },
          });
        } else {
          console.error('rtc不存在');
        }
      } catch (error) {
        console.error('meetingPk的sendOffer错误');
      }
    },
    /**
     * 观众收到主播的offer，观众回复主播answer
     */
    sendAnswer: async ({
      sdp,
      sender,
      receiver,
    }: {
      sdp: RTCSessionDescriptionInit;
      sender: string;
      receiver: string;
    }) => {
      console.log('meetingPk的sendAnswer', {
        sender,
        receiver,
      });
      try {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        const rtc = networkStore.rtcMap.get(receiver);
        if (rtc) {
          await rtc.setRemoteDescription(sdp);
          userStream.value?.getTracks().forEach((track) => {
            if (userStream.value) {
              console.log('meetingPk的sendAnswer插入track');
              rtc.peerConnection?.addTrack(track, userStream.value);
            }
          });
          const answerSdp = await rtc.createAnswer();
          if (!answerSdp) {
            console.error('meetingPk的answerSdp为空');
            return;
          }
          await rtc.setLocalDescription(answerSdp);
          networkStore.wsMap.get(roomId.value)?.send<WsAnswerType['data']>({
            requestId: getRandomString(8),
            msgType: WsMsgTypeEnum.nativeWebRtcAnswer,
            data: {
              live_room_id: Number(roomId.value),
              sender,
              receiver,
              sdp: answerSdp,
            },
          });
        } else {
          console.error('rtc不存在');
        }
      } catch (error) {
        console.error('meetingPk的sendAnswer错误');
        console.log(error);
      }
    },
    addTrack: ({ stream, receiver }: { stream; receiver: string }) => {
      const rtc = networkStore.rtcMap.get(receiver);
      if (rtc) {
        stream.getTracks().forEach((track) => {
          console.log('meetingPk的sendOffer插入track666', track.kind, track);
          rtc.peerConnection?.addTrack(track, stream);
        });
      }
    },
  };

  return { updateWebRtcMeetingPkConfig, webRtcMeetingPk };
};
