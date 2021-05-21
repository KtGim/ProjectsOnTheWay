import {resolve} from 'path';
import fs from 'fs';
import chalkLog from './chalkLog';

const routersRoot = resolve(__dirname, '../src/router/index.ts')

const modifyInfo = {
  created: {
    text: '创建',
    log: chalkLog.done
  },
  modified: {
    text: '更新',
    log: chalkLog.warn
  }
}

export default (template, type) => {
  if (template) {
    fs.writeFileSync(routersRoot, template, 'utf-8');
    const action = modifyInfo[type];
    action.log(`router ${action.text}完毕!`)
  }
}