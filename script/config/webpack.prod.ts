import PreloadPlugin from '@vue/preload-webpack-plugin';
// import { version as axiosVersion } from 'axios/package.json';
import CompressionPlugin from 'compression-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import { version as piniaVersion } from 'pinia/package.json';
import TerserPlugin from 'terser-webpack-plugin';
// import { version as vueDemiVersion } from 'vue-demi/package.json';
// import { version as vueRouterVersion } from 'vue-router/package.json';
// import { version as vueVersion } from 'vue/package.json';
import { Configuration } from 'webpack';

import { gzipEnable } from '../constant';
import { chalkINFO } from '../utils/chalkTip';

console.log(chalkINFO(`读取: ${__filename.slice(__dirname.length + 1)}`));

const prodConfig: Configuration = {
  mode: 'production',
  devtool: false,
  // externals: {
  //   vue: 'Vue',
  //   'vue-router': 'VueRouter',
  //   pinia: 'Pinia',
  //   axios: 'axios',
  // },
  optimization: {
    /**
     * splitChunks属性，如果设置了mode: 'production'，会有默认行为，具体看官网
     * 但即使没有设置mode: 'production'，也没有手动添加splitChunks属性，默认还是会添加splitChunks的部分行为，
     * 比如：splitChunks.chunks:'async'等等，即会将异步代码抽离！
     */
    splitChunks: {
      // 对入口文件进行代码分离
      // chunks: 'all',  //async,initial,all
      // minSize: 20 * 1024, //生成 chunk 的最小体积。默认：20000（19.5kb）
      /**
       * maxSize:尝试将大于maxSize的chunk分割成较小的部分chunks。
       * 官网写的默认值是0，但是，实际测试：如果在chunks:async的时候，确实这个属性会生效，会将异步代码配合minSize进行抽离；
       * 但是如果在chunks:initial或all的时候，如果不手动添加maxSize属性，就不会将同步代码配合minSize进行抽离！
       * 因此，如果希望maxSize可以对同步和异步代码都进行分离，就手动设置maxSize:0，或者手动设置maxSize为自己需要设置的值，
       * 但一定不能不写这个maxSize!最起码也得写一个maxSize:0，虽然这样写会报警告，或者直接写maxSize的值和minSize值一样！
       */
      // maxSize: 0,   //不写maxSize默认就是0，这里手动设置0
      // maxSize: 30 * 1024,
      // minRemainingSize: 0, //???
      // minChunks: 1, //模块被不同entry引用的次数大于等于才能分割。
      // maxAsyncRequests: 30, //按需加载时的最大并行请求数。默认：30
      // maxInitialRequests: 30, //按需加载时的最大并行请求数。默认：30
      /**
       * enforceSizeThreshold：强制执行拆分的体积阈值和其他限制（minRemainingSize，maxAsyncRequests，maxInitialRequests）将被忽略。
       * 即拆分的包大小范围允许在这个阈值范围，即设置minSize:20 * 1024，enforceSizeThreshold: 10 * 1024，
       * 允许拆分的包在10kb-30kb之间！
       */
      // enforceSizeThreshold: 1 * 1024,  //默认：50000byte
      /**
       * 不建议全局设置filename，因为如果缓存组没有手动设置filename，默认缓存组会继承全局
       * 的filename，这样在某些情况会显得很奇葩，比如：全局设置了chunks:'async'，filename:'[id]-asyncChunks.js',
       * 而缓存组设置了一个chunks:'initial',且没有设置它的filename，那么最终打包会先匹配缓存组，然后匹配
       * 到同步代码就抽离，然后设置filename，由于这个缓存组没有设置它的filename，因此会继承全局的filename，
       * 因此就会把同步代码抽离后叫[id]-asyncChunks.js，虽然还是一样把代码抽离出来了，但是
       * 抽离出来的文件和文件名"货不对板"，做不到见名知意，这样就很别扭了。因此如果设置设置了全局的filename，那
       * 么最好就是每一个缓存组都设置自己的filename，这样就可以和全局的进行区分了
       */
      // filename: "[id]-splitChunks.js", //默认[name]-bundle.js
      /**
       * 缓存组可以继承和/或覆盖来自 splitChunks.* 的任何选项
       * 即如果匹配到缓存缓存组里的某一个，如vendor，vendor里的设置会对splitChunks的设置进行继承或覆盖
       * 即vendor里没有设置chunks，vendor就会继承splitChunks的chunks，vendor设置了filename，会覆盖splitChunks的filename
       */
      cacheGroups: {
        // cacheGroups里的优先级默认比外面的高
        // defaultVendors:false,  //禁用默认webpack默认设置的defaultVendors缓存组
        // default:false, //禁用默认webpack默认设置的default缓存组
        defaultVendors: {
          // 重写默认的defaultVendors
          chunks: 'initial',
          // minSize: 50 * 1024,
          maxSize: 100 * 1024,
          test: /[\\/]node_modules[\\/]/,
          // filename: 'js/[name]-defaultVendors.js',
          filename: 'js/[name]-[contenthash:6]-defaultVendors.js',
          priority: -10,
        },
        default: {
          // 重写默认的default
          chunks: 'all',
          maxSize: 100 * 1024,
          filename: 'js/[name]-[contenthash:6]-default.js',
          minChunks: 2, // 至少被minChunks个入口文件引入了minChunks次。
          priority: -20,
        },
      },
    },
    usedExports: true, // production模式或者不设置usedExports，它默认就是true。usedExports的目的是标注出来哪些函数是没有被使用 unused，会结合Terser进行处理
    sideEffects: true, // webpack.dev.ts有注释
    minimize: true, // 是否开启Terser,默认就是true，设置false后，不会压缩和转化
    minimizer: [
      new TerserPlugin({
        parallel: true, // 使用多进程并发运行以提高构建速度
        extractComments: false, // 默认true,会将/^\**!|@preserve|@license|@cc_on/i的注释提取到单独的文件中
        // Terser 压缩配置
        terserOptions: {
          parse: {
            // 注意：terserOptions.parse被标记了deprecated。
          },
          compress: {
            // defaults:true,默认true,传递false禁用大多数默认启用的compress转换
            arguments: true, // 默认false,尽可能将参数[index]替换为函数参数名
            dead_code: true, // 默认true,删除无法访问的代码(比如return后面的语句)
            toplevel: false, // 默认false,在顶级作用域中删除未引用的函数("funcs")和/或变量("vars"), 设置true表示同时删除未引用的函数和变量
            keep_classnames: false, // 默认false,传递true以防止terser丢弃类名
            keep_fnames: false, // 默认false,传递true以防止terser丢弃函数名
            drop_console: false, // 默认false,设置true会删掉丢掉对console.*函数的调用
            // pure_funcs: ['console.log'], // 告诉terser,console.log没有副作用,terser会将它删除
          },
          /**
           * mangle,默认值true,会将keep_classnames,keep_fnames,toplevel等等mangle options的所有选项设为true。
           * 传递false以跳过篡改名称，或者传递一个对象来指定篡改选项
           */
          mangle: true,
          toplevel: false, // 注意：terserOptions.toplevel被标记了deprecated。默认false,如果希望启用顶级变量和函数名修改,并删除未使用的变量和函数,则设置为true。
          keep_classnames: true, // 默认undefined,传递true以防止丢弃或混淆类名。
          keep_fnames: false, // 默认false,传递true以防止函数名被丢弃或混淆。
          // TODO 外层的keep_classnames和keep_fnames和compress的有啥区别or优先级？
        },
      }),
      new CssMinimizerPlugin({
        parallel: true, // 使用多进程并发执行，提升构建速度。
      }), // css压缩，去除无用的空格等等
    ],
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          // 'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false, // https://github.com/facebook/create-react-app/issues/6846
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false, // https://github.com/facebook/create-react-app/issues/6846
            },
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsxSuffixTo: ['\\.vue$'],
              // If you want to speed up compilation significantly you can set this flag. https://www.npmjs.com/package/ts-loader#transpileonly
              transpileOnly: true,
              happyPackMode: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // http压缩
    gzipEnable &&
      new CompressionPlugin({
        test: /\.(css|js)$/i,
        threshold: 10 * 1024, // 大于10k的文件才进行压缩
        minRatio: 0.8, // 只有压缩比这个比率更好的资产才会被处理(minRatio =压缩大小/原始大小),即压缩如果达不到0.8就不会进行压缩
        algorithm: 'gzip', // 压缩算法
      }),
    // 注入script或link
    new HtmlWebpackTagsPlugin({
      append: false,
      publicPath: '', // 默认会拼上output.publicPath，因为我们引入的是cdn的地址，因此不需要拼上output.publicPath，直接publicPath:''，这样就约等于拼上空字符串''
      links: [],
      // scripts: [
      //   `https://unpkg.com/vue@${vueVersion}/dist/vue.global.prod.js`,
      //   `https://unpkg.com/vue-router@${vueRouterVersion}/dist/vue-router.global.prod.js`,
      //   `https://unpkg.com/axios@${axiosVersion}/dist/axios.min.js`,
      //   `https://unpkg.com/vue-demi@${vueDemiVersion}/lib/index.iife.js`,
      //   `https://unpkg.com/pinia@${piniaVersion}/dist/pinia.iife.prod.js`,
      // ],
    }),
    // 将 CSS 提取到单独的文件中
    new MiniCssExtractPlugin({
      /**
       * Options similar to the same options in webpackOptions.output
       * all options are optional
       */
      filename: 'css/[name]-[contenthash:6].css',
      chunkFilename: 'css/[id]-[contenthash:6].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    // Css TreeShaking
    // new PurgeCssPlugin({
    //   /**
    //    * 实际测试有一些bug，比如html里面有ul这个元素，css里面的.ul{}，#ul{}，ul{}都会打包进去？？？
    //    * 在js文件里如果有给元素添加类，但是注释了，如：// divEle.className='test123'，但是这个.test123一样会打包进去，得手动删除这行注释代码才行！
    //    * 而且貌似不能对.vue文件进行treeShaking，而且构建出来的css文件会空白，没有任何内容，所以暂时不用这个插件了
    //    */
    //   paths: glob.sync(`${path.resolve(__dirname, '../src')}/**/*`, {
    //     nodir: true,
    //   }),
    //   safelist: function () {
    //     return {
    //       standard: ['body', 'html'],
    //     };
    //   },
    // }),
    // 预加载
    new PreloadPlugin({
      rel: 'preload',
      include: 'initial',
      fileBlacklist: [/\.map$/, /hot-update\.js$/],
    }),
    // 预获取
    new PreloadPlugin({
      rel: 'prefetch',
      include: 'asyncChunks',
    }),
    // new webpack.optimize.ModuleConcatenationPlugin(), //作用域提升。！！！在使用cdn时，axios有问题，先不用！
  ].filter(Boolean),
};

export default prodConfig;
