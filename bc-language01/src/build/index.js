const  path = require("path");
const { readDirs }  = require('./utils/index.js');
const { processFile }  = require('./utils/fileOperation/processFile.js');
const fs = require("fs");

const bestConfigPath = 'best.js';

const buildLan = () => {
    const configPath = path.resolve(bestConfigPath);
    if(!fs.existsSync(configPath)) {
        console.log('配置文件不存在' + configPath);
        process.exit(0);
    }

    const {
        language: {
            componentPath,
            languagePath,
            lanSuffix = '.js',
            oneByOnePath
        }
    } = require(configPath);

    if(componentPath && languagePath) {
        processTotalInfo(componentPath, languagePath, lanSuffix);
    }

    oneByOnePath && oneByOnePath.forEach(({
        componentPath,
        languagePath,
        handler,
        dest
    }) => {
        processOne(componentPath, languagePath, handler, dest, lanSuffix)
    });
};

const getAbsolutePath = (pathname) => {
    return path.isAbsolute(pathname) ? pathname : path.resolve(pathname)
}

const processOne = (componentPath, languagePath, handler, dest, lanSuffix) => {
    const comPath = getAbsolutePath(componentPath);
    const lanPath = getAbsolutePath(languagePath);
    const filesInfo = {};
    const ExceptionFilesSet = new Set(); // 保存处理出异常的文件的路径
    readDirs(comPath, lanPath, comPath, '', false, filesInfo, 0, ExceptionFilesSet, handler, dest, lanSuffix);
    processFile(filesInfo);    
}

const processTotalInfo = (componentPath, languagePath, lanSuffix) => {
    const filesInfo = {};
    const pagePath = getAbsolutePath(componentPath);
    const lanPath = getAbsolutePath(languagePath); // 默认获取 目录下的映射

    const ExceptionFilesSet = new Set(); // 保存处理出异常的文件的路径
    readDirs(pagePath, lanPath, pagePath, '', false, filesInfo, 0, ExceptionFilesSet, '', '', lanSuffix);
    // console.log(filesInfo);

    processFile(filesInfo);
    // 获取相对路径
    // const cPath = path.dirname(__dirname);
    // console.log(path.relative(componentPath, cPath), componentPath);
}

buildLan();

// module.exports = buildLan