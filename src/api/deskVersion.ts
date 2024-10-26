import request from '@/utils/request';

export function fetchDeskVersionLatest() {
  return request.get(`/desk_version/latest`);
}

export function fetchDeskVersionCheck(version) {
  return request.get(`/desk_version/check`, { params: { version } });
}

export function fetchDeskVersionByVersion(version) {
  return request.get(`/desk_version/find_by_version`, { params: { version } });
}
