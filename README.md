<p align="center">
  <a href="https://desk.hsslive.cn" target="_blank">
    <img
      width="200"
      src="https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/img/logo.png?raw=true"
      alt="BilldDesk logo"
    />
  </a>
</p>

<h1 align="center">
  BilldDesk
</h1>

<p align="center">
 基于WebRTC + Vue3 + Electron + Nodejs搭建的远程桌面
</p>

<div align="center">

![stars](https://img.shields.io/github/stars/galaxy-s10/billd-desk)
![forks](https://img.shields.io/github/forks/galaxy-s10/billd-desk)

![version](https://img.shields.io/github/package-json/v/galaxy-s10/billd-desk)
![License](https://img.shields.io/github/license/galaxy-s10/billd-desk)
![language](https://img.shields.io/github/languages/top/galaxy-s10/billd-desk)

</div>

## 📢 省流 📢

2025 年起，billd-desk 项目的所有仓库将进入 dev 状态，如果你需要获取线上生产环境的代码，有以下两种方式：

1. 请花些时间查看之前提交的代码：[https://github.com/galaxy-s10/billd-desk/commits/master/](https://github.com/galaxy-s10/billd-desk/commits/master/)。
2. 订阅 [billd-project](https://github.com/billd-project)，价格：[https://desk.hsslive.cn/#/price](https://desk.hsslive.cn/#/price)

历史原因：参考 [billd-live 的历史原因](https://github.com/galaxy-s10/billd-live?tab=readme-ov-file#-%E7%9C%81%E6%B5%81-)

## 简介

BilldDesk 远程桌面控制，目前实现了类似 ToDesk、向日葵等远程桌面的功能。

## 生态

| 名称                | 仓库                                                                   | star & fork                                                                                                                                                                                                                                                                                                     | 线上地址/下载地址                                              |
| ------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 远程桌面网页/客户端 | [billd-desk](https://github.com/galaxy-s10/billd-desk)                 | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk)                                 | [https://desk.hsslive.cn](https://desk.hsslive.cn)             |
| 远程桌面后台        | [billd-desk-admin](https://github.com/galaxy-s10/billd-desk-admin)     | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk-admin?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk-admin?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-admin)               | [https://desk-admin.hsslive.cn](https://desk-admin.hsslive.cn) |
| 远程桌面移动端      | [billd-desk-flutter](https://github.com/galaxy-s10/billd-desk-flutter) | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk-flutter?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-flutter) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk-flutter?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-flutter) | TODO                                                           |
| 远程桌面服务端      | [billd-desk-server](https://github.com/galaxy-s10/billd-desk-server)   | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk-server?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-server) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk-server?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-server)     | [https://desk-api.hsslive.cn](https://desk-api.hsslive.cn)     |

## 功能

- [x] Web 端控制桌面客户端
- [x] 桌面客户端控制桌面客户端
- [x] Web 端控制 Web 端（仅观看）
- [x] 桌面客户端控制 Web 端（仅观看）
- [x] 多人同时远程同一设备
- [x] 连接鉴权
- [x] 支持 Macos 系统
- [x] 支持 Windows 系统
- [x] 支持 Linux 系统（未实际测试）
- [x] 文件传输
- [x] 开机自启
- [x] 锁屏保活
- [ ] 移动客户端（Flutter）
- [ ] 后台管理

## 预览

### 控制端发起远程控制

![https://github.com/user-attachments/assets/8e760673-49b5-48b1-b15b-29963880fa64](https://github.com/user-attachments/assets/8e760673-49b5-48b1-b15b-29963880fa64)

![https://github.com/user-attachments/assets/beb7d43c-5660-4185-96c8-2f2761a11413](https://github.com/user-attachments/assets/beb7d43c-5660-4185-96c8-2f2761a11413)

### 控制端正在控制被控端

![https://github.com/user-attachments/assets/4cc167f5-70ac-47bc-a226-564a2f69c2f1](https://github.com/user-attachments/assets/4cc167f5-70ac-47bc-a226-564a2f69c2f1)

### 被控端

![https://github.com/user-attachments/assets/b1482a29-ca11-4ed8-b78e-49815a556bfe](https://github.com/user-attachments/assets/b1482a29-ca11-4ed8-b78e-49815a556bfe)

### 文件传输

![https://github.com/user-attachments/assets/fc9d5f94-e716-46ce-b17d-a39c394521a3](https://github.com/user-attachments/assets/fc9d5f94-e716-46ce-b17d-a39c394521a3)

## 接口文档

接口文档：[https://apifox.com/apidoc/shared-a8ba9715-7730-432d-896c-97f983050795](https://apifox.com/apidoc/shared-a8ba9715-7730-432d-896c-97f983050795)

## 本地启动

### billd-desk(pro)

#### 安装依赖

> 建议使用 node 版本：v18.19.0

```bash
pnpm i
```

> 更新 billd 相关依赖：

```bash
pnpm i billd-deploy@latest billd-utils@latest billd-scss@latest billd-html-webpack-plugin@latest
```

#### 运行

> 配置文件：**`src/spec-config.ts`**，请在该文件填写对应的信息。

```bash
npm run dev
```

#### 打包

> 打包时会先使用[`standard-version`](https://github.com/conventional-changelog/standard-version#readme)进行发版，请确保当前项目初始化了git，否则打包会失败。

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

### billd-desk-server(pro)

#### 安装依赖

> 建议使用 node 版本：v18.19.0

```bash
pnpm i
```

> 更新 billd 相关依赖：

```bash
pnpm i billd-utils@latest billd-html-webpack-plugin@latest
```

#### 运行

> 本地必须要有 docker 环境！
>
> 项目启动后，会在项目的 src/secret/目录下生成 secret-beta、secret-dev、secret-prod 文件，请填写里面的信息，MYSQL_CONFIG、REDIS_CONFIG 必填！

1. 初始化docker容器

```bash
npm run docker:dev
```

2. 初始化数据库，这个命令只需要执行一次，执行后就会自动创建数据库和数据库表。

```bash
npm run mysql:dev
```

3. 运行，默认运行在5300端口

```bash
npm run dev
```

## 性能测试

主要测试各个端之间远程时候的延迟。

> TODO

## 常见问题

### 应用图标缓存问题

如果应用图标不更新，可以尝试替换一个图标图片再打包，或者你不希望换图标图片的话，可以将现在的图标图片拿去压缩一下，亲测也能解决问题。

### rebuild

```bash
npm config set registry https://registry.npmmirror.com
```

```bash
./node_modules/.bin/electron-rebuild
```

### rebuild 时 cpu-feature 报错

直接删了 node_modules 的 cpu-feature

### pnpm 安装 electron 时卡在 postinstall

1. 直接 ctrl+c 退出 npm 安装
2. 进入 node_modules/electron/install.js，将
   ```js
   downloadArtifact({
     version,
     artifactName: 'electron',
     force: process.env.force_no_cache === 'true',
     cacheRoot: process.env.electron_config_cache,
     checksums:
       (process.env.electron_use_remote_checksums ??
       process.env.npm_config_electron_use_remote_checksums)
         ? undefined
         : require('./checksums.json'),
     platform,
     arch,
   })
     .then(extractFile)
     .catch((err) => {
       console.error(err.stack);
       process.exit(1);
     });
   ```
   修改为：
   ```js
   downloadArtifact({
     version,
     artifactName: 'electron',
     force: process.env.force_no_cache === 'true',
     cacheRoot: process.env.electron_config_cache,
     checksums:
       (process.env.electron_use_remote_checksums ??
       process.env.npm_config_electron_use_remote_checksums)
         ? undefined
         : require('./checksums.json'),
     platform,
     arch,
     mirrorOptions: {
       mirror: 'https://npmmirror.com/mirrors/electron/',
       platform,
       arch,
     },
   })
     .then(extractFile)
     .catch((err) => {
       console.error(err.stack);
       process.exit(1);
     });
   ```
3. 在 node_modules/electron 目录下执行 node install

## 兼容性

- [x] Windows
- [x] Macos
- [x] Linux

## 贡献者

  <a href="https://github.com/galaxy-s10/billd-desk/graphs/contributors" target="_blank">
    <img
      width="200"
      src="https://contrib.rocks/image?repo=galaxy-s10/billd-desk"
      alt="BilldDesk logo"
    />
  </a>
