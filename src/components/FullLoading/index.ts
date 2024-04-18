import { ComponentPublicInstance, StyleValue, createApp } from 'vue';

import main from './main.vue';

const initInstance = (option: IOption) => {
  // 这里就是与vue2最大的区别了,在vue2的时候,我们只需instance.$mount()便能得到节点,现在不行
  const app = createApp(main);
  const container = document.createElement('div');
  // @ts-ignore
  const instance: ComponentPublicInstance<InstanceType<typeof main>> =
    app.mount(container);
  if (option.el) {
    instance.isFixed = false;
    option.el.appendChild(container);
  } else {
    instance.isFixed = true;
    document.body.appendChild(container);
  }
  return instance;
};

interface IOption {
  content?: string;
  style?: StyleValue;
  loading?: boolean;
  showMask?: boolean;
  el?: HTMLElement;
}

const defaultOption: IOption = {
  content: '',
  showMask: false,
  style: {},
};

let globalLoading;

// 直接导出该方法
export const fullLoading = function (option: IOption): IOption {
  const newOption = {
    ...defaultOption,
    ...option,
  };
  // 没有传el,代表是全局的loading,全局loading的话就使用单例
  if (!newOption.el) {
    if (!globalLoading) {
      globalLoading = initInstance(newOption);
    }
    Object.keys(newOption).forEach((key) => {
      globalLoading[key] = option?.[key] || newOption[key];
    });
    return globalLoading;
  } else {
    const cptLoading = initInstance(newOption);
    Object.keys(newOption).forEach((key) => {
      cptLoading[key] = option?.[key] || newOption[key];
    });
    return cptLoading;
  }
};

// 不推荐。
// export const usefullLoading = {
//   install: (app: App) => {
//     // 挂载在根实例的全局配置上
//     app.config.globalProperties['$fullLoading'] = fullLoading;
//   },
// };
