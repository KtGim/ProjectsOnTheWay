import { isRegExp } from 'util';
import { SwaggerResponse, SwaggerFetchOptions } from '../interfaces';
import { fetchSwaggerJson, writeFile, deleteModule } from '../utils';
import parseSwaggerJson from '../parseSwaggerJson';
import { Options, Url, GenMessage, Status, GenMessageWrapper, EnumTypes } from './interfaces';
import { join, basename } from 'path';
import getApiModel from './getApiModel';
import getInterfacesModel from './getInterfacesModel';

type IUrl = [string, string, SwaggerFetchOptions | undefined];

// 生成 存放 swagger model 的文件名
const interfaceModelsName = 'interfaces';

class ApiGenerator {
    private options: Options;
    private urls: IUrl[];
    private swaggerResponses: SwaggerResponse[] = [];
    private types: EnumTypes = {};

    constructor(options: Options) {
        this.options = options;
        this.urls = this.parseUrls(options.urls, options.fetchOptions);
        this.types = {};
        deleteModule(options.outputPath);
    }

    private parseUrls(urls: Url[], fetchOptions?: SwaggerFetchOptions): IUrl[] {
        return urls.map((url, index) => {
            if (typeof url === 'string') {
                return [url, `swaggerApi${index}`, fetchOptions];
            }
            return url[2] ? (url as IUrl) : [url[0], url[1], fetchOptions];
        });
    }

    /**
     * 请求 swagger 数据
     */
    async fetch() {
        const fetchApis = this.urls.map(([url, dirname, currentFetchOptions]) =>
            fetchSwaggerJson(url, currentFetchOptions)
        );
        this.swaggerResponses = await Promise.all(fetchApis);
        return this.swaggerResponses;
    }

    /**
     * 一般在等待 this.fetch 完成后再执行，否则不会生成
     * 生成接口文件
     */
    async generate() {
        const { tagAlias = {}, outputPath, include, exclude } = this.options;
        const messages: GenMessageWrapper[] = [];
        let curIndex = 0;
        for await (const swaggerResponse of this.swaggerResponses) {
            const dirname = this.urls[curIndex][1];
            const typesTemp: EnumTypes = {};
            const FileEnums: EnumTypes = {};
            const { swaggerObj, basePath, definitions } = parseSwaggerJson(swaggerResponse);
            const includeKeys = Object.keys(swaggerObj)
                .map(key => key.trim())
                .filter(key => swaggerObjFilter(key, include, exclude));
            const { apiModelPromises, globalInterfaceNamesSet } = includeKeys.reduce<{
                apiModelPromises: Promise<GenMessage>[];
                globalInterfaceNamesSet: Set<string>;
            }>(
                (target, key) => {
                    const alias = tagAlias[key];
                    const prefixDirName = dirname ? `${dirname}/${alias ? alias : key}.ts` : `${alias ? alias : key}.ts`
                    const filename = join(outputPath, prefixDirName);
                    const { content, relatedInterfaceNames } = getApiModel(
                        swaggerObj[key].paths,
                        key,
                        basePath,
                        filename,
                        this.options,
                        // this.types,
                        typesTemp,
                        FileEnums,
                        this.initRelativePath(key),
                        // this.initRelativePath(dirname ? `${dirname}/${key}` : key),
                        './'
                    );
                    target.apiModelPromises.push(genFile(filename, content));
                    relatedInterfaceNames.forEach(name => target.globalInterfaceNamesSet.add(name));
                    return target;
                },
                {
                    apiModelPromises: [],
                    globalInterfaceNamesSet: new Set<string>(),
                }
            );
            
            // swagger 所有的 定义的模型，生成到一个 interfaces 文件
            const {content: interfaceModelsContent, EnumStringsTypes} = await getInterfacesModel(
                definitions,
                [
                    ...globalInterfaceNamesSet,
                ],
                typesTemp
            );

            // const relativePath = this.initRelativePath(dirname, true);
            const interfaceImports: string = this.initInterfaceFileImports([...new Set(EnumStringsTypes)], './');

            const interfacesFilename = join(outputPath, `${dirname}/${interfaceModelsName}.ts`);
            const interfacesModelPromise = genFile(interfacesFilename, interfaceModelsContent, interfaceImports);

            const EnumTypesPromise = initEnumTypes(typesTemp, join(outputPath, dirname));
            const TypeEnumsPromise = initTypeEnums(typesTemp, join(outputPath, dirname));

            const allPromises = [...apiModelPromises, interfacesModelPromise, EnumTypesPromise, TypeEnumsPromise];
            const message = await allSettled(allPromises);
            messages.push(message);

            curIndex += 1;
        }

        return messages;
    }

