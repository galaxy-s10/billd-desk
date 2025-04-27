import { IDeskUser } from '@/interface';
import request from '@/utils/request';

export function fetchFindReceiverByUuid(uuid) {
  return request.get(`/desk_user/find_receiver_by_uuid`, { params: { uuid } });
}

export function fetchDeskUserLogin(data: IDeskUser) {
  return request.post<IDeskUser>(`/desk_user/login`, data);
}

export function fetchDeskUserAutoLogin(data: IDeskUser) {
  return request.post<IDeskUser>(`/desk_user/auto_login`, data);
}

export function fetchDeskUserLinkVerify(data: IDeskUser) {
  return request.post(`/desk_user/link_verify`, data);
}

export function fetchDeskUserCreate() {
  return request.post<IDeskUser>(`/desk_user/create`);
}

export function fetchDeskUserUpdateByUuid(data: IDeskUser) {
  return request.put<IDeskUser>(`/desk_user/update_by_uuid`, data);
}
