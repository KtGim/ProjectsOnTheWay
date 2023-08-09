const inject = require('./inject');
const injectHtmlFunc = require('./injectHtmlFunc');
const { validate } = require('schema-utils');

const pluginName = 'parseZGTemplate';

class ParseZGTemplatePlugin {
    constructor(options) {
        const schema = {
            type: 'object',
            properties: {
                apiKey: {
                    type: 'string'
                },
                defaultGlobalProps: {
                    type: 'object'
                },
                otherProps: {
                    type: 'object'
                },
                HtmlWebpackPlugin: {
                    instanceof: 'Function'
                }
            },
        };
        validate(schema, options);
        this.options = options;
    }
    apply (compiler) {
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            const { HtmlWebpackPlugin, apiKey, defaultGlobalProps, otherProps } = this.options;
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                pluginName, 
                (data, cb) => {
                    const jsTemplate = inject(apiKey, defaultGlobalProps, otherProps);
                    data.html = injectHtmlFunc(jsTemplate, data.html);
                    cb(null, data)
                })
        })
    }
}
  
module.exports = ParseZGTemplatePlugin