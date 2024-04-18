import { Socket, io } from 'socket.io-client';

import { useNetworkStore } from '@/store/network';
import { useUserStore } from '@/store/user';
import {
  IWsFormat,
  WsConnectStatusEnum,
  WsMsgTypeEnum,
} from '@/types/websocket';

export function prettierReceiveWsMsg(...arg) {
  console.warn('【websocket】收到消息', ...arg);
}

export function prettierSendWsMsg(data: {
  requestId: string;
  msgType: string;
  data;
}) {
  console.warn(
    `【websocket】发送消息 msgType:${data.msgType},requestId:${data.requestId}`,
    data
  );
}

export class WebSocketClass {
  socketIo: Socket | null = null;
  status: WsConnectStatusEnum = WsConnectStatusEnum.disconnect;
  url = '';
  roomId = '-1';
  isAnchor = false;

  constructor(data: { roomId: string; url: string; isAnchor: boolean }) {
    if (!window.WebSocket) {
      alert('当前环境不支持WebSocket！');
      return;
    }
    console.warn('开始new WebSocketClass', data);
    this.roomId = data.roomId;
    this.isAnchor = data.isAnchor;
    this.url = data.url;
    this.socketIo = io(data.url, {
      transports: ['websocket'],
      // forceBase64: true,
      // WARN 用了自定义parser之后，msrblob里面的blob文件错误
      // parser: customParser,
    });
    this.update();
  }

  // 发送websocket消息
  send = <T extends unknown>({
    // 写成<T extends unknown>而不是<T>是为了避免eslint将箭头函数的<T>后面的内容识别成jsx语法
    msgType,
    requestId,
    data,
  }: {
    msgType: WsMsgTypeEnum;
    requestId: string;
    data?: T;
  }) => {
    if (!this.socketIo?.connected) {
      console.error(
        '【websocket】未连接成功，不发送websocket消息！',
        msgType,
        data
      );
      return;
    }
    prettierSendWsMsg({ requestId, msgType, data });
    const userStore = useUserStore();
    const sendData: IWsFormat<any> = {
      request_id: requestId,
      socket_id: this.socketIo.id,
      is_anchor: this.isAnchor,
      user_info: userStore.userInfo,
      user_token: userStore.token || undefined,
      data: data || {},
    };
    // const binary = stringToArrayBuffer(JSON.stringify(sendData));
    this.socketIo?.emit(msgType, sendData);
  };

  // 更新store
  update = () => {
    const networkStore = useNetworkStore();
    networkStore.updateWsMap(this.roomId, this);
  };

  // 手动关闭websocket连接
  close = () => {
    console.warn('手动关闭websocket连接', this.socketIo?.id);
    this.socketIo?.close();
  };
}
