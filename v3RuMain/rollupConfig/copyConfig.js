import vue from 'rollup-plugin-vue'
import node from '@rollup/plugin-node-resolve'
import cjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import css from 'rollup-plugin-css-only'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'
import simplevars from 'postcss-simple-vars'
import nested from 'postcss-nested'
import postcssEach from 'postcss-each'
import postcssMixin from 'postcss-mixins'
import postcssColor from 'postcss-color-function'
import postcssCalc from 'postcss-calc'
import postcssextend from 'postcss-extend-rule'
import postcssDiscardComment from 'postcss-discard-comments'
import postcssDiscardEmpty from 'postcss-discard-empty'
import postcssUrl from 'postcss-url'
import postcssRem from 'postcss-rem'
import sortMedia from 'postcss-sort-media-queries'
import cssnano from 'cssnano'
import url from '@rollup/plugin-url'
import typescript from 'rollup-plugin-typescript2'
import analyze from 'rollup-plugin-analyzer'

import fs from 'fs'
import path from 'path'

const babelConfig = {
  exclude: 'node_modules/**',
  babelHelpers: true,
  babelrc: false,
  presets: [['@babel/preset-env', { modules: false }]]
}

const baseFolder = './src/'
const componentsFolder = 'components/'

const components = fs
  .readdirSync(baseFolder + componentsFolder)
  .filter((f) =>
    fs.statSync(path.join(baseFolder + componentsFolder, f)).isDirectory()
  )

const entries = {
  index: './src/index.ts',
  ...components.reduce((obj, name) => {
    obj[name] = (baseFolder + componentsFolder + name)
    return obj
  }, {})
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const vuePluginConfig = {
  defaultLang: {
    style: 'postcss',
    script: 'ts'
  },
  transformAssetUrls: {
    includeAbsolute: true
  },
  preProcessStyles: true,
  compileTemplate: false,
  template: {
    isProduction: true,
    compilerOptions: {
      whitespace: 'condense'
    }
  },
  style: {
    postcssPlugins: [
      autoprefixer,
      postcssImport({
        resolve (id, basedir) {
          // resolve alias @css, @import '@css/style.css'
          // because @css/ has 5 chars
          if (id.startsWith('@css')) {
            // basedir will resolve to /src/components
            return path.resolve('src/assets/styles/css', id.slice(5))
          }

          // resolve node_modules, @import '~normalize.css/normalize.css'
          // similar to how css-loader's handling of node_modules
          // if (id.startsWith('~')) {
          //   return path.resolve(basedir, '../node_modules', id);
          // }

          // resolve relative path, @import './components/style.css'
          return path.resolve(basedir, id)
        }
      }),
      postcssEach,
      postcssMixin,
      simplevars,
      postcssColor,
      postcssCalc,
      nested,
      postcssextend,
      postcssDiscardComment,
      postcssDiscardEmpty,
      postcssUrl({ url: 'inline' }),
      postcssRem({
        baseline: 16, // Default to 16
        // convert: 'px', // Default to rem
        fallback: true, // Default to false
        precision: 6 // Default to 5
      }),
      sortMedia({
        sort: 'mobile-first'
      }),
      autoprefixer({
        overrideBrowserslist: '> 1%, IE 6, Explorer >= 10, Safari >= 7'
      }),
      cssnano({
        zindex: false
      })

    ]
  }
}

export default () => {
  const mapComponent = (name) => {
    return [
      {
        input: baseFolder + componentsFolder + `${name}/index.ts`,
        external: ['vue'],
        output: {
          format: 'umd',
          name: capitalize(name),
          file: `dist/components/${name}/index.js`,
          exports: 'named',
          globals: {
            vue: 'Vue'
          }
        },
        plugins: [
          typescript(),
          url({
            include: [
              '**/*.svg',
              '**/*.png',
              '**/*.gif',
              '**/*.jpg',
              '**/*.jpeg'
            ]
          }),
          node({
            extensions: ['.vue', '.js', '.ts']
          }),
          cjs(),
          vue(vuePluginConfig),
          css(),
          babel(babelConfig)
        ]
      }
    ]
  }

  let config = [
    {
      input: entries,
      external: ['vue'],
      output: {
        format: 'esm',
        dir: 'dist/esm'
      },
      plugins: [
        typescript(),
        cjs(),
        url({
          include: [
            '**/*.svg',
            '**/*.png',
            '**/*.gif',
            '**/*.jpg',
            '**/*.jpeg'
          ]
        }),
        node({
          extensions: ['.vue', '.js', '.ts']
        }),
        vue(vuePluginConfig),
        css(),
        babel(babelConfig),
        analyze(),
        terser({
          output: {
            comments: '/^!/'
          },
          compress: {
            defaults: true
          }
        })
      ]
    },
    {
      input: entries,
      external: ['vue'],
      output: {
        format: 'cjs',
        dir: 'dist/cjs',
        exports: 'named'
      },
      plugins: [
        typescript(),
        url({
          include: [
            '**/*.svg',
            '**/*.png',
            '**/*.gif',
            '**/*.jpg',
            '**/*.jpeg'
          ]
        }),
        node({
          extensions: ['.vue', '.js', '.ts']
        }),
        vue(vuePluginConfig),
        css(),
        babel(babelConfig),
        cjs()
      ]
    },
    {
      input: 'src/index.ts',
      external: ['vue'],
      output: {
        format: 'esm',
        file: 'dist/vueslib.esm.js'
      },
      plugins: [
        typescript(),
        url({
          include: [
            '**/*.svg',
            '**/*.png',
            '**/*.gif',
            '**/*.jpg',
            '**/*.jpeg'
          ]
        }),
        node({
          extensions: ['.vue', '.js', '.ts', '.css']
        }),
        vue(vuePluginConfig),
        css(),
        babel(babelConfig),
        cjs()
      ]
    },
    // individual components
    ...components.map((f) => mapComponent(f)).reduce((r, a) => r.concat(a), [])

  ]

  if (process.env.MINIFY === 'true') {
    config = config.filter((c) => !!c.output.file)
    config.forEach((c) => {
      c.output.file = c.output.file.replace(/\.js/g, '.min.js')
      c.plugins.push(terser({
        output: {
          comments: '/^!/'
        },
        compress: {
          defaults: true
        }
      }))
    })
  }
  return config
}