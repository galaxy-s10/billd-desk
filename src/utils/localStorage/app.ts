import { lsKey } from '@/constant';
import cache from '@/utils/cache';

export const getLastBuildDate = () => {
  return cache.getStorage<string>(lsKey.lastBuildDate);
};

export const setLastBuildDate = (val: string) => {
  return cache.setStorage(lsKey.lastBuildDate, val);
};
