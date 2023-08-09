import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginVuedoc, { vueDocFiles } from 'vite-plugin-vuedoc'
import vueJsx from '@vitejs/plugin-vue-jsx'
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';

import path from 'path';

const customResolver = resolve({
  extensions: ['.mjs', '.js', '.jsx', '.json', '.less']
});

const projectRootDir = path.resolve(__dirname);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vitePluginVuedoc({}),
    vue({
      include: [...vueDocFiles] 
    }),
    vueJsx(),
    alias({
      entries: [
        {
          find: '@/src',
          replacement: path.resolve(projectRootDir, 'src')
          // OR place `customResolver` here. See explanation below.
        },
        {
          find: '@/components',
          replacement: path.resolve(projectRootDir, 'components')
          // OR place `customResolver` here. See explanation below.
        },
        {
          find: '@/docs',
          replacement: path.resolve(projectRootDir, 'docs')
          // OR place `customResolver` here. See explanation below.
        },
        {
          find: '@/lib',
          replacement: path.resolve(projectRootDir, 'lib')
          // OR place `customResolver` here. See explanation below.
        },
      ],
      // customResolver,
    }),
    resolve()
  ]
})
