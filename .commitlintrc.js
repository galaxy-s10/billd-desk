const typeEnum = require('./.cz-config');
console.log(
  '\x1B[0;37;44m INFO \x1B[0m',
  '\x1B[0;;34m ' +
    `读取了: ${__filename.slice(__dirname.length + 1)}` +
    ' \x1B[0m'
);

module.exports = {
  extends: ['@commitlint/config-conventional'],
  // https://github.com/conventional-changelog/commitlint/blob/master/docs/reference-rules.md
  rules: {
    'type-enum': [2, 'always', typeEnum.types.map((i) => i.value)],
    'scope-empty': [0, 'never'],
  },
};
