# BC-Language
- 开发设计背景
https://best-inc.feishu.cn/wiki/wikcnC9Sy6DS3QzROLH5Z2zxJSc
## 使用

- 因为各个项目中的 babel 与 工具的版本不同，所以要求编译时使用语言工具自带的 编译项目，将需要编译的文件目录拷贝到项目中，进行编译
- 编译项目 地址 http://bitbucket.rd.800best.com/projects/WMSWEB/repos/bc-language-temp/browse
```
    1. git clone 编译项目

    2. 进入 bc-language-temp  npm i

    3. 将业务文件 拷贝进入 bc-language-temp

    4. 执行命令
        i: lan 业务文件地址  语言包目录地址;  编译业务文件整个目录；
            例子： lan page\webs\src\page  page\webs\src\Language\zh
            编译业务文件 
        ii lan 业务文件具体文件地址  语言包目录地址  具体文件目录
            例子： lan page\webs\src\page\Common  page\webs\src\Language\zh  Common
            window.language.Common[xxx]
    5. windows 下 如果发现无法执行 再运行一下 npm link;尝试之后，看是否需要再做以下设置  [无法识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次](https://www.jianshu.com/p/d021ccf88981)
```

## plugin 的使用

    - 主要是用与在页面上提供语言切换的 select 框
    - 使用方式
    ```
        const InjectLanguagePlugin = require('@best/bc-language/lib/inject-language-plugin/index.js');
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        // webpack.config.js

        ...
        plugins: [
            ...,
            new InjectLanguagePlugin({
                containerKey: '#country-selector',    // css 选择器，需要注意唯一性，此处是 demo,会将下拉切换框挂在上去
                HtmlWebpackPlugin,                    // 使用  HtmlWebpackPlugin 在编译时将js 注入到 html 种
                languageKeyInfo: {
                    cn: {
                        key: 'cn',                    // 切换时会将这个值回填回去
                        name: '中文'                   // 下拉列表展示的名称
                    },
                    us: {
                        key: 'us',
                        name: '英文'
                    }
                }
            })
        ]
        ...


        // app.js 在 app 种监听切换事件
        ...
        
        const [globalKey, setGlobalTextKey] = useState(0);
        useEffect(() => {
            window.addEventListener('best_country_selector', ({detail}) => {
                const lanKey = detail.value;
                const lan = require(`../../Lan/${lanKey}`);
                window.language = lan;
                setGlobalTextKey(lanKey);
            });
        }, []);
        ...

        return (
            <div key={globalKey}>
                ...
            </div>
        )
    ```