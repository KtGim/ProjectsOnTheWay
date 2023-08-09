# 基础api

## FileReader

- 获取上传文件的宽高

  - [fileReady地址](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)

```es6
   private _valiadImgSize = (file) => {
        if (!file) {
            return false
        }
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = function (e) {
            const data = e.target?.result;
            const img = new Image();
            img.onload = function () {
                const { width, height } = img;
            }
            img.src = data as string;
        }
        return true
    }
```
