# [脚手架项目](https://best-inc.feishu.cn/wiki/wikcn56lwC3yqa9hf9pmPlDBzwd)

    构建百世脚手架
## 目录结构

    ```
        ├─commands              // 命令行命令执行目录
        │  └─options            // 命令行参数 具体执行方法
        ├─helper                // 辅助库
        │  ├─builder            // 构建或者打包方发目录
        │  ├─const              // 脚手架 静态变量
        │  ├─log                // 日志打印实例
        │  ├─parser             // 命令行解析实例
        │  └─spinner            // 加载实例
        ├─questions             // 交互问答
        ├─scripts               // 可执行脚本
        ├─src                   // 项目入口
        └─webpack               // webpack 公共构建配置
    ```

## 基础命令

    ```
        Usage: @best/bc-cli [options] [command]

        cli for best

        Options:
        -V, --version              版本信息
        -i, --init [project name]  初始化项目
        -c, --create <page name>   生成页面
        -h, --help                 帮助

        Commands:
        build                      线上打包
        dev                        开发环境打包
        dll                        打包 dll 文件
        hot                        开发环境运行
    ```
