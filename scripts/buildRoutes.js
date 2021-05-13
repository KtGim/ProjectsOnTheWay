const {resolve} = require('path');
const fs = require('fs');
const { done, warn } = require('./chalkLog');

const routersRoot = resolve(__dirname, '../src/router/index.ts')

const modifyInfo = {
  created: {
    text: '创建',
    log: done
  },
  modified: {
    text: '更新',
    log: warn
  }
}

module.exports = (template, type) => {
  if (template) {
    fs.writeFileSync(routersRoot, template, 'utf-8');
    const action = modifyInfo[type];
    action.log(`router ${action.text}完毕!`)
  }
}