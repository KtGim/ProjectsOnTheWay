/**
 * 默认配置行为属于 creams-main
 * 具体配置项逻辑内容，请根据各自业务自行修改
 */

const fs = require('fs');
const branchEnv = 'rc';

const baseUrl = `https://${branchEnv}-api.creams.io/`;

module.exports = {
  outputPath: './src/apis/tenant',
  urls: {
    [`${baseUrl}wechat/v2/api-docs?group=creams-wechat-api`]: {
      outputDirName: ''
    }
  },
  permissionConfig: {
    fetchUrl: `${baseUrl}/web/users/authorities/all`,
    outPath: './src/permission',
  },
  modulesPath: '', // 项目源码文件夹
  mockApis:[],
  port: 8000,
}