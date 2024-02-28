import { IQiniuData } from '@/interface';
import request from '@/utils/request';

export interface IQiniuKey {
  prefix: string;
  hash: string;
  ext: string;
}

export function fetchQiniuUploadToken(params: IQiniuKey) {
  return request.get('/qiniu_data/get_token', { params });
}

export function fetchQiniuDataList(params) {
  return request.get('/qiniu_data/list', {
    params,
  });
}

export function fetchDiff(params) {
  return request.get('/qiniu_data/diff', {
    params,
  });
}

// 上传图片
export function fetchUpload(data: IQiniuKey) {
  // data:new FormData {prefix,uploadFiles}
  return request.post<{
    flag: boolean;
    respBody?: any;
    respErr?: any;
    respInfo?: any;
    resultUrl?: string;
  }>('/qiniu_data/upload', data, {
    timeout: 1000 * 60,
  });
}

// 上传chunk
export function fetchUploadChunk(data) {
  // data:new FormData {prefix,uploadFiles}
  return request.post<{ percentage: number }>(
    '/qiniu_data/upload_chunk',
    data,
    {
      headers: { 'Content-Type': 'multipart/form-data;' },
      timeout: 1000 * 60,
    }
  );
}

// 合并chunk
export function fetchUploadMergeChunk(data) {
  // data:new FormData {prefix,uploadFiles}
  return request.post('/qiniu_data/merge_chunk', data, {
    timeout: 1000 * 60,
  });
}

// 获取上传图片进度
export function fetchUploadProgress(params: IQiniuKey) {
  return request.get<{ percentage?: number }>('/qiniu_data/progress', {
    timeout: 1000 * 10, // 以免并发轮询获取进度的时候超时
    params,
  });
}

export function fetchCreateLink(data: IQiniuData) {
  return request.post('/qiniu_data/create', data);
}
export function fetchUpdateQiniuData(data: IQiniuData) {
  return request.instance({
    url: `/qiniu_data/update/${data.id!}`,
    method: 'put',
    data,
  });
}

export function fetchDeleteQiniuData(id: number) {
  return request.instance({
    url: `/qiniu_data/delete/${id}`,
    method: 'delete',
  });
}
// eslint-disable-next-line camelcase
export function fetchDeleteQiniuDataByQiniuKey(qiniu_key: string) {
  return request.instance({
    url: `/qiniu_data/delete_by_qiniukey`,
    // delete请求的话，设置params参数都是在地址栏的，因此会将如果参数是数组，会将数组序列化，如http://127.0.0.1:3300/role/batch_delete_child_roles?id=1&c_roles=18&c_roles=2&c_roles=%2733%27
    method: 'delete',
    // data: { qiniu_key },
    // eslint-disable-next-line camelcase
    params: { qiniu_key }, // 后端的koa-body设置了strict:true，则delete不会解析data数据，因此需要使用params
  });
}
