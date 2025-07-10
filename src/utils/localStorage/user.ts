import { LS_KEY } from '@/constant';
import cache from '@/utils/cache';

export const getToken = () => {
  return cache.getStorage<string>(LS_KEY.token);
};
export const setToken = (val: string) => {
  return cache.setStorage(LS_KEY.token, val);
};
export const clearToken = () => {
  return cache.clearStorage(LS_KEY.token);
};
