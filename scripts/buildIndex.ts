import {resolve} from 'path';
import fs from 'fs';
import { transformModifyType } from './buildDocs/type'

import buildCompIndexTemplate from './buildCompIndexTemplate';
import buildIndexTemplate from './buildIndexTemplate';
import buildCompIndexLessTemplate from  './buildCompIndexLessTemplate';
import chalkLog from './chalkLog';

const { done } = chalkLog;
const routersRoot = resolve(__dirname, `../components`);


const buildIndex = (componentName: string, componentNames: string[], type:  keyof typeof transformModifyType) => {
  if (type === 'created') {
    const compTemplate = buildCompIndexTemplate(componentName);
    fs.writeFileSync(resolve(routersRoot, `${componentName}/index.tsx`), compTemplate, 'utf-8');
    done(`${componentName}/index.tsx  创建完毕!`)
    const lessTemplate = buildCompIndexLessTemplate(componentName);
    fs.writeFileSync(resolve(routersRoot, `${componentName}/index.less`), lessTemplate, 'utf-8');
    done(`${componentName}/index.less  创建完毕!`)
  }

  // 修改 index.ts 文件
  const indexTemplate = buildIndexTemplate(componentNames);
  fs.writeFileSync(resolve(routersRoot, 'index.ts'), indexTemplate, 'utf-8');
  done(`components/index.ts  更新完毕!`)
}

export default buildIndex;