import { IPaging, IWallet } from '@/interface';
import request from '@/utils/request';

export function fetchWalletList(params) {
  return request.get<IPaging<IWallet>>('/wallet/list', {
    params,
  });
}

export function fetchMyWallet() {
  return request.get<IWallet>('/wallet/my_wallet');
}
