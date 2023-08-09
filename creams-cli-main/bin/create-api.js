const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

const {log} = console;

module.exports = function(rootPath, configPath) {
  const {ApiGenerator} = require('../lib');
  const urlObj = require(configPath);
  
  if (!urlObj.outputPath) {
    log(chalk.red(`outputPath 不存在, 请设置`));
    process.exit(3);
  }

  console.log(urlObj)

  const outputPath = path.isAbsolute(urlObj.outputPath) ? urlObj.outputPath : path.join(rootPath, urlObj.outputPath);
  
  if (!path.isAbsolute(outputPath)) {
    log(chalk.red(`outputPath: ${outputPath} 不是正确的路径名, 请设置`));
    process.exit(3);
  }

  const urlObjArr = [];
  const hasUrls = urlObj.urls && Object.keys(urlObj.urls).length > 0;

  if (hasUrls) {
    Object.keys(urlObj.urls).forEach((key) => {
      const {
        outputDirName,
      } = urlObj.urls[key]
      urlObjArr.push({
        urls:[[key, outputDirName]],
        outputPath,
      })
    })
    const spinner = ora();
    urlObjArr.forEach(async (uObj) => {
      spinner.color = 'yellow';
      spinner.start(`${uObj.urls[0][0]}接口正在生成文档`);
      const apiGenerator = new ApiGenerator(uObj);
      await apiGenerator.fetch().catch(err => {log(chalk.red(err)); process.exit(3)});
      await apiGenerator.generate().catch(err => {log(chalk.red(err)); process.exit(3)});
      spinner.stop();
    })
    log(chalk.green('接口文档生成'));
  } else {
    log(chalk.red(`未配置 请求url 参数`));
    process.exit(3);
  }
}



