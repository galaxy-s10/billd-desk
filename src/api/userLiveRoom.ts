import { IUserLiveRoom } from '@/interface';
import request from '@/utils/request';

export function fetchUserHasLiveRoom(userId: number) {
  return request.get<IUserLiveRoom>(`/user_live_room/find_by_userId/${userId}`);
}

export function fetchCreateUserLiveRoom() {
  return request.post(`/user_live_room/create`);
}
