import { IScreenWall } from '@/interface';
import request from '@/utils/request';

export function fetchScreenWallSetImg(data) {
  return request.post('/screen_wall/set_img', data);
}

export function fetchScreenWallGetImg(params) {
  return request.get('/screen_wall/get_img', { params });
}

export function fetchScreenWallGetAllImg(params) {
  return request.get<string[]>('/screen_wall/get_all_img', { params });
}

export function fetchScreenWallGetImgBySuperAdmin(params) {
  return request.get('/screen_wall/get_img_by_superadmin', { params });
}

export function fetchScreenWallAddGroup(data) {
  return request.post('/screen_wall/add_group', data);
}

export function fetchScreenWallDelData(data) {
  return request.post('/screen_wall/del_data', data);
}

export function fetchScreenWallDelGroup(data) {
  return request.post('/screen_wall/del_group', data);
}

export function fetchScreenWallEditData(data) {
  return request.post('/screen_wall/edit_data', data);
}

export function fetchScreenWallEditGroup(data) {
  return request.post('/screen_wall/edit_group', data);
}

export function fetchScreenWallAddData(data) {
  return request.post('/screen_wall/add_data', data);
}

export function fetchScreenWallGetData(params) {
  return request.get<IScreenWall[]>('/screen_wall/get_data', { params });
}
