// 通过 文件路径 获取指定的 Props 定义字符串
/**
 * 
 * @param {文件路径} pathname 
 * @param {需要返回的 interface 的名称} identifiers 
 * @returns string[]
 */
module.exports = function(pathname, identifiers) {
  if (!identifiers || identifiers.length === 0) {
    identifiers = ['Props']; // interface Props 将会被获取
  }
  const collections = [];
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  let program = ts.createProgram([pathname], { allowJs: true });
  const sourceFile = program.getSourceFile(pathname);
  
  // To print the AST, we'll use TypeScript's printer
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  // To give constructive error messages, keep track of found and un-found identifiers
  const unfoundNodes = [], foundNodes = [];

  // Loop through the root AST nodes of the file
  ts.forEachChild(sourceFile, node => {
    let name = "";
    
    // This is an incomplete set of AST nodes which could have a top level identifier
    // it's left to you to expand this list, which you can do by using
    // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
    // as below
    if (ts.isFunctionDeclaration(node)) {
      name = node.name.text;
      // Hide the method body when printing
      node.body = undefined;
    } else if (ts.isVariableStatement(node)) {
      name = node.declarationList.declarations[0].name.getText(sourceFile);
    } else if (ts.isInterfaceDeclaration(node)){
      name = node.name.text
    }

    const container = identifiers.includes(name) ? foundNodes : unfoundNodes;
    container.push([name, node]);
  });

  if (!foundNodes.length) {
    console.log(`Could not find any of ${identifiers.join(", ")} in ${file}, found: ${unfoundNodes.filter(f => f[0]).map(f => f[0]).join(", ")}.`);
    process.exitCode = 1;
  } else {
    foundNodes.map(f => {
      const [name, node] = f;
      // console.log(printer.printNode(ts.EmitHint.Unspecified, node, sourceFile));
      collections.push(printer.printNode(ts.EmitHint.Unspecified, node, sourceFile))
    });
  }
  return collections
}