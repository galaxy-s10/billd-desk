import request from '@/utils/request';

export function fetchRtcV1Publish(data: {
  api: string;
  clientip: string | null;
  sdp: string;
  streamurl: string;
  tid: string;
}) {
  return request.post(`/srs/rtcV1Publish`, data);
}

export function fetchRtcV1Play(data: {
  api: string;
  clientip: string | null;
  sdp: string;
  streamurl: string;
  tid: string;
}) {
  return request.post(`/srs/rtcV1Play`, data);
}
