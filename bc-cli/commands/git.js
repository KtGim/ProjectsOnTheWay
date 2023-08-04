const fs = require('fs');
const os = require('os');
const path = require('path');
const ini = require('ini');

const { pushd } = require('shelljs');

const { execSync } = require('../helper/const/index');
const { spinner } = require('../helper/spinner/index');

const getCurrentUser = (currentPath) => {
  // 试图获取全局环境下的 git 配置文件路径
  let configPath = path.join(os.homedir(), '.gitconfig');
  // 不存在获取当前目录下的 git 配置文件路径
  if(!configPath) {
    configPath = path.resolve(currentPath, '.git/config');
  }
  // 如果文件不存在， 获取新的配置文件路径
  if (!fs.existsSync(configPath)) {
      configPath = path.join(os.homedir(), '.config/git/config');
  }
  const fileObj = fs.readFileSync(configPath, 'utf8');
  return ini.parse(fileObj);
}

const cloneRepo = ({
    repoUrl,
    currentPath,
    dirPath,
    dirname
}) => {
    spinner.start('开始下载')
    execSync(`git clone ${repoUrl}`).then(res => {
      const oldPath = `${currentPath}/gwmsweb`;
      fs.renameSync(oldPath, dirPath);
      spinner.stop('下载成功');
      spinner.start('正在安装');
      // 可以询问是否自动安装
      spinner.color = 'green';
      pushd(dirname);
      execSync('npm i').then(() => {
        spinner.stop('安装成功');
      }, () => {
        spinner.stop('安装失败');
      }).finally(() => {});
    }, () => {
      spinner.fail(`下载失败: ${err}`);
    }).catch((err) => {
      spinner.fail(`下载失败: ${err}`);
    });
}

module.exports = {
    cloneRepo,

    execSync,
    getCurrentUser
}