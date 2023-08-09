import { route, GET } from 'awilix-koa';
import { Context } from 'koa';
import { getApiPrefix } from '@/utils/env';
import BaseController from '../index';
import IndexController from './indexController';

@route("/tenant")
class Index extends BaseController {
  private indexController: IndexController;

  constructor(cradle: any) {
    super();
    this.indexController = new IndexController(cradle);
  }

  @route('/token/:code/:appId')
  @GET()
  async getToken(ctx: Context) {
    const {
      request: {
        url,
        header: {
          host,
        },
      },
      params: {
        code,
        appId
      }
    } = ctx;
    let apiPrefix = '';
    if (typeof url === 'string' && host) {
      apiPrefix = getApiPrefix(url, host);
    } else if (Array.isArray(url) && host) {
      apiPrefix = getApiPrefix(url[0], host);
    }
    
    const result = await this.indexController.getToken({
      code,
      appId
    });
    ctx.body = result;
  }
 
  @route("/user/:openId/:customerId")
  @GET()
  async index(ctx: Context) {
    const {
      params: {
        openId,
        customerId
      },
    } = ctx;
    const result = await this.indexController.getUserInfo({
      openId,
      query: {
        customerId
      }
    });
    ctx.body = result;
  }

  private initResponse(ctx: Context, data: any, success: boolean = true, error?: string) {
    ctx.body = {
      data: data ? data : null,
      status: 200,
      success,
      error: error || undefined
    }
  }
}

export default Index;