const {resolve} = require('path');
const fs = require('fs');
const Diff = require('diff');

const buildMdTemplate = require('./buildMdTemplate')
const { done, warn, danger } = require('./chalkLog');
const { argv } = require('argvs');

const docsRoot = resolve(__dirname, '../docs')
const tsxRoot = resolve(__dirname, '../components')

const tsxFiles = {};
const docsFiles = {};

const modifyInfo = {
  initial: {
    text: '初始化',
    log: done
  },
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
  let newFile = null;
  components.forEach((componentName) => {
    const isMdExist = fs.existsSync(resolve(docsRoot, `${componentName}/index.md`));
    const isTsxExist = fs.existsSync(resolve(docsRoot, `${componentName}/index.md`));
    const template = buildMdTemplate(componentName)
    if (type === 'initial' && !isMdExist) {
      // 初始化
      initDocs(componentName, template, type)
      collectFiles(componentName, isTsxExist, isMdExist);
    } else if (type === 'created') {
      // 创建
      initDocs(componentName, template, type)
      collectFiles(componentName, isTsxExist, isMdExist);
    } else if (isMdExist && type !== 'created' && type !== 'initial') {
      // 更新
      if (tsxFiles[componentName]) {
        newFile = fs.readFileSync(resolve(tsxRoot, `${componentName}/index.tsx`), 'utf-8');
        diffFiles(tsxFiles[componentName], newFile, initDocs(componentName, template, type));
        tsxFiles[componentName] = newFile;
      }
    }
  })
}

function collectFiles(componentName, isTsxExist, isMdExist) {
  if (!componentName) {
    return
  }
  if (!tsxFiles[componentName] && isTsxExist) {
    tsxFiles[componentName] = fs.readFileSync(resolve(tsxRoot, `${componentName}/index.tsx`), 'utf-8')
  }
  if (!docsFiles[componentName] && isMdExist) {
    docsFiles[componentName] = fs.readFileSync(resolve(docsRoot, `${componentName}/index.md`), 'utf-8')
  }
}

function diffFiles(oldFile, newFile, cb) {
  const diff = Diff.diffTrimmedLines(oldFile, newFile);

  diff.forEach((part) => {
    console.log(part, '====ppp====')
  });

  cb && cb();
}

function initDocs (componentName, template, type) {
  if (componentName && template) {
    const action = modifyInfo[type]
    const dirPath = resolve(docsRoot, `${componentName}`);
    if (type !== 'moved') {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      fs.writeFileSync(resolve(docsRoot, `${componentName}/index.md`), template, 'utf-8');
    } else {
      removeDir(dirPath);
    }
    action.log(`${componentName}文档 ${action.text} 完毕!`)
  }
}