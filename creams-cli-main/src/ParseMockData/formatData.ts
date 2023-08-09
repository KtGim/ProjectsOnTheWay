import { Schema } from "../SwaggerHelper/interfaces"

export const formatString = (prop: string, format?: string, enumArr?: string[]) => {
  switch (format) {
    case 'date-time':
      return {
        key: prop,
        value: new Date(),
      }
    case 'string':
    default:
      if (enumArr && enumArr.length > 0) {
        return {
          key: prop,
          value: parseInt(`${Math.random() * enumArr.length}`, 10),
        }
      } else {
        return {
          key: `${prop}|1-3`,
          value: function() {
            // 依据 ascii 吗 表生成 随机数据
            let str: string = ''
            for (let i = 0; i < 5; i++) {
              str += String.fromCharCode((parseInt(`${Math.random() * 95}`, 10) + 32))
            }
            return str;
          }(),
        }
      }
  }
}

export const formatNumber = (prop: string) => {
  return {
    key: `${prop}|0-10000000.0-2`,
    value: parseInt(`${Math.random() * 10}`, 10),
  }
}

export const formatBoolean = (prop: string) => {
  return {
    key: `${prop}|1`,
    value: true,
  }
}

export const formatFile = (prop: string) => {
  return {
    key: prop,
    value: {
      fileKey: 'fileKey',
      url: 'https://app.creams.io'
    },
  }
}

export const formatArray = (prop: string, items?: Schema) => {
  return {
    key: `${prop}|1-15`,
    type: 'ref',
    ref: getDefinitionName(items?.$ref || '')
  }
}


export function getDefinitionName(definitionPath: string) {
  const path: string = definitionPath?.split('/').reverse()[0] || '';
  if (path && path.indexOf("«") > -1 && path.indexOf("»") > -1) {
    const groups = new RegExp("«(.*?)»").exec(path)
    return (groups && groups[1]) || ''
  }
  return path
}

export function formatPropModel(info: {[key: string]: any}, prop: string, propInfo: Schema) {
  switch(propInfo.type) {
    case 'string':
      info[prop] = {
        ...info[prop],
        ...formatString(prop, propInfo.format, propInfo.enum)
      }
      break;
    case 'integer':
    case 'number':
      info[prop] = {
        ...info[prop],
        ...formatNumber(prop)
      }
      break;
    case 'boolean':
      info[prop] = {
        ...info[prop],
        ...formatBoolean(prop)
      }            
      break;
    case 'array':
      info[prop] = {
        ...info[prop],
        ...formatArray(prop, propInfo.items)
      }   
      break;
    case 'file':
      info[prop] = {
        ...info[prop],
        ...formatFile(prop)
      }   
      break;
    default:
      info[prop] = null
  }
}