import request from '@/utils/request';

export function fetchDeskConfigTurnserver() {
  return request.get(`/desk_config/turnserver`);
}
