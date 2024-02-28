import request from '@/utils/request';

export function fetchLivePlayList(params: {
  orderName: string;
  orderBy: string;
  nowPage?: number;
  pageSize?: number;
}) {
  return request.get('/live_play/list', {
    params,
  });
}
