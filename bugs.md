# 记录搭建项目过程中遇到的问题及解决方式

## 组件库使用时，react 版本和宿主项目 react 版本不一致，导致报错

- [官方描述]https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react

- 解决思路： 本地测试时使用宿主项目环境中的 react 版本 （直接找到宿主环境的本地路径，使用 npm link 软连接到 组件库即可），然后重新 build 就可以使用

    - npm link ..\..\gwms\node_modules\react  (相对组件库地址的宿主环境 react 目录)
