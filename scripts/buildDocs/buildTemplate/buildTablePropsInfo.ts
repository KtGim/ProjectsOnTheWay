const parseTsFile = require('../../parseTsFile');

const buildTablePropsInfo = (tsxPath: string) => {
  const {
    propAlias,
    typeAlias
  } = parseTsFile(tsxPath);

  let propsCellsInfo = '';
  Object.keys(propAlias).forEach(key => {
    // @ts-ignore
    let propsInfos = propAlias[key];
    // @ts-ignore
    if (typeAlias.get(propAlias[key])) {
      // @ts-ignore
      propsInfos = typeAlias.get(propAlias[key])
      // @ts-ignore
      propsCellsInfo += `| ${key} | - | ${propAlias[key]} (取值为: ${propsInfos.replace(/\|/g, ',')}) | - |\n`;
    } else {
      propsCellsInfo += `| ${key} | - | ${propsInfos} | - |\n`;
    }
  })
  return `## 组件属性

|名称  | 描述 | 类型 |default|
|--|--|--|--|
${propsCellsInfo}`
}

export default buildTablePropsInfo;