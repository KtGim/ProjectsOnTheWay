const babel = require("@babel/core");
const generate = require("@babel/generator")
const fs = require("fs");

const code = fs.readFileSync('/Users/qianjingjing/Desktop/projects_own/babelDemo/demos/002/scopeDemo.js', "utf-8");

const ast = babel.parse(code, {
    sourceType: 'module'
})

// console.log(ast);

babel.traverse(ast, {
    // enter(path) {
    //     path.traverse({
    //         ImportDeclaration (pi) {
    //             console.log(pi.node);
    //         }
    //     },)
    // },
    FunctionDeclaration(path) {
        // console.log(path.scope); // 获取当前函数的作用域信息
        // console.log(path.scope.bindings); // 作用域内部 的 具体引用
        const bindings = path.scope.bindings;
        const firstVar = Object.keys(bindings)[0];
        // console.log(bindings[firstVar], firstVar);
        // Object.keys(bindings).forEach(binding => {
        //     console.log(bindings[binding].referencePaths);
        // })
        const curBinding = path.scope.getBinding(firstVar);

        let sname = 'qqq';

        // 循环找出没有被占用的变量名
        while(true) {

            // 1️⃣首先看一下父作用域是否已定义了该变量
            if (path.scope.parentHasBinding(sname)) {
                continue
            }

            // 2️⃣ 检查当前作用域是否定义了变量
            if (path.scope.hasOwnBinding(sname)) {
                // 已占用
                continue
            }

            //  再检查第一个参数的当前的引用情况,
            // 如果它所在的作用域定义了同名的变量，我们也得放弃
            if (curBinding.references > 0) {
                let findIt = false
                for (const refNode of curBinding.referencePaths) {
                    if (refNode.scope !== path.scope && refNode.scope.hasBinding(sname)) {
                        findIt = true
                        break
                    }
                }
                if (findIt) {
                    continue
                }
            }
            break
        }

        // 开始替换掉
        const i = babel.types.identifier(sname);
        curBinding.referencePaths.forEach(p => p.replaceWith(i))
        curBinding.identifier.name = sname;
    },
    // Identifier(path) {

    // }
})

// const ast = babel.transformFileSync('/Users/qianjingjing/Desktop/projects_own/babelDemo/demos/002/demo01.js', {
//     sourceType: "module",
// }, (err, res) => {
//     console.log(err, 'error')
//     console.log(res, "==>");
// })

// console.log(ast);

console.log(generate.default(ast).code);