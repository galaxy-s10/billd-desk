import { IGiftRecord, IList, IPaging } from '@/interface';
import request from '@/utils/request';

export function fetchGiftGroupList(params: IList<IGiftRecord>) {
  return request.get<IPaging<IGiftRecord>>('/gift_record/gift_group_list', {
    params: {
      live_room_id: params.live_room_id,
      status: params.status,
      nowPage: params.nowPage,
      pageSize: params.pageSize,
    },
  });
}

export function fetchGiftRecordList(params: IList<IGiftRecord>) {
  return request.get<IPaging<IGiftRecord>>('/gift_record/list', {
    params: {
      live_room_id: params.live_room_id,
      status: params.status,
      nowPage: params.nowPage,
      pageSize: params.pageSize,
    },
  });
}

export function fetchGiftRecordCreate(data: {
  goodsId: number;
  liveRoomId: number;
  goodsNums: number;
}) {
  return request.post('/gift_record/create', {
    live_room_id: data.liveRoomId,
    goods_id: data.goodsId,
    goods_nums: data.goodsNums,
  });
}
