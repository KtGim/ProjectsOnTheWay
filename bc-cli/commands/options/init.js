const fs = require('fs');
const { exit } = require('process');
const { cloneRepo, getCurrentUser } = require('../git');
const { chalkLog, colors } = require('../../helper/log/index');
const { init, collectTypes } = require('../../questions/index');


const initClone = async (param, currentPath) => {
  const { proName, proType } = await init(param);
  if(typeof param == 'boolean') {
    if(proName) {
      cloneRepoByByProName(proName, proType, currentPath);
    } else {
      chalkLog('项目名称未填写', colors.red);
      exit(0);
    }
  } else {
    if(fs.existsSync(dir)) {
      chalkLog('目录已经存在', colors.red);
    } else {
      cloneRepoByByProName(param, proType, currentPath)
    }
  }
}


const cloneRepoByByProName = (proName, proType, currentPath) => {
  const dir = `${currentPath}/${proName}`;
  const { user } = getCurrentUser();
  let repoUrl = `http://${user.name}@bitbucket.rd.800best.com/scm/wmsweb/gwmsweb.git`;
  try {
    switch (proType) {
      case collectTypes.pc:
      case collectTypes.mini:
      case collectTypes.mobile:
    }
    cloneRepo({
      repoUrl,
      currentPath,
      dirPath: dir,
      dirname: proName,
    });
  } catch(e) {
    chalkLog(`退出: ${e}`, colors.red);
    exit(0);
  }
}

module.exports = initClone;