console.log(
  '\x1B[0;37;44m INFO \x1B[0m',
  '\x1B[0;;34m ' +
    `读取了: ${__filename.slice(__dirname.length + 1)}` +
    ' \x1B[0m'
);

module.exports = {
  types: [
    { type: 'feat', section: '✨ 新特性', hidden: false },
    { type: 'fix', section: '🐛 Bug修复', hidden: false },
    { type: 'docs', section: '📝 文档更改', hidden: false },
    { type: 'style', section: '🎨 样式更改', hidden: false },
    { type: 'refactor', section: '🔨 代码重构', hidden: false },
    {
      type: 'perf',
      section: '⚡️ 优化性能',
      hidden: false,
    },
    { type: 'test', section: '🧪 测试', hidden: false },
    { type: 'build', section: '🚀 构建', hidden: false },
    { type: 'ci', section: '👷 CI', hidden: false },
    { type: 'chore', section: '🏗 其他', hidden: false },
    { type: 'revert', section: '⏪ 回退', hidden: false },
  ],
};
