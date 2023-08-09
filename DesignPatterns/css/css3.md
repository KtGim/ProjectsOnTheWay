# css3

- 双飞翼布局: 主要适用于 ie 兼容性很好， html:xt 过度类型的文件类型; h5 不能使用
  - 左右中布局

```css
.left {
  float: left;
  width: 100px;
  margin-left: -100%;
}
.right {
  float: left;
  width: 100px;
  margin-left: -200px;
}
.middle {
  float: left;
  width: 100%;
}

.middle {
  margin-left: 300px;
}

.middle, .inner {
  margin-left: 300px;
}

/* 一嘴改的 */
.container {
    overflow: hidden;
}

/* 假的高度 */
.left, .right, .middle {
    padding-bottom: 9999px;
    margin-bottom: 9999px;
}
```

- h5 (移动端)全局样式，neat.css normalize.css
  - cssicon.space
  - hint.css
  - [不推荐使用 id 作为 css选择器](https://blog.csdn.net/iteye_19603/article/details/82488810)

```css
    html {
        box-sizing: border-box;
    }
    *,*:before,*:after {
        box-sizing: inherit;
    }
```