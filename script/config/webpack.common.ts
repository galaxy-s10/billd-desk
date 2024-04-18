import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
import BilldHtmlWebpackPlugin, { logData } from 'billd-html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import ComponentsPlugin from 'unplugin-vue-components/webpack';
import { VueLoaderPlugin } from 'vue-loader';
import { Configuration, DefinePlugin } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import WebpackBar from 'webpackbar';
import WindiCSSWebpackPlugin from 'windicss-webpack-plugin';

import {
  analyzerEnable,
  eslintEnable,
  htmlWebpackPluginTitle,
  outputDir,
  outputStaticUrl,
  webpackBarEnable,
  windicssEnable,
} from '../constant';
import { chalkINFO, chalkWARN } from '../utils/chalkTip';
import { resolveApp } from '../utils/path';

import devConfig from './webpack.dev';
import prodConfig from './webpack.prod';

console.log(chalkINFO(`读取: ${__filename.slice(__dirname.length + 1)}`));

const sassRules = (isProduction: boolean, module?: boolean) => {
  return [
    isProduction
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: outputStaticUrl(isProduction),
          },
        }
      : {
          loader: 'vue-style-loader',
          options: {
            sourceMap: false,
          },
        },
    {
      loader: 'css-loader', // 默认会自动找postcss.config.js
      options: {
        importLoaders: 2, // https://www.npmjs.com/package/css-loader#importloaders
        sourceMap: false,
        modules: module
          ? {
              localIdentName: '[name]_[local]_[hash:base64:5]',
            }
          : undefined,
      },
    },
    {
      loader: 'postcss-loader', // 默认会自动找postcss.config.js
      options: {
        sourceMap: false,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: false,
        // 根据sass-loader9.x以后使用additionalData，9.x以前使用prependData
        additionalData: `@use 'billd-scss/src/index.scss' as *;@import '@/assets/constant.scss';`,
      },
    },
  ].filter(Boolean);
};

const cssRules = (isProduction: boolean, module?: boolean) => {
  return [
    isProduction
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: outputStaticUrl(isProduction),
          },
        }
      : {
          loader: 'vue-style-loader',
          options: {
            sourceMap: false,
          },
        },
    {
      loader: 'css-loader', // 默认会自动找postcss.config.js
      options: {
        importLoaders: 1, // https://www.npmjs.com/package/css-loader#importloaders
        sourceMap: false,
        modules: module
          ? {
              localIdentName: '[name]_[local]_[hash:base64:5]',
            }
          : undefined,
      },
    },
    {
      loader: 'postcss-loader', // 默认会自动找postcss.config.js
      options: {
        sourceMap: false,
      },
    },
  ].filter(Boolean);
};

