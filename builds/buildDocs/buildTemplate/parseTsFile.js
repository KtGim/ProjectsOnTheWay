"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var typescript_1 = __importDefault(require("typescript"));
function default_1(pathname) {
    // console.log(pathname)
    var options = {
        target: typescript_1["default"].ScriptTarget.ES5,
        module: typescript_1["default"].ModuleKind.CommonJS,
        allowJs: true
    };
    var program = typescript_1["default"].createProgram([pathname], options);
    var sourceNodeFile = program.getSourceFile(pathname);
    var printer = typescript_1["default"].createPrinter({ newLine: typescript_1["default"].NewLineKind.LineFeed });
    var typeAlias = new Map();
    var propAlias = {};
    // Get the checker, we will use it to find more about classes
    var checker = program.getTypeChecker();
    var output = [];
    // Visit every sourceFile in the program
    for (var _i = 0, _a = program.getSourceFiles(); _i < _a.length; _i++) {
        var sourceFile = _a[_i];
        if (sourceFile.fileName === pathname) {
            // console.log(sourceFile.locals);
            typescript_1["default"].forEachChild(sourceFile, visit);
        }
        // if (!sourceFile.isDeclarationFile) {
        //   // Walk the tree to search for classes
        //   ts.forEachChild(sourceFile, visit);
        // }
    }
    // print out the doc
    // fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));
    // console.log(output, 'output===')
    return {
        propAlias: propAlias,
        typeAlias: typeAlias
    };
    // 用于将 { a: number } 类型的字符串 准换成对象
    function initObjectAlias(objectStr) {
        var props = {};
        if (objectStr) {
            var containerStr = (objectStr.match(/{(.*?)}/msg) || [])[0].replace(/;/g, '').split('\n').slice(1, -1).map(function (propStr) { return propStr.trim(); });
            containerStr.forEach(function (prop) {
                if (prop) {
                    var propsAndType = prop.split(':');
                    props[propsAndType[0].trim()] = propsAndType[1].trim();
                }
            });
        }
        return props;
    }
    /** visit nodes finding exported classes */
    function visit(node) {
        // Only consider exported nodes
        if (!isNodeExported(node)) {
            return;
        }
        if (typescript_1["default"].isClassDeclaration(node) && node.name) {
            // This is a top level class, get its symbol
            var symbol = checker.getSymbolAtLocation(node.name);
            if (symbol) {
                output.push(serializeClass(symbol));
            }
            // No need to walk any further, class expressions/inner declarations
            // cannot be exported
        }
        else if (typescript_1["default"].isModuleDeclaration(node)) {
            // This is a namespace, visit its children
            typescript_1["default"].forEachChild(node, visit);
        }
        else if (typescript_1["default"].isTypeAliasDeclaration(node)) {
            // let symbol = checker.getSymbolAtLocation(node.name);
            // if (symbol) {
            //   output.push(serializeClass(symbol));
            // }
            var propsStr = printer.printNode(typescript_1["default"].EmitHint.Unspecified, node, sourceNodeFile);
            var props = '';
            if (!propsStr.match(/{(.*?)}/msg)) {
                // 匹配 type A = '1' | '2' | '3'
                props = propsStr.split("=")[1].replace(/;/g, '').trim();
            }
            else {
                props = initObjectAlias(propsStr);
            }
            typeAlias.set(node.name.escapedText, props);
        }
        else if (typescript_1["default"].isInterfaceDeclaration(node)) {
            var props = printer.printNode(typescript_1["default"].EmitHint.Unspecified, node, sourceNodeFile);
            propAlias = __assign(__assign({}, propAlias), initObjectAlias(props));
        }
        else if (typescript_1["default"].isEnumDeclaration(node)) {
            // const props = printer.printNode(ts.EmitHint.Unspecified, node, sourceNodeFile);
            // console.log(props.match(/{(.*?)}/msg)[0]);
        }
    }
    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol) {
        return {
            name: symbol.getName(),
            documentation: typescript_1["default"].displayPartsToString(symbol.getDocumentationComment(checker)),
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration))
        };
    }
    /** Serialize a class symbol information */
    function serializeClass(symbol) {
        var details = serializeSymbol(symbol);
        // Get the construct signatures
        var constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
        // @ts-ignore
        details.constructors = constructorType
            .getConstructSignatures()
            .map(serializeSignature);
        return details;
    }
    /** Serialize a signature (call or construct) */
    function serializeSignature(signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: typescript_1["default"].displayPartsToString(signature.getDocumentationComment(checker))
        };
    }
    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node) {
        return ((typescript_1["default"].getCombinedModifierFlags(node) & typescript_1["default"].ModifierFlags.Export) !== 0 ||
            (!!node.parent && node.parent.kind === typescript_1["default"].SyntaxKind.SourceFile));
    }
}
exports["default"] = default_1;
