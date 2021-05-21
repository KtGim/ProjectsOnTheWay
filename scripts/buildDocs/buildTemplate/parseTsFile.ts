import ts from "typescript";

export default function (pathname: string) {
  // console.log(pathname)
  const options = {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    allowJs: true
  }
  let program = ts.createProgram([pathname], options);
  const sourceNodeFile = program.getSourceFile(pathname);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const typeAlias = new Map();
  let propAlias = {};
  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();
  const output = [];
  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.fileName === pathname) {
      // console.log(sourceFile.locals);
      ts.forEachChild(sourceFile, visit);
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
    propAlias,
    typeAlias
  };

  // 用于将 { a: number } 类型的字符串 准换成对象
  function initObjectAlias (objectStr: string) {
    let props: {[key in string]: string} = {};
    if (objectStr) {
      const containerStr: string[] = (objectStr.match(/{(.*?)}/msg) || [])[0].replace(/;/g, '').split('\n').slice(1, -1).map(propStr => propStr.trim());
      containerStr.forEach(prop => {
        if (prop) {
          const propsAndType = prop.split(':');
          props[propsAndType[0].trim()] = propsAndType[1].trim();
        }
      })
    }
    return props
  }

  /** visit nodes finding exported classes */
  function visit(node: any) {
    
    // Only consider exported nodes
    if (!isNodeExported(node)) {
      return;
    }

    if (ts.isClassDeclaration(node) && node.name) {
      // This is a top level class, get its symbol
      let symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        output.push(serializeClass(symbol));
      }
      // No need to walk any further, class expressions/inner declarations
      // cannot be exported
    } else if (ts.isModuleDeclaration(node)) {
      // This is a namespace, visit its children
      ts.forEachChild(node, visit);
    } else if(ts.isTypeAliasDeclaration(node)) {
      // let symbol = checker.getSymbolAtLocation(node.name);
      // if (symbol) {
      //   output.push(serializeClass(symbol));
      // }
      const propsStr = printer.printNode(ts.EmitHint.Unspecified, node, sourceNodeFile!);
      
      let props: string | {
        [x: string]: string
      } = '';

      if (!propsStr.match(/{(.*?)}/msg)) {
        // 匹配 type A = '1' | '2' | '3'
        props = propsStr.split("=")[1].replace(/;/g, '').trim()
      } else {
        props = initObjectAlias(propsStr);
      }
      typeAlias.set(node.name.escapedText, props);
    } else if(ts.isInterfaceDeclaration(node)) {
      const props = printer.printNode(ts.EmitHint.Unspecified, node, sourceNodeFile!);

      propAlias = {
        ...propAlias,
        ...initObjectAlias(props),
      }

    } else if(ts.isEnumDeclaration(node)) {
      // const props = printer.printNode(ts.EmitHint.Unspecified, node, sourceNodeFile);
      // console.log(props.match(/{(.*?)}/msg)[0]);
    }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: any) {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
      )
    };
  }

  /** Serialize a class symbol information */
  function serializeClass(symbol: any) {
    let details = serializeSymbol(symbol);

    // Get the construct signatures
    let constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration
    );
    // @ts-ignore
    details.constructors = constructorType
      .getConstructSignatures()
      .map(serializeSignature);
    return details;
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: any) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType()),
      documentation: ts.displayPartsToString(signature.getDocumentationComment(checker))
    };
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: any) {
    return (
      (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }
}
