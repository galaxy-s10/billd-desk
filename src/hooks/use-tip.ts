import { ComponentPublicInstance, VNode, createApp } from 'vue';

import ModalCpt from '@/hooks/tipModal/index.vue';
import { i18n } from '@/hooks/use-i18n';

const translate = (key: string) => (i18n.global as any).t(key);

const app = createApp(ModalCpt);
const container = document.createElement('div');
app.use(i18n);
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
  instance.title = data.title || translate('app.tip');
  instance.width = data.width || '320px';
  instance.content = data.content;
  instance.hiddenCancel = !!data.hiddenCancel;
  instance.hiddenClose = !!data.hiddenClose;
  instance.confirmButtonText =
    data.confirmButtonText || translate('app.confirm');
  instance.cancelButtonText = data.cancelButtonText || translate('app.cancel');
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

export function closeUseTip() {
  instance.show = false;
}
