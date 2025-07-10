import { IList, IPaging, IWsMessage } from '@/interface';
import request from '@/utils/request';

export function fetchGetWsMessageList(params: IList<IWsMessage>) {
  return request.get<IPaging<IWsMessage>>('/ws_message/list', {
    params,
  });
}
