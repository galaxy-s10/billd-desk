// TIP: ctrl+cmd+t,生成函数注释
import { computeBox, getRangeRandom } from 'billd-utils';
import sparkMD5 from 'spark-md5';

/**
 * 将base64转换为file
 */
export function base64ToFile(base64: string, fileName: string) {
  // 解析Base64编码的字符串，分离数据头和编码数据
  const splitDataURI = base64.split(',');
  const byteString = atob(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  // 构建Uint8Array类型的数组，用数组来创建Blob对象
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i += 1) {
    intArray[i] = byteString.charCodeAt(i);
  }
  const imageBlob = new Blob([intArray], { type: mimeString });
  const file = new File([imageBlob], fileName, { type: mimeString });
  return file;
}

export function stringToArrayBuffer(str: string) {
  const encoder = new TextEncoder(); // 默认是'utf-8'编码
  const uint8Array = encoder.encode(str);
  return uint8Array.buffer;
}

export function createNullVideo() {
  const videoEl = document.createElement('video');
  videoEl.autoplay = true;
  videoEl.muted = true;
  videoEl.playsInline = true;
  videoEl.loop = true;
  videoEl.setAttribute('webkit-playsinline', 'true');
  videoEl.setAttribute('x5-video-player-type', 'h5');
  videoEl.setAttribute('x5-video-player-fullscreen', 'true');
  videoEl.setAttribute('x5-video-orientation', 'portraint');
  videoEl.oncontextmenu = (e) => {
    e.preventDefault();
  };
  return videoEl;
}

export async function handleUserMedia({ video, audio }) {
  try {
    const event = await navigator.mediaDevices.getUserMedia({
      video,
      audio,
    });
    return event;
  } catch (error) {
    console.log(error);
  }
}

export function formatMoney(money?: number) {
  if (!money) {
    return '0.00';
  }
  return (money / 100).toFixed(2);
}

export const formatTimeHour = (timestamp: number) => {
  function addZero(num: number) {
    return num < 10 ? `0${num}` : num;
  }
  const date = new Date(timestamp);

  // 获取小时
  const hours = date.getHours();

  // 获取分钟
  const minutes = date.getMinutes();

  // 打印结果
  return `${addZero(hours)}:${addZero(minutes)}`;
};

export const formatTime = (timestamp: number) => {
  function addZero(num: number) {
    return num < 10 ? `0${num}` : num;
  }
  const date = new Date(timestamp);

  // 获取年份
  const year = date.getFullYear();

  // 获取月份（注意月份是从0开始的，所以要加1）
  const month = date.getMonth() + 1;

  // 获取日期
  const day = date.getDate();

  // 获取小时
  const hours = date.getHours();

  // 获取分钟
  const minutes = date.getMinutes();

  // 获取秒数
  const seconds = date.getSeconds();

  // 打印结果
  return `${year}-${addZero(month)}-${addZero(day)} ${addZero(hours)}:${addZero(
    minutes
  )}:${addZero(seconds)}`;
};

export const getLiveRoomPageUrl = (liveRoomId: number) => {
  return `${getHostnameUrl()}/pull/${liveRoomId}`;
};

/**
 * 例子：当前地址栏：https://live.hsslive.cn，结果：https://live.hsslive.cn
 * 例子：当前地址栏：https://live.hsslive.cn/push?liveType=1&roomId=101，结果：https://live.hsslive.cn
 */
export const getHostnameUrl = () => {
  // window.location.host，包含了域名的一个DOMString，可能在该串最后带有一个":"并跟上 URL 的端口号。
  // window.location.hostname，包含了域名的一个DOMString
  const { protocol, host } = window.location;
  const res = `${protocol}//${host}`;
  return res;
};

/**
 * 根据文件内容获取hash，同一个文件不管重命名还是改文件名后缀，hash都一样
 * @param file
 * @returns
 */
export const getHash = (file: File) => {
  return new Promise<{
    hash: string;
    ext: string;
    buffer: ArrayBuffer;
  }>((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const spark = new sparkMD5.ArrayBuffer();
      const buffer = e.target!.result as ArrayBuffer;
      spark.append(buffer);
      const hash = spark.end();
      const arr = file.name.split('.');
      const ext = arr[arr.length - 1];
      resolve({ hash, ext, buffer });
    };
  });
};

