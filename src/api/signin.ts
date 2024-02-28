import { IList, IPaging, ISigninStatistics } from '@/interface';
import request from '@/utils/request';

export function fetchSigninList(params: IList<ISigninStatistics>) {
  return request.get<IPaging<ISigninStatistics>>('/signin_statistics/list', {
    params,
  });
}

export function fetchCreateSignin(data: ISigninStatistics) {
  return request.post('/signin_record/create', data);
}

export function fetchTodayIsSignin({ liveRoomId }) {
  return request.get('/signin_record/today_is_signin', {
    params: {
      live_room_id: liveRoomId,
    },
  });
}
