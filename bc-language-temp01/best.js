module.exports = {
    language: {
        // componentPath: 'C:\\Users\\BG499022\\Desktop\\bc-language\\page\\webs\\src\\page',  // 可使用行对路径或者绝对路径
        // languagePath: 'C:\\Users\\BG499022\\Desktop\\bc-language\\page\\webs\\src\\Language\\zh',
        lanSuffix: '.js', // 识别的文件后缀名称
        oneByOnePath: [  // 提供点对点的切换
            {
                componentPath: 'C:\\Users\\BG499022\\Desktop\\bc-language-temp\\src\\Common\\Login',
                languagePath: 'C:\\Users\\BG499022\\Desktop\\bc-language-temp\\src\\Lan\\zh',

                // handler 和 dest 共同存在的情况下 dest 优先执行
                // handler: 'Common',  // 目录对目录   业务文件是目录，语言包也是目录
                dest: 'Login'     // 目录对文件   业务文件是目录，语言包是文件
            }
        ]
    }
}