import { IDeskVersion, IList } from '@/interface';
import request from '@/utils/request';

export function fetchDeskVersionLatest(params) {
  return request.get(`/desk_version/latest`, { params });
}

export function fetchDeskVersionCheck({ version, type }) {
  return request.get(`/desk_version/check`, { params: { version, type } });
}

export function fetchDeskVersionByVersion({ version, type }) {
  return request.get(`/desk_version/find_by_version`, {
    params: { version, type },
  });
}
export function fetchDeskVersionAllVersion(params: IList<IDeskVersion>) {
  return request.get(`/desk_version/find_all_version`, {
    params,
  });
}
