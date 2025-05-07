import { ILoginRecord } from '@/interface';
import request from '@/utils/request';

export function fetchLoginRecordCreate(data: ILoginRecord) {
  return request.post(`/login_record/create`, data);
}
