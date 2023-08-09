#!/usr/bin/env node
const path = require('path');
const shell = require('shelljs');
shell.exec(`${path.dirname(__dirname)}/node_modules/.bin/babel-node --presets @babel/preset-env ${__dirname}/build/index.js`);