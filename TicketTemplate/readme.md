# WEB 打印模板

## 需求和设计文档
- https://best-inc.feishu.cn/wiki/wikcnclHHOC8v4udUFIEmxM73Kd

## 如何使用
- https://best-inc.feishu.cn/wiki/V6rUwQ8Znieq9pkcIt2c9QXMn2e  (PI)
- https://best-inc.feishu.cn/wiki/UaA9wwNJtiONiqkiCt3cFBbZnbb  (DEV)

## 开发文档
- https://best-inc.feishu.cn/wiki/QJ3Ewi1a2ibkYWkGziEc4GI2nLe

## 第三方依赖
- qrcode.react
- react-barcode
- html2canvas

## 为什么大量使用 ref 和 this.state.xxx
- 可以快速定位到元素，给属性赋值
- 不会触发 react 渲染机制，导致页面太卡
- 合适的时机还是需要通过 this.setState 来同步数据
- 可以通过 ref 拿到自定义组件的内部封装的方法


## 水平垂直文本样式
```
    display: table-cell;
    vertical-align: middle;
```
    