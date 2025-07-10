import request from '@/utils/request';

export function fetchTencentcloudCssPush(liveRoomId: number) {
  return request.post<{
    obs: {
      url: string;
      key: string;
    };
    rtmp: string;
    flv: string;
    hls: string;
    webrtc: string;
  }>(`/tencentcloud_css/push`, { liveRoomId });
}
