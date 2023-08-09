const pluginName = 'injectLanguagePlugin';
const { injectCommon, injectLink } = require('./inject');
const { flagIconsLinkTemplate, initBestCountrySelectorJsTemplate, styleTemplate } = require('./templates');

class InjectLanguagePlugin {
    /**
     * 
     * @param {
     * containerKey
     * HtmlWebpackPlugin
     * languageKeyInfo
     * localLanKey
     * } options
     */
    constructor(options) {
        this.options = options;
    }
    apply (compiler) {
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            const { HtmlWebpackPlugin, languageKeyInfo, containerKey, localLanKey } = this.options;
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                pluginName, 
                (data, cb) => {
                    const jsTemplate = initBestCountrySelectorJsTemplate(languageKeyInfo, containerKey, localLanKey);
                    let template = data.html;
                    template = injectCommon(jsTemplate, template);
                    template = injectCommon(styleTemplate, template);
                    template = injectLink(flagIconsLinkTemplate, template);
                    data.html = template;
                    cb(null, data)
                })
        })
    }
}
  
module.exports = InjectLanguagePlugin;