---
name: Grids 不规则布局
route: /Grids
menu: 组件
---

import { Box } from '../comps/box';
import BasicDemo from './demo/index.tsx';
import BasicDemoCode from '!raw-loader!./demo/index.tsx';

# Grids 布局

基础的 grid 布局

## 代码演示

### 基本用法

<Box code={BasicDemoCode} title="基本用法" desc="使用kind控制Alert类型">
  <BasicDemo />
</Box>

## API

| 属性 | 说明     | 类型                                         | 默认值 |
| ---- | -------- | -------------------------------------------- | ------ |
| kind | 警告类型 | 'info'/'positive'/'negative'/'warning'非必填 | 'info' |