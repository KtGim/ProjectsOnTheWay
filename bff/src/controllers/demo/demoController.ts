import { Context } from 'koa';
import { route, GET } from 'awilix-koa';
import Index from './index';
import IndexService from '@/service/tenant/indexService';

type IndexControllerType = {
  indexService: IndexService
}

@route("/demo")
class IndexController extends Index {

  private indexService: IndexService;
  constructor(cradle: IndexControllerType) {
    super(cradle);
    this.indexService = cradle.indexService;
  }
 
  @route("/index")
  @GET()
  async actionData(ctx: Context) {
    // console.log(ctx, process.env);
    // 数据处理
    const result = await this.indexService.error();
    ctx.body = {
      result
    }
  }
}

export default IndexController;