const fs = require('fs');
const babel = require("@babel/core");
const t = require("@babel/types");

// 保存 值 为 undefined 字段信息
const undefinedCharInfo = {

};

const splitChar = '\r\n';
const trimTag = /\s+/g;

module.exports = ({
    pathname,
    // pathPrefix,
    lanPath,
    globalPrefix
}) => {
    // console.log(lanPath, pathname);
    if(!lanPath) return;
    const exists = fs.existsSync(lanPath);
    if(exists) {
        const lan = require(lanPath).default;
        console.log('开始替换文件内容： ======>', pathname, lanPath);
        const valueKeyLanObj = Object.keys(lan).reduce((pre, next) => {
            return {
                ...pre,
                [lan[next]]: `window.language.${globalPrefix}.${next}`
            }
        }, {});
        try {
            const contentString = fs.readFileSync(pathname, 'utf-8');
            // processByString(valueKeyLanObj, contentString, pathname);
            processByBabel(valueKeyLanObj, contentString, pathname);
        } catch(e) {
            console.log(e);
        }
    } else {
        console.log('语言包文件不存在： ======>', lanPath)
    }
}

const processByString = (valueKeyLanObj, bytes, pathname) => {
    const lines = bytes.split(splitChar);
    // console.log(lines, valueKeyLanObj);
    const strMap = new Map(); // 保存单一文件下相同中文
    const newLines = [];
    lines.forEach(line => {
        if(line) {
            let str = '';
            let len = line.length;
            let i = 0;
            let cLine = line;
            /**
             * 遍历这一行知道结束
             * 每次遇到汉字就拼接起来，知道下一个不是汉子时，停止拼接，重置 str
             */
            while(i < len) {
                if(line.charCodeAt(i) > 255) {
                    str += line[i];
                } else {
                    if(str) {
                        // 这一个字节不是汉字 结束拼接并且记录汉字信息
                        strMap.set(str, {
                            prefix: valueKeyLanObj[str]
                        });
                        // console.log(valueKeyLanObj[str], str, pathname);
                        if(!valueKeyLanObj[str]) {
                            undefinedCharInfo[pathname] = {
                                ...(undefinedCharInfo[pathname] || {}),
                                char: str
                            }
                        } else {
                            cLine = cLine.replace(str, `{${valueKeyLanObj[str]}}`);
                        }
                        // 替换完之后清空 str
                        str = '';
                    }
                }
                i ++;
            }
            // 换行的字符串

            newLines.push(cLine);
        } else {
            newLines.push(line);
        }
    })

    // console.log(newLines.join(splitChar));
    fs.writeFileSync(pathname, newLines.join(splitChar));
}

const getTextContent = (text) => {
    if(text && typeof text == 'string') {
        return {
            allStr: text.replace(trimTag,''),
            strWithSpace: text.trim()
        };
    } else {
        return {
            allStr: '',
            strWithSpace: ''
        };
    }
}

