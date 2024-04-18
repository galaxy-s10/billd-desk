console.log(
  '\x1B[0;37;44m INFO \x1B[0m',
  '\x1B[0;;34m ' +
    `读取了: ${__filename.slice(__dirname.length + 1)}` +
    ' \x1B[0m'
);

module.exports = {
  bracketSpacing: true, // 默认为true。即要求：{ foo: bar }；可改为false，即要求{foo: bar}
  singleQuote: true, // 默认为false。即要求：const a = "1"；可改为true，即要求const a = '1'
  semi: true, // 默认值true，即要求在所有代码语句的末尾添加分号；可改为false，即要求仅在可能导致 ASI 失败的行的开头添加分号。
  singleAttributePerLine: true, // 默认false。即在HTML、Vue和JSX中不要每行强制执行单个属性；可改为true，即要求每行强制执行单个属性。

  /**
   * jsxBracketSameLine
   * 注意是多行，如果是类似这种：<a>1</a>，基本不会触发换行，因此也就不会触发这个bracketSameLine
   * 但是如果是类似这种：<a a="1 "b="2">1</a>，它有多个属性，或者说他的一个属性值很长，可能会导致换行，
   * 如果换行了，那么就会触发bracketSameLine，将<a a="1 "b="2">最后的>单独放在一行或者最后一行的末尾
   */
  bracketSameLine: false, // 默认为false。即将多行HTML（HTML、JSX、Vue、Angular）元素的 > 单独放在下一行；可改为true，即将 > 放在最后一行的末尾。
  // jsxBracketSameLine: false, // 此选项已在v2.4.0中弃用，使用bracketSameLine替换，https://prettier.io/blog/2021/09/09/2.4.0.html

  /**
   * trailingComma
   * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Trailing_commas
   * 尾后逗号 （有时叫做“终止逗号”）在向 JavaScript 代码添加元素、参数、属性时十分有用。
   * 如果你想要添加新的属性，并且上一行已经使用了尾后逗号，你可以仅仅添加新的一行，而不需要修改上一行。
   * 这使得版本控制的代码比较（diff）更加清晰，代码编辑过程中遇到的麻烦更少。
   */
  trailingComma: 'es5', // 默认值在v2.0.0中none更改为es5。即在ES5中有效的尾随逗号（对象、数组等）。可选："none"：没有尾随逗号；"all"：尽可能尾随逗号

  /**
   * printWidth
   * 如果设置了printWidth值，则以设置的printWidth值为准
   * 如果没有设置printWidth值，且.editorconfig文件有设置max_line_length值，则使用.editorconfig文件的max_line_length
   */
  printWidth: 80, // 默认80，printWidth不是硬性的允许行长度上限，不要试图将 printWidth 当作 ESLint 的max-len 来使用——它们不一样

  /**
   * tabWidth
   * 如果设置了tabWidth值，则以设置的tabWidth值为准
   * 如果没有设置tabWidth值，且.editorconfig文件有设置indent_size或者tab_width值，则使用.editorconfig文件的indent_size或者tab_width
   */
  tabWidth: 2, // 指定每个缩进级别的空格数。
  // parser: 'babel', // 指定要使用的解析器。Prettier 会自动从输入文件路径推断解析器，因此您不必更改此设置。
};
