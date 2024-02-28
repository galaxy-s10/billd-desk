import { ComponentPublicInstance, VNode, createApp } from 'vue';

import ModalCpt from '@/hooks/tipModal/index.vue';

const app = createApp(ModalCpt);
const container = document.createElement('div');
// @ts-ignore
const instance: ComponentPublicInstance<InstanceType<typeof ModalCpt>> =
  app.mount(container);

document.body.appendChild(container);

export function useTip(data: {
  title?: string;
  width?: string;
  content: string | VNode;
  hiddenCancel?: boolean;
  hiddenClose?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) {
  instance.show = true;
  instance.title = data.title || '提示';
  instance.width = data.width || '320px';
  instance.content = data.content;
  instance.hiddenCancel = !!data.hiddenCancel;
  instance.hiddenClose = !!data.hiddenClose;
  instance.confirmButtonText = data.confirmButtonText || '确认';
  instance.cancelButtonText = data.cancelButtonText || '取消';
  return new Promise((resolve, reject) => {
    instance.handleOk = () => {
      instance.show = false;
      resolve('ok');
    };
    instance.handleCancel = () => {
      instance.show = false;
      reject('cancel');
    };
  });
}
