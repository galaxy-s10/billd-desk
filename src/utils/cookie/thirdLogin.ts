import cookies from 'js-cookie';

import { COOKIE_DOMAIN, COOKIE_KEY } from '@/constant';

export const getThirdLoginInfo = () => {
  return cookies.get(COOKIE_KEY.thirdLoginInfo);
};

export const setThirdLoginInfo = (val) => {
  cookies.set(COOKIE_KEY.thirdLoginInfo, val, {
    domain: COOKIE_DOMAIN,
  });
};

export const clearThirdLoginInfo = () => {
  cookies.remove(COOKIE_KEY.thirdLoginInfo);
};
