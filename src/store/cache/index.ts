import { defineStore } from 'pinia';

import { lsKeyPrefix } from '@/constant';
import { AppRootState } from '@/store/app';

export type PiniaCacheRootState = {
  muted: boolean;
  volume: number;
  'resource-list': AppRootState['allTrack'];
};

export const usePiniaCacheStore = defineStore(`${lsKeyPrefix}pinia-cache`, {
  persist: {
    key: `${lsKeyPrefix}pinia-cache`,
  },
  state: (): PiniaCacheRootState => {
    return {
      muted: true,
      volume: 80,
      'resource-list': [],
    };
  },
  actions: {
    setResourceList(res: PiniaCacheRootState['resource-list']) {
      this['resource-list'] = res;
    },
    setMuted(res: PiniaCacheRootState['muted']) {
      this.muted = res;
    },
    setVolume(res: PiniaCacheRootState['volume']) {
      this.volume = res;
    },
  },
});
