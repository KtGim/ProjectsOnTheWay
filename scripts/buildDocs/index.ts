import {resolve} from 'path';
import fs from 'fs';

import { actionType, cacheFiles, transformModifyType } from './type';
import { modifyActions } from './actionsInfo';
import { removeDir } from '../utils';

import buildTemplate from './buildTemplate';

class BuildDocs {
  private type: actionType;
  private components: string[];
  private tsxFiles: cacheFiles;
  private docsFiles: cacheFiles;

  constructor(components: string[] | string, type: keyof typeof transformModifyType) {
    this.type = transformModifyType[type];
    this.components = (typeof components === 'string' && components) ? [components] : components as string[];
    this.tsxFiles = {};
    this.docsFiles = {};

    this.init();
  }

  init() {
    this.components.forEach((componentName) => {
      if (!componentName) {
        return
      }
      const {
        tsxFiles,
        docsFiles,
      } = this;

      const tsxPath = this.getTsxPath(componentName);
      const docsPath = this.getDocsPath(componentName);

      const isTsxExist = fs.existsSync(tsxPath);
      const isMdExist = fs.existsSync(docsPath);

      if (!tsxFiles[componentName] && isTsxExist) {
        this.collectTsxFiles(componentName, tsxPath)
      }
      if (!docsFiles[componentName] && isMdExist) {
        this.collectDocsFiles(componentName, docsPath)
      }
    })
  }

  getTsxPath(componentName:string) {
    return resolve(__dirname, '../../components', `${componentName}/index.tsx`)
  }

  getDocsPath(componentName:string) {
    return resolve(__dirname, '../../docs', `${componentName}/index.md`)
  }

  collectTsxFiles(componentName: string, path: string) {
    this.tsxFiles[componentName] = fs.readFileSync(path, 'utf-8');
  }

  collectDocsFiles(componentName: string, path: string) {
    try {
      this.docsFiles[componentName] = fs.readFileSync(path, 'utf-8');
    } catch(e) {
      this.docsFiles[componentName] = '';
      fs.mkdirSync(resolve(path, '..'));
    }
  }

  processDocs(componentName: string, type: keyof typeof transformModifyType) {
    let {
      components,
    } = this;

    this.type = transformModifyType[type];

    const docsPath = this.getDocsPath(componentName);
    const tsxPath = this.getTsxPath(componentName);

    if (this.type === 'CREATED') {
      // if (!components.includes(componentName)) {
        components.push(componentName);
        this.collectTsxFiles(componentName, tsxPath);
        this.collectDocsFiles(componentName, docsPath);
        buildTemplate({
          componentName,
          tsxPath,
          docsPath,
          docsFiles: this.docsFiles,
          tsxFiles: this.tsxFiles,
          type: this.type
        })
      // }
    } else if (this.type === 'MOVED') {
      components = components.filter(comp => comp !== componentName);
      removeDir(resolve(docsPath, '..'));
    } else if (this.type === 'MODIFIED') {
      buildTemplate({
        componentName,
        tsxPath,
        docsPath,
        docsFiles: this.docsFiles,
        tsxFiles: this.tsxFiles,
        type: this.type
      })
      this.collectTsxFiles(componentName, tsxPath);
      this.collectDocsFiles(componentName, docsPath);
    }

    const action = modifyActions[this.type];

    action.log(`${componentName}相关文档 ${action.text} 完成！`)
    
    
    
    // let newFile = null;
    // const isMdExist = fs.existsSync(resolve(docsRoot, `${componentName}/index.md`));
    // const isTsxExist = fs.existsSync(resolve(docsRoot, `${componentName}/index.md`));
    // this.components.forEach((componentName) => {
      
    //   const template = buildMdTemplate(componentName)
    //   if (type === 'INITIAL' && !isMdExist) {
    //     // 初始化
    //     this.initDocs(componentName)
    //     // collectFiles(componentName, isTsxExist, isMdExist);
    //   }
      // else if (type === 'created') {
        // 创建
      //   initDocs(componentName, template, type)
      //   collectFiles(componentName, isTsxExist, isMdExist);
      // } else if (isMdExist && type !== 'created' && type !== 'initial') {
        // 更新
      //   if (tsxFiles[componentName]) {
      //     newFile = fs.readFileSync(resolve(tsxRoot, `${componentName}/index.tsx`), 'utf-8');
      //     diffFiles(tsxFiles[componentName], newFile, initDocs(componentName, template, type));
      //     tsxFiles[componentName] = newFile;
      //   }
      // }
    // })
  }

  // initDocs(componentName: string) {
    // buildTemplate(componentName, this.docsRoot, this.type);
    // const {
    //   docsRoot,
    //   type
    // } = this;
    // if (componentName) {
    //   const action = modifyActions[type];
      // const dirPath = resolve(docsRoot, `${componentName}`);
      // if (type !== 'MOVED') {
      //   if (!fs.existsSync(dirPath)) {
      //     fs.mkdirSync(dirPath);
      //   }
      //   // fs.writeFileSync(resolve(docsRoot, `${componentName}/index.md`), template, 'utf-8');
      // } else {
      //   removeDir(dirPath);
      // }
    //   action.log(`${componentName}文档 ${action.text} 完毕!`)
    // }
  // }
}

export default BuildDocs;