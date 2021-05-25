const fs = require('fs');
const Diff = require('diff');
import buildContent from './buildContent';
import buildTablePropsInfo from './buildTablePropsInfo';
import { actionType, cacheFiles } from '../type';

const buildMdTemplate: (options: {
  componentName: string,
  tsxPath: string,
  docsPath: string,
  docsFiles: cacheFiles,
  tsxFiles: cacheFiles,
  type: actionType
}) => void = ({
    componentName,
    tsxPath,
    docsPath,
    docsFiles,
    tsxFiles,
    type
  }) => {

    if (type === 'CREATED') {
      const template = `${buildContent('Demo')}

${buildTablePropsInfo(tsxPath)}`;
      fs.writeFileSync(docsPath, template, 'utf-8');
    } else if (type === 'MODIFIED') {
     
      
      const newFile = fs.readFileSync(tsxPath, 'utf-8');
      const oldDocsFile = fs.readFileSync(docsPath, 'utf-8');

      const template = `${oldDocsFile.split('## 组件属性')[0]}${buildTablePropsInfo(tsxPath)}`;
      fs.writeFileSync(docsPath, template, 'utf-8');

      // @ts-ignore
      // diffFiles(tsxFiles[componentName], newFile);

    }
}

const diffFiles = (oldFile: string, newFile: string, cb?: Function) => {
  const diff = Diff.diffTrimmedLines(oldFile, newFile);

  diff.forEach((part: any) => {
    console.log(part)
  });

  cb && cb();
}

const createDocs = () => {

}

export default buildMdTemplate;