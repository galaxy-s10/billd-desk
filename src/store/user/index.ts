import { defineStore } from 'pinia';

import { fetchLogin, fetchUserInfo } from '@/api/user';
import { fetchMyWallet } from '@/api/wallet';
import { IAuth, IRole } from '@/interface';
import { IUser } from '@/types/IUser';
import cache from '@/utils/cache';

type UserRootState = {
  userInfo?: IUser;
  token?: string | null;
  roles?: IRole[];
  auths?: IAuth[];
};

export const useUserStore = defineStore('user', {
  state: (): UserRootState => {
    return {
      token: cache.getStorageExp('token'),
      roles: undefined,
      userInfo: undefined,
      auths: undefined,
    };
  },
  actions: {
    setUserInfo(res: UserRootState['userInfo']) {
      this.userInfo = res;
    },
    setToken(res: UserRootState['token'], exp: number) {
      cache.setStorageExp('token', res, exp);
      this.token = res;
    },
    setRoles(res: UserRootState['roles']) {
      this.roles = res;
    },
    setAuths(res: UserRootState['auths']) {
      this.auths = res;
    },
    logout() {
      cache.clearStorage('token');
      this.token = undefined;
      this.userInfo = undefined;
      this.roles = undefined;
    },
    async pwdLogin({ id, password }) {
      try {
        const { data: token } = await fetchLogin({
          id,
          password,
        });
        this.setToken(token, 24);
        return token;
      } catch (error: any) {
        // 错误返回401，全局的响应拦截会打印报错信息
        return null;
      }
    },
    async updateMyWallet() {
      const res = await fetchMyWallet();
      if (res.code === 200) {
        if (this.userInfo?.wallet?.balance) {
          this.userInfo.wallet.balance = res.data.balance;
        }
      }
    },
    async getUserInfo() {
      try {
        const { code, data } = await fetchUserInfo();
        this.setUserInfo(data);
        this.setRoles(data.roles);
        this.setAuths(data.auths);
        return { code, data };
      } catch (error) {
        return error;
      }
    },
  },
});
