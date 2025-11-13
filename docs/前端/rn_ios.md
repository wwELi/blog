# RN 0.39 xcode 启动模拟器踩坑点

## 引入本地依赖导致 导致本地模块出现 xxxx.h not found？
本地可能需要连接本地模块开发，通过本地路径林杰， 但是启动的时候报 "xxxx.h not found", 原因是 xcode 会通过header search path 查找 本地链接路径并非基于node_modules 而是 依赖所在问目录

```解决```
xcode:  查看lib 找到对应的lib  build setting ->  paths -> Header search paths 查看是否路径会执行 主项目的node_modules/react_native下

## 部分引入的lib 不支持arm 64
::: warning build 出现以下错误
Building for 'iOS-simulator', but linking in object file (/Users/wei.wang/Library/Developer/Xcode/DerivedData/OTRASTabletApp-ffxyfmpropogarcxlgenjxycruvc/Build/Products/Debug-iphonesimulator/libRNScanner.a[9] (IDCardCoreProject.o)) built for 'iOS'
:::
```解决```
build setting -> Architectures -> Excluded Architectures -> 选择 any ios or iOS-simulator SDK 值输入为arm64, 这样在选择simulator 就会多 rosetta 版本（Rosetta  是 macOS 上的 “翻译器”，它能让 Intel 架构的程序 在 ARM 芯片（Apple Silicon） 上运行）

## 常用快捷键

| 功能                     | 快捷键                       | 等同于命令
| ---------------------- | ------------------------- |--------------|
| clean            | **⌘ + ⇧ +K**             |xcodebuild clean -project ios/xxx.xcodeproj -alltargets|
| build           | **⌘ + ⇧ + R**             |xcodebuild build -project ios/xxx.xcodeproj -alltargets|
| reload js         | **⌘ + R**                 |
