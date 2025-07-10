import request from '@/utils/request';

// qq登录
export function fetchQQLogin({ code, exp }) {
  return request.post(`/qq_user/login`, {
    code,
    exp,
  });
}