// 文件切片
export const splitFile = (file: File) => {
  const chunkList: { chunk: Blob; chunkName: string }[] = [];
  // 先以固定的切片大小1024*100
  let max = 50 * 100;
  let count = Math.ceil(file.size / max);
  let index = 0;
  // 限定最多100个切片
  if (count > 100) {
    max = Math.ceil(file.size / 100);
    count = 100;
  }
  /**
   * 0：0,max
   * 1：max,2max
   * 2：2max,3max
   */
  while (index < count) {
    chunkList.push({
      chunkName: `${index}`,
      chunk: new File([file.slice(index * max, (index + 1) * max)], file.name),
    });
    index += 1;
  }
  return chunkList;
};

/**
 * 格式化倒计时
 * @param endTime
 * @param startTime
 */
export function formatDownTime(data: {
  endTime: number;
  startTime: number;
  showMs?: boolean;
}) {
  const times = (data.endTime - data.startTime) / 1000;
  // js获取剩余天数
  const d = parseInt(String(times / 60 / 60 / 24));
  // js获取剩余小时
  let h = parseInt(String((times / 60 / 60) % 24));
  // js获取剩余分钟
  let m = parseInt(String((times / 60) % 60));
  // js获取剩余秒
  let s = parseInt(String(times % 60));
  let ms = new Date(data.endTime).getMilliseconds();

  if (h < 10) {
    // @ts-ignore
    h = `0${h}`;
  }
  if (m < 10) {
    // @ts-ignore
    m = `0${m}`;
  }
  if (s < 10) {
    // @ts-ignore
    s = `0${s}`;
  }
  if (Number(ms) < 100) {
    if (ms < 10) {
      // @ts-ignore
      ms = `00${ms}`;
    } else {
      // @ts-ignore
      ms = `0${ms}`;
    }
  }
  const msRes = data.showMs ? `${ms}毫秒` : '';
  if (d > 0) {
    return `${d}天${h}时${m}分${s}秒${msRes}`;
  } else if (h > 0) {
    return `${h}时${m}分${s}秒${msRes}`;
  } else {
    return `${m}分${s}秒${msRes}`;
  }
}
/**
 * 格式化倒计时
 * @param endTime
 * @param startTime
 */
export function formatDownTime2(data: {
  endTime: number;
  startTime: number;
  day?: string;
  hour?: string;
  minute?: string;
  second?: string;
  millisecond?: string;
  showMillisecond?: boolean;
  addZero?: boolean;
}) {
  const times = (data.endTime - data.startTime) / 1000;
  // js获取剩余天数
  const d = parseInt(String(times / 60 / 60 / 24));
  // js获取剩余小时
  let h = parseInt(String((times / 60 / 60) % 24));
  // js获取剩余分钟
  let m = parseInt(String((times / 60) % 60));
  // js获取剩余秒
  let s = parseInt(String(times % 60));
  let ms = new Date(data.endTime).getMilliseconds();

  function addZero(num: number, flag: boolean) {
    if (flag) {
      return num < 10 ? `0${num}` : `${num}`;
    } else {
      return `${num}`;
    }
  }

  // @ts-ignore
  h = addZero(h, data.addZero);
  // @ts-ignore
  m = addZero(m, data.addZero);
  // @ts-ignore
  s = addZero(s, data.addZero);
  if (Number(ms) < 100) {
    if (ms < 10) {
      // @ts-ignore
      ms = `00${ms}`;
    } else {
      // @ts-ignore
      ms = `0${ms}`;
    }
  }
  return {
    d,
    h,
    m,
    s,
    ms,
  };
}

/**
 * requestFileSystem保存文件，成功返回code:1，失败返回code:2
 * @param data
 */
export function saveFile(data: { file: File; fileName: string }) {
  return new Promise<{ code: number }>((resolve) => {
    const { file, fileName } = data;
    const requestFileSystem =
      // @ts-ignore
      window.requestFileSystem || window.webkitRequestFileSystem;
    if (!requestFileSystem) {
      console.error('不支持requestFileSystem');
      resolve({ code: 2 });
      return;
    }
    function onError(error) {
      console.error('saveFile错误', data.fileName);
      console.log(error);
      resolve({ code: 2 });
    }
    function onFs(fs) {
      // 创建文件
      fs.root.getFile(
        fileName,
        { create: true },
        (fileEntry) => {
          // 创建文件写入流
          fileEntry.createWriter(function (fileWriter) {
            fileWriter.onwriteend = () => {
              // 完成后关闭文件
              fileWriter.abort();
              resolve({ code: 1 });
            };
            // 写入文件内容
            fileWriter.write(file);
          });
        },
        onError
      );
    }
    // Opening a file system with temporary storage
    requestFileSystem(
      // @ts-ignore
      window.PERSISTENT,
      0,
      onFs,
      onError
    );
  });
}

