<h1 align="center">项目简介</h1>

<p align="center">
本项目后端使用gin、gorm和ssh、sftp开发。旨在编写一个轻量，易用，多平台的运维项目。
前端使用react、typescript、vite构建。
现阶段目的是做一个阉割版的xshell并简单的实现ansible或者saltstack的部分功能。
</p>

<p align="center">
    <a href="https://github.com/lixin59/omsUI/blob/master/LICENSE">
        <img
            alt="MIT license"
            src="https://img.shields.io/npm/l/chonky?style=flat&colorB=dcd67a"
        />
    </a>
    <a href="https://github.com/lixin59/omsUI">
        <img
            alt="GitHub stars"
            src="https://img.shields.io/github/stars/lixin59/omsUI?style=flat&colorB=50f4cc"
        />
    </a>
    <a href="https://github.com/lixin59/omsUI">
        <img src="https://img.shields.io/github/last-commit/lixin59/omsUI.svg?style=flat-square">
    </a>
    <a href="https://github.com/lixin59/omsUI">
        <img src="https://img.shields.io/github/last-commit/lixin59/omsUI.svg?style=flat-square">
    </a>
    <img src="https://img.shields.io/github/commit-activity/y/lixin59/omsUI?style=flat-square">
    <br />
    <img src="https://img.shields.io/github/issues/lixin59/omsUI?style=flat-square">
    <img src="https://img.shields.io/github/issues-closed-raw/lixin59/omsUI?style=flat-square">
    <img src="https://img.shields.io/github/forks/lixin59/omsUI?style=flat-square">
    <img src="https://img.shields.io/github/watchers/lixin59/omsUI?style=flat-square">
    <br />
</p>
<p align="center">
  <a href="https://wang918562230.gitbook.io/ssbeattyoms-wen-dang/">文档</a>
  ·
  <a href="https://github.com/ssbeatty/oms/releases">下载</a>
  ·
  <a href="https://wang918562230.gitbook.io/ssbeattyoms-wen-dang/">开始使用</a>
</p>

### 目前已经实现的功能

1. 隧道, 类似`ssh`的`-L`和`-R`
2. cron 任务和长进程的管理
3. ssh 命令批量执行
4. 文件批量的上传 流式传输支持大文件
5. 基于`sftp`文件浏览器

### 查看后端代码请移步到 [oms](https://github.com/ssbeatty/oms)

### 技术交流

- QQ 群 720670808
- ![QQ群](./docs/images/qq.png)

## 安装依赖

```shell
pnpm install
```

## 1.运行

```shell
pnpm dev
```

## 2.编译

```shell
pnpm build
```
本地打包调试
```shell
pnpm build:test  && pnpm serve
```

## 3.注意

## node 版本 20.11.0 , vite 版本 5.1.X

## 开发环境调试设置

系统打包会优先使用`.env`文件里面的环境变量。
如果没有`.env`文件会使用默认的 host.
如果需要在开发环境中调试 api,在根目录下添加`.env`文件，然后添加以下内容(ip 地址和端口根据后端接口来修改).

```text
 VITE_TEST_HOST='127.0.0.1:9090'
```

## 项目预览

### 主题切换

![浅色](./docs/images/light.png)
![深色](./docs/images/dark.png)

### 主机页面

![主机页面](./docs/images/home.png)

### 分组管理

![分组管理](./docs/images/group.png)

### 任务管理

![任务管理](./docs/images/job.png)

### 上传文件

![上传文件](./docs/images/upload.png)

### web ssh

![web ssh](./docs/images/webssh.png)

### 文件浏览

![文件浏览](./docs/images/file.png)
![文件浏览](./docs/images/file1.png)

### 主机监控

![主机信息](./docs/images/hostMonitor.png)
![文件系统](./docs/images/fileSystem.png)
