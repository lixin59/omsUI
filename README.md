## 项目简介
本项目使用gin、gorm和ssh、sftp开发。旨在编写一个轻量，易用，多平台的运维项目。

现阶段目的是做一个阉割版的xshell并简单的实现ansible或者saltstack的部分功能。
### 查看后端代码请移步到 [oms](https://github.com/ssbeatty/oms)

# 安装依赖
```shell
npm install
```
或者
```shell
yarn add
```

# 1.运行 
```shell
npm run dev
```
```shell
yarn dev
```
# 2.编译
```shell
npm run build
```
```shell
yarn build
```

# 3.注意 
## node 版本 14.17.1 , vite 版本 2.6.14

## 开发环境调试设置

如果需要在开发环境中调试api,在根目录下添加```.env```文件，然后添加以下内容
```text
 # 修改这个host即可。这个主要用于调试后端接口，系统打包会先使用这个环境变量。
 # 如果没有.env文件会使用默认的host
 VITE_TEST_HOST='127.0.0.1:9090'
```
