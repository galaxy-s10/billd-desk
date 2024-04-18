import { windowReload } from 'billd-utils';

import { getLastBuildDate } from '@/utils/localStorage/app';

import { useTip } from './use-tip';

export function handleTip() {
  window.$message.info('敬请期待！');
}

export const useCheckUpdate = () => {
  function handleHtmlCheckUpdate(data: {
    htmlUrl: string;
    lastBuildDate: string;
  }) {
    return new Promise<{ shouldTip: boolean }>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', data.htmlUrl, true);
      xhr.onreadystatechange = function () {
        try {
          if (this.readyState !== 4) return;
          if (this.status !== 200) return; // or whatever error handling you want
          const reg = /\('最后构建日期:', "(.+)"\)/;
          const res = reg.exec(this.responseText);
          if (res?.[1] !== data.lastBuildDate) {
            resolve({ shouldTip: true });
            console.log('提示更新');
            useTip({
              content: '发现新内容可用，是否刷新页面？',
              confirmButtonText: '刷新',
            })
              .then(() => {
                windowReload();
              })
              .catch(() => {});
          } else {
            resolve({ shouldTip: false });
            console.log('不提示更新');
          }
        } catch (error) {
          console.error(error);
        }
      };
      xhr.send();
    });
  }

  function checkUpdate(data: { htmlUrl: string }) {
    setInterval(
      async () => {
        const lastBuildDate = getLastBuildDate();
        if (lastBuildDate) {
          const res = await handleHtmlCheckUpdate({
            htmlUrl: data.htmlUrl,
            lastBuildDate,
          });
          return res;
        }
      },
      1000 * 60 * 5
    );
  }
  return { checkUpdate };
};
