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
 基于Vue3 + WebRTC + Nodejs + Electron搭建的远程桌面控制
</p>

<div align="center">

![stars](https://img.shields.io/github/stars/galaxy-s10/billd-desk)
![forks](https://img.shields.io/github/forks/galaxy-s10/billd-desk)

![version](https://img.shields.io/github/package-json/v/galaxy-s10/billd-desk)
![License](https://img.shields.io/github/license/galaxy-s10/billd-desk)
![language](https://img.shields.io/github/languages/top/galaxy-s10/billd-desk)
![language](https://img.shields.io/github/languages/top/galaxy-s10/billd-desk-server)
![language](https://img.shields.io/github/languages/top/galaxy-s10/billd-desk-flutter)

</div>

## 简介

BilldDesk 远程桌面控制，目前实现了类似 ToDesk、向日葵等远程桌面的功能。

## 对比ToDesk免费个人版

> 作者使用过很多远程软件：TeamViewer、向日葵、ToTesk、AnyDesk、RustDesk、UU远程、连连控，还有qq自带的远程协助等等，但用ToDesk免费个人版比较多，因此用ToTesk和BilldDesk作对比~

|                           | BilldDesk      | ToDesk免费个人版                                       |
| ------------------------- | -------------- | ------------------------------------------------------ |
| 连接限制                  | 无限制，免费   | 80h/月，200次/月，24h/次，超出需要购买专业版（¥24/月） |
| 画质限制                  | 无限制，免费   | 最高1080p，30帧                                        |
| 安卓被控                  | 支持，免费     | 不支持，需要购买专业版（¥24/月）或购买插件（¥15/月）   |
| 同时显示多屏              | 支持，免费     | 不支持，需要购买性能版（¥95/月）                       |
| 屏幕墙                    | 支持，免费     | 不支持，需要购买ToDesk企业版（¥805/年）                |
| 远程时录屏                | 支持，免费     | 不支持                                                 |
| web网页发起远程控制       | 支持，免费     | 不支持，需要购买ToDesk企业版（¥805/年）                |
| 远程控制web网页（仅观看） | 支持，免费     | 不支持                                                 |
| 同账号多主控同时发起远控  | 支持，免费     | 支持，需要购买插件（¥233/月）                          |
| 私有化部署/二次开发       | 支持，开源免费 | 不支持，需要ToDesk企业版，定价未知                     |

## 生态

| 项目名称            | 代码仓库                                                               | star & fork                                                                                                                                                                                                                                                                                                     | 线上地址/下载地址                                                        |
| ------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 远程桌面网页/客户端 | [billd-desk](https://github.com/galaxy-s10/billd-desk)                 | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk)                                 | [https://desk.hsslive.cn](https://desk.hsslive.cn)                       |
| 远程桌面后台        | [billd-desk-admin](https://github.com/galaxy-s10/billd-desk-admin)     | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk-admin?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk-admin?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-admin)               | [https://desk-admin.hsslive.cn](https://desk-admin.hsslive.cn)           |
| 远程桌面移动端      | [billd-desk-flutter](https://github.com/galaxy-s10/billd-desk-flutter) | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk-flutter?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-flutter) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk-flutter?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-flutter) | [https://desk.hsslive.cn/#/download](https://desk.hsslive.cn/#/download) |
| 远程桌面服务端      | [billd-desk-server](https://github.com/galaxy-s10/billd-desk-server)   | [![github](https://img.shields.io/github/stars/galaxy-s10/billd-desk-server?label=star&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-server) [![github](https://img.shields.io/github/forks/galaxy-s10/billd-desk-server?label=fork&logo=GitHub)](https://github.com/galaxy-s10/billd-desk-server)     | [https://desk-api.hsslive.cn](https://desk-api.hsslive.cn)               |

## 功能

- [x] `web网页` 控制 `电脑端`
- [x] `web网页` 控制 `安卓端`
- [x] `web网页` 控制 `web网页`（仅观看）
- [x] `电脑端` 控制 `电脑端`
- [x] `电脑端` 控制 `安卓端`
- [x] `电脑端` 控制 `web网页`（仅观看）
- [ ] `安卓端` 控制 `电脑端`
- [ ] `安卓端` 控制 `安卓端`
- [ ] `安卓端` 控制 `web网页`（仅观看）
- [x] 多台设备同时远程一台设备
- [x] 一台设备同时远程多台设备
- [x] 多屏操作
- [x] 连接鉴权
- [x] 自定义设备码/连接密码
- [x] 自定义接口（wws/api/中继服务器）
- [x] 按键组合键
- [x] 文件传输
- [x] 开机自启
- [x] 锁屏保活
- [x] 屏幕墙
- [x] 支持 macOS 系统
- [x] 支持 Windows 系统
- [x] 支持 Linux 系统（未实际测试）
- [x] 支持 安卓端（Flutter）
- [ ] 支持 苹果端（Flutter）
- [ ] 后台管理
- [ ] Docker一键部署
- [x] 支持私有化部署

> 更多功能请查看：[features.md](docs/features.md)

## 预览

快速体验：[https://desk.hsslive.cn](https://desk.hsslive.cn)

### web网页/电脑端控制电脑端

![img](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/111.png?raw=true)

### web网页/电脑端控制安卓端

![img](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/222.png?raw=true)

### web网页/电脑端控制web网页

> 仅观看模式

![img](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/333.png?raw=true)

### web网页移动端

> 首页

![img](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/777.png?raw=true)

> 控制页

![img](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/888.png?raw=true)

### 屏幕墙

![img](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/444.png?raw=true)

### 安卓端控制电脑端【TODO】

### 安卓端控制安卓端【TODO】

### 安卓端控制web网页【TODO】

> 仅观看模式

### 文件传输

![img](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/666.png?raw=true)

### 跨平台支持

![img](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/555.png?raw=true)

## 技术栈

### 总览

- 前端相关：[Vue3](https://vuejs.org) 以及相关技术栈、`WebRTC`
- 后端相关：[Nodejs](https://nodejs.org) 以及相关技术栈、`Koa2`、`Sequelize`、`Mysql`、`Redis`、`Socket.io`
- 桌面客户端相关：[Electron](https://www.electronjs.org) 以及相关技术栈、`WebRTC`
- 移动客户端相关：[Flutter3](https://flutter.dev) 以及相关技术栈、`WebRTC`
- Docker 相关：[Docker](https://www.docker.com)
- 部署相关：[阿里云云效](https://devops.aliyun.com)、[billd-deploy](https://github.com/galaxy-s10/billd-deploy)

### 编程语言

- JavaScript/Typescript
- Dart
- Kotlin
- C++

## 本地启动

> https://desk.hsslive.cn/s/qk

- [x] billd-desk(pro) 查看 [start-client.md](docs/start-client.md)

- [x] billd-desk-server(pro) 查看 [start-server.md](docs/start-server.md)

- [x] billd-desk-fultter(pro) 查看 [start-app.md](docs/start-app.md)

## 接口文档

查看 [apifox](https://apifox.com/apidoc/shared-a8ba9715-7730-432d-896c-97f983050795)

## 性能测试

查看 [benchmarking.md](docs/benchmarking.md)

## 常见问题

查看 [faq.md](docs/faq.md)

## 问题反馈

欢迎提 [issue](https://github.com/galaxy-s10/billd-desk/issues)

## 参与贡献

欢迎提 [pr](https://github.com/galaxy-s10/billd-desk/pulls)

## 私有化部署

billd-desk完全开源（可商用），欢迎部署！

## 客户端下载

> https://desk.hsslive.cn/s/bd2
>
> 备用链接：https://pan.baidu.com/s/1MRTeS47wsV70BQe4bxDqSQ?pwd=qx8j

## 官方交流群

- qq群：957845615

- 微信4群（未满200人）
  ![wechat_group4-1](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/wechat_group4-1.jpg?raw=true)

- 微信3群（已满200人）
  ![wechat_group3-1](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/wechat_group3-1.jpg?raw=true)

- 微信2群（已满200人）
  ![wechat_group2](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/wechat_group2.jpg?raw=true)

- 微信1群（已满200人）
  ![wechat_group1](https://github.com/galaxy-s10/billd-desk/blob/main/src/assets/readme_img/wechat_group1.jpg?raw=true)

## 多平台支持

- [x] Web网页（建议使用：[Chrome浏览器](https://www.google.com/intl/zh-CN/chrome/) / [Via浏览器](https://viayoo.com) / `Safari浏览器`）
- [ ] Windows 7（[再见，Windows 7/8/8.1](https://www.electronjs.org/zh/blog/windows-7-to-8-1-deprecation-notice)）
- [x] Windows 10、Windows 11
- [x] macOS
- [x] Linux
- [x] Android 11 至 Android 15，其他安卓版本的未实际测试
- [ ] iOS

## 贡献者

  <a href="https://github.com/galaxy-s10/billd-desk/graphs/contributors" target="_blank">
    <img
      width="200"
      src="https://contrib.rocks/image?repo=galaxy-s10/billd-desk"
      alt="BilldDesk logo"
    />
  </a>

## 初心

该项目初心只是作为[billd-live](https://github.com/galaxy-s10/billd-live)的衍生项目，但后面觉得远程桌面也挺有意思的，就一直坚持完善下去。

## 愿景

各大远程软件虽然免费都能用，但免费版的功能覆盖不够全面，比如有些普通个人用户可能只是临时需要远程一下安卓手机，但却需要开通一个月的服务才可以。BilldDesk完善了这些基本功能，让普通用户也能用上~
