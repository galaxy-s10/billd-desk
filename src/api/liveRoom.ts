import { IList, IPaging } from '@/interface';
import { ILiveRoom } from '@/types/ILiveRoom';
import request from '@/utils/request';

export function fetchLiveRoomList(params: IList<ILiveRoom>) {
  return request.get<IPaging<ILiveRoom>>('/live_room/list', {
    params,
  });
}

export function fetchVerifyPkKey(data: { liveRoomId: number; key }) {
  return request.get(`/live_room/verify_pk_key/${data.liveRoomId}`, {
    params: { key: data.key },
  });
}

export function fetchUpdateLiveRoomKey() {
  return request.instance({
    url: '/live_room/update_key',
    method: 'put',
  });
}

export function fetchFindLiveRoom(roomId: string) {
  return request.get<ILiveRoom>(`/live_room/find/${roomId}`);
}
