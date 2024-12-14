console.log(
  '\x1B[0;37;44m INFO \x1B[0m',
  '\x1B[0;;34m ' + `读取了: postcss配置文件` + ' \x1B[0m'
);

// 把.browserslistrc的last 2 version改成last 20 version就可以看到明显效果
// user-select:none
export default {
  plugins: {
    'postcss-preset-env': {},
  },
};
