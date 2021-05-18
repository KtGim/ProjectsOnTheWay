const {resolve} = require('path');
const fs = require('fs');
const buildMdTemplate = require('./buildMdTemplate')
const { done, warn, danger } = require('./chalkLog');
const { argv } = require('argvs');

const routersRoot = resolve(__dirname, '../docs')

const modifyInfo = {
  created: {
    text: '创建',
    log: done
  },
  modified: {
    text: '更新',
    log: warn
  },
  moved: {
    text: '移除',
    log: danger
  }
}

const removeDir = (path) => {
  let files = [];
  if( fs.existsSync(path) ) {
    files = fs.readdirSync(path);
    files.forEach((file) => {
      let curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) {
        removeDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

module.exports = (componentNames, type) => {
  const components = typeof componentNames === 'string' ? [componentNames] : componentNames;
  components.forEach((componentName) => {
    const template = buildMdTemplate(componentName)
    if (type === 'created') {
      initDocs(componentName, template, type)
    } else if (fs.existsSync(resolve(routersRoot, `${componentName}/index.md`)) && type !== 'created') {
      initDocs(componentName, template, type)
    }
  })
}

function initDocs (componentName, template, type) {
  if (componentName && template) {
    const action = modifyInfo[type]
    const dirPath = resolve(routersRoot, `${componentName}`);
    if (type !== 'moved') {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      fs.writeFileSync(resolve(routersRoot, `${componentName}/index.md`), template, 'utf-8');
    } else {
      removeDir(dirPath);
    }
    action.log(`${componentName}文档 ${action.text} 完毕!`)
  }
}