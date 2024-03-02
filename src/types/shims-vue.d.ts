import { ElectronAPI } from '@electron-toolkit/preload';

declare module '*.vue' {
  /* eslint-disable */
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    $message: import('naive-ui/es/message/src/MessageProvider').MessageApiInjection;
    TXLivePusher: any;
  }
}

// interface Window {}
