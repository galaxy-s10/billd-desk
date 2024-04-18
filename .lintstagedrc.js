console.log(
  '\x1B[0;37;44m INFO \x1B[0m',
  '\x1B[0;;34m ' +
    `读取了: ${__filename.slice(__dirname.length + 1)}` +
    ' \x1B[0m'
);

module.exports = {
  // 只对这几种格式的代码进行prettier美化
  '*.{js,jsx,ts,tsx,vue}': ['prettier --write'],
};
