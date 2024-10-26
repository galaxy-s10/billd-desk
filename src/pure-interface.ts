export interface IIpcRendererData {
  windowId: number;
  channel: any;
  requestId: string;
  data: any;
  code?: number;
  msg?: string;
}
