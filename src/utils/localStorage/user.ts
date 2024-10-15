import { lsKey } from '@/constant';
import cache from '@/utils/cache';

export const getUuid = () => {
  return cache.getStorage<string>(lsKey.uuid);
};
export const setUuid = (val: string) => {
  return cache.setStorage(lsKey.uuid, val);
};
export const clearUuid = () => {
  return cache.clearStorage(lsKey.uuid);
};

export const getPassword = () => {
  return cache.getStorage<string>(lsKey.password);
};
export const setPassword = (val: string) => {
  return cache.setStorage(lsKey.password, val);
};
export const clearPassword = () => {
  return cache.clearStorage(lsKey.password);
};

export const getToken = () => {
  return cache.getStorage<string>(lsKey.token);
};
export const setToken = (val: string) => {
  return cache.setStorage(lsKey.token, val);
};
export const clearToken = () => {
  return cache.clearStorage(lsKey.token);
};
