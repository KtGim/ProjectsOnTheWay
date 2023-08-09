#### 检测浏览器支持性
    ```
        const canvasSupport = () => {
            return !!document.createElement('canvas').getContext('2d');
        }
        // 使用
        if (!canvasSupport) {
            console.log('不支持canvas');
            return
        }
    ```
#### canvas 相对位置
    ```
        <canvas id="canvasOne" width="200px" height="200px">
            not supported
        </canvas>
        //  画布内容 相对于 canvas 容器左上角进行排布
        const canvasArea = document.getElementById('canvasOne');
        const context = canvasArea.getContext('2d');
        context.fillStyle = 'yellow';
        context.fillRect(100, 100, 200, 200);
        context.fillText('Hello Word', 150, 150);
    ```

#### api
    - globalAlpha  表示 context 对象的 透明度
    - 设置背景图片 drawImage()
    ```
        const HelloWordImage = new Image();
        HelloWordImage.src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=137628589,3436980029&fm=26&gp=0.jpg";
        context.drawImage(HelloWordImage, 0, 0);
    ```