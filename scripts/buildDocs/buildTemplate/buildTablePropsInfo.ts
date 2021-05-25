import { componentProps } from '../type';
import parseTsFile from './parseTsFile'

const buildTablePropsInfo = (tsxPath: string) => {
  const {
    propAlias,
    typeAlias
  } = parseTsFile(tsxPath);
  let propsCellsInfo = '';
  Object.keys(propAlias as componentProps).forEach(key => {
    // @ts-ignore
    const propsTypeName = propAlias[key].typeName;
     // @ts-ignore
    const desc = propAlias[key].desc;
    let propsInfos = propsTypeName;
    // @ts-ignore
    if (typeAlias.get(propAlias[key])) {
      // @ts-ignore
      propsInfos = typeAlias.get(propAlias[key])
      // @ts-ignore
      propsCellsInfo += `| ${key} | ${desc} | ${propsTypeName} (取值为: ${propsInfos.replace(/\|/g, ',')}) | - |\n`;
    } else {
      // @ts-ignore
      propsCellsInfo += `| ${key} | ${desc} | ${propsTypeName} | - |\n`;
    }
  })
  return `## 组件属性

|名称  | 描述 | 类型 |default|
|--|--|--|--|
${propsCellsInfo}`
}

export default buildTablePropsInfo;