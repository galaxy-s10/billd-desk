import { IPaging, IWalletRecord } from '@/interface';
import request from '@/utils/request';

export function fetchWalletRecordMyList(params) {
  return request.get<IPaging<IWalletRecord>>('/wallet_record/my_list', {
    params,
  });
}
