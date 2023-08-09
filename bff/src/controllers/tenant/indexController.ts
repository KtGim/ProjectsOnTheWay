import { GetUserOpenIdPayload, GetWeChatTokenQuery } from '@/apis/tenant/TenantTicket';
import IndexService from '@/service/tenant/indexService';

type IndexControllerType = {
  tenantIndexService: IndexService
}

class IndexController {
  private tenantIndexService: IndexService;
  constructor({
    tenantIndexService
  }: IndexControllerType) {
    this.tenantIndexService = tenantIndexService;
  }

  async getToken(query: GetWeChatTokenQuery) {
    return await this.tenantIndexService.getToken(query);
  }

  async getUserInfo(query: GetUserOpenIdPayload) {
    return await this.tenantIndexService.getUserInfo(query);
  }

  async errorDemo() {
    // console.log(ctx, process.env);
    // 数据处理
    return await this.tenantIndexService.error();
  }
}

export default IndexController;