import { IScreenWall } from '@/interface';
import request from '@/utils/request';

export function fetchScreenWallSetImg(data) {
  return request.post('/screen_wall/set_img', data);
}

export function fetchScreenWallGetImg(params) {
  return request.get('/screen_wall/set_img', { params });
}

export function fetchScreenWallAddGroup(data) {
  return request.post('/screen_wall/add_group', data);
}

export function fetchScreenWallDelData(data) {
  return request.post('/screen_wall/del_data', data);
}

export function fetchScreenWallEditData(data) {
  return request.post('/screen_wall/edit_data', data);
}

export function fetchScreenWallAddData(data) {
  return request.post('/screen_wall/add_data', data);
}

export function fetchScreenWallGetData(params) {
  return request.get<IScreenWall[]>('/screen_wall/get_data', { params });
}