const processByBabel = (valueKeyLanObj, contentString, pathname) => {
    // console.log(valueKeyLanObj);
    // console.log(pathname);
    const ast =  babel.parseSync(contentString,{
        filename: pathname,
        sourceType: "module",
        presets: [
            '@babel/preset-env',
            '@babel/preset-react'
        ],
        plugins: [
            ['@babel/plugin-transform-runtime', { corejs: 3, helpers: true, regenerator: true }],
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-transform-react-jsx-compat']
        ]
    });

    babel.traverse(ast, {
        TemplateElement(path) {
            const key = path.node.value.raw;
            const {
                allStr,
                strWithSpace
            } = getTextContent(key);
            const hasText = allStr || strWithSpace;
            const value_key = valueKeyLanObj[allStr] || valueKeyLanObj[strWithSpace];
            if(hasText && value_key) {
                const { expressions, quasis } = path.parentPath.node;
                // console.log(path.parentPath.node);
                const index = quasis.findIndex(node => {
                    return node.value && (node.value.raw == allStr || node.value.raw == strWithSpace)
                });
                const expressions_new_node = t.identifier(value_key);
                if(index == 0) {
                    expressions.unshift(expressions_new_node);
                } else {
                    expressions.push(expressions_new_node);
                }
                quasis.splice(index, 1, t.templateElement({ raw: '', cooked: ''}));
                quasis.forEach(qa =>{
                    qa.tail = false;
                });
                quasis.push(t.templateElement({ raw: '', cooked: ''}, true));
                // console.log(quasis, expressions);
                const new_node = t.templateLiteral(quasis, expressions);
                // console.log(new_node);
                path.parentPath.replaceWith(new_node);
            }
        },
        Literal(path) {
            const key = path.node.value;
            const {
                allStr,
                strWithSpace
            } = getTextContent(key);
            const hasText = allStr || strWithSpace;
            // types.jsxExpressionContainer(types.identifier('props.name'))
            // 改变 type 类型
            const value_key = valueKeyLanObj[allStr] || valueKeyLanObj[strWithSpace];
            if(hasText && value_key) {
                // console.log(path.parentPath.node.type);
                const parentType = path.parentPath.node.type;
                let name = '';
                // console.log(parentType, value_key);
                switch(parentType) {
                    case 'JSXAttribute':
                        name = path.parent.name && path.parent.name.name;
                        if(name && typeof name == 'string') {
                            path.parentPath.replaceWith(t.jsxAttribute(t.jSXIdentifier(name), t.jSXExpressionContainer(t.identifier(value_key))));
                        }
                        break;
                    case 'VariableDeclarator':
                    //     name = path.parent.id && path.parent.id.name;
                    //     if(name) {
                    //         path.parentPath.parentPath.replaceWith(t.variableDeclaration(path.parentPath.parentPath.node.kind, [t.variableDeclarator(t.identifier(name), t.identifier(value_key))]));
                    //     }
                    //     break;
                    case 'ObjectProperty':
                    //     const { method, key: {name: ne, value: va}} = path.parentPath.node;
                    //     if(!method && (ne || va)) { // 不是函数属性
                    //         // console.log(path.parentPath.node)
                    //         const new_node = t.objectProperty(t.identifier(ne || va), t.identifier(value_key));
                    //         path.parentPath.replaceWith(new_node);
                    //     }
                    //     break;
                    case 'CallExpression':
                    //     {
                    //         const {callee: { name: cName }, arguments: args} = path.parentPath.node;
                    //         const argsList = [];
                    //         args.forEach(argNode => {
                    //             const {
                    //                 allStr,
                    //                 strWithSpace
                    //             } = getTextContent(argNode.value);
                    //             const arg_node_text = valueKeyLanObj[allStr] || valueKeyLanObj[strWithSpace];
                    //             if(arg_node_text) {
                    //                 argsList.push(arg_node_text);
                    //             }
                    //         });
                    //         // console.log(argsList);
                    //         if(!cName) {
                    //             path.replaceWith(t.identifier(value_key))
                    //         }
                    //         if(argsList.length && cName) {
                    //             const new_node = t.callExpression(t.identifier(cName), argsList.map(argName => t.identifier(argName)));
                    //             path.parentPath.replaceWith(new_node);
                    //         }
                    //     }
                    //     break;
                    case 'NewExpression':
                    //     {
                    //         // console.log(path.parentPath.node);
                    //         const {callee: { name: cName }, arguments: args} = path.parentPath.node;
                    //         const argsList = [];
                    //         args.forEach(argNode => {
                    //             const {
                    //                 allStr,
                    //                 strWithSpace
                    //             } = getTextContent(argNode.value);
                    //             const arg_node_text = valueKeyLanObj[allStr] || valueKeyLanObj[strWithSpace];
                    //             if(arg_node_text) {
                    //                 argsList.push(arg_node_text);
                    //             }
                    //         });
                    //         // console.log(argsList);
                    //         if(argsList.length) {
                    //             const new_node = t.callExpression(t.identifier(cName), argsList.map(argName => t.identifier(argName)));
                    //             path.parentPath.replaceWith(new_node);
                    //         }
                    //     }
                    //     break;
                    case 'ConditionalExpression':
                        // {
                        //     const { test, consequent, alternate } = path.parentPath.node;
                        //     const consequentTxtObj = getTextContent(consequent.value);
                        //     const alternateTxtObj = getTextContent(alternate.value);
                        //     const consequentTxt = valueKeyLanObj[consequentTxtObj.allStr] || valueKeyLanObj[consequentTxtObj.strWithSpace];
                        //     const alternateTxt = valueKeyLanObj[alternateTxtObj.allStr] || valueKeyLanObj[alternateTxtObj.strWithSpace];
                        //     let new_node = null;
                        //     if(consequentTxt) {
                        //         new_node = t.conditionalExpression(test, t.identifier(consequentTxt), alternate);
                        //     } else if(alternateTxt) {
                        //         new_node = t.conditionalExpression(test, consequent, t.identifier(alternateTxt));
                        //     } else if(consequentTxt && alternateTxt) {
                        //         new_node = t.conditionalExpression(test, t.identifier(consequentTxt), t.identifier(alternateTxt));
                        //     }
                        //     new_node && path.parentPath.replaceWith(new_node);
                        // }
                        // path.replaceWith(t.identifier(value_key));
                        // break;
                    case 'BinaryExpression':
                        // {
                        //     const { left, right, operator } = path.parentPath.node;
                        //     const leftTxtObj = getTextContent(left.value);
                        //     const rightTxtObj = getTextContent(right.value);
                        //     const leftTxt = valueKeyLanObj[leftTxtObj.allStr] || valueKeyLanObj[leftTxtObj.strWithSpace];
                        //     const rightTxt = valueKeyLanObj[rightTxtObj.allStr] || valueKeyLanObj[rightTxtObj.strWithSpace];
                        //     let new_node = null;
                        //     if(leftTxt) {
                        //         new_node = t.binaryExpression(operator, t.identifier(leftTxt), right);
                        //     } else if(rightTxt) {
                        //         new_node = t.binaryExpression(operator, left, t.identifier(rightTxt));
                        //     } else if(rightTxt && leftTxt) {
                        //         new_node = t.binaryExpression(operator, t.identifier(leftTxt), t.identifier(rightTxt));
                        //     }
                        //     new_node && path.parentPath.replaceWith(new_node);
                        // }
                        // path.replaceWith(t.identifier(value_key));
                        // break;
                    case 'LogicalExpression':
                    default:
                        path.replaceWith(t.identifier(value_key));
                }
            }
        },
        JSXText(path) {
            const key = path.node.value;
            const {
                allStr,
                strWithSpace
            } = getTextContent(key);
            
            if(valueKeyLanObj[allStr] || valueKeyLanObj[strWithSpace]) {
                path.node.value = `{${valueKeyLanObj[allStr] || valueKeyLanObj[strWithSpace]}}`
            }
        }
    });

    babel.transformFromAstAsync(ast).then(res => {
        fs.writeFileSync(pathname, res.code);
    });
}

