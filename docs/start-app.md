## billd-desk-flutter(pro)

## 调试

```bash
flutter pub get
```

使用 vscode 开发，用 vscode 自带的调试

## 打包

> https://docs.flutter.cn/deployment/android/#build-an-apk

### 安卓

```bash
flutter build apk --release
```

> 默认输出项项目的 build/app/outputs/flutter-apk/app-release.apk 目录

### 苹果（TODO）

```bash
flutter build ipa --release
```

### 生成 app 图标

> 生成的图标在 android/app/src/main/res/目录里

```bash
dart run flutter_launcher_icons:main
## 或者
flutter pub run flutter_launcher_icons:main
```
