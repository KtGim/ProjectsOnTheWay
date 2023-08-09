const path = require('path');
const fs = require('fs');

const inject = require('./inject');
const injectHtmlFunc = require('./injectHtmlFunc');

const pluginName = 'recordWebLog';

class RecordWebLogPlugin {
    constructor(options) {
        this.options = options;
    }
    apply (compiler) {
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            const { HtmlWebpackPlugin } = this.options;
            // 没有做文件后缀处理
            const configFile = path.resolve('weblog.js');
            if(fs.existsSync(configFile)) {
                const configOption = require(configFile);
                HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                    pluginName, 
                    (data, cb) => {
                        const jsTemplate = inject(configOption);
                        if(jsTemplate) {
                            data.html = injectHtmlFunc(jsTemplate, data.html);
                        }
                        cb(null, data)
                    }
                )
            } else {
                throw Error(`\n ===> file ${configFile} is not exist!\n`);
            }
        })
            
    }
}
  
module.exports = RecordWebLogPlugin