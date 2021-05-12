<p align="center">
    <img alt="logo" src="https://i.loli.net/2021/05/12/poY8H4ReArTPNOv.png" width="120" height="120" style="margin-bottom: 10px;">
</p>

<h1 align="center">Tenant UI</h1>

<p align="center">移动端组件库(Vue)</p>

<p align="center">
    <img src="https://img.shields.io/badge/npm-v6.14.10-yellow" alt="npm version" />
    <img src="https://img.shields.io/badge/vite-v2.2.3-yellow" alt="vite version" />
    <img src="https://img.shields.io/badge/rollup-v2.46.0-yellow" alt="rollup version" />
</p>

<p align="center">
  🔥 <a href="#">文档网站</a>
</p>

---

## 特色

## 安装

```bash
npm i tenant -S
```

## 快速开始

```js
import { createApp } from 'vue';
import { Demo } from 'tenant';
import 'tenant/lib/Demo/index.css';

const app = createApp();
app.use(Demo);
```

## 按需加载

- vite

```bash
# 安装 vite 按需加载的包 vite-plugin-imp
npm i -D vite-plugin-imp

# 在 vite.config.js 中配置依赖, 注意组件名称(name)会被转换成 小写横线的形式如： HelloWorld -> hello-world 需要转换成驼峰

{
  ...
  plugins: [
    ...
    vitePluginImp({
      libList: [
        {
          libName: 'tenantui',
          style(name) {
            return `tenantui/lib/${name}/style/index.css`
          }
        },
      ]
    }),
    ...
  ]
}
```

- vue-cli

```bash
# 安装 vue-cli 按需加载的包 babel-plugin-import
npm i -D vite-plugin-imp

# 在 babel.config.js 中配置依赖, 注意组件名称(name)会被转换成 小写横线的形式如： HelloWorld -> hello-world 需要转换成驼峰

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      libraryName: 'tenant',
      libraryDirectory: 'lib',
      style: (name) => `tenant/lib/${name}/style/index.css`
    }]
  ]
}

```

## Browser Support

-

## Links

- [Documentation](https://youzan.github.io/vant)
- [Changelog](https://youzan.github.io/vant#/en-US/changelog)