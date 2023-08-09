const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const request = require('request');
const mkdirp = require('mkdirp');
const {dirname} = path;

function writeFile(path, contents) {
    return new Promise((resolve, reject) => {
        mkdirp(dirname(path), (err) => {
            if (err) return reject(err);
            fs.writeFile(path, contents, (error) => {
                if (error) reject(error);
                resolve();
            });
        });
    });
}

/**
 * 渲染 key: { desc: 'description' },
 * @param {*} key
 * @param {*} desc
 */
function renderItemString(key, desc) {
  return `    ${key}: { desc: '${desc}' },\n`;
}

/**
* 渲染 多行注释
* @param {*} comment
*/
function renderComment(comment) {
  return `\n    /**\n     * ${comment}\n     */\n`;
}

function mapPermission(permissions) {
  let subContent = '';
  if (permissions) {
      permissions.forEach(item => {
          subContent += renderItemString(item.permission, item.permissionName);
          subContent += mapPermission(item.subPermissions);
      });
  }
  return subContent;
}

/**
*
* @param {*} data 后端提供的权限数据
* @param {*}
* {
*   objName,  生成的对象变量名称
*   enumName,  导出的 enum 变量名称
*   outputPath, 生成的文件地址
*   hasEnumType, 是否导出 enum 类型
*   EnumTypeName,  导出 enum 类型 的名称
*   renderContent    内容的渲染
* }
*/
function generate({ objName, enumName, outputPath, hasEnumType, EnumTypeName, renderContent }) {
  let content = `import createEnum from '@/utils/createEnum';\n\nconst ${objName} = {\n`;
  content += renderContent(content);
  content =
      content +
      `};\n\nexport const ${enumName} = createEnum(${objName});${hasEnumType ? '' : '\n'}`;
  if (hasEnumType) {
      content = content + `\nexport type ${EnumTypeName} = typeof ${enumName}.T;\n`;
  }
  writeFile(outputPath, content);
}

module.exports = function(configPath) {

  const { permissionConfig: { fetchUrl, outPath} } = require(configPath);
  if (!fetchUrl) {
    log(chalk.red(`fetchUrl: ${fetchUrl} 不存在, 请设置`));
    process.exit(3);
  } else if (!outPath) {
    log(chalk.red(`outPath: ${outPath} 不存在, 请设置`));
    process.exit(3);
  }
  const spinner = ora();
  spinner.start('正在请求接口数据');
  request(
    {
        url: fetchUrl,
        method: 'GET',
        json: true,
    },
    function (error, response, data) {
        if (!error && response.statusCode == 200) {
            spinner.stop();
            spinner.start('正在解析接口数据');
            try {
                generate({
                    objName: 'permissionObj',
                    enumName: 'AuthEnum',
                    outputPath: `${path.join(outPath, 'AuthType.ts')}`,
                    EnumTypeName: 'AuthType',
                    hasEnumType: true,
                    renderContent: () => {
                        return data
                            .filter(module => module.permissions && module.permissions.length)
                            .map(module => {
                                return `${renderComment(module.module)}${mapPermission(
                                    module.permissions
                                )}`;
                            })
                            .join('');
                    },
                });
                generate({
                    objName: 'moduleObj',
                    enumName: 'ModuleEnum',
                    outputPath: `${path.join(outPath, 'ModuleType.ts')}`,
                    EnumTypeName: 'ModuleType',
                    hasEnumType: true,
                    renderContent: () => {
                        let contentStr = '';
                        const moduleEnums = [];
                        data.forEach(module => {
                            if (!moduleEnums.includes(module.moduleEnum)) {
                                moduleEnums.push(module.moduleEnum);
                                contentStr += renderItemString(module.moduleEnum, module.module);
                            } else {
                                console.log(
                                    `${module.moduleEnum} 重复，请联系后端检查是否存在问题`
                                );
                            }
                        });
                        return contentStr;
                    },
                });
                spinner.stop();
            } catch (e) {
                console.log(`[ERROR] ${e.message}`);
                spinner.stop();
            }
        } else {
            console.log('请求数据失败', error);
        }
    }
  );
}
