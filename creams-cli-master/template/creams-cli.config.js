/**
 * 默认配置行为属于 creams-main
 * 具体配置项逻辑内容，请根据各自业务自行修改
 */

const fs = require('fs');
let branchEnv = 'rc';

const creamsConfigPath = `${process.env.PWD}/creams.config.js`;

if (fs.existsSync(creamsConfigPath)) {
  const creamsConfig = require(creamsConfigPath);
  if (creamsConfig) {
    branchEnv = creamsConfig.branchEnv
  }
} else {
  console.log('配置文件: creams.config 不存在');
  process.exit(3);
}

const baseUrl = `https://${branchEnv}-api.creams.io/`;

module.exports = {
  outputPath: './services',
  urls: {
    [`${baseUrl}web/v2/api-docs?group=creams-web-api`]: {
      outputDirName: ''
    },
    [`${baseUrl}open/v2/api-docs?group=open-api-service-api`]: {
      outputDirName: 'open'
    },
  },
  permissionConfig: {
    fetchUrl: `https://${branchEnv}-api.creams.io/web/users/authorities/all`,
    outPath: './src/authorities/config',
  },
  modulesPath: './modules', // 项目源码文件夹
  mockApis:[],
  port: 8000,
}