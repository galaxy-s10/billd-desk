import { lsKey } from '@/constant';
import cache from '@/utils/cache';

export const getToken = () => {
  return cache.getStorage<string>(lsKey.token);
};
export const setToken = (val: string) => {
  return cache.setStorage(lsKey.token, val);
};
export const clearToken = () => {
  return cache.clearStorage(lsKey.token);
};
