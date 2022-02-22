import ts from "typescript";
import {readFileSync, existsSync} from 'fs';

export default function (pathname: string) {
  const p = pathname;
  console.log(p);

  if(existsSync(p)) {
    const sourceFile = ts.createSourceFile(
      p,
      readFileSync(p).toString(),
      ts.ScriptTarget.Latest,
      /*setParentNodes */ true
    );
    delint(sourceFile);
    // console.log(sourceFile);
  }

  const propAlias = {};
  const typeAlias = {};

  return {
    propAlias,
    typeAlias
  };

}

function delint(sourceFile: ts.SourceFile) {
  delintNode(sourceFile);

  const declarations: string[] = [];
  const declarationProps = {};

  function delintNode(node: ts.Node) {
    
    // // interface 具体内容
    if(ts.SyntaxKind.InterfaceDeclaration == node.kind) {
      console.log(node.getText(), '1');
      //@ts-ignore
      console.log(node.parent);
    }
    
    // // interface 的内容
    // if(ts.SyntaxKind.PropertySignature == node.kind) {
    //   console.log(node.getText(), '2');
    // }

    // // type 类型的内容
    // if(ts.SyntaxKind.TypeAliasDeclaration == node.kind) {
    //   console.log(node.getText(), '4');
    // }

    // if(ts.SyntaxKind.TypeReference == node.kind) {
    //   console.log(node.getText(), '3');
    // }

    // if(ts.SyntaxKind.ImportDeclaration == node.kind) {
    //   console.log(node.getText(), '5');
    // }

    // if(ts.SyntaxKind.ImportClause == node.kind) {
    //   console.log(node.getText(), '6');
    // }

    // if(ts.SyntaxKind.ImportSpecifier == node.kind) {
    //   console.log(node.getText(), '7');
    // }

    // if(ts.SyntaxKind.ImportType == node.kind) {
    //   console.log(node.getText(), '8');
    // }

    // if(ts.SyntaxKind.NamedImports == node.kind) {
    //   console.log(node.getText(), '9');
    // }

    // if(ts.SyntaxKind.NamespaceImport == node.kind) {
    //   console.log(node.getText(), '10');
    // }
    
    // if(ts.SyntaxKind.NamespaceKeyword == node.kind) {
    //   console.log(node.getText(), '11');
    // }

    // if(ts.SyntaxKind.ImportKeyword == node.kind) {
    //   console.log(node.getText(), '12');
    // }

    ts.forEachChild(node, delintNode);
  }

  function report(node: ts.Node, message: string) {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
  }

  // 标记此节点是一个 interface 节点
  function interfaceDeclarationStr (interfaceName: string) {
    if(interfaceName) {
      return [`interface ${interfaceName} {`, `interface ${interfaceName} extends`]
    }
    return []
  }

  // 标记此节点是一个 type 节点
  function typeDeclarationStr (typeName: string) {
    if(typeName) {
      return `type ${typeName} =`
    }
    return null
  }
}
