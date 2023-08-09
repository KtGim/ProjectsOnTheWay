# plugins

- react-hot-loader: 局部刷新，不会触发react 生命周期函数，不会更改当前组件的任何状态
- webpack-dev-server: 开启node服务器，可以直接本地访问资源文件，配置参数可以设置热更新，自动刷新修改的组件。
- webpack.hotModuleReplacement: 开启局部刷新功能，不直接刷新页面

## DllPlugin 和 DllReferencePlugin

- DllPlugin 用于分离项目中的第三方文件库，DllReferencePlugin主要在主代码中饮用 DllPlugin 的第三方插件

- DllPlugin 的 webpack 线程要与 主要项目线程分开 单独运行
