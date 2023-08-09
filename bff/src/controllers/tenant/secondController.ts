import { Context } from 'koa';
import SecondService from '@/service/tenant/secondService';

type SecondControllerType = {
  tenantSecondService: SecondService
}

class SecondController {
  private tenantSecondService: SecondService;
  constructor({
    tenantSecondService
  }: SecondControllerType) {
    this.tenantSecondService = tenantSecondService;
  }

  async actionData(ctx: Context) {
    // 数据处理
    const result = await this.tenantSecondService.getData();
    ctx.body = {
      result
    }
  }
}

export default SecondController;