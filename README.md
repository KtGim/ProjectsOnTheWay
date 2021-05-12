<p align="center">
    <img alt="logo" src="https://i.loli.net/2021/05/12/poY8H4ReArTPNOv.png" width="120" height="120" style="margin-bottom: 10px;">
</p>

<h1 align="center">Tenant UI</h1>

<p align="center">移动端组件库(Vue)</p>

<p align="center">
    <img src="https://img.shields.io/npm/v/vant.svg?style=flat-square" alt="npm version" />
    <img src="https://img.shields.io/github/workflow/status/youzan/vant/CI/dev?style=flat-square" alt="npm version" />
    <img src="https://img.shields.io/codecov/c/github/youzan/vant/dev.svg?style=flat-square&color=#4fc08d" alt="Coverage Status" />
    <img src="https://img.shields.io/npm/dm/vant.svg?style=flat-square&color=#4fc08d" alt="downloads" />
    <img src="https://img.shields.io/jsdelivr/npm/hm/vant?style=flat-square" alt="Jsdelivr Hits">
    <img src="https://img.badgesize.io/https://unpkg.com/vant/lib/vant.min.js?compression=gzip&style=flat-square&label=gzip%20size&color=#4fc08d" alt="Gzip Size" />
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
app.use(Button);
```

## 按需加载 （vite）

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

## Browser Support

-

## Links

- [Documentation](https://youzan.github.io/vant)
- [Changelog](https://youzan.github.io/vant#/en-US/changelog)