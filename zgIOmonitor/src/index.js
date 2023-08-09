const path = require('path');
const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');
// const inject = require('./inject-tempalte-plugin/inject');
// const injectHtmlFunc = require('./inject-tempalte-plugin/injectHtmlFunc');
const schema = {
    type: 'object',
    properties: {
        // apiKey: {
        //     type: 'string'
        // },
        paramsList: {
            type: 'array'
        },
        // defaultGlobalProps: {
        //     type: 'object'
        // },
        // otherProps: {
        //     type: 'object'
        // },
        // templateUrl: {
        //     type: 'string'
        // }
    },
};

const getClickTemplate = (proName, paramsList) => `
    const zgClickFunc = (${paramsList.join(',')}, ...rest) => {
        zhuge && zhuge.track('${proName}', {
            ${paramsList.join(',')},
            ...rest
        });
    }
`;

const getParamsStr = (str, isVariable) => {
    const tempStrArr = str.trim().split(' ');
    if(!isVariable) {
        return tempStrArr.map(ts => `'${ts}'`).join(',');
    } else {
        const resultStr = [];
        const resultStrArr = [];
        tempStrArr.forEach(ts => {
            if(ts.includes('}')) {
                const s = `${ts.replace(/\${/g, '').replace(/}/g, '')}`;
                resultStr.push(s);
                resultStrArr.push(s);
            } else {
                resultStr.push(`'${ts}'`);
                resultStrArr.push(ts);
            }
        });
        return resultStr.join(',');
    }
}

// let injectedJs = false;
  
module.exports = function (source) {
    const options = this.getOptions ? this.getOptions() : getOptions(this);  // webpack5 this.getOptions, v5 getOptions(this)
    const packageJsonObj = require(path.join(process.cwd(), 'package.json'));
    validate(schema, options);
    const {
        paramsList
    } = options;

    // 静态字符串变量  zgMonitor="type name"
    const matchStr = /zgmonitor={"(.+?)"}/;             // zgmonitor={...}
    const matchStr2 = /zgmonitor="(.+?)"/;              // zgmonitor=""
    // 动态注入的变量  zgMonitor={`${type} ${name}`}
    const matchStr3 = /zgmonitor={`(.+?)`}/;            // zgmonitor=""
    const matchModuleNameStr = /export default (.+?)/;

    // 没有注入埋点直接返回资源
    if(!source.match(/zgmonitor=/)) {
        return source;
    }
    const lines = source.split('\n');
    const moduleNameMatcher = source.match(matchModuleNameStr);
    let moduleName = null;
    let contentStartIndex = -1;  // 标记正文开始的位置
    if(moduleNameMatcher) { // 匹配模块名称
        moduleName = moduleNameMatcher[1];
    }
    const newLines = [];
    const hasZgClickDefinition = false;
    lines.forEach((line, no) => {
        const matcher = line.match(matchStr) || line.match(matchStr2) || line.match(matchStr3);
        if(matcher && matcher[1]) {
            let paramsStr = matcher[1];
            const finalParamsStr = getParamsStr(paramsStr, line.match(matchStr3));
            let endStrIndex1 = line.indexOf('/>');  // 先匹配这个 防止被覆盖 
            let endStrIndex2 = line.indexOf('>');   // 后匹配这个
            let endIndex = -1;
            let endStr = '';
            if(endStrIndex1 > -1) {
                endIndex = endStrIndex1;
                endStr = '/>';
            } else if(endStrIndex2 > -1) {
                endIndex = endStrIndex2;
                endStr = '>';
            }
            line = `${endIndex > -1 ? line.slice(0, endIndex) : line} onClick={() => { zgClickFunc(${finalParamsStr}); }} ${endIndex > -1 ? endStr: ''}`;
        }
        // 找到函数定义的位置 应当 包含  函数名称 和 {   即:  App => { || XX extends Component { || function XXX() {
        // => TODO: 根据函数类型 区分 模板类型 和点击事件绑定关系
        if(contentStartIndex == -1 && line.includes(moduleName) && line.includes('{')) {
            contentStartIndex = no;
            // 暂时没有区分 函数组件 箭头组件 类组件所以使用全局方法注入
        }
        if(!hasZgClickDefinition && line.includes('const zgClickFunc = (')) {
            hasZgClickDefinition = true;
        }
        newLines.push(line);
    });
    if(!hasZgClickDefinition) { // 如果没有定义过click 事件 则在 文件中添加这个 点击 事件
        newLines.splice(contentStartIndex, 0, ...getClickTemplate(packageJsonObj.name, paramsList).split('\n'));
    }
    return newLines.join('\n');
}