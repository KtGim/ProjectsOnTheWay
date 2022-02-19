import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';
import postcss from 'rollup-plugin-postcss';
import ts from 'rollup-plugin-typescript2';
import jsx from 'acorn-jsx';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';

const fileExtensions = ['.js', '.jsx', '.tsx', '.md'];
const cssExtensions = ['.css', '.less'];

const tsPlugin = ts({
    tsconfig: require.resolve('./tsconfig.json'), // 导入本地ts配置
    extensions: fileExtensions,
    tsconfigOverride: { compilerOptions : { module: "es2015" } }
})

export default {
  input: "site/index.tsx",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    sourcemap: true,
  },
  plugins: [
    string({
      include: ['**/*.md'],
    }),
    json(),
    image(),
    postcss({
      extensions: cssExtensions
    }),
    nodeResolve({
      extensions: fileExtensions
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'development' ),
      preventAssignment: true
    }),
    // mdParser(),
    tsPlugin,
    babel({
      presets: ["@babel/preset-react"],
      babelHelpers: "bundled",
      extensions: fileExtensions,
      exclude: 'node_modules/**'
    }),
    commonjs(),
    serve({
      open: true,
      verbose: true,
      contentBase: ["", "site"],
      host: "localhost",
      port: 3000,
    }),
    livereload({ watch: "dist" }),
  ],
  acornInjectPlugins: [jsx()]
};