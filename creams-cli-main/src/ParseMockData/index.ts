import { Methods, SwaggerResponse, Schema, Type, Paths } from '../SwaggerHelper/interfaces';
import parseSwaggerJson from '../SwaggerHelper/parseSwaggerJson';
import fetchSwaggerJson from '../SwaggerHelper/utils/fetchSwaggerJson';
import {formatPropModel, getDefinitionName} from './formatData';

type PathInfoName = 'postPaths' | 'getPaths' | 'deletePaths' | 'putPaths';
type PathResult = {
  [key: string]: any
};

interface Definitions {
  [ModelName: string]: Definition | Properties | string | null;
}

interface Properties {
  [propertyName: string]: Schema;
}

interface Definition {
  type: Type;
  title: string;
  properties: Properties;
}

class ParseMocker {

  private urls: string[];
  private definitions: Definitions;
  public getPaths: PathResult;
  public postPaths: PathResult;
  public deletePaths: PathResult;
  public putPaths: PathResult;
  private mockDataSchema: {[key: string]: any};

  constructor(urls:string[]) {
    this.urls = urls;
    this.definitions = {};
    this.getPaths = {};
    this.postPaths = {};
    this.putPaths = {};
    this.deletePaths = {};
    this.mockDataSchema = {};
  }

  async formatData() {
    const fetchData = this.urls.map((url) => {
      return fetchSwaggerJson(url).then( (res: SwaggerResponse) => {
        const parsedDataModal = parseSwaggerJson(res);
        this.definitions = {
          ...this.definitions,
          ...parsedDataModal.definitions
        }
        this.initMockPathData(parsedDataModal.paths);
      });
    });
    Promise.all(fetchData).then(res => {
      Object.keys(this.definitions).forEach(definition => {
        if (!this.definitions[definition]) {
          return
        }
        const {
          properties,
        } = this.definitions[definition] as Definition;
        if (!properties) {
          return
        }
        this.definitions[definition] = properties;
      })
      this.parseDefinition();
      // console.log(this.mockDataSchema);
    })
  }

  // 通过返回数据类型生成 mock 数据 模板
  parseDefinition() {
    Object.keys(this.definitions).forEach(defi => {
      let defiInfo = this.definitions[defi];
      const info: {[key: string]: any} = {};
      if (defiInfo) {
        Object.keys((defiInfo as Properties)).forEach((prop: string) => {
          let propInfo = defiInfo && (defiInfo as Properties)[prop];
          if (propInfo) {
            formatPropModel(info, prop, propInfo)
          }
        })
        // 定义返回体类型
        // console.log(info);
      }
      this.mockDataSchema[defi] = info;
    })
  }

  initMockPathData(paths: Paths) {
    Object.keys(paths).forEach(path => {
      Object.keys(paths[path]).forEach((methodKey) => {
        const res = paths[path]?.[methodKey as Methods]?.responses || undefined;
        
        let sca = res && res['200'] && res['200']['schema'] || null;
        if (!sca) {
          sca = res && res['201'] && res['201']['schema'] || null;
        }
        let pathResponse: string | null = null;
        if (sca) {
          pathResponse = sca['$ref'] || null
        }
        // 优化后代码： 主要将各种 方式的请求进行 分类
        // get 请求  -> getPaths  以此类推
        const pathName:PathInfoName = `${methodKey.toLowerCase()}Paths` as PathInfoName;
        const pathResponseName = pathResponse && getDefinitionName(pathResponse);
        
        // 将 url 中 所有的变量转换为 * 字符串，方便进行path 的匹配
        // ex: '/users/customers/{id}/logos'.replace(/{.*?}/gi, '.*?') => '/users/customers/.*?/logos'
        let pathReg = `^${path.replace(/{.*?}/gi, '.*?')}$`;
        
        this[pathName] = {
          ...this[pathName],
          [pathReg]: pathResponseName && this.definitions[pathResponseName]
        }
      })
    })
  }
}

export default ParseMocker;