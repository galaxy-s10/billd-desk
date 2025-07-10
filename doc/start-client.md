## billd-desk(pro)

## 安装依赖

> 使用 node 版本：v18.19.0，建议18版本
> 使用 pnpm 版本：9.1.3，建议9版本

```bash
pnpm i
```

> 更新 billd 相关依赖：

```bash
pnpm i billd-deploy@latest billd-utils@latest billd-scss@latest billd-html-webpack-plugin@latest
```

## 运行

> 配置文件：**`src/spec-config.ts`**，请在该文件填写对应的信息。

```bash
npm run dev
```

## 打包

> 打包时会先使用[`standard-version`](https://github.com/conventional-changelog/standard-version#readme)进行发版，请确保当前项目初始化了 git，否则打包会失败。

- web

> 打包成功后，资源输出在`dist`目录

```bash
npm run build:web
```

- windows、macos、linux 包

> 打包成功后，资源输出在`electron-release`目录

```bash
npm run build
```

- windows 包

> 打包成功后，资源输出在`electron-release`目录

```bash
npm run build:win
```

- macos 包

> 打包成功后，资源输出在`electron-release`目录

```bash
npm run build:mac
```

- linux 包

> 打包成功后，资源输出在`electron-release`目录

```bash
npm run build:linux
```
