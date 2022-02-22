/**
 * 定义的节点新获取比较复杂 后续更新
 */

import parseTsFile from "./parseTsFile";

import {log} from 'console';

const args =  process.argv;

const fromPath = args[2];
const toPath = args[3];
let errorInfo = [];
if(!fromPath) {
    errorInfo.push('需要提供一个来源文件路径，以便我们们对文档进行解析！')
}
if(!toPath) {
    errorInfo.push('需要提供一个目标文件路径，以便我们将解析后的文档输入进文件！')
}

if(errorInfo.length) {
    log('#######################\n');
    log(errorInfo.join('\n'));
    log('\n#######################\n');
    process.exit();
}

const {
    propAlias,
    typeAlias
} = parseTsFile(fromPath);

console.log(propAlias, typeAlias);
