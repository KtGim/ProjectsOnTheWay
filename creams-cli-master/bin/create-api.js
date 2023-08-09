const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

const {log} = console;

module.exports = function(rootPath, configPath) {
  const {ApiGenerator} = require('../lib');
  const urlObj = require(configPath);
  
  if (!urlObj.outputPath) {
    log(chalk.red(`outputPath 不存在, 请设置`));
    process.exit(3);
  }

  const outputPath = path.isAbsolute(urlObj.outputPath) ? urlObj.outputPath : path.join(rootPath, urlObj.outputPath);
  
  if (!path.isAbsolute(outputPath)) {
    log(chalk.red(`outputPath: ${outputPath} 不是正确的路径名, 请设置`));
    process.exit(3);
  }

  inquirer.registerPrompt('selectLine', require('inquirer-select-line'));
  inquirer.prompt([{
    type: 'rawlist',
    message: '生成哪个项目的 api',
    name: 'project',
    choices: ['CREAMS_MAIN', 'TENANT_H5'],
    default: 'creams-main',
  }]).then(async function(answers) {
      const projectType = answers.project;
      const hasUrls = urlObj.urls && Object.keys(urlObj.urls).length > 0;
      const urls = [];

      if (hasUrls) {
        Object.keys(urlObj.urls).forEach((key) => {
          const {
            outputDirName,
          } = urlObj.urls[key]
          urls.push([key, outputDirName]);
        })

        const urlObjArr = {
          outputPath,
          projectType,
          urls
        }

        const spinner = ora();
        spinner.color = 'yellow';
        spinner.start(`接口正在生成文档`);
        const apiGenerator = new ApiGenerator(urlObjArr);
        await apiGenerator.fetch().catch(err => {log(chalk.red(err)); process.exit(3)});
        await apiGenerator.generate().catch(err => {log(chalk.red(err)); process.exit(3)});
        // await apiGenerator.generateFile().catch(err => {log(chalk.red(err)); process.exit(3)});
        spinner.stop();
        log(chalk.green('接口文档生成完成'));
      } else {
        log(chalk.red(`未配置 请求url 参数`));
        process.exit(3);
      }
  });
}



