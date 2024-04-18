import portfinder from 'portfinder';
import { Configuration } from 'webpack';

import { outputStaticUrl } from '../constant';
import TerminalPrintPlugin from '../TerminalPrintPlugin';
import { chalkINFO } from '../utils/chalkTip';
import { resolveApp } from '../utils/path';

console.log(chalkINFO(`读取: ${__filename.slice(__dirname.length + 1)}`));

export default new Promise((resolve) => {
  // 默认端口8000，如果被占用了，会自动递增+1
  const defaultPort = 8000;
  portfinder
    .getPortPromise({
      port: defaultPort,
      stopPort: 9000,
    })
    .then((port) => {
      const devConfig: Configuration = {
        target: 'web',
        // https://github.com/webpack/webpack/blob/main/lib/config/defaults.js
        mode: 'development',
        stats: 'none',
        // https://webpack.docschina.org/configuration/devtool/
        // devtool: 'eval-cheap-module-source-map',
        devtool: 'eval', // eval，具有最高性能的开发构建的推荐选择。
        // 这个infrastructureLogging设置参考了vuecli5，如果不设置，webpack-dev-server会打印一些信息
        infrastructureLogging: {
          level: 'none',
        },
        devServer: {
          client: {
            logging: 'none', // https://webpack.js.org/configuration/dev-server/#devserverclient
          },
          hot: true, // 启用 webpack 的热模块替换功能
          // hot: 'only', // 要在构建失败的情况下启用热模块替换而不刷新页面作为后备，请使用hot: 'only'。但在vue项目的话，使用only会导致ts文件没有热更，得使用true
          compress: true, // 为所有服务启用gzip 压缩
          port, // 开发服务器端口，默认8080
          open: false, // 告诉 dev-server 在服务器启动后打开浏览器。
          historyApiFallback: {
            rewrites: [
              /**
               * 如果publicPath设置了/abc，就不能直接设置historyApiFallback: true，这样会重定向到vue3-blog-admin根目录下的index.html
               * publicPath设置了/abc，就重定向到/abc，这样就可以了
               */
              {
                from: new RegExp(outputStaticUrl(false)),
                to: outputStaticUrl(false),
              },
            ],
          },
          /**
           * devServer.static提供静态文件服务器，默认是 'public' 文件夹。static: false禁用
           * 即访问localhost:8080/a.js，其实访问的是public目录的a.js
           */
          // WARN 因为CopyWebpackPlugin插件会复制public的文件，所以static: false后再访问localhost:8080/a.js，其实还是能访问到public目录的a.js
          static: {
            watch: true, // 告诉 dev-server 监听文件。默认启用，文件更改将触发整个页面重新加载。可以通过将 watch 设置为 false 禁用。
            publicPath: outputStaticUrl(false), // 让它和输入的静态目录对应
            directory: resolveApp('./public/'),
          },
          proxy: {
            '/api': {
              // target: 'http://localhost:4200',
              target: 'http://localhost:4300',
              // target: 'https://live.hsslive.cn/aliyun-hk/',
              secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
              /**
               * changeOrigin，是否修改请求地址的源
               * 默认changeOrigin: false，即发请求即使用devServer的localhost:port发起的，如果后端服务器有校验源，就会有问题
               * 设置changeOrigin: true，就会修改发起请求的源，将原本的localhost:port修改为target，这样就可以通过后端服务器对源的校验
               */
              changeOrigin: true,
              pathRewrite: {
                '^/api': '', // 效果：/api/link/list ==> http://localhost:4300/link/list
                // '^/api': '/admin/', // 效果：/api/link/list ==> http://localhost:4300/admin/link/list
              },
            },
            '/prodapi': {
              target: 'https://live.hsslive.cn',
              secure: false,
              changeOrigin: true,
              pathRewrite: {
                '^/prodapi': '/api/',
              },
            },
          },
        },
        module: {
          rules: [
            {
              test: /.(ts|tsx)$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: 'swc-loader',
                  options: {
                    jsc: {
                      parser: {
                        syntax: 'typescript',
                        tsx: true,
                      },
                    },
                  },
                },
              ],
            },
            {
              test: /.(js|jsx|mjs|cjs)$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: 'swc-loader',
                  options: {
                    jsc: {
                      parser: {
                        syntax: 'ecmascript',
                        jsx: true,
                      },
                    },
                  },
                },
              ],
            },
            // {
            //   test: /\.(js|mjs|jsx|ts|tsx)$/,
            //   exclude: /node_modules/,
            //   use: [
            //     {
            //       loader: 'esbuild-loader',
            //       options: {
            //         loader: 'tsx', // Remove this if you're not using JSX
            //         target: 'esnext', // Syntax to compile to (see options below for possible values)
            //       },
            //     },
            //   ],
            // },
          ],
        },
        // @ts-ignore
        plugins: [
          // 终端打印调试地址
          new TerminalPrintPlugin(),
        ].filter(Boolean),
        optimization: {
          /**
           * 官网解释：告知 webpack 去辨识 package.json 中的 副作用 标记或规则，
           * 以跳过那些当导出不被使用且被标记不包含副作用的模块。'flag' 值在非生产环境默认使用。
           * 个人理解：flag，即如果package.json有标识就会用它的标识，
           * 但不意味着你的项目的package.json就得设置sideEffects，你的项目不设置，它也会对你
           * 项目里面用到的node_modules里面的包的package.json做检查。
           * 设置true的话，还会分析源代码的副作用?但测试结果貌似不会，可能我理解有问题，已经
           * 提了issue:https://github.com/webpack/webpack/issues/16314
           * 设置false的话，即不会检查package.json的sideEffects字段，把所有模块都当成有副作
           * 用的（即使某个包的package.json设置sideEffects为false），因为sideEffects并不
           * 是npm的package.json合法字段，只是写给webpack识别用的而已
           */
          // sideEffects: true,
          sideEffects: 'flag',
        },
      };
      resolve(devConfig);
    })
    .catch((error) => {
      console.log(error);
    });
});
