const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const GenerateFiles = require('../lib/CopyTemplate/index');
const chalk = require('chalk');

module.exports = function(configPath) {
  inquirer.registerPrompt('selectLine', require('inquirer-select-line'));
  inquirer.prompt([{
    type: 'rawlist',
    message: '生成何种项目类型文件夹?',
    name: 'module',
    choices: ['umiModule', 'creamsModule'],
    default: 'creamsModule',
  }, {
    type: 'input',
    message: '请输入文件夹名称?',
    name: 'moduleName',
    validate: function(moduleName) {
      // Declare function as asynchronous, and save the done callback
      var done = this.async();
      if (!moduleName) {
        // Pass the return value in the done callback
        done('page名称必填');
        return;
      }
      // Pass the return value in the done callback
      done(null, true);
    },
  }]).then(function(answers) {
      const choice = answers.module;
      const {modulesPath} = require(configPath);
      const targetModulePath = path.join(process.env.PWD, `${modulesPath}/creams-${answers.moduleName}`);
      const templatePath = path.join(__dirname, `../template/${choice}`);
      const options = {
        moduleName: answers.moduleName,
        pageName: answers.moduleName,
        modelName: answers.moduleName,
      }

      if (fs.existsSync(targetModulePath)) {
        inquirer.prompt([{
          type: 'confirm',
          message: '目标目录已经存在，确认继续？',
          name: 'ok'
        }]).then(as => {
          if (as.ok) {
            runCopy(templatePath, targetModulePath, options)
          }
        }).catch(console.log)
      } else {
        runCopy(templatePath, targetModulePath, options)
      }
      //'copy'
  });
}

function runCopy(templatePath, targetModulePath, options) {
  const copy = new GenerateFiles(templatePath, targetModulePath, options);
  try {
    copy.run();
    console.log(chalk.green(`${targetModulePath} 生成完成`));
  } catch(err) {
    console.log(chalk.red(`${err} 生成失败`));
  }
}

