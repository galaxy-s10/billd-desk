export const APP_NAME = process.env.VUE_APP_RELEASE_PROJECT_NAME;
export const APP_ENV = process.env.VUE_APP_RELEASE_PROJECT_ENV;
export const PUBLIC_PATH = process.env.PUBLIC_PATH;
export const NODE_ENV = process.env.NODE_ENV;

export const outputDir = 'dist'; // 输出目录名称
export const eslintEnable = false; // 是否开启eslint（开发环境会读取它），会影响热更新速度，这里只是关闭了webpack的eslint插件，但可以依靠编辑器的eslint提示。
export const webpackBarEnable = false; // 是否开启WebpackBar（开发环境会读取它），只要是插件就会影响构建速度，开发环境关掉它吧
export const analyzerEnable = false; // 是否开启Webpack包分析
export const gzipEnable = false; // 是否开启http压缩
export const windicssEnable = false; // 是否开启windicss
export const htmlWebpackPluginTitle = 'billd-live'; // htmlWebpackPlugin的标题

export const outputStaticUrl = (isProduction: boolean) => {
  if (isProduction) {
    return 'https://resource.hsslive.cn/billd-live/client/dist/';
  }
  return '/';
};
