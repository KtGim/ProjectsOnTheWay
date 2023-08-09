const path = require('path');

const aliasPath = path.resolve(__dirname, './components/');

module.exports = {
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['ggs-ui/lib/*', aliasPath],
          ['ggs-ui/esm/*', aliasPath],
          ['ggs-ui', aliasPath],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
      }
    }
  },
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
};