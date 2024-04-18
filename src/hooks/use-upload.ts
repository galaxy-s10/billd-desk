import { upload } from 'qiniu-js';
import { ref } from 'vue';

import {
  fetchQiniuUploadToken,
  fetchUpload,
  fetchUploadChunk,
  fetchUploadMergeChunk,
  fetchUploadProgress,
} from '@/api/qiniuData';
import { QINIU_RESOURCE } from '@/constant';
import { getHash, splitFile } from '@/utils';

export async function useUpload({
  prefix,
  file,
}: {
  prefix: string;
  file: File;
}): Promise<
  | {
      flag: boolean;
      respBody?: any;
      respErr?: any;
      respInfo?: any;
      resultUrl?: string | undefined;
    }
  | undefined
> {
  const timer = ref();
  let isMerge = false;

  const mergeAndUpload = async ({ hash, ext, prefix }) => {
    await fetchUploadMergeChunk({ hash, ext, prefix });
    const { data } = await fetchUpload({
      hash,
      ext,
      prefix,
    });
    clearInterval(timer.value);
    return data;
  };

  try {
    const { hash, ext } = await getHash(file);
    const { code } = await fetchUploadProgress({ prefix, hash, ext });
    if (code === 3) {
      const res = await fetchUpload({ prefix, hash, ext });
      return new Promise((resolve) => {
        resolve(res.data);
      });
    }
    const chunkList = splitFile(file);
    return new Promise<{
      flag: boolean;
      respBody?: any;
      respErr?: any;
      respInfo?: any;
      resultUrl?: string | undefined;
    }>((resolve) => {
      for (let i = 0; i < chunkList.length; i += 1) {
        const v = chunkList[i];
        const form = new FormData();
        form.append('prefix', prefix);
        form.append('hash', hash);
        form.append('ext', ext);
        form.append('chunkName', v.chunkName);
        form.append('chunkTotal', `${chunkList.length}`);
        form.append('uploadFiles', v.chunk);
        fetchUploadChunk(form).then((res) => {
          if (res.data.percentage === 50) {
            if (!isMerge) {
              mergeAndUpload({ hash, ext, prefix })
                .then((uploadRes) => {
                  console.log('mergeAndUpload成功', uploadRes);
                  resolve(uploadRes);
                })
                .catch((err) => {
                  console.error('mergeAndUpload失败', err);
                  resolve({ flag: false });
                });
              isMerge = true;
            }
          }
        });
      }
      let flag = false;
      timer.value = setInterval(async () => {
        try {
          const { code, data, message } = await fetchUploadProgress({
            hash,
            prefix,
            ext,
          });
          if (flag) {
            clearInterval(timer.value);
            return;
          }
          if (code === 1) {
            const percentage = data.percentage!;
            if (percentage === 100) {
              flag = true;
            }
          } else {
            clearInterval(timer.value);
            console.error(code, data, message);
          }
        } catch (error) {
          console.error(error);
          clearInterval(timer.value);
        }
      }, 1000);
    });
  } catch (error) {
    console.error(error);
  } finally {
    clearInterval(timer.value);
  }
}

export async function useQiniuJsUpload({
  prefix,
  file,
}: {
  prefix: string;
  file: File;
}) {
  const { hash, ext } = await getHash(file);
  const res = await fetchQiniuUploadToken({ ext, hash, prefix });
  if (res.code === 200) {
    return new Promise<{ flag: boolean; err?: any; resultUrl?: string }>(
      (resolve) => {
        const key = `${prefix + hash}.${ext}`;
        const observable = upload(file, key, res.data);
        observable.subscribe({
          next(res) {
            console.log('next', res);
          },
          error(err) {
            console.log('error', err);
            resolve({
              flag: false,
              err,
            });
          },
          complete(res) {
            console.log('complete', res);
            resolve({
              flag: true,
              resultUrl: `${QINIU_RESOURCE.url}/${res.key as string}`,
            });
          },
        });
      }
    );
  } else {
    return Promise.resolve<{ flag: boolean; err?: any; resultUrl?: string }>({
      flag: false,
    });
  }
}
