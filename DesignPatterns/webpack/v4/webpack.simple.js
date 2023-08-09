// compiler(Table) -> Compilation(Table) -> Chunk -> Module -> runloaders -> Dependencies(AST) -> Tenmplate -> js

const fs = require('fs');
const ejs = require('ejs');
const input = './src/index.js';
const output = './dist/main.js';

const entry = fs.readFileSync(input, 'utf-8');

