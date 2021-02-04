# Electron Splash

这是一个骨架项目，示范如何在electron项目中开发一个实时更新的Splash界面，反映后端的实时进展。这种设计在后端需要做很多准备工作的情况下特别有用。

比如我在后端是一个Spring项目，Spring启动的时候，Splash上可以实时显示Spring启动的进展，当然也显示可能发生的意外情况。

## 如何工作

本项目的原理是：

1. Electron应用启动后，一个splash专用的server会迅速启动，它是node的，负责将后端的进展通过Socket.io推送给Splash页面。当然此处我们假设这个专用server启动很快，不需要一个splash的splash。
2. Electron持续检查splash server是否已经可用。
3. Electron打开主窗口，加载Splash页面并展现，这个页面中有Socket.io的客户端，将后端推送而来的消息适当地展示在页面上。
4. Electron在启动splash server的同时（几乎同时，因为上述步骤为异步执行）启动正式server。比如作为一个子进程。该子进程的启动消息会被推送到Socket.io，比如子进程的stdout、stderr。
5. Electron持续检查一个端口，当端口可用，则认为正式server已经启动完毕，splash的使命结束。
6. Electron加载正式界面。
7. Electron终止Splash专用server。

## 如何运行

骨架项目主要不是用来直接运行的，不过可以快速看看效果 - 

`npm start`

## 如何定制

1. ./splash目录是splash页面所在的目录，其中的client是个标准的create-react-app应用，server是个标准的express应用。可以通过修改里面的逻辑来定制splash的外观。
2. ./main目录是主逻辑目录，client和server分别是主要逻辑所在，其应用类型和设计不限。现在里面是一个create-react-app的client和一个express的server，仅作为示例使用。现在主server与splash通信的方式是主server的stdout、stderr直接通过socket.io给到splash的客户端。可以定制为适合各种情况的通信方式。
3. ./electron目录，其中有electron生命周期相关逻辑。其中./electron/splash和./electron/main是启动和结束两个server的相关逻辑。
4. build目录，是打包相关逻辑。（TODO，目前里面的内容是错的，从另一个项目copy过来的。这部分还没有实现。）

## 如何打包部署

（TODO，目前./build里面的内容是错的，从另一个项目copy过来的。这部分还没有实现。）

## 何时需要这个项目？

有些项目，electron直接套壳在既有的bs架构的系统上面，打包为一个桌面应用。这些系统的server有多种，比如有java/spring的，有docker的……

后台server的启动常是个比较耗时的过程，如果后台的进展（和问题）可以展现给用户，则用户体验会好一些。

比如像：

1. https://github.com/nielinjie/electron-react-spring 
2. https://github.com/nielinjie/electron-docker-compose





