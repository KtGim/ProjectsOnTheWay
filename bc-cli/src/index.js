#!/usr/bin/env node
const { program } = require('commander');
const packageJson = require('../package.json');

const { commanders, webpackCommands } = require('../helper/const/index');
const { parseOptions } = require('../helper/parser/index');
const { buildByEnv } = require('../helper/builder/index');

const {
  description,
  version,
  name
} = packageJson;

// 获取当前执行命令的路径
const currentPath = process.cwd();

program
  .name(name)
  .description(description)
  .version(version)

program.command(`${webpackCommands.BUILD}`)
  .description('线上打包')
  .action(() => {
    buildByEnv(currentPath, webpackCommands.BUILD);
  });

program.command(`${webpackCommands.DEV}`)
  .description('开发环境打包')
  .action(() => {
    buildByEnv(currentPath, webpackCommands.DEV);
  });

program.command(`${webpackCommands.DLL}`)
  .description('打包 dll 文件')
  .action(() => {
    buildByEnv(currentPath, webpackCommands.DLL);
  });

program.command(`${webpackCommands.HOT}`)
  .description('开发环境运行')
  .action(() => {
    buildByEnv(currentPath, webpackCommands.HOT);
  });

program
  .option(`-i, --${commanders.INIT} [project name]`, '初始化项目')
  .option(`-c, --${commanders.CREATE} <page name>`, '生成页面')

program.parse(process.argv);
const options = program.opts();

// console.log(options);

parseOptions(options, currentPath);