    async generateFile() {
        const { outputPath } = this.options;
        const EnumTypesPromise = initEnumTypes(this.types, outputPath);
        const TypeEnumsPromise = initTypeEnums(this.types, outputPath);
        const allPromises = [EnumTypesPromise, TypeEnumsPromise];
        await allSettled(allPromises);
        // const message = await allSettled(allPromises);
        // console.log(message);
    }

    private initInterfaceFileImports = (importEnums: string[], relativePath: string) => {
        return `import {\n ${ importEnums.map(ie => ie.trim()).join(',\n ') }\n} from '${relativePath}Enum/EnumTypes';\n`
    }

    private initRelativePath = (dirname: string, init?: boolean) => {
        let relativePath = './';
        dirname && dirname.split('/').forEach((i, index) => {
            if (init) {
                relativePath += '../'
            } else if (index > 0) {
                relativePath += '../'
            }
        })
        return relativePath;
    }
}

export default ApiGenerator;

/**
 * 在 swaggerObj 中筛选出需要生成的 接口
 * @param key 当前的 tag
 * @param include 需要生成的 tag 优先级大于 exclude
 * @param exclude 不需要生成的 tag
 */
function swaggerObjFilter(key: string, include?: RegExp | string[], exclude?: RegExp | string[]) {
    const isMatch = (pattern?: RegExp | string[]) => {
        if (isRegExp(pattern)) {
            return pattern.test(key);
        }
        if (Array.isArray(pattern)) {
            return pattern.includes(key);
        }
    };
    const includeIsMatch = isMatch(include);
    if (typeof includeIsMatch === 'undefined') {
        const excludeIsMatch = isMatch(exclude);
        return typeof excludeIsMatch === 'undefined' ? true : !excludeIsMatch;
    }
    return includeIsMatch;
}

/**
 * 处理一组 Promise 不管成功失败 都返回数据
 * @param allPromises
 */
function allSettled(allPromises: Promise<GenMessage>[]): Promise<GenMessageWrapper> {
    const successMessages: GenMessage[] = [];
    const errorMessages: GenMessage[] = [];
    let count = 0;
    return new Promise(resolve => {
        allPromises.forEach(item => {
            item.then(successMessage => {
                successMessages.push(successMessage);
            })
                .catch(errMessage => {
                    errorMessages.push(errMessage);
                })
                .finally(() => {
                    count++;
                    if (count === allPromises.length) {
                        resolve({
                            successMessages,
                            errorMessages,
                        });
                    }
                });
        });
    });
}

function genFile(filename: string, content: string, imports?: string,) {
    const fileBasename = basename(filename);
    return new Promise<GenMessage>((resolve, reject) => {
        writeFile(filename, content, imports)
            .then(() => {
                resolve(getSuccessMessage(filename));
            })
            .catch(err => {
                reject(getErrorMessage(filename));
                return console.error(`Failed to store ${fileBasename}:${err.message}`);
            });
    });
}

function initEnumTypes(enumTypes: EnumTypes, outputPath: string) {
    const contents: string[] = [];
    Object.entries(enumTypes).forEach(([key, value]) => {
        contents.push(`export type ${key} = ${value};`)
    })
    return new Promise<GenMessage>((resolve, reject) => {
        writeFile(join(outputPath, './Enum/EnumTypes.ts'), contents.join('\n'))
            .then(() => {
                resolve(getSuccessMessage('./Enum/EnumTypes.ts'));
            })
            .catch(err => {
                reject(getErrorMessage('EnumTypes.ts'));
                return console.error(`Failed to store EnumTypes.ts:${err.message}`);
            });
    });
}

function initTypeEnums(enumTypes: EnumTypes, outputPath: string) {
    const contents: string[] = [];
    Object.entries(enumTypes).forEach(([key, value]) => {
        const values = value.split('|');
        const valuesMap = values.map(key => `${key.trim()} = ${key.trim()}`)
        contents.push(`export enum ${key} {\n ${valuesMap.join(',\n ')}\n};\n`)
    })
    return new Promise<GenMessage>((resolve, reject) => {
        writeFile(join(outputPath, './Enum/TypeEnums.ts'), contents.join('\n'))
            .then(() => {
                resolve(getSuccessMessage('./Enum/TypeEnums.ts'));
            })
            .catch(err => {
                reject(getErrorMessage('TypeEnums.ts'));
                return console.error(`Failed to store TypeEnums.ts:${err.message}`);
            });
    });
}

function getSuccessMessage(outputPath: string): GenMessage {
    return {
        outputPath,
        message: `${outputPath} generation succeeded`,
        status: Status.success,
    };
}

function getErrorMessage(outputPath: string): GenMessage {
    return {
        outputPath,
        message: `${outputPath} generation failed`,
        status: Status.error,
    };
}
