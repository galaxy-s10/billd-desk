import request from '@/utils/request';

export function fetchWsKeepAlive(data) {
  return request.post('/ws/keep_alive', data);
}

export function fetchWsSendMsg(data) {
  return request.post('/ws/send_msg', data);
}
