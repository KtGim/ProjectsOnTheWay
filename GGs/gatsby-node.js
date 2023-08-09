const path = require('path');

exports.onCreateWebpackConfig = args => {
  const aliasPath = path.resolve(__dirname, '../components/');
  args.actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, './'), 'node_modules'],
      alias: {
        'ggs-ui/lib': aliasPath,
        'ggs-ui/esm': aliasPath,
        'ggs-ui': aliasPath,
      },
    },
  });
};