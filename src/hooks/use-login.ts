import { hrefToTarget, isMobile } from 'billd-utils';
import { createApp } from 'vue';

import { fetchQQLogin } from '@/api/qqUser';
import { fullLoading } from '@/components/FullLoading';
import {
  DEFAULT_AUTH_INFO,
  QQ_CLIENT_ID,
  QQ_OAUTH_URL,
  QQ_REDIRECT_URI,
  WECHAT_GZH_APPID,
  WECHAT_GZH_OAUTH_URL,
  WECHAT_REDIRECT_URI,
} from '@/constant';
import LoginModalCpt from '@/hooks/loginModal/index.vue';
import { PlatformEnum } from '@/interface';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { clearThirdLoginInfo, setThirdLoginInfo } from '@/utils/cookie';
import { getToken } from '@/utils/localStorage/user';

const app = createApp(LoginModalCpt);
const container = document.createElement('div');
// @ts-ignore
const instance: ComponentPublicInstance<InstanceType<typeof LoginModalCpt>> =
  app.mount(container);

document.body.appendChild(container);

const POSTMESSAGE_TYPE = [PlatformEnum.qqLogin];

export async function handleQQLogin(e) {
  const { type, data } = e.data;
  if (!POSTMESSAGE_TYPE.includes(type)) return;
  console.log('收到消息', type, data);
  const userStore = useUserStore();
  const appStore = useAppStore();

  try {
    switch (type) {
      case PlatformEnum.qqLogin: {
        const res = await fetchQQLogin({ code: data.code, exp: data.qqExp });
        if (res.code === 200) {
          window.$message.success('登录成功！');
          fullLoading({
            loading: false,
          });
        }
        userStore.setToken(res.data, data.qqExp);
        userStore.getUserInfo();
        appStore.showLoginModal = false;
        break;
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    clearThirdLoginInfo();
  }
}

export function loginTip(show = false) {
  const token = getToken();
  instance.show = show;
  const appStore = useAppStore();
  if (!token) {
    window.$message.warning('请先登录！');
    // instance.show = true;
    appStore.showLoginModal = true;
    return false;
  }
  return true;
}

export function commentAuthTip() {
  const userStore = useUserStore();
  if (
    !userStore.auths?.find(
      (v) => v.auth_value === DEFAULT_AUTH_INFO.MESSAGE_SEND.auth_value
    )
  ) {
    window.$message.error(
      `没有${DEFAULT_AUTH_INFO.MESSAGE_SEND.auth_value}权限！`
    );
    return false;
  }
  return true;
}

export function loginMessage() {
  window.addEventListener('message', handleQQLogin);
}

export function useQQLogin(data: { exp }) {
  fullLoading({
    loading: true,
    showMask: true,
    content: 'qq登录...',
    style: { color: 'white' },
  });
  const handleUrl = (state: string) =>
    `${QQ_OAUTH_URL}/authorize?response_type=code&client_id=${QQ_CLIENT_ID}&redirect_uri=${QQ_REDIRECT_URI}&scope=get_user_info,get_vip_info,get_vip_rich_info&state=${state}`;
  let loginInfo = JSON.stringify({
    isMobile: false,
    createTime: +new Date(),
    env: 'qq',
    dev: process.env.NODE_ENV === 'development',
    qqExp: data.exp,
  });
  if (isMobile()) {
    loginInfo = JSON.stringify({ ...JSON.parse(loginInfo), isMobile: true });
    setThirdLoginInfo(loginInfo);
    hrefToTarget(handleUrl(window.btoa(loginInfo)));
  } else {
    setThirdLoginInfo(loginInfo);
    window.open(
      handleUrl(window.btoa(loginInfo)),
      'qq_login_window',
      'toolbar=yes,location=no,directories=no,status=no,menubar=no,scrollbars=no,titlebar=no,toolbar=no,resizable=no,copyhistory=yes, width=918, height=609,top=250,left=400'
    );
  }
}

export const useWechatLogin = (qrData: { platform; exp; loginId }) => {
  const redirectUri = encodeURIComponent(WECHAT_REDIRECT_URI);
  const loginInfo = JSON.stringify({
    isMobile: false,
    createTime: +new Date(),
    env: 'wechat',
    dev: process.env.NODE_ENV === 'development',
    qrcodePlatform: qrData.platform,
    qrcodeExp: qrData.exp,
    qrcodeLoginId: qrData.loginId,
  });
  setThirdLoginInfo(loginInfo);
  const stateRes = window.btoa(loginInfo);
  // https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
  const url = `${WECHAT_GZH_OAUTH_URL}appid=${WECHAT_GZH_APPID}&redirect_uri=${redirectUri}&scope=snsapi_userinfo&response_type=code&state=${stateRes}`;
  hrefToTarget(url);
};
