module.exports = {
  presets: [['@babel/env', {
    modules: false, // 关闭模块转换
  },], '@babel/typescript', '@babel/react'],
  plugins: ['@babel/proposal-class-properties', [
    '@babel/plugin-transform-runtime',
    {
      corejs: 3,
      helpers: true,
      useESModules: true
    }
  ]],
};