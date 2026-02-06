BilldDesk Pro | [BilldDesk 开源版](./README_OpenSource.md)

<p align="center">
  <a href="https://desk.hsslive.cn" target="_blank">
    <img
      width="200"
      src="https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/icon.png"
    />
  </a>
</p>

<h1 align="center">
  BilldDesk Pro
</h1>

<p align="center">
  跨平台远程桌面控制，实现了类似 ToDesk/向日葵等远程软件的功能。
</p>

## 功能

- [x] `web网页` 控制 `电脑端`
- [x] `web网页` 控制 `安卓端`
- [x] `web网页` 控制 `web网页`（仅观看）
- [x] `电脑端` 控制 `电脑端`
- [ ] `电脑端` 控制 `安卓端`（开发中，70%）
- [x] `电脑端` 控制 `web网页`（仅观看）
- [ ] `安卓端` 控制 `电脑端`（开发中，70%）
- [ ] `安卓端` 控制 `安卓端`（开发中，70%）
- [x] `安卓端` 控制 `web网页`（仅观看）
- [x] 多台设备同时远程一台设备
- [x] 一台设备同时远程多台设备
- [x] 多屏操作
- [x] 连接鉴权
- [x] 自定义设备码/连接密码
- [x] 自定义中继服务器
- [x] 自定义接口（wss、api）
- [x] 码率/帧率/画质调整
- [x] 按键映射
- [x] 剪贴板同步
- [x] 分辨率同步
- [x] 文件传输
- [x] 开机自启（无人值守）
- [x] 锁屏保活
- [x] 屏幕墙
- [x] 快捷键/常用操作
  - [x] Ctrl+Alt+Del 
  - [x] 显示桌面
  - [x] 打开设置
  - [x] 任务视图
  - [x] 任务管理器
  - [x] 资源管理器
  - [x] 重启
  - [x] 关机
  - [x] 注销
  - [x] 锁定
- [x] 批量群控
- [x] 隐私屏
  - [x] 自定义隐私屏图片
  - [x] 自定义隐私屏文字
- [x] 虚拟屏
- [x] 扩展屏
- [x] 设备分组
- [x] 后台管理
- [x] 私有化部署
- [ ] Docker一键部署

## 跨平台支持

- [x] Windows 系统
  - [x] Windows 10、Windows 11
  - [x] Windows Server 2022
  - [ ] Windows 7 不支持
  - [ ] 其他版本未实际测试
- [x] macOS 系统
  - [x] macOS 15
  - [ ] 其他版本未实际测试
- [x] Android系统
  - [x] Android 8 至 Android 15
  - [x] Android 6、Android 7，被控时支持观看，暂不支持操作
  - [ ] 其他版本未实际测试
- [x] Web浏览器（[Chrome](https://www.google.com/intl/zh-CN/chrome/)、[Edge](https://www.microsoft.com/zh-cn/edge/download)、[Firefox](https://www.firefox.com/zh-CN/)、[Via](https://viayoo.com)、[Safari](https://www.apple.com/safari/)）
- [ ] iOS系统
- [ ] Linux 系统

## 技术架构

框架/第三方库：

- Electron
- Flutter
- Vue
- Koa2
- ...

编程语言：

- JavaScript/Typescript
- Dart
- Kotlin
- C++
- Swift
- ...

Api：

- WebRTC
- Win32
- Cocoa
- AccessibilityService
- ...

## 客户端下载

[https://desk.hsslive.cn/#/download](https://desk.hsslive.cn/#/download)

## 预览

快速体验：[https://desk.hsslive.cn](https://desk.hsslive.cn)

### web网页/电脑端控制电脑端

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/111.png?raw=true)

### web网页/电脑端控制安卓端

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/222.png?raw=true)

### web网页/电脑端控制web网页

> 仅观看模式

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/333.png?raw=true)

### web网页移动端

> 首页

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/777.png?raw=true)

> 控制页

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/888.png?raw=true)

### 屏幕墙

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/444.png?raw=true)

### 批量群控

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/b1.webp?raw=true)

### 设备分组

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/999.png?raw=true)

### 隐私屏

> 支持自定义隐私屏（图片、文字）

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/a7.png?raw=true)

### 虚拟屏

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/a8.png?raw=true)

### 鼠标、键盘仿真

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/a9.jpg?raw=true)

### 安卓端控制电脑端【TODO】

### 安卓端控制安卓端【TODO】

### 安卓端控制web网页【TODO】

> 仅观看模式

### 文件传输

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/666.png?raw=true)

### 跨平台支持

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/555.png?raw=true)

### [后台] 控制台

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/a2.png?raw=true)

### [后台] 黑名单

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/a1.png?raw=true)

### [后台] 设备分组

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/a3.png?raw=true)

### [后台] 远程管理

- 远程记录

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/a4.png?raw=true)

- 在线远程

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/a5.png?raw=true)

- 在线设备

![img](https://github.com/galaxy-s10/billd-desk/blob/main/readme_img/a6.png?raw=true)

## BilldDesk Pro免费吗？

- **免费**，你可以直接下载BilldDesk客户端，开始流畅的远程体验。
- 有付费功能（隐私屏、虚拟屏、屏幕墙、高码率/帧率/画质），如果你经常使用到BilldDesk，推荐你购买任意VIP套餐（包月6元/月、包年4.2元/月）。

## 常见问题

[https://desk.hsslive.cn/#/faq](https://desk.hsslive.cn/#/faq)

## 问题反馈

欢迎提 [issue](https://github.com/galaxy-s10/billd-desk/issues)

## 联系作者

[https://desk.hsslive.cn/#/hi](https://desk.hsslive.cn/#/hi)

## BilldDesk Pro源码

- BilldDesk开源：[源码](./README_OpenSource.md)
- BilldDesk Pro不开源，源码需要购买：[https://desk.hsslive.cn/#/price](https://desk.hsslive.cn/#/price)
