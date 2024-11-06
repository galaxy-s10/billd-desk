<p align="center">
  <a href="https://live.hsslive.cn/remoteDesktop" target="_blank">
    <img
      width="200"
      src="https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/img/logo.png?raw=true"
      alt="Billd-Desk logo"
    />
  </a>
</p>
<h1 align="center">
  BilldDesk
</h1>
<p align="center">
 基于WebRTC + Vue3 + Electron + Nodejs搭建的远程桌面
</p>

## 简介

BilldDesk远程桌面控制，目前实现了类似ToDesk、向日葵等远程桌面的功能。

## 生态

| 名称           | 仓库                                                                     | star & fork                                                                                                                                                                                                                                                                                                         | 线上地址                                           |
| -------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 远程桌面网页端 | [billd-desk](https://github.com/galaxy-s10/billd-desk)                   | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk)                                     | [https://desk.hsslive.cn](https://desk.hsslive.cn) |
| 远程桌面客户端 | [billd-desk-electron](https://github.com/galaxy-s10/billd-desk-electron) | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk-electron?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-electron) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk-electron?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-electron) |                                                    |
| 远程桌面移动端 | [billd-desk-flutter](https://github.com/galaxy-s10/billd-desk-flutter)   | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk-flutter?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-flutter) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk-flutter?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-flutter)     |                                                    |
| 远程桌面服务端 | [billd-desk-server](https://github.com/galaxy-s10/billd-desk-server)     | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk-server?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-server) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk-server?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-server)         |                                                    |

## 功能

- [x] Web端控制桌面客户端
- [ ] Web端查看Web端
- [x] 桌面客户端控制桌面客户端
- [x] 桌面客户端查看Web端
- [x] 连接鉴权
- [x] 支持Macos系统
- [x] 支持Windows系统
- [ ] 支持Linux系统
- [ ] 文件传输
- [ ] 移动客户端
- [ ] 后台管理

目前暂不实现以下功能：

- ❌ Web端控制Web端
- ❌ 桌面客户端控制Web端
- ❌ Docker部署

## 预览

### 控制端发起远程控制

![https://github.com/user-attachments/assets/8e760673-49b5-48b1-b15b-29963880fa64](https://github.com/user-attachments/assets/8e760673-49b5-48b1-b15b-29963880fa64)

![https://github.com/user-attachments/assets/beb7d43c-5660-4185-96c8-2f2761a11413](https://github.com/user-attachments/assets/beb7d43c-5660-4185-96c8-2f2761a11413)

### 控制端正在控制被控端

![https://github.com/user-attachments/assets/4cc167f5-70ac-47bc-a226-564a2f69c2f1](https://github.com/user-attachments/assets/4cc167f5-70ac-47bc-a226-564a2f69c2f1)

### 被控端

![https://github.com/user-attachments/assets/b1482a29-ca11-4ed8-b78e-49815a556bfe](https://github.com/user-attachments/assets/b1482a29-ca11-4ed8-b78e-49815a556bfe)

## 接口文档

线上接口：[https://desk-api.hsslive.cn](https://desk-api.hsslive.cn)

接口文档：todo

## 本地启动

- 安装依赖（建议使用 node 版本：v18.19.0）

```bash
pnpm i
```

> 更新 billd 相关依赖：

```bash
pnpm i billd-deploy@latest billd-utils@latest billd-scss@latest billd-html-webpack-plugin@latest
```

- 运行

```bash
npm run dev
```

- 打包windows、macos、linux包

```bash
npm run build
```

- 打包windows包

```bash
npm run build:win
```

- 打包macos包

```bash
npm run build:mac
```

- 打包linux包

```bash
npm run build:linux
```

## 性能测试

主要测试各个端之间远程时候的延迟。

> TODO

## 视频教程

b站合集：[BilldDesk开源远程桌面控制](https://space.bilibili.com/381307133/channel/collectiondetail?sid=4106361&ctype=0)

WebRTC课程：[https://www.hsslive.cn/article/151](https://www.hsslive.cn/article/151)

## 常见问题

### rebuild

```bash
npm config set registry https://registry.npmmirror.com
```

```bash
./node_modules/.bin/electron-rebuild
```

### rebuild时cpu-feature报错

直接删了node_modules的cpu-feature

### pnpm安装electron时卡在postinstall

1. 直接ctrl+c退出npm安装
2. 进入node_modules/electron/install.js，将
   ```js
   downloadArtifact({
     version,
     artifactName: 'electron',
     force: process.env.force_no_cache === 'true',
     cacheRoot: process.env.electron_config_cache,
     checksums:
       process.env.electron_use_remote_checksums ??
       process.env.npm_config_electron_use_remote_checksums
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
       process.env.electron_use_remote_checksums ??
       process.env.npm_config_electron_use_remote_checksums
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
3. 在node_modules/electron目录下执行node install

## 交流群🔥

![WechatIMG1417](https://github.com/user-attachments/assets/d0743ee0-4545-4618-863e-13c40f717119)

## 兼容性

- [x] Windows
- [x] Macos
- [ ] Linux
