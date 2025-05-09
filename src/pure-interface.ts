export interface IIpcRendererData {
  /** 发送消息的窗口id */
  windowId: number;
  channel: any;
  requestId: string;
  data: any;
  code?: number;
  msg?: string;
}
