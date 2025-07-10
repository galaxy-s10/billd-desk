import { LS_KEY } from '@/constant';
import cache from '@/utils/cache';

export const getAxiosBaseUrl = () => {
  return cache.getStorage<string>(LS_KEY.axiosBaseUrl);
};
export const setAxiosBaseUrl = (val: string) => {
  return cache.setStorage(LS_KEY.axiosBaseUrl, val);
};
export const clearAxiosBaseUrl = () => {
  return cache.clearStorage(LS_KEY.axiosBaseUrl);
};

export const getWssUrl = () => {
  return cache.getStorage<string>(LS_KEY.wssUrl);
};
export const setWssUrl = (val: string) => {
  return cache.setStorage(LS_KEY.wssUrl, val);
};
export const clearWssUrl = () => {
  return cache.clearStorage(LS_KEY.wssUrl);
};

export const getCoturnUrl = () => {
  return cache.getStorage<string>(LS_KEY.coturnUrl);
};
export const setCoturnUrl = (val: string) => {
  return cache.setStorage(LS_KEY.coturnUrl, val);
};
export const clearCoturnUrl = () => {
  return cache.clearStorage(LS_KEY.coturnUrl);
};
