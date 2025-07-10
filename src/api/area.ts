import { IPaging } from '@/interface';
import { ILiveRoom } from '@/types/ILiveRoom';
import request from '@/utils/request';

export function fetchAreaList() {
  return request.get('/area/list');
}

export function fetchAreaLiveRoomList(params) {
  return request.get('/area/area_live_room_list', {
    params,
  });
}

export function fetchLiveRoomList(params) {
  return request.get<IPaging<ILiveRoom>>('/area/live_room_list', {
    params,
  });
}
