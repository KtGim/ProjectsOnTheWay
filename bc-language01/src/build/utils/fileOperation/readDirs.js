const fs = require('fs');
const path = require('path');
const { getDesPathInfo } = require('./processFile.js');

const getPathName = (prefix, filename) => {
    return path.resolve(prefix, filename);
}

const destAffixes = ['.js', '.jsx', '.tsx'];

/**
 * 
 * @param {string}                      componentPath       // 业务组件绝对路径
 * @param {string}                      lanPath             // 语言包绝对路径
 * @param {string}                      prefix              // 当前目录
 * @param {string}                      filename            // 当前文件
 * @param {boolean}                     defaultIndexFile    // 是否当前目录下只有这一个文件
 * @param {object}                      filesInfo           // 保存处理后的文件信息
 * @param {Set}                         exceptionFilesSet   // 处理出异常的文件
 * @param {string}                      lanAffix            // 语言包文件后缀 默认 .js
 */
const readDirs = (componentPath, lanPath, prefix, filename, defaultIndexFile, filesInfo, moduleLevel, exceptionFilesSet, handler, dest, lanAffix) => {
    const pathname = getPathName(prefix, filename);
    try {
        const fStat = fs.statSync(pathname);
        const fileAffix = path.extname(pathname);
        if(fStat.isFile()) { // App/go.sj  -> 
            // TODO 兼容器
            if(destAffixes.includes(fileAffix)) {
                filesInfo[pathname] = {
                    pathname: pathname,
                    pathPrefix: prefix,
                    ...getDesPathInfo(pathname.replace(lanAffix, ''), componentPath, lanPath,defaultIndexFile && moduleLevel > 1, handler, dest, lanAffix),
                    defaultIndexFile: defaultIndexFile && moduleLevel > 1
                }
            }
        } else if (fStat.isDirectory()) {
            const files = fs.readdirSync(pathname);
            files.forEach((pn) => {
                readDirs(componentPath, lanPath, pathname, pn, files.length > 1, filesInfo, moduleLevel + 1, exceptionFilesSet, handler, dest, lanAffix);
            });
        }
    } catch(e) {
        console.log(e, pathname);
        exceptionFilesSet.add(pathname);
    }
}

module.exports = readDirs;