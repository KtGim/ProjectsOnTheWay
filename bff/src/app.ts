import Koa, { Context } from 'koa';
import server from 'koa-static';
// import glob from 'glob';
import { createContainer, Lifetime } from 'awilix';
import { scopePerRequest, loadControllers } from 'awilix-koa';

import { firstCharUppercase } from '@/utils/utils';

const app = new Koa();

const container = createContainer();

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

process.on('unhandledRejection', (err) => {
  console.log('未捕获的异常信息:\n', err)
})

container.loadModules(['./service/**/*.ts'], {
  cwd: __dirname,
  formatName: (name: string, descriptor: any) => {
    const splat = descriptor.path.split('/')
    const namespace = splat[splat.length - 2] // `repository` or `service`
    name = firstCharUppercase(name);
    return `${namespace}${name}`
  },
  // 生命周期每次都创建实例
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
  }
})

app.use(server(__dirname + '../dist'));
// app.use(historyApiFallback({ index: '/', whiteList: ['/api'] }));
app.use(scopePerRequest(container));
app.use(loadControllers('./controllers/**/*.ts', { cwd: __dirname }));

app.listen(8080, () => {
  console.log('port is running: 8080')
})