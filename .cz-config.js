console.log(
  '\x1B[0;37;44m INFO \x1B[0m',
  '\x1B[0;;34m ' +
    `读取了: ${__filename.slice(__dirname.length + 1)}` +
    ' \x1B[0m'
);

// https://github.com/leoforfree/cz-customizable
module.exports = {
  types: [
    {
      value: 'feat',
      name: '✨  feat:      新功能',
    },
    {
      value: 'fix',
      name: '🐛  fix:       修补bug',
    },
    {
      value: 'docs',
      name: '📝  docs:      文档新增/变更',
    },
    {
      value: 'ci',
      name: '👷  ci:        CI Build',
    },
    {
      value: 'build',
      name: '🚀  build:     版本打包/Tag',
    },
    {
      value: 'chore',
      name: '📦️  chore:     构建工具调整',
    },
    {
      value: 'perf',
      name: '⚡️  perf:      性能提升',
    },
    {
      value: 'refactor',
      name: '🔨  refactor:  代码重构',
    },
    {
      value: 'revert',
      name: '⏪  revert:    代码回滚',
    },
    {
      value: 'style',
      name: '🎨  style:     样式或UI修改',
    },
    {
      value: 'test',
      name: '🧪  test:      Add missing tests or correcting existing tests',
    },
  ],
  scopes: [],
  skipEmptyScopes: true,
  // allowCustomScopes: true,
};
