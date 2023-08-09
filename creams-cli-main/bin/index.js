#!/usr/bin/env node

const {program} = require('commander');
const chalk = require('chalk');

const fs = require('fs');
const path = require('path');

program
  .description('creams-main 脚手架工具 所有命令')
  .version('1.0.0')
  .option('-mo, --mock', '创建 creams-main 的 mock数据')
  .option('-p, --permission', '生成 creams-main 权限信息')
  .option('-a, --api', '生成 creams-main 的api')
  .option('-c, --create','本地创建 creams-main 的模板')
  .option('-con, --config', '生成配置文件')
  .option('-m, --module', '生成 modules 下的项目目录')
  .option('-pa, --page', '生成页面')


program.parse(process.argv);
const rootPath = process.env.PWD;
const configPath = `${rootPath}/creams-cli.config.js`;
const hasConfig = fs.existsSync(configPath);

const options = program.opts();

if (options.config) { // 初始化配置文件
  const tempConfigFile = path.join(__dirname, '../template/creams-cli.config.js');
  const fsState = fs.statSync(tempConfigFile);
  if (fsState.isFile()) {
    readable = fs.createReadStream(tempConfigFile);
    // 创建写入流
    writable = fs.createWriteStream(configPath); 
    // 通过管道来传输流
    readable.pipe(writable);
  } else {
    console.log(chalk.red('系统配置文件不存在'))
  }
} else if (options.api) {
  checkConfig(hasConfig);
  const createApi = require('./create-api');
  createApi(rootPath, configPath);
} else if (options.permission) {
  checkConfig(hasConfig);
  const createPermission = require('./gen-per');
  createPermission(configPath);
} else if (options.module) {
  checkConfig(hasConfig);
  const createModule = require('./create-module');
  createModule(configPath);
} else if (options.mock) {
  checkConfig(hasConfig);
  const mockApi = require('./add-mocker');
  mockApi(rootPath, configPath);
} else {
  console.log(chalk.green(`请使用 ${chalk.red('creams-cli -h')} 查看具体命令`))
}

// 必须配置模板
function checkConfig(hasConfig) {
  if (!hasConfig) {
    console.log(chalk.red(`creams-cli.config.js 文件不存在，请使用 ${chalk.green('creams-cli --config')} 自动生成配置模板`))
    process.exit(3);
  }
}