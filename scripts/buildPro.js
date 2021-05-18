const fs = require('fs');
const {resolve, join} = require('path');

const buildRoutesTemplate = require('./buildRoutesTemplate')

const buildRoutes = require('./buildRoutes');
const buildDoc = require('./buildDoc');

const root = resolve(__dirname, '../components');

let leadingInNames = fs.readdirSync(root)
  .filter((f) =>
    (fs.statSync(join(root, f)).isDirectory()) && (f !== 'style')
  )

if (leadingInNames.length) {
  buildDoc(leadingInNames, 'created')
  buildRoutes(buildRoutesTemplate(leadingInNames), 'created');
}