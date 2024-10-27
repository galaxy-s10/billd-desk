import { UploadFileInfo } from 'naive-ui';
import { defineStore } from 'pinia';

import {
  IDeskVersion,
  LiveLineEnum,
  LiveRenderEnum,
  MediaTypeEnum,
} from '@/interface';
import { mobileRouterName } from '@/router';
import { ILiveRoom } from '@/types/ILiveRoom';

export type AppRootState = {
  showDebug: boolean;
  version: string;
  updateModalInfo?: {
    version: string;
    show_version: string;
    isUpdate: number;
    forceUpdate: number;
    checkUpdate: number;
    updateContent: string;
    updateDate: string;
    download: {
      macos_dmg: string;
      window_64_exe: string;
      window_32_exe: string;
      window_arm_exe: string;
      linux_64_deb: string;
      linux_64_tar: string;
      linux_arm_deb: string;
      linux_arm_tar: string;
    };
    disableList: {
      version: string;
      msg: string;
    }[];
    remark: string;
  };
  deskVersionInfo?: IDeskVersion;
  lastBuildDate: string;
  scaleFactor: number;
  windowId: number;
  workAreaSize: {
    width: number;
    height: number;
  };
  primaryDisplaySize: {
    width: number;
    height: number;
  };
  remoteDesk: Map<
    string,
    {
      deskUserUuid: string;
      remoteDeskUserUuid: string;
      sender: string;
      isClose: boolean;
      maxBitrate: number;
      maxFramerate: number;
      resolutionRatio: number;
      audioContentHint: string;
      videoContentHint: string;
    }
  >;
  playing: boolean;
  videoRatio: number;
  normalVolume: number;
  navList: { routeName: string; name: string }[];
  allTrack: {
    /** 1开启；2关闭 */
    audio: number;
    /** 1开启；2关闭 */
    video: number;
    id: string;
    deviceId?: string;
    mediaName: string;
    type: MediaTypeEnum;
    openEye: boolean;
    track?: MediaStreamTrack;
    stream?: MediaStream;
    streamid?: string;
    trackid?: string;
    // canvasDom?: fabric.Image | fabric.Text;
    canvasDom?: any;
    hidden?: boolean;
    muted?: boolean;
    volume?: number;
    videoEl?: HTMLVideoElement;
    imgInfo?: UploadFileInfo[];
    mediaInfo?: UploadFileInfo[];
    txtInfo?: { txt: string; color: string };
    timeInfo?: { color: string };
    stopwatchInfo?: { color: string };
    rect?: { top: number; left: number };
    scaleInfo: Record<number, { scaleX: number; scaleY: number }>;
  }[];
  videoControls: {
    pipMode?: boolean;
    pageFullMode?: boolean;
    fullMode?: boolean;
    renderMode?: LiveRenderEnum;
    line?: boolean;
    speed?: boolean;
    networkSpeed?: boolean;
    fps?: boolean;
    kbs?: boolean;
    resolution?: boolean;
  };
  videoControlsValue: {
    pipMode?: boolean;
    pageFullMode?: boolean;
    kbs?: string;
    fps?: number;
  };
  liveLine: LiveLineEnum;
  liveRoomInfo?: ILiveRoom;
  showLoginModal: boolean;
  disableSpeaking: Map<number, { exp: number; label: string }>;
  showSigninRedDot: boolean;
};

export const useAppStore = defineStore('app', {
  state: (): AppRootState => {
    return {
      showDebug: false,
      version: '',
      updateModalInfo: undefined,
      deskVersionInfo: undefined,
      lastBuildDate: '',
      scaleFactor: 1,
      windowId: -1,
      workAreaSize: { width: 0, height: 0 },
      primaryDisplaySize: { width: 0, height: 0 },
      remoteDesk: new Map(),
      playing: false,
      videoRatio: 16 / 9,
      videoControls: {
        renderMode: LiveRenderEnum.video,
      },
      videoControlsValue: {
        pipMode: false,
      },
      normalVolume: 70,
      navList: [
        { routeName: mobileRouterName.h5, name: '频道' },
        { routeName: mobileRouterName.h5Rank, name: '排行' },
        { routeName: mobileRouterName.h5Profile, name: '我的' },
      ],
      allTrack: [],
      liveLine: LiveLineEnum.hls,
      liveRoomInfo: undefined,
      showLoginModal: false,
      disableSpeaking: new Map(),
      showSigninRedDot: false,
    };
  },
  actions: {
    setLiveRoomInfo(res: AppRootState['liveRoomInfo']) {
      this.liveRoomInfo = res;
    },
    setLiveLine(res: AppRootState['liveLine']) {
      this.liveLine = res;
    },
    setAllTrack(res: AppRootState['allTrack']) {
      this.allTrack = res;
    },
    getTrackInfo() {
      const res = { audio: 0, video: 0 };
      this.allTrack.forEach((item) => {
        // if (item.stream) {
        if (item.audio === 1) {
          res.audio += 1;
        }
        if (item.video === 1) {
          res.video += 1;
        }
        // }
      });
      return res;
    },
  },
});
