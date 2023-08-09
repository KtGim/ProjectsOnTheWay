# antd 按需加载，实现原理

## webpack externals 用法

## tree shaking 原理

- 基于 ES6 的静态引用，tree shaking 通过扫描所有 ES6 的 export，找出被 import 的内容并添加到最终代码中。 webpack 的实现是把所有 import 标记为有使用/无使用两种，在后续压缩时进行区别处理。
- 所有 import 标记为 /*harmony import*/
- 被使用过的 export 标记为 /*harmony export ([type])*/，其中 [type] 和 webpack 内部有关，可能是 binding, immutable 等等。
- 没被使用过的 import 标记为 /*unused harmony export [FuncName]*/，其中 [FuncName] 为 export 的方法名称
- webpack tree shaking 只处理顶层内容，例如类和对象内部都不会再被分别处理
- concatenateModule webpack 默认配置，将所有 js 打入到同一个闭包

## plugin

- compiler:
  - 在 webpack 启动时，一次性创建，包含整个webpack的配置，在webpack中应用插件时，插件可以接受到 compiler。引用
- compilation
  - 代表了一次资源的构建，每次检测到文件改动时就会生成新的 compilation 队像，该对象包含了当前资源的打包信息（模块资源、编译生成资源、变化的文件、以及被跟踪依赖）

## 多入口文件，编译

## [package.json字段说明](https://docs.npmjs.com/files/package.json)