/**
 * requestFileSystem读取文件，成功返回code:1，失败返回code:2
 * @param data
 */
export function readFile(fileName: string) {
  return new Promise<{ code: number; file?: File }>((resolve) => {
    const requestFileSystem =
      // @ts-ignore
      window.requestFileSystem || window.webkitRequestFileSystem;
    if (!requestFileSystem) {
      console.error('不支持requestFileSystem');
      resolve({ code: 2 });
      return;
    }
    function onError(error) {
      console.error('readFile错误', fileName);
      console.log(error);
      resolve({ code: 2 });
    }
    function onFs(fs) {
      fs.root.getFile(
        fileName,
        {},
        (fileEntry) => {
          fileEntry.file(function (file) {
            resolve({ code: 1, file });
          }, onError);
        },
        onError
      );
    }
    // Opening a file system with temporary storage
    requestFileSystem(
      // @ts-ignore
      window.PERSISTENT,
      0,
      onFs,
      onError
    );
  });
}

export function generateBase64(dom: CanvasImageSource) {
  const canvas = document.createElement('canvas');
  // @ts-ignore
  const res = dom.getBoundingClientRect();
  let width = res.width;
  let height = res.height;
  if (dom instanceof HTMLVideoElement) {
    if (dom.videoWidth) {
      width = dom.videoWidth;
    }
    if (dom.videoHeight) {
      height = dom.videoHeight;
    }
  }
  if (dom instanceof HTMLCanvasElement) {
    if (dom.width) {
      width = dom.width;
    }
    if (dom.height) {
      height = dom.height;
    }
  }
  const rate = width / height;
  const ratio = 1;
  function geturl() {
    const coverWidth = width * ratio;
    const coverHeight = coverWidth / rate;
    canvas.width = coverWidth;
    canvas.height = coverHeight;
    canvas.getContext('2d')!.drawImage(dom, 0, 0, coverWidth, coverHeight);
    // webp比png的体积小非常多！因此coverWidth就可以不用压缩太夸张
    return canvas.toDataURL('image/webp', 1);
  }
  const dataURL = geturl();
  return dataURL;
}

/**
 * @description 获取随机字符串(ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz)
 * @example: getRandomString(4) ===> abd3
 * @param {number} length
 * @return {*}
 */
export const getRandomEnglishString = (length: number): string => {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let res = '';
  for (let i = 0; i < length; i += 1) {
    res += str.charAt(getRangeRandom(0, str.length - 1));
  }
  return res;
};

export const createVideo = ({
  muted = true,
  autoplay = true,
  appendChild = false,
  show = false,
  controls = false,
  size = 100,
}) => {
  const videoEl = document.createElement('video');
  videoEl.autoplay = autoplay;
  videoEl.muted = muted;
  videoEl.playsInline = true;
  videoEl.loop = true;
  videoEl.controls = controls;
  videoEl.setAttribute('webkit-playsinline', 'true');
  videoEl.setAttribute('x5-video-player-type', 'h5');
  videoEl.setAttribute('x5-video-player-fullscreen', 'true');
  videoEl.setAttribute('x5-video-orientation', 'portraint');
  videoEl.oncontextmenu = (e) => {
    e.preventDefault();
  };
  if (appendChild) {
    if (!show) {
      videoEl.style.width = `1px`;
      videoEl.style.height = `1px`;
      videoEl.style.opacity = '0';
      videoEl.style.pointerEvents = 'none';
    } else {
      videoEl.style.width = `${size}px`;
      videoEl.style.height = `${size}px`;
    }
    videoEl.style.position = 'fixed';
    videoEl.style.bottom = '0';
    videoEl.style.right = '0';

    document.body.appendChild(videoEl);
  }
  return videoEl;
};

