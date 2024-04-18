<p align="center">
  <a href="https://live.hsslive.cn" target="_blank">
    <img
      width="200"
      src="https://resource.hsslive.cn/billd-live/image/240160ddbc14367f7e0126c1f5b09b69.svg"
      alt="Billd-Live logo"
    />
  </a>
</p>

<h1 align="center">
  Billd-Live
</h1>

<p align="center">
  基于Vue3 + WebRTC + Node + SRS + FFmpeg搭建的直播间
</p>

## 简介

billd 直播间，目前实现了类似 [bilibili 的 Web 在线直播](https://live.bilibili.com)功能，即你（房主）可以发布直播，别人进入你的直播间后能看到你的直播内容；而你也可以作为观众，进入别人的直播间看别人的直播内容。

## 生态

| 名称         | 仓库                                                                             | star & fork                                                                                                                                                                                                                                                                                                                         | 线上地址                                                                       |
| ------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 直播间前台   | [billd-live](https://github.com/galaxy-s10/billd-live)                           | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live)                                                     | [https://live.hsslive.cn](https://live.hsslive.cn)                             |
| 直播间后端   | [billd-live-server](https://github.com/galaxy-s10/billd-live-server)             | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-server?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-server) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-server?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-server)                         | [https://live-api.hsslive.cn](https://live-api.hsslive.cn)                     |
| 直播间后台   | [billd-live-admin](https://github.com/galaxy-s10/billd-live-admin)               | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-admin?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-admin) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-admin?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-admin)                             | [https://live-admin.hsslive.cn](https://live-admin.hsslive.cn)                 |
| 远程桌面     | [billd-desk](https://github.com/galaxy-s10/billd-desk)                           | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk)                                                     | [https://live.hsslive.cn/remoteDeskTop](https://live.hsslive.cn/remoteDeskTop) |
| 直播间移动端 | [billd-live-flutter](https://github.com/galaxy-s10/billd-live-flutter)           | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-flutter?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-flutter) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-flutter?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-flutter)                     | [https://live.hsslive.cn/download](https://live.hsslive.cn/download)           |
| 直播间移动端 | [billd-live-react-native](https://github.com/galaxy-s10/billd-live-react-native) | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-react-native?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-react-native) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-react-native?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-react-native) | [https://live.hsslive.cn/download](https://live.hsslive.cn/download)           |
| 直播间客户端 | [billd-live-electron](https://github.com/galaxy-s10/billd-live-electron)         | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-electron?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-flutter) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-electron?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-electron)                  | [https://live.hsslive.cn/download](https://live.hsslive.cn/download)           |
| 直播间移动端 | [billd-live-kotlin](https://github.com/galaxy-s10/billd-live-kotlin)             | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-live-kotlin?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-live-kotlin) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-live-kotlin?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-live-kotlin)                         | [https://live.hsslive.cn/download](https://live.hsslive.cn/download)           |

## 功能

- [x] 原生 webrtc 推拉流
- [x] srs webrtc 推流，`http-flv` 或 `hls`拉流
- [x] msr 推流，ffmpeg转码，`http-flv` 或 `hls`拉流
- [x] 一对一打PK
- [x] 一对多打PK
- [x] 多对多打PK
- [x] 前端混流
- [x] 推流鉴权
- [x] 拉流鉴权
- [x] [OBS](https://github.com/obsproject/obs-studio)、[FFmpeg](https://ffmpeg.org)推流
- [x] 用户模块（qq 登录）
- [x] 支付模块（支付宝当面付）
- [x] 订单模块
- [x] 商品模块
- [x] 适配移动端
- [x] 在线后台
- [x] 多平台转推（b站、虎牙直播）
- [x] 接入腾讯云-云直播
- [ ] 接入腾讯云-实时音视频TRTC

## 技术栈

- 前端相关：[Vue3](https://vuejs.org) 以及相关技术栈、`Typescript`、`WebRTC`、`WebCodecs`、`Web Audio`、`Web Workder`、`Canvas`
- 后端相关：[Nodejs](https://nodejs.org) 以及相关技术栈、`Koa2`、`Sequelize`、`Mysql`、`Redis`、`Socket.io`
- 流媒体服务器相关：[SRS](https://ossrs.net)、 [FFmpeg](https://ffmpeg.org)、[Coturn](https://github.com/coturn/coturn)
- Docker 相关：[Docker](https://www.docker.com)

## 接口文档

apifox：[https://apifox.com/apidoc/shared-c7556b54-17b2-494e-a039-572d83f103ed](https://apifox.com/apidoc/shared-c7556b54-17b2-494e-a039-572d83f103ed)

## 下载

[https://live.hsslive.cn/download](https://live.hsslive.cn/download)

## 预览

线上地址：[https://live.hsslive.cn](https://live.hsslive.cn)

### 电脑端（web）

- 首页

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/95849774-1df0-4a59-b726-8d3bc0795619" 
  style="width:800px"
/>

- 进入直播间

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/91ac3f5f-b06d-46b3-84bc-ab6e0add4d5b" 
  style="width:800px"
/>

- 发起直播

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/81e2f413-8470-42ab-bee7-699e2f8f0290" 
  style="width:800px"
/>

- 排行榜

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/6d7d79b6-e8b9-42ff-9e25-d44c41948579" 
  style="width:800px"
/>

### 移动端（web）

- 首页

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/9b56e99a-f821-4c9c-b9c3-330c2f61d533" 
  style="height:500px"
/>

- 进入直播间

<img
  src="https://github.com/galaxy-s10/billd-live/assets/61055341/db4145a9-517d-45a5-9c74-641892d55a3e" 
  style="height:500px"
/>

### 安卓端（flutter）

-

<img
  src="https://resource.hsslive.cn/billd-live/image/38a0fae4c5104913ca0b7617ca58b518.webp" 
  style="width:300px"
/><img
  src="https://resource.hsslive.cn/billd-live/image/8fa5423182476341ade6d74dba9eac0f.webp" 
  style="width:300px"
/><img
  src="https://resource.hsslive.cn/billd-live/image/a6df703d48c3c3e5ec708ebf0b48f345.webp" 
  style="width:300px"
/>

- 直播间详情、分区详情

<img
  src="https://resource.hsslive.cn/billd-live/image/420a663259487309a51cdc0d44b01246.webp" 
  style="width:300px"
/> <img
  src="https://resource.hsslive.cn/billd-live/image/da8d31cda66f51b95cd8b34f4cbeb680.webp" 
  style="width:300px"
/>

-

<img
  src="https://resource.hsslive.cn/billd-live/image/3a777718d31f94e6d25071d29f5e5185.webp" 
  style="width:300px"
/> <img
  src="https://resource.hsslive.cn/billd-live/image/e785bc308c2d24460baf36f65aa39c5e.webp" 
  style="width:300px"
/>

- 直播中心

<img
  src="https://resource.hsslive.cn/billd-live/image/77b89ccf7a10be1663f7e9d5bc69565d.jpg" 
  style="width:300px"
/> <img
  src="https://resource.hsslive.cn/billd-live/image/90f505de2580b69aed73ea5c5717e669.jpg" 
  style="width:300px"
/>

## 本地启动

> b站教程：[从零搭建迷你版b站web直播间合集](https://space.bilibili.com/381307133/channel/collectiondetail?sid=1458070)，看里面带 `从零搭建迷你b站直播间` 封面的视频。
>
> billd-live付费课：[https://www.hsslive.cn/article/151](https://www.hsslive.cn/article/151)

### billd-live

- 安装依赖（建议使用 node 版本：v18.19.0）

```bash
pnpm i
```

> 更新 billd 相关依赖：

```bash
pnpm i billd-utils@latest billd-scss@latest billd-deploy@latest billd-html-webpack-plugin@latest
```

- 运行

```bash
npm run start
```

- 打包

```bash
npm run build
```

### billd-live-server

- 安装依赖（建议使用 node 版本：v18.19.0）

```bash
pnpm i
```

> 更新 billd 相关依赖：

```bash
pnpm i billd-utils@latest billd-scss@latest billd-html-webpack-plugin@latest
```

> 本地必须要有 docker、ffmpeg 环境！
>
> 项目启动后，会在项目的 src/secret/目录下生成 secret.ts 文件，请填写里面的信息，MYSQL_CONFIG、REDIS_CONFIG、SRS_CONFIG 必填！

```bash
# 1.初始化docker容器
pnpm run docker:dev

# 2.运行（4300端口）
pnpm run dev
```

## 兼容性

- [x] iphone 14
- [x] 三星 s10
- [x] ipad air 3

## 常见问题

[https://live.hsslive.cn/about/faq](https://live.hsslive.cn/about/faq)

## 环境配置

### 本地开发环境

> 配置：MacBook Pro 2023 Apple M3 Max，14 核 CPU，36G 内存

- 操作系统：mac os 14.1
- node 版本：v18.19.0
- pnpm 版本：8.6.3
- docker 版本：24.0.5, build ced0996
- mysql 版本：基于 docker，镜像：mysql:8.0
- redis 版本：基于 docker，镜像：redis:7.0
- srs 版本：基于 docker，镜像：registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5.0.170
- ffmpeg 版本：5.1.2

### 构建/托管服务器环境

> 配置：4 核 CPU，4G 内存，8M 带宽（广州）

- 操作系统：CentOS Linux release 8.2.2004
- nginx 版本：1.22.1
- node 版本：v16.19.1
- pnpm 版本：8.6.3
- docker 版本：23.0.1, build a5ee5b1
- mysql 版本：基于 docker，镜像：mysql:8.0
- redis 版本：基于 docker，镜像：redis:7.0

### 流媒体服务器环境

> 配置：2 核 CPU，2G 内存，带宽 30M（香港）

- 操作系统：Alibaba Cloud Linux release 3 (Soaring Falcon)
- node 版本：v16.20.0
- pnpm 版本：8.6.3
- pm2 版本：5.3.0
- docker 版本：24.0.2, build cb74dfc
- srs 版本：基于 docker，镜像：registry.cn-hangzhou.aliyuncs.com/ossrs/srs:5.0.170
- ffmpeg 版本：6.0

## 致敬开源

billd-live自2023年3月开源以来，仅有作者（也就是我）一个人维护，深知做开源的难处。

如果你做过开源项目，并且单个仓库拿到 **`128+star`**，我个人认为这是非常不容易的，因为这代表了你的开源被很多人关注或认同，如果此时你正在了解直播相关方面的内容，我录制的 [**billd-live付费课**](https://www.hsslive.cn/article/151) 或许会对你有一定帮助，它将对你进行**免费**，作为我认同你在开源方面做的贡献，以及我对你力所能及的回馈，希望你能不忘初心，砥砺前行~
