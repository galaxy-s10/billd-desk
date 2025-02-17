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

### 网页端发起远程控制

![https://github.com/user-attachments/assets/570ad74c-ea03-4a2f-b784-e4f9d8499cbf](https://github.com/user-attachments/assets/570ad74c-ea03-4a2f-b784-e4f9d8499cbf)

![https://github.com/user-attachments/assets/87169915-20e4-4999-ace4-2133385ceeca](https://github.com/user-attachments/assets/87169915-20e4-4999-ace4-2133385ceeca)

![https://github.com/user-attachments/assets/000e328e-a104-4f32-bd31-57ebbd805dab](https://github.com/user-attachments/assets/000e328e-a104-4f32-bd31-57ebbd805dab)

### 客户端发起远程控制

![https://github.com/user-attachments/assets/8e760673-49b5-48b1-b15b-29963880fa64](https://github.com/user-attachments/assets/8e760673-49b5-48b1-b15b-29963880fa64)

![https://github.com/user-attachments/assets/beb7d43c-5660-4185-96c8-2f2761a11413](https://github.com/user-attachments/assets/beb7d43c-5660-4185-96c8-2f2761a11413)

![https://github.com/user-attachments/assets/4cc167f5-70ac-47bc-a226-564a2f69c2f1](https://github.com/user-attachments/assets/4cc167f5-70ac-47bc-a226-564a2f69c2f1)

### 被控端

![https://github.com/user-attachments/assets/b1482a29-ca11-4ed8-b78e-49815a556bfe](https://github.com/user-attachments/assets/b1482a29-ca11-4ed8-b78e-49815a556bfe)

### 文件传输

![https://github.com/user-attachments/assets/fc9d5f94-e716-46ce-b17d-a39c394521a3](https://github.com/user-attachments/assets/fc9d5f94-e716-46ce-b17d-a39c394521a3)

## 接口文档

查看 [https://apifox.com/apidoc/shared-a8ba9715-7730-432d-896c-97f983050795](https://apifox.com/apidoc/shared-a8ba9715-7730-432d-896c-97f983050795)

## 本地启动

- [x] billd-desk(pro) 查看 [start-client.md](doc/start-client.md)

- [x] billd-desk-server(pro) 查看 [start-server.md](doc/start-server.md)

## 性能测试

查看 [benchmarking.md](doc/benchmarking.md)

## 常见问题

查看 [faq.md](doc/faq.md)

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
