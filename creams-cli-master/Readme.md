# creams-cli 基础功能介绍

  主要是基于 creams-main 构建的 cli 工具，通过读取根目录下的配置文件，完成项目功能的配置。但由于公司大部分项目数据接口模型来自于 swagger 因此此项目的部分功能可以在多个项目中使用

## cli 基本命令

  ```javascript
    -V, --version     output the version number
    -mo, --mock       创建 creams-main 的 mock数据
    -p, --permission  生成 creams-main 权限信息
    -a, --api         生成 creams-main 的api
    -con, --config    生成配置文件
    -m, --module      生成 modules 下的项目目录
    -h, --help        display help for command
  ```

## 配置文件 creams-cli.config.js

- 配置项说明
  
  - outputPath: 接口输出目录，相对于根目录
  - urls: [{key: {outputDirName: string}}] swagger 接口配置, 也是 mock 模型生成的必要配置
    - key: 具体接口名称  string
      - outputDirName: 输出定义接口的目录名称
  - permissionConfig: 权限接口的 url 地址
    - fetchUrl: 接口名称
    - outPath: 输出到指定目录
  - modulesPath: 项目 pages 源码目录，用于生成目录
  - port: mock 服务器端口
  - mockApis: string[]
    - 需要代理的接口名称
  - apiPrefix: 接口的前缀  /api/property-management/property/v2/tenant-users， 微服务接口路径不一致
  - target: 接口实际请求的 url

- example

```javascript
  module.exports = {
    outputPath: './services',
    urls: {
      ['api/web/v2/api-docs?group=creams-web-api']: {
        outputDirName: ''
      },
      ['api/open/v2/api-docs?group=open-api-service-api']: {
        outputDirName: 'open'
      },
    },
    permissionConfig: {
      fetchUrl: `https://rc-api.creams.io/web/users/authorities/all`,
      outPath: path.join(__dirname, '../src/authorities/config'),
    },
    modulesPath: './modules', // 项目源码文件夹  modules
    port: 8088,
    mockApis: []
  }
```

## mock服务

  creams-cli 读取配置项目中的端口，并在该端口启动node服务。本地项目需要将 api_url 切换成 localhost: port

- example: 一下配置将会使 creams-cli 中的请求发往 locahost:8080 node 服务端口，并拦截 mockApis 中包含的接口，返回接口模型定义的 mock数据

```json
  // 本地项目 scripts 示例
  "scripts": {
    ...
    "mock": "api_url=http://localhost:8080/ login_url=https://rc-accounts.creams.io node --max_old_space_size=4000 config/webpack/webpack.dev.js"
  },
```

```javascript
  module.exports = {
    urls: [
      'https://notice-api.creams.io/property-management/v2/api-docs?group=property-management-service-api'
    ], // 需要 mock的 api 接口 链接, 也是生成 api 的链接
    ...
    mockApis:[
      '/property/v2/tenant-users' // 被拦截的 url, 将会生成 mock 数据
    ],
    apiPrefix: '/api/property-management', // 接口的前缀  /api/property-management/property/v2/tenant-users， 微服务接口路径不一致
    port: 8000,  // 启动端口 需要与 scripts.mock  中的 api_url 保持一致
    target: `https://notice-app.creams.io/`, // 接口实际请求的 url
  }
```
