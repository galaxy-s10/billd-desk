import path from 'path';

import vue from '@vitejs/plugin-vue';
import { BilldHtmlWebpackPlugin, logData } from 'billd-html-webpack-plugin';
import autoImport from 'unplugin-auto-import/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import unpluginVueComponents from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import electron from 'vite-plugin-electron/simple';
import eslint from 'vite-plugin-eslint2';
import { createHtmlPlugin } from 'vite-plugin-html';

import pkg from './package.json';

const isWeb = process.env['VITE_APP_RELEASE_PROJECT_ISWEB'] === 'true';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  const outputStaticUrl = () => {
    if (isWeb) {
      if (isProduction) {
        return 'https://resource.hsslive.cn/billd-desk/client/dist/';
      } else {
        return './';
      }
    } else {
      return './';
    }
  };

  return {
    base: outputStaticUrl(),
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use 'billd-scss/src/index.scss' as *;@import "@/assets/css/constant.scss";`,
        },
      },
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
      /**
       * 不建议省略.vue后缀
       * https://cn.vitejs.dev/config/shared-options.html#resolve-extensions
       */
      // extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'],
    },
    build: {
      outDir: 'dist',
    },
    plugins: [
      // legacy(),
      // isProduction && legacy(),
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            // @ts-ignore
            title: pkg.productName,
          },
        },
      }),
      electron({
        main: {
          entry: 'electron-main/index.ts', // 主进程文件
          vite: {
            build: {
              outDir: 'electron-dist',
              lib: {
                entry: 'electron-main/index.ts', // 主进程文件
                formats: ['cjs'],
                fileName: () => '[name].cjs',
              },
            },
          },
        },
        preload: {
          input: 'electron-main/preload.ts',
          vite: {
            build: {
              outDir: 'electron-dist',
            },
          },
        },
      }),
      // renderer({
      //   resolve: {
      //     '@nut-tree/nut-js': { type: 'cjs' },
      //   },
      // }),
      checker({
        // typescript: true,
        vueTsc: true,
        // eslint: {
        //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"', // for example, lint .ts & .tsx
        // },
      }),
      eslint({}),
      autoImport({
        imports: [
          {
            'naive-ui': ['useMessage', 'useNotification'],
          },
        ],
      }),
      unpluginVueComponents({
        // eslint-disable-next-line
        resolvers: [NaiveUiResolver()],
      }),
      new BilldHtmlWebpackPlugin({ env: 'vite4' }).config,
    ],
    define: {
      'process.env': {
        BilldHtmlWebpackPlugin: logData(null),
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
        PUBLIC_PATH: outputStaticUrl(),
        VUE_APP_RELEASE_PROJECT_NAME: JSON.stringify(
          process.env.VUE_APP_RELEASE_PROJECT_NAME
        ),
        VUE_APP_RELEASE_PROJECT_ENV: JSON.stringify(
          process.env.VUE_APP_RELEASE_PROJECT_ENV
        ),
        VUE_APP_RELEASE_PROJECT_VERSION: JSON.stringify(pkg.version),
      },
    },

    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:4300',
          secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
          /**
           * changeOrigin，是否修改请求地址的源
           * 默认changeOrigin: false，即发请求即使用devServer的localhost:port发起的，如果后端服务器有校验源，就会有问题
           * 设置changeOrigin: true，就会修改发起请求的源，将原本的localhost:port修改为target，这样就可以通过后端服务器对源的校验
           */
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/'),
        },
        '/betaapi': {
          target: 'http://localhost:4300',
          secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
          /**
           * changeOrigin，是否修改请求地址的源
           * 默认changeOrigin: false，即发请求即使用devServer的localhost:port发起的，如果后端服务器有校验源，就会有问题
           * 设置changeOrigin: true，就会修改发起请求的源，将原本的localhost:port修改为target，这样就可以通过后端服务器对源的校验
           */
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/betaapi/, '/'),
        },
        '/prodapi': {
          target: 'http://localhost:4200',
          secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
          /**
           * changeOrigin，是否修改请求地址的源
           * 默认changeOrigin: false，即发请求即使用devServer的localhost:port发起的，如果后端服务器有校验源，就会有问题
           * 设置changeOrigin: true，就会修改发起请求的源，将原本的localhost:port修改为target，这样就可以通过后端服务器对源的校验
           */
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/prodapi/, '/'),
        },
      },
    },
  };
});
