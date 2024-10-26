import { defineStore } from 'pinia';

import { lsKeyPrefix } from '@/constant';
import { AppRootState } from '@/store/app';

export type PiniaCacheRootState = {
  muted: boolean;
  volume: number;
  deskUserUuid: string;
  deskUserPassword: string;
  remoteDeskUserUuid: string;
  'resource-list': AppRootState['allTrack'];
};

export const usePiniaCacheStore = defineStore(`${lsKeyPrefix}pinia-cache`, {
  persist: {
    key: `${lsKeyPrefix}pinia-cache`,
  },
  state: (): PiniaCacheRootState => {
    return {
      deskUserUuid: '',
      deskUserPassword: '',
      remoteDeskUserUuid: '',
      muted: true,
      volume: 80,
      'resource-list': [],
    };
  },
  actions: {
    setResourceList(res: PiniaCacheRootState['resource-list']) {
      this['resource-list'] = res;
    },
  },
});
