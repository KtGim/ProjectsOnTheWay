const fs = require('fs');
const path = require('path');
const processLan = require('./processLan.js');

/**
 * 
 * @param {string}          pathname        // 当前文件目录路径
 * @param {string}          componentPath   // 业务组件路径
 * @param {string}          lanPath         // 语言包路径
 * @param {boolean}         isDefault       // 是否是模块默认 index.js
 * @param {string}          handler         // 修改单一的句柄
 * @param {string}          lanAffix        // 语言包文件后缀 default .js
 * @returns {object}                        // 文件语言绝对路径, 全局语言句柄 {lanPath, globalPrefix}
 */
const getDesPathInfo = (pathname, componentPath, lanPath, isDefault, handler, dest, lanAffix = '.js') => {
    let desPath = '';
    let destDirs = '';
    let destLanPath = '';
    let gp = '';
    let lanDest = '';

    if(dest) {
        destLanPath = [dest];
        gp = dest;
        lanDest = generateLanPath(lanPath, destLanPath, lanAffix);
    } else {
        desPath = pathname.replace(`${componentPath}${path.sep}`, '');
        destDirs = desPath.split(path.sep);
        destLanPath = (destDirs.length > 2 ? destDirs.slice(0, 2) : destDirs).filter(dir => dir !== 'index');
        gp = (handler ? [handler, ...destLanPath] : destLanPath).join('.');
        lanDest = generateLanPath(lanPath, destLanPath, lanAffix);
    }

    // TODO 判断文件内容
    return {
        lanPath: lanDest,
        globalPrefix: gp
    };
}

/**
 * 
 * @param {string}      lanPath   语言包总目录
 * @param {string}      destDirs  当前文件处理路径
 * @param {string}      lanAffix  文件后缀
 * 
 */
const generateLanPath = (lanPath, destDirs, lanAffix) => {
    const fileLanName = `${path.join(lanPath, destDirs.join(path.sep))}`;

    const destPaths = [
        `${fileLanName}${lanAffix}`,
        `${fileLanName}${path.sep}index${lanAffix}`
    ];

    if(fs.existsSync(destPaths[0])) {
        return destPaths[0];
    } else if(fs.existsSync(destPaths[1])) {
        return destPaths[1];
    } else {
        console.log('语言包文件不存在： ======>', fileLanName)
        return null
    }
}

/**
 * 
 * @param {文件对象信息} filesInfo
 */
const processFile = (filesInfo) => {
    Object.keys(filesInfo).forEach((key) => {
        processLan(filesInfo[key]);
    })
}

module.exports = {
    processFile,
    getDesPathInfo
}



