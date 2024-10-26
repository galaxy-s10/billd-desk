import { defineStore } from 'pinia';

import { LS_KEY_PREFIX } from '@/constant';

export type PiniaCacheRootState = {
  muted: boolean;
  volume: number;
  linkDeviceList: {
    remoteDeskUserUuid: string;
    remoteDeskUserPassword: string;
  }[];
  isAlwaysOnTop: boolean;
  hidePwd: boolean;
  deskUserUuid: string;
  deskUserPassword: string;
  remoteDeskUserUuid: string;
  remoteDeskUserPassword: string;
};

export const usePiniaCacheStore = defineStore(`${LS_KEY_PREFIX}pinia-cache`, {
  persist: {
    key: `${LS_KEY_PREFIX}pinia-cache`,
  },
  state: (): PiniaCacheRootState => {
    return {
      muted: true,
      volume: 70,
      linkDeviceList: [],
      isAlwaysOnTop: false,
      hidePwd: false,
      deskUserUuid: '',
      deskUserPassword: '',
      remoteDeskUserUuid: '',
      remoteDeskUserPassword: '',
    };
  },
  actions: {},
});