export function videoFullBox(data: {
  wrapSize: { width: number; height: number };
  videoEl: HTMLVideoElement;
  videoResize?: (data: { w: number; h: number }) => void;
}) {
  const { videoEl } = data;
  let wrapSize = data.wrapSize;

  if (!videoEl) {
    throw new Error('videoEl不能为空！');
  }

  let w = videoEl.videoWidth;
  let h = videoEl.videoHeight;
  function handleResize() {
    w = videoEl.videoWidth;
    h = videoEl.videoHeight;
    data.videoResize?.({ w, h });
    setVideoSize({ width: w, height: h });
  }
  function setVideoSize({ width, height }) {
    const res = computeBox({
      width,
      height,
      maxHeight: wrapSize.height,
      minHeight: wrapSize.height,
      maxWidth: wrapSize.width,
      minWidth: wrapSize.width,
    });
    videoEl.style.width = `${res.width as number}px`;
    videoEl.style.height = `${res.height as number}px`;
    videoEl.setAttribute('resolution-width', width);
    videoEl.setAttribute('resolution-height', height);
  }
  setVideoSize({ width: w, height: h });
  data.videoResize?.({ w, h });
  videoEl.addEventListener('resize', handleResize);
  function changeWrapSize(data: { width; height }) {
    wrapSize = data;
    setVideoSize({ width: videoEl.videoWidth, height: videoEl.videoHeight });
  }
  return { changeWrapSize };
}

export function videoToCanvas(data: {
  wrapSize: { width: number; height: number };
  videoEl: HTMLVideoElement;
  videoResize?: (data: { w: number; h: number }) => void;
}) {
  const { videoEl } = data;
  let wrapSize = data.wrapSize;
  if (!videoEl) {
    throw new Error('videoEl不能为空！');
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  let timer;
  let w = videoEl.videoWidth;
  let h = videoEl.videoHeight;
  function handleResize() {
    w = videoEl.videoWidth;
    h = videoEl.videoHeight;
    data.videoResize?.({ w, h });
    setVideoSize({ width: w, height: h });
  }
  function setVideoSize({ width, height }) {
    const res = computeBox({
      width,
      height,
      maxHeight: wrapSize.height,
      minHeight: wrapSize.height,
      maxWidth: wrapSize.width,
      minWidth: wrapSize.width,
    });
    canvas.style.width = `${res.width as number}px`;
    canvas.style.height = `${res.height as number}px`;
  }
  setVideoSize({ width: w, height: h });
  data.videoResize?.({ w, h });
  videoEl.addEventListener('resize', handleResize);
  // const defaultRatio = 16 / 9;
  function drawCanvas() {
    canvas.width = w;
    canvas.height = h;
    // const videoRatio = w / h;
    // if (w > h) {
    //   // 视频宽大于高
    //   // 比率的值越大，说明高的值越小
    //   // 如果视频的比率比默认dom的比率大，则说明同等宽度的情况下，视频的高度会比默认dom的高度值低
    //   if (videoRatio > defaultRatio) {
    //     // 视频的比率比dom比率大
    //     canvas.style.minWidth = '100%';
    //     canvas.style.maxHeight = '100%';
    //   } else {
    //     canvas.style.minHeight = '100%';
    //     canvas.style.maxWidth = '100%';
    //   }
    // } else {
    //   // 视频宽小于高
    //   // 比率的值越大，说明高的值越小
    //   // 如果视频的比率比默认dom的比率大，则说明同等宽度的情况下，视频的高度会比默认dom的高度值低

    //   if (videoRatio > defaultRatio) {
    //     // 视频的比率比dom比率大
    //     canvas.style.minHeight = '100%';
    //     canvas.style.maxWidth = '100%';
    //   } else {
    //     canvas.style.minWidth = '100%';
    //     canvas.style.maxHeight = '100%';
    //   }
    // }
    ctx.drawImage(videoEl, 0, 0, w, h);
    timer = requestAnimationFrame(drawCanvas);
  }

  function stopDrawing() {
    videoEl.removeEventListener('resize', handleResize);
    cancelAnimationFrame(timer);
  }

  function changeWrapSize(data: { width; height }) {
    wrapSize = data;
    setVideoSize({ width: videoEl.videoWidth, height: videoEl.videoHeight });
  }

  drawCanvas();

  return { drawCanvas, stopDrawing, changeWrapSize, canvas };
}
