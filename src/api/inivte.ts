import request from '@/utils/request';

export function fetchInviteCreate(data) {
  return request.post('/invite/create', data);
}
export function fetchInviteKeepAlive(data) {
  return request.post('/invite/keep_alive', data);
}

export function fetchInviteDel(data) {
  return request.post('/invite/del', data);
}

export function fetchInviteGet(params) {
  return request.get('/invite/get', { params });
}
