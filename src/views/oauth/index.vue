<template>
  <div v-if="!errMsg.length">{{ currentOauth }}登录...</div>
  <div v-else>非法登录！{{ errMsg }}</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchWechatLogin } from '@/api/wechatUser';
import { handleQQLogin } from '@/hooks/use-login';
import { PlatformEnum } from '@/interface';
import router, { routerName } from '@/router';
import { useUserStore } from '@/store/user';
import { clearThirdLoginInfo, getThirdLoginInfo } from '@/utils/cookie';

const route = useRoute();
const userStore = useUserStore();

const errMsg = ref('');
const currentOauth = ref('');

onMounted(async () => {
  const { platform } = route.params;
  const { code, state } = route.query;
  if (!code) {
    errMsg.value = '地址栏缺少code';
    return;
  }
  if (!state) {
    errMsg.value = '地址栏缺少state';
    return;
  }

  const atobStateRes = window.atob(window.decodeURIComponent(state as string));
  let loginInfo = '';

  try {
    const res = JSON.parse(atobStateRes);
    // 在第三方登录的时候，会往cookie里记录环境，因此这里直接读取
    // 如果不是dev环境，则读取cookie
    if (!res.dev) {
      loginInfo = getThirdLoginInfo();
      if (!loginInfo) {
        errMsg.value = 'cookie缺少登录信息';
        return;
      }

      if (state !== window.btoa(window.decodeURIComponent(loginInfo))) {
        errMsg.value = 'state非法';
        return;
      }
    } else {
      loginInfo = atobStateRes;
    }
  } catch (error) {
    errMsg.value = '校验state错误';
    return;
  }

  switch (platform) {
    case PlatformEnum.qqLogin:
      currentOauth.value = 'QQ';
      break;
    case PlatformEnum.wechatLogin:
      currentOauth.value = '微信';
      break;
  }

  try {
    // eslint-disable-next-line
    const { isMobile, env, qrcodePlatform, qrcodeExp, qrcodeLoginId, qqExp } =
      JSON.parse(loginInfo);

    if (env === 'qq') {
      const info = { type: PlatformEnum.qqLogin, data: { code, qqExp } };
      if (isMobile) {
        try {
          await handleQQLogin({
            data: info,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        window.opener.postMessage(info, '*');
        window.close();
      }
    } else if (env === 'wechat') {
      // eslint-disable-next-line
      if (!qrcodePlatform || !qrcodeLoginId || !qrcodeExp) {
        window.$message.error('参数缺失！');
        return;
      }
      const res = await fetchWechatLogin({
        code,
        platform: qrcodePlatform,
        login_id: qrcodeLoginId,
        exp: qrcodeExp,
      });
      if (res.code === 200) {
        window.$message.success('登录成功！');
        userStore.setToken(res.data, qrcodeExp);
        userStore.getUserInfo();
        router.push({ name: routerName.h5 });
      } else {
        window.$message.error(res.message);
      }
    }
  } catch (error) {
    console.log(error);
    clearThirdLoginInfo();
  }
});
</script>

<style lang="scss" scoped></style>