const commonConfig = (isProduction) => {
  const result: Configuration = {
    entry: {
      main: {
        import: './src/main.ts',
      },
    },
    output: {
      clean: true, // 在生成文件之前清空 output 目录。替代clean-webpack-plugin
      filename: 'js/[name]-[contenthash:6]-bundle.js', // 入口文件打包生成后的文件的文件名
      /**
       * 入口文件中，符合条件的代码，被抽离出来后生成的文件的文件名
       * 如：动态(即异步)导入，默认不管大小，是一定会被单独抽离出来的。
       * 如果一个模块既被同步引了，又被异步引入了，不管顺序（即不管是先同步引入再异步引入，还是先异步引入在同步引入），
       * 这个模块会打包进bundle.js，而不会单独抽离出来。
       */
      chunkFilename: 'js/[name]-[contenthash:6]-bundle-chunk.js',
      path: resolveApp(`./${outputDir}`),
      assetModuleFilename: 'assets/[name]-[contenthash:6].[ext]', // 静态资源生成目录（不管什么资源默认都统一生成到这里,除非单独设置了generator）
      /**
       * webpack-dev-server 也会默认从 publicPath 为基准，使用它来决定在哪个目录下启用服务，来访问 webpack 输出的文件。
       * 所以不管开发模式还是生产模式，output.publicPath都会生效，
       * output的publicPath建议(或者绝大部分情况下必须)与devServer的publicPath一致。
       * 如果不设置publicPath，它默认就约等于output.publicPath:""，到时候不管开发还是生产模式，最终引入到
       * index.html的所有资源都会拼上这个路径，如果不设置output.publicPath，会有问题：
       * 比如vue的history模式下，如果不设置output.publicPath，如果路由全都是/foo,/bar,/baz这样的一级路由没有问题，
       * 因为引入的资源都是js/bundle.js，css/bundle.css等等，浏览器输入：http://localhost:8080/foo，回车访问，
       * 引入的资源就是http://localhost:8080/js/bundle.js，http://localhost:8080/css/bundle.css，这些资源都
       * 是在http://localhost:8080/根目录下的没问题，但是如果有这些路由：/logManage/logList,/logManage/logList/editLog，
       * 等等超过一级的路由，就会有问题，因为没有设置output.publicPath，所以它默认就是""，此时浏览器输入：
       * http://localhost:8080/logManage/logList回车访问，引入的资源就是http://localhost:8080/logManage/logList/js/bundle.js，
       * 而很明显，我们的http://localhost:8080/logManage/logList/js目录下没有bundle.js这个资源（至少默认情况下是没有，除非设置了其他属性）
       * 找不到这个资源就会报错，这种情况的路由是很常见的，所以建议默认必须手动设置output.publicPath:"/"，这样的话，
       * 访问http://localhost:8080/logManage/logList，引入的资源就是：http://localhost:8080/js/bundle.js，就不会报错。
       * 此外，output.publicPath还可设置cdn地址。
       */
      publicPath: outputStaticUrl(isProduction),
    },
    cache: {
      type: 'memory',
      // type: 'filesystem',
      // allowCollectingMemory: true, // 它在生产模式中默认为false，并且在开发模式下默认为true。https://webpack.js.org/configuration/cache/#cacheallowcollectingmemory
      // buildDependencies: {
      //   // 建议cache.buildDependencies.config: [__filename]在您的 webpack 配置中设置以获取最新配置和所有依赖项。
      //   config: [
      //     resolveApp('./script/config/webpack.common.ts'),
      //     resolveApp('./script/config/webpack.dev.ts'),
      //     resolveApp('./script/config/webpack.prod.ts'),
      //     resolveApp('.browserslistrc'), // 防止修改了.browserslistrc文件后，但没修改webpack配置文件，webpack不读取最新更新后的.browserslistrc
      //     resolveApp('babel.config.js'), // 防止修改了babel.config.js文件后，但没修改webpack配置文件，webpack不读取最新更新后的babel.config.js
      //   ],
      // },
    },
    resolve: {
      // 解析路径
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.mjs'], // 解析扩展名，加上.mjs是因为vant，https://github.com/youzan/vant/issues/10738
      alias: {
        '@': resolveApp('./src'), // 设置路径别名
        script: resolveApp('./script'), // 设置路径别名
        vue$: 'vue/dist/vue.runtime.esm-bundler.js', // 设置vue的路径别名
      },
      fallback: {
        /**
         * webpack5移除了nodejs的polyfill，更专注于web了？
         * 其实webpack5之前的版本能用nodejs的polyfill，也是
         * 和nodejs正统的api不一样，比如path模块，nodejs的path，
         * __dirname是读取到的系统级的文件绝对路径的（即/user/xxx）
         * 但在webpack里面使用__dirname，读取到的是webpack配置的绝对路径/
         * 可能有用的polyfill就是crypto这些通用的模块，类似path和fs这些模
         * 块其实都是他们的polyfill都是跑在浏览器的，只是有这些api原本的一些功能，
         * 还是没有nodejs的能力，所以webpack5干脆就移除了这些polyfill，你可以通过
         * 安装他们的polyfill来实现原本webpack4之前的功能，但是即使安装他们的polyfill
         * 也只是实现api的功能，没有他们原本在node的能力
         */
        // path: require.resolve('path-browserify'),
        // path: false,
        // fs: false,
        // child_process: false,
      },
    },
    resolveLoader: {
      // 用于解析webpack的loader
      modules: ['node_modules'],
    },
    module: {
      noParse: /^(vue|vue-router|naive-ui)$/,
      // loader执行顺序：从下往上，从右往左
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          oneOf: [
            {
              resourceQuery: /module/,
              use: cssRules(isProduction, true),
            },
            {
              resourceQuery: /\?vue/,
              use: cssRules(isProduction),
            },
            {
              test: /\.module\.\w+$/,
              use: cssRules(isProduction, true),
            },
            {
              use: cssRules(isProduction),
            },
          ],
          sideEffects: true, // 告诉webpack是有副作用的，不对css进行删除
        },
        {
          test: /\.(sass|scss)$/,
          exclude: /node_modules/,
          oneOf: [
            {
              resourceQuery: /module/,
              use: sassRules(isProduction, true),
            },
            {
              resourceQuery: /\?vue/,
              use: sassRules(isProduction),
            },
            {
              test: /\.module\.\w+$/,
              use: sassRules(isProduction, true),
            },
            {
              use: sassRules(isProduction),
            },
          ],
          sideEffects: true,
        },
        {
          test: /\.(jpg|jpeg|png|gif|svg|webp)$/,
          type: 'asset',
          generator: {
            filename: 'img/[name]-[contenthash:6][ext]',
          },
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024, // 如果一个模块源码大小小于 maxSize，那么模块会被作为一个 Base64 编码的字符串注入到包中， 否则模块文件会被生成到输出的目标目录中
            },
          },
        },
        {
          test: /\.(eot|ttf|woff2?)$/,
          type: 'asset/resource',
          generator: {
            filename: 'font/[name]-[contenthash:6][ext]',
          },
        },
      ],
    },
    plugins: [
      // 构建进度条
      webpackBarEnable && new WebpackBar(),
      // 友好的显示错误信息在终端
      new FriendlyErrorsWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
        typescript: {
          // extensions: {
          //   vue: {
          //     enabled: true,
          //     compiler: resolveApp('./node_modules/vue/compiler-sfc/index.js'),
          //   },
          // },
          diagnosticOptions: {
            semantic: true,
            syntactic: false,
          },
        },
        /**
         * devServer如果设置为false，则不会向 Webpack Dev Server 报告错误。
         * 但是控制台还是会打印错误。
         */
        devServer: false, // 7.x版本：https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/723
        // logger: {
        //   devServer: false, // fork-ts-checker-webpack-plugin6.x版本
        // },
        /**
         * async 为 false，同步的将错误信息反馈给 webpack，如果报错了，webpack 就会编译失败
         * async 默认为 true，异步的将错误信息反馈给 webpack，如果报错了，不影响 webpack 的编译
         */
        async: true,
      }),
      // 解析vue
      new VueLoaderPlugin(),
      // eslint-disable-next-line
      ComponentsPlugin({
        // eslint-disable-next-line
        resolvers: [NaiveUiResolver()],
      }),
      // windicss
      windicssEnable && new WindiCSSWebpackPlugin(),
      // 该插件将为您生成一个HTML5文件，其中包含使用脚本标签的所有Webpack捆绑包
      new HtmlWebpackPlugin({
        filename: 'index.html',
        title: htmlWebpackPluginTitle,
        template: resolveApp('./public/index.html'),
        hash: true,
        minify: isProduction
          ? {
              collapseWhitespace: true, // 折叠空白
              keepClosingSlash: true, // 在单标签上保留末尾斜杠
              removeComments: true, // 移除注释
              removeRedundantAttributes: true, // 移除多余的属性（如：input的type默认就是text，如果写了type="text"，就移除它，因为不写它默认也是type="text"）
              removeScriptTypeAttributes: true, // 删除script标签中type="text/javascript"
              removeStyleLinkTypeAttributes: true, // 删除style和link标签中type="text/css"
              useShortDoctype: true, // 使用html5的<!doctype html>替换掉之前的html老版本声明方式<!doctype>
              // 上面的都是production模式下默认值。
              removeEmptyAttributes: true, // 移除一些空属性，如空的id,classs,style等等，但不是空的就全删，比如<img alt />中的alt不会删。http://perfectionkills.com/experimenting-with-html-minifier/#remove_empty_or_blank_attributes
              minifyCSS: true, // 使用clean-css插件删除 CSS 中一些无用的空格、注释等。
              minifyJS: true, // 使用Terser插件优化
            }
          : false,
        chunks: ['main'], // 要仅包含某些块，您可以限制正在使用的块
      }),
      // 注入项目信息
      new BilldHtmlWebpackPlugin({
        env: 'webpack5',
      }),
      // 将已存在的单个文件或整个目录复制到构建目录。
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public', // 复制public目录的文件
            // to: 'assets', //复制到output.path下的assets，不写默认就是output.path根目录
            globOptions: {
              ignore: [
                // 复制到output.path时，如果output.paht已经存在重复的文件了，会报错：
                // ERROR in Conflict: Multiple assets emit different content to the same filename md.html
                '**/index.html', // 忽略from目录下的index.html，它是入口文件
              ],
            },
          },
        ],
      }),
      // new EsbuildPlugin({
      //   target: 'esnext',
      //   // define: {
      //   //   DSF_FS: JSON.stringify({ d: 23 }),
      //   //   'process.env.NODE_ENV': JSON.stringify({ d: 32 }),
      //   //   'process.env.PUBLIC_PATdH': JSON.stringify({ f: 2 }),
      //   //   // 'process.env.VUE_APP_RELEASE_PROJECT_NAME': JSON.stringify(
      //   //   //   process.env.VUE_APP_RELEASE_PROJECT_NAME
      //   //   // ),
      //   //   // 'process.env.VUE_APP_RELEASE_PROJECT_ENV': JSON.stringify(
      //   //   //   process.env.VUE_APP_RELEASE_PROJECT_ENV
      //   //   // ),
      //   //   // 'process.env.BilldHtmlWebpackPlugin': JSON.stringify(logData()),
      //   //   // 'process.env': {
      //   //   //   BilldHtmlWebpackPlugin: JSON.stringify(logData()),
      //   //   //   NODE_ENV: JSON.stringify(
      //   //   //     isProduction ? 'production' : 'development'
      //   //   //   ),
      //   //   //   PUBLIC_PATH: JSON.stringify(outputStaticUrl(isProduction)),
      //   //   //   VUE_APP_RELEASE_PROJECT_NAME: JSON.stringify(
      //   //   //     process.env.VUE_APP_RELEASE_PROJECT_NAME
      //   //   //   ),
      //   //   //   VUE_APP_RELEASE_PROJECT_ENV: JSON.stringify(
      //   //   //     process.env.VUE_APP_RELEASE_PROJECT_ENV
      //   //   //   ),
      //   //   // },
      //   // },
      // }),
      // 定义全局变量
      new DefinePlugin({
        BASE_URL: `${JSON.stringify(outputStaticUrl(isProduction))}`, // public下的index.html里面的favicon.ico的路径
        'process.env': {
          BilldHtmlWebpackPlugin: JSON.stringify(logData()),
          NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
          PUBLIC_PATH: JSON.stringify(outputStaticUrl(isProduction)),
          VUE_APP_RELEASE_PROJECT_NAME: JSON.stringify(
            process.env.VUE_APP_RELEASE_PROJECT_NAME
          ),
          VUE_APP_RELEASE_PROJECT_ENV: JSON.stringify(
            process.env.VUE_APP_RELEASE_PROJECT_ENV
          ),
        },
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
      }),
      // ts类型检查
      // feat: drop support for Vue.js：https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/pull/801
      // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/tree/v6.5.2#vuejs
      // fork-ts-checker-webpack-plugin得配合ts-loader使用。
      // new ForkTsCheckerWebpackPlugin({
      //   // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
      //   typescript: {
      //     extensions: {
      //       vue: {
      //         enabled: true,
      //         compiler: resolveApp('./node_modules/vue/compiler-sfc/index.js'),
      //       },
      //     },
      //     diagnosticOptions: {
      //       semantic: true,
      //       syntactic: false,
      //     },
      //   },
      //   /**
      //    * devServer如果设置为false，则不会向 Webpack Dev Server 报告错误。
      //    * 但是控制台还是会打印错误。
      //    */
      //   // devServer: false, // 7.x版本：https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/723
      //   logger: {
      //     devServer: false, // fork-ts-checker-webpack-plugin6.x版本
      //   },
      //   /**
      //    * async 为 false，同步的将错误信息反馈给 webpack，如果报错了，webpack 就会编译失败
      //    * async 默认为 true，异步的将错误信息反馈给 webpack，如果报错了，不影响 webpack 的编译
      //    */
      //   async: true,
      // }),
      // bundle分析
      analyzerEnable &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          generateStatsFile: true,
          statsOptions: { source: false },
        }), // configuration.plugins should be one of these object { apply, … } | function
      // eslint
      eslintEnable &&
        new ESLintPlugin({
          extensions: ['js', 'jsx', 'ts', 'tsx', 'vue'],
          emitError: false, // 发现的错误将始终发出，禁用设置为false.
          emitWarning: false, // 找到的警告将始终发出，禁用设置为false.
          failOnError: false, // 如果有任何错误，将导致模块构建失败，禁用设置为false
          failOnWarning: false, // 如果有任何警告，将导致模块构建失败，禁用设置为false
          cache: true,
          cacheLocation: resolveApp('./node_modules/.cache/.eslintcache'),
        }),
    ].filter(Boolean),
  };
  return result;
};

export default (env) => {
  return new Promise((resolve) => {
    const isProduction = env.production;
    process.env.NODE_ENV = isProduction ? 'production' : 'development';
    const configPromise = Promise.resolve(
      isProduction ? prodConfig : devConfig
    );
    configPromise.then(
      (config: any) => {
        // 根据当前环境，合并配置文件
        const mergeConfig = merge(commonConfig(isProduction), config);
        console.log(
          chalkWARN(
            `根据当前环境，合并配置文件，当前是: ${process.env.NODE_ENV!}环境`
          )
        );
        resolve(mergeConfig);
      },
      (err) => {
        console.log(err);
      }
    );
  });
};
