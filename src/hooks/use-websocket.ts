import { copyToClipBoard, getRandomString } from 'billd-utils';
import { NButton } from 'naive-ui';
import { computed, h, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { fetchVerifyPkKey } from '@/api/liveRoom';
import { THEME_COLOR, WEBSOCKET_URL } from '@/constant';
import { useRTCParams } from '@/hooks/use-rtcParams';
import { useTip } from '@/hooks/use-tip';
import { useWebRtcLive } from '@/hooks/webrtc/live';
import { useWebRtcMeetingOne } from '@/hooks/webrtc/meetingOne';
import { useWebRtcMeetingPk } from '@/hooks/webrtc/meetingPk';
import { useWebRtcSrs } from '@/hooks/webrtc/srs';
import { useWebRtcTencentcloudCss } from '@/hooks/webrtc/tencentcloudCss';
import {
  DanmuMsgTypeEnum,
  ILiveUser,
  WsMessageMsgIsFileEnum,
} from '@/interface';
import router, { routerName } from '@/router';
import { useAppStore } from '@/store/app';
import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import { LiveRoomTypeEnum } from '@/types/ILiveRoom';
import { IUser } from '@/types/IUser';
import {
  IDanmu,
  WSGetRoomAllUserType,
  WSLivePkKeyType,
  WsAnswerType,
  WsCandidateType,
  WsConnectStatusEnum,
  WsDisableSpeakingType,
  WsGetLiveUserType,
  WsHeartbeatType,
  WsJoinType,
  WsLeavedType,
  WsMessageType,
  WsMsgTypeEnum,
  WsOfferType,
  WsOtherJoinType,
  WsRemoteDeskBehaviorType,
  WsRoomLivingType,
  WsStartLiveType,
  WsStartRemoteDesk,
  WsUpdateJoinInfoType,
} from '@/types/websocket';
import { createNullVideo, handleUserMedia } from '@/utils';
import {
  WebSocketClass,
  prettierReceiveWsMsg,
} from '@/utils/network/webSocket';

import { useWebRtcRemoteDesk } from './webrtc/remoteDesk';

export const useWebsocket = () => {
  const route = useRoute();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const networkStore = useNetworkStore();

  const { maxBitrate, maxFramerate, resolutionRatio } = useRTCParams();
  const { updateWebRtcRemoteDeskConfig, webRtcRemoteDesk } =
    useWebRtcRemoteDesk();
  const { updateWebRtcMeetingPkConfig, webRtcMeetingPk } = useWebRtcMeetingPk();
  const { updateWebRtcSrsConfig, webRtcSrs } = useWebRtcSrs();
  const { updateWebRtcTencentcloudCssConfig, webRtcTencentcloudCss } =
    useWebRtcTencentcloudCss();
  const { updateWebRtcLiveConfig, webRtcLive } = useWebRtcLive();
  const { updateWebRtcMeetingOneConfig, webRtcMeetingOne } =
    useWebRtcMeetingOne();

  const connectStatus = ref();
  const loopHeartbeatTimer = ref();
  const loopGetLiveUserTimer = ref();
  const liveUserList = ref<ILiveUser[]>([]);
  const roomId = ref('');
  const roomLiving = ref(false);
  const isAnchor = ref(false);
  const isRemoteDesk = ref(false);
  const anchorInfo = ref<IUser>();
  const anchorSocketId = ref('');
  const canvasVideoStream = ref<MediaStream>();
  const userStream = ref<MediaStream>();
  const lastCoverImg = ref('');
  const currentMaxBitrate = ref(maxBitrate.value[3].value);
  const currentMaxFramerate = ref(maxFramerate.value[2].value);
  const currentResolutionRatio = ref(resolutionRatio.value[3].value);
  const timerObj = ref({});
  const damuList = ref<IDanmu[]>([]);

  onUnmounted(() => {
    clearInterval(loopHeartbeatTimer.value);
    clearInterval(loopGetLiveUserTimer.value);
  });

  watch(
    [() => userStore.userInfo?.id, () => connectStatus.value],
    ([userInfo, status]) => {
      if (userInfo && status === WsConnectStatusEnum.connect) {
        const ws = networkStore.wsMap.get(roomId.value);
        if (!ws) return;
        ws.send<WsUpdateJoinInfoType['data']>({
          requestId: getRandomString(8),
          msgType: WsMsgTypeEnum.updateJoinInfo,
          data: {
            live_room_id: Number(roomId.value),
          },
        });
      }
    },
    { immediate: true }
  );

  const mySocketId = computed(() => {
    return networkStore.wsMap.get(roomId.value)?.socketIo?.id || '-1';
  });

  function handleHeartbeat(socketId: string) {
    loopHeartbeatTimer.value = setInterval(() => {
      const ws = networkStore.wsMap.get(roomId.value);
      if (!ws) return;
      ws.send<WsHeartbeatType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.heartbeat,
        data: {
          socket_id: socketId,
          live_room_id: Number(roomId.value),
          roomLiving: isAnchor.value && roomLiving.value,
        },
      });
    }, 1000 * 5);
  }

  function handleSendGetLiveUser(liveRoomId: number) {
    loopGetLiveUserTimer.value = setInterval(() => {
      const ws = networkStore.wsMap.get(roomId.value);
      if (!ws) return;
      ws.send<WsGetLiveUserType['data']>({
        requestId: getRandomString(8),
        msgType: WsMsgTypeEnum.getLiveUser,
        data: {
          live_room_id: liveRoomId,
        },
      });
    }, 1000 * 5);
  }

  function handleStartLive({
    name,
    type,
    msrDelay,
    msrMaxDelay,
  }: {
    name?: string;
    type: LiveRoomTypeEnum;
    videoEl?: HTMLVideoElement;
    msrDelay: number;
    msrMaxDelay: number;
  }) {
    if (appStore.liveRoomInfo) {
      appStore.liveRoomInfo.type = type;
    }
    networkStore.wsMap.get(roomId.value)?.send<WsStartLiveType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.startLive,
      data: {
        name: name!,
        type,
        msrDelay,
        msrMaxDelay,
      },
    });
    if (type === LiveRoomTypeEnum.srs) {
      updateWebRtcSrsConfig({
        isPk: false,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      webRtcSrs.newWebRtc({
        sender: mySocketId.value,
        receiver: 'srs',
        videoEl: createNullVideo(),
      });
      webRtcSrs.sendOffer({
        sender: mySocketId.value,
        receiver: 'srs',
      });
    } else if (type === LiveRoomTypeEnum.tencent_css) {
      updateWebRtcTencentcloudCssConfig({
        isPk: false,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      webRtcTencentcloudCss.newWebRtc({
        sender: mySocketId.value,
        receiver: 'tencentcloud_css',
        videoEl: createNullVideo(),
      });
      webRtcTencentcloudCss.sendOffer({
        sender: mySocketId.value,
        receiver: 'tencentcloud_css',
      });
    } else if (type === LiveRoomTypeEnum.pk) {
      updateWebRtcSrsConfig({
        isPk: true,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      webRtcSrs.newWebRtc({
        sender: mySocketId.value,
        receiver: 'srs',
        videoEl: createNullVideo(),
      });
      webRtcSrs.sendOffer({
        sender: mySocketId.value,
        receiver: 'srs',
      });
    } else if (type === LiveRoomTypeEnum.tencent_css_pk) {
      updateWebRtcTencentcloudCssConfig({
        isPk: true,
        roomId: roomId.value,
        canvasVideoStream: canvasVideoStream.value,
      });
      webRtcTencentcloudCss.newWebRtc({
        sender: mySocketId.value,
        receiver: 'tencentcloud_css',
        videoEl: createNullVideo(),
      });
      webRtcTencentcloudCss.sendOffer({
        sender: mySocketId.value,
        receiver: 'tencentcloud_css',
      });
    }
  }

  function sendJoin() {
    const instance = networkStore.wsMap.get(roomId.value);
    if (!instance) return;
    instance.send<WsJoinType['data']>({
      requestId: getRandomString(8),
      msgType: WsMsgTypeEnum.join,
      data: {
        isRemoteDesk: isRemoteDesk.value,
        socket_id: mySocketId.value,
        live_room_id: Number(roomId.value),
        user_info: userStore.userInfo,
      },
    });
  }

  function initReceive() {
    const ws = networkStore.wsMap.get(roomId.value);
    if (!ws?.socketIo) return;
    // websocket连接成功
    ws.socketIo.on(WsConnectStatusEnum.connect, () => {
      prettierReceiveWsMsg(WsConnectStatusEnum.connect, ws.socketIo);
      handleHeartbeat(ws.socketIo!.id!);
      if (!ws) return;
      connectStatus.value = WsConnectStatusEnum.connect;
      ws.status = WsConnectStatusEnum.connect;
      ws.update();
      sendJoin();
    });

    // websocket连接断开
    ws.socketIo.on(WsConnectStatusEnum.disconnect, (err) => {
      prettierReceiveWsMsg(WsConnectStatusEnum.disconnect, ws);
      console.log('websocket连接断开', err);
      if (!ws) return;
      ws.status = WsConnectStatusEnum.disconnect;
      ws.update();
    });

    // 收到livePkKey
    ws.socketIo.on(WsMsgTypeEnum.livePkKey, (data: WSLivePkKeyType['data']) => {
      console.log('收到livePkKey', data);
      const url = router.resolve({
        name: routerName.pull,
        params: { roomId: data.live_room_id },
        query: {
          pkKey: data.key,
        },
      });
      const pkurl = `${window.location.origin}${url.href}`;
      useTip({
        title: '邀请主播加入PK',
        width: '360px',
        hiddenCancel: true,
        content: h('div', [
          h('div', { style: { marginBottom: '5px' } }, `${pkurl}`),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              color: THEME_COLOR,
              onClick: () => {
                copyToClipBoard(pkurl);
                window.$message.success('复制成功！');
              },
            },
            () => '复制链接' // 用箭头函数返回性能更好。
          ),
          h('div', { style: { marginTop: '5px' } }, '注意，有效期：5分钟'),
        ]),
      }).catch(() => {});
    });

    // 收到startRemoteDesk
    ws.socketIo.on(WsMsgTypeEnum.startRemoteDesk, (data: WsStartRemoteDesk) => {
      console.log('收到startRemoteDesk', data);
      if (data.data.receiver === mySocketId.value) {
        appStore.remoteDesk.startRemoteDesk = true;
        appStore.remoteDesk.sender = data.data.sender;
      }
    });

    // 收到srsOffer
    ws.socketIo.on(WsMsgTypeEnum.srsOffer, (data: WsOfferType['data']) => {
      console.log('收到srsOffer', data);
    });

    // 收到srsAnswer
    ws.socketIo.on(WsMsgTypeEnum.srsAnswer, (data: WsAnswerType['data']) => {
      console.log('收到srsAnswer', data);
    });

    // 收到srsCandidate
    ws.socketIo.on(
      WsMsgTypeEnum.srsCandidate,
      (data: WsCandidateType['data']) => {
        console.log('收到srsCandidate', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的srsCandidate');
          const rtc = networkStore.rtcMap.get(data.sender);
          rtc?.addIceCandidate(data.candidate);
        } else {
          console.error('不是发给我的srsCandidate');
        }
      }
    );

    // 收到nativeWebRtcOffer
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcOffer,
      async (data: WsOfferType['data']) => {
        console.log('收到nativeWebRtcOffer', data);
        if (data.isRemoteDesk) {
          if (data.receiver === mySocketId.value) {
            console.warn('是发给我的nativeWebRtcOffer-isRemoteDesk');
            if (networkStore.rtcMap.get(data.sender)) {
              return;
            }
            updateWebRtcRemoteDeskConfig({
              roomId: roomId.value,
              userStream: userStream.value,
              anchorStream: canvasVideoStream.value,
            });
            webRtcRemoteDesk.newWebRtc({
              // 因为这里是收到offer，而offer是房主发的，所以此时的data.data.sender是房主；data.data.receiver是接收者；
              // 但是这里的nativeWebRtc的sender，得是自己，不能是data.data.sender，不要混淆
              sender: mySocketId.value,
              receiver: data.sender,
              videoEl: createNullVideo(),
            });
            await webRtcRemoteDesk.sendAnswer({
              sender: mySocketId.value,
              // data.data.receiver是接收者；我们现在new pc，发送者是自己，接收者肯定是房主，不能是data.data.receiver，因为data.data.receiver是自己
              receiver: data.sender,
              sdp: data.sdp,
            });
          } else {
            console.error('不是发给我的nativeWebRtcOffer-isRemoteDesk');
          }
          return;
        }
        if (
          data.live_room.type === LiveRoomTypeEnum.pk ||
          data.live_room.type === LiveRoomTypeEnum.tencent_css_pk
        ) {
          if (!route.query.pkKey) {
            return;
          }
          if (data.receiver === mySocketId.value) {
            console.warn('是发给我的nativeWebRtcOffer');
            const res = await fetchVerifyPkKey({
              liveRoomId: Number(roomId.value),
              key: route.query.pkKey,
            });
            if (res.code === 200 && res.data === true) {
              await useTip({
                content: '是否加入PK？',
              });
              const stream = await handleUserMedia({
                video: true,
                audio: true,
              });
              userStream.value = stream;
              updateWebRtcMeetingPkConfig({
                roomId: roomId.value,
                anchorStream: canvasVideoStream.value,
                userStream: userStream.value,
              });
              webRtcMeetingPk.newWebRtc({
                // 因为这里是收到offer，而offer是房主发的，所以此时的data.data.sender是房主；data.data.receiver是接收者；
                // 但是这里的nativeWebRtc的sender，得是自己，不能是data.data.sender，不要混淆
                sender: mySocketId.value,
                receiver: data.sender,
                videoEl: createNullVideo(),
              });
              await webRtcMeetingPk.sendAnswer({
                sender: mySocketId.value,
                // data.data.receiver是接收者；我们现在new pc，发送者是自己，接收者肯定是房主，不能是data.data.receiver，因为data.data.receiver是自己
                receiver: data.sender,
                sdp: data.sdp,
              });
            } else {
              await useTip({
                content: '加入PK失败，验证pkKey错误！',
                hiddenCancel: true,
                hiddenClose: true,
              });
            }
          } else {
            console.error('不是发给我的nativeWebRtcOffer');
          }
        } else if (data.live_room.type === LiveRoomTypeEnum.wertc_live) {
          if (data.receiver === mySocketId.value) {
            console.warn('是发给我的nativeWebRtcOffer');
            if (networkStore.rtcMap.get(data.sender)) {
              return;
            }
            updateWebRtcLiveConfig({
              roomId: roomId.value,
              canvasVideoStream: canvasVideoStream.value,
            });
            webRtcLive.newWebRtc({
              // 因为这里是收到offer，而offer是房主发的，所以此时的data.data.sender是房主；data.data.receiver是接收者；
              // 但是这里的nativeWebRtc的sender，得是自己，不能是data.data.sender，不要混淆
              sender: mySocketId.value,
              receiver: data.sender,
              videoEl: createNullVideo(),
            });
            await webRtcLive.sendAnswer({
              sender: mySocketId.value,
              // data.data.receiver是接收者；我们现在new pc，发送者是自己，接收者肯定是房主，不能是data.data.receiver，因为data.data.receiver是自己
              receiver: data.sender,
              sdp: data.sdp,
            });
          } else {
            console.error('不是发给我的nativeWebRtcOffer');
          }
        } else if (data.live_room.type === LiveRoomTypeEnum.wertc_meeting_one) {
          if (data.receiver === mySocketId.value) {
            console.warn('是发给我的nativeWebRtcOffer');
            await useTip({
              content: '是否加入会议？',
            });
            const stream = await handleUserMedia({
              video: true,
              audio: true,
            });
            userStream.value = stream;
            updateWebRtcMeetingOneConfig({
              roomId: roomId.value,
              userStream: userStream.value,
              anchorStream: canvasVideoStream.value,
            });
            if (networkStore.rtcMap.get(data.sender)) {
              return;
            }
            webRtcMeetingOne.newWebRtc({
              // 因为这里是收到offer，而offer是房主发的，所以此时的data.data.sender是房主；data.data.receiver是接收者；
              // 但是这里的nativeWebRtc的sender，得是自己，不能是data.data.sender，不要混淆
              sender: mySocketId.value,
              receiver: data.sender,
              videoEl: createNullVideo(),
            });
            await webRtcMeetingOne.sendAnswer({
              sender: mySocketId.value,
              // data.data.receiver是接收者；我们现在new pc，发送者是自己，接收者肯定是房主，不能是data.data.receiver，因为data.data.receiver是自己
              receiver: data.sender,
              sdp: data.sdp,
            });
          } else {
            console.error('不是发给我的nativeWebRtcOffer');
          }
        }
      }
    );

    // 收到nativeWebRtcAnswer
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcAnswer,
      async (data: WsAnswerType['data']) => {
        console.log('收到nativeWebRtcAnswer', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的nativeWebRtcAnswer');
          const rtc = networkStore.rtcMap.get(data.sender);
          if (rtc) {
            await rtc.setRemoteDescription(data.sdp);
          }
        } else {
          console.error('不是发给我的nativeWebRtcAnswer');
        }
      }
    );

    // 收到nativeWebRtcCandidate
    ws.socketIo.on(
      WsMsgTypeEnum.nativeWebRtcCandidate,
      (data: WsCandidateType['data']) => {
        console.log('收到nativeWebRtcCandidate', data);
        if (data.receiver === mySocketId.value) {
          console.warn('是发给我的nativeWebRtcCandidate');
          const rtc = networkStore.rtcMap.get(data.sender);
          rtc?.addIceCandidate(data.candidate);
        } else {
          console.error('不是发给我的nativeWebRtcCandidate');
        }
      }
    );

    // 收到remoteDeskBehavior
    ws.socketIo.on(
      WsMsgTypeEnum.remoteDeskBehavior,
      (data: WsRemoteDeskBehaviorType['data']) => {
        console.log('收到remoteDeskBehavior', data);
      }
    );

    // 主播正在直播
    ws.socketIo.on(
      WsMsgTypeEnum.roomLiving,
      (data: WsRoomLivingType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.roomLiving, data);
        roomLiving.value = true;
        if (data.anchor_socket_id) {
          anchorSocketId.value = data.anchor_socket_id;
        }
        if (route.name === routerName.pull) {
          // 当前是拉流页面
        } else if (route.name === routerName.push) {
          // 当前是推流页面
        }
      }
    );

    // 主播不在直播
    ws.socketIo.on(WsMsgTypeEnum.roomNoLive, (data) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.roomNoLive, data);
      roomLiving.value = false;
    });

    // 当前所有在线用户
    ws.socketIo.on(
      WsMsgTypeEnum.liveUser,
      (data: WSGetRoomAllUserType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.liveUser, data);
        liveUserList.value = data.liveUser;
      }
    );

    // 收到用户发送消息
    ws.socketIo.on(WsMsgTypeEnum.message, (data: WsMessageType) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.message, data);
      damuList.value.push({
        user_agent: data.data.user_agent,
        live_room_id: data.data.live_room_id,
        request_id: data.request_id,
        socket_id: data.socket_id,
        msgType: data.data.msgType,
        msg: data.data.msg,
        userInfo: data.user_info,
        msgIsFile: data.data.msgIsFile,
        send_msg_time: data.data.send_msg_time,
      });
    });

    // 收到disableSpeaking
    ws.socketIo.on(
      WsMsgTypeEnum.disableSpeaking,
      (data: WsDisableSpeakingType['data']) => {
        prettierReceiveWsMsg(WsMsgTypeEnum.disableSpeaking, data);
        // if (data.is_disable_speaking) {
        //   window.$message.error('你已被禁言！');
        //   appStore.disableSpeaking.set(data.live_room_id, {
        //     exp: data.disable_expired_at,
        //     label: formatDownTime({
        //       startTime: +new Date(),
        //       endTime: data.disable_expired_at,
        //     }),
        //   });
        //   clearTimeout(timerObj.value[data.live_room_id]);
        //   timerObj.value[data.live_room_id] = setInterval(() => {
        //     if (
        //       data.disable_expired_at &&
        //       +new Date() > data.disable_expired_at
        //     ) {
        //       clearTimeout(timerObj.value[data.live_room_id]);
        //     }
        //     appStore.disableSpeaking.set(data.live_room_id, {
        //       exp: data.disable_expired_at!,
        //       label: formatDownTime({
        //         startTime: +new Date(),
        //         endTime: data.disable_expired_at!,
        //       }),
        //     });
        //   }, 1000);
        //   damuList.value = damuList.value.filter(
        //     (v) => v.request_id !== data.request_id
        //   );
        // }
        if (data.user_id !== userStore.userInfo?.id && data.disable_ok) {
          window.$message.success('禁言成功！');
        }
        if (
          data.user_id !== userStore.userInfo?.id &&
          data.restore_disable_ok
        ) {
          window.$message.success('解除禁言成功！');
        }
        if (
          data.user_id === userStore.userInfo?.id &&
          data.restore_disable_ok
        ) {
          window.$message.success('禁言接触了！');
          clearTimeout(timerObj.value[data.live_room_id]);
          appStore.disableSpeaking.delete(data.live_room_id);
        }
      }
    );

    // 用户加入房间完成
    ws.socketIo.on(WsMsgTypeEnum.joined, (data: WsJoinType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.joined, data);
      appStore.setLiveRoomInfo(data.live_room);
      anchorInfo.value = data.anchor_info;
    });

    // 其他用户加入房间
    ws.socketIo.on(WsMsgTypeEnum.otherJoin, (data: WsOtherJoinType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.otherJoin, data);
      const requestId = getRandomString(8);
      const danmu: IDanmu = {
        live_room_id: data.live_room.id!,
        request_id: requestId,
        msgType: DanmuMsgTypeEnum.otherJoin,
        socket_id: data.join_socket_id,
        userInfo: data.join_user_info,
        msgIsFile: WsMessageMsgIsFileEnum.no,
        msg: '',
        send_msg_time: +new Date(),
      };
      damuList.value.push(danmu);
      if (route.name === routerName.push) {
        // 当前是推流页面
        if (!isAnchor.value) {
          console.error('不是主播');
          return;
        }
        if (!roomLiving.value) {
          console.error('主播没点开始直播');
          return;
        }
        if (userStore.userInfo?.id === data.join_user_info?.id) {
          console.error('自己进入直播间，退出');
          return;
        }
        if (
          [
            LiveRoomTypeEnum.system,
            LiveRoomTypeEnum.srs,
            LiveRoomTypeEnum.obs,
          ].includes(data.live_room.type!)
        ) {
          return;
        }
        if (data.live_room.type === LiveRoomTypeEnum.wertc_live) {
          updateWebRtcLiveConfig({
            roomId: roomId.value,
            canvasVideoStream: canvasVideoStream.value,
          });
          data.socket_list.forEach((item) => {
            if (item !== mySocketId.value) {
              if (networkStore.rtcMap.get(item)) {
                return;
              }
              webRtcLive.newWebRtc({
                sender: mySocketId.value,
                receiver: item,
                videoEl: createNullVideo(),
              });
              webRtcLive.sendOffer({
                sender: mySocketId.value,
                receiver: item,
              });
            }
          });
        } else if (data.live_room.type === LiveRoomTypeEnum.wertc_meeting_one) {
          updateWebRtcMeetingOneConfig({
            roomId: roomId.value,
            anchorStream: canvasVideoStream.value,
          });
          data.socket_list?.forEach((item) => {
            if (item !== mySocketId.value) {
              if (networkStore.rtcMap.get(item)) {
                return;
              }
              webRtcMeetingOne.newWebRtc({
                sender: mySocketId.value,
                receiver: item,
                videoEl: createNullVideo(),
              });
              webRtcMeetingOne.sendOffer({
                sender: mySocketId.value,
                receiver: item,
              });
            }
          });
        } else if (data.live_room.type === LiveRoomTypeEnum.pk) {
          updateWebRtcMeetingPkConfig({
            roomId: roomId.value,
            anchorStream: canvasVideoStream.value,
          });
          data.socket_list?.forEach((item) => {
            if (item !== mySocketId.value) {
              if (networkStore.rtcMap.get(item)) {
                return;
              }
              webRtcMeetingPk.newWebRtc({
                sender: mySocketId.value,
                receiver: item,
                videoEl: createNullVideo(),
              });
              webRtcMeetingPk.sendOffer({
                sender: mySocketId.value,
                receiver: item,
              });
            }
          });
        } else if (data.live_room.type === LiveRoomTypeEnum.tencent_css_pk) {
          updateWebRtcMeetingPkConfig({
            roomId: roomId.value,
            anchorStream: canvasVideoStream.value,
          });
          data.socket_list?.forEach((item) => {
            if (item !== mySocketId.value) {
              if (networkStore.rtcMap.get(item)) {
                return;
              }
              webRtcMeetingPk.newWebRtc({
                sender: mySocketId.value,
                receiver: item,
                videoEl: createNullVideo(),
              });
              webRtcMeetingPk.sendOffer({
                sender: mySocketId.value,
                receiver: item,
              });
            }
          });
        }
      } else {
        // 当前不是推流页面
      }
    });

    // 用户离开房间
    ws.socketIo.on(WsMsgTypeEnum.leave, (data) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.leave, data);
    });

    // 用户离开房间完成
    ws.socketIo.on(WsMsgTypeEnum.leaved, (data: WsLeavedType['data']) => {
      prettierReceiveWsMsg(WsMsgTypeEnum.leaved, data);
      if (anchorSocketId.value === data.socket_id) {
        roomLiving.value = false;
      }
      networkStore.removeRtc(data.socket_id);
      damuList.value.push({
        live_room_id: Number(roomId.value),
        socket_id: data.socket_id,
        msgType: DanmuMsgTypeEnum.userLeaved,
        msgIsFile: WsMessageMsgIsFileEnum.no,
        userInfo: data.user_info,
        msg: '',
        send_msg_time: +new Date(),
      });
    });
  }

  function initWs(data: {
    isAnchor: boolean;
    roomId: string;
    isRemoteDesk?: boolean;
    currentResolutionRatio?: number;
    currentMaxFramerate?: number;
    currentMaxBitrate?: number;
  }) {
    roomId.value = data.roomId;
    isAnchor.value = data.isAnchor;
    if (data.isRemoteDesk) {
      isRemoteDesk.value = data.isRemoteDesk;
    }
    if (data.currentMaxBitrate) {
      currentMaxBitrate.value = data.currentMaxBitrate;
    }
    if (data.currentMaxFramerate) {
      currentMaxFramerate.value = data.currentMaxFramerate;
    }
    if (data.currentResolutionRatio) {
      currentResolutionRatio.value = data.currentResolutionRatio;
    }
    new WebSocketClass({
      roomId: roomId.value,
      url: WEBSOCKET_URL,
      isAnchor: data.isAnchor,
    });
    initReceive();
  }

  return {
    initWs,
    handleStartLive,
    handleSendGetLiveUser,
    mySocketId,
    canvasVideoStream,
    lastCoverImg,
    roomLiving,
    anchorInfo,
    liveUserList,
    damuList,
    currentMaxFramerate,
    currentMaxBitrate,
    currentResolutionRatio,
  };
};
