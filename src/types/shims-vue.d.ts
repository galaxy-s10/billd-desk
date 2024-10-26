declare module '*.vue' {
  /* eslint-disable */
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// declare global {
interface Window {
  electronAPI: any;
  $message: import('naive-ui/es/message/src/MessageProvider').MessageApiInjection;
  $notification: import('naive-ui/es/notification/index').NotificationProviderInst;
  // $notification: import('naive-ui/es/notification/index').NotificationApiInjection;
  TXLivePusher: any;
}
// }

// interface Window {}
