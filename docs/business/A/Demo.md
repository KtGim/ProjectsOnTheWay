# heading

## 简介

### 例子

``` demo
<A />
```  

```tsx
  import React from 'react';

  const A = () => {
      return (
          <div>
              AAAA
          </div>
      )
  };

  export default A;
```

### API

| 成员 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| affix | 固定模式 | boolean | true |  |
| bounds | 锚点区域边界 | number | 5 |  |
| getContainer | 指定滚动的容器 | () => HTMLElement | () => window |  |
| getCurrentAnchor | 自定义高亮的锚点 | () => string | - |  |
| offsetTop | 距离窗口顶部达到指定偏移量后触发 | number |  |  |
| showInkInFixed | `affix={false}` 时是否显示小圆点 | boolean | false |  |
| targetOffset | 锚点滚动偏移量，默认与 offsetTop 相同 | number | - |  |
| onChange | 监听锚点链接改变 | (currentActiveLink: string) => void | - |  |
| onClick | `click` 事件的 handler | function(e: Event, link: Object) | - |  |
