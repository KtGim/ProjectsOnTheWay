import BaseService from '../index';
import { handleResponse } from '@/utils/prerequest';
import { getUserOpenId, GetUserOpenIdPayload, getWeChatToken, GetWeChatTokenQuery } from '@/apis/tenant/TenantTicket'
// @handleClass(__dirname) // 包裹方法的错误处理方式
class IndexService extends BaseService {
  constructor() {
    super()
  }

  @handleResponse(__dirname)
  async getToken(query: GetWeChatTokenQuery) {
    return await getWeChatToken({
      query
    })
  }

  @handleResponse(__dirname) //包裹方法的错误处理方式
  async getUserInfo(params: GetUserOpenIdPayload) {
    return await getUserOpenId(params);
  }

  @handleResponse(__dirname)
  async error() {
    return await new Promise<{data: string, status: number}>(res => {
      throw Error('抛出错误')
      res({data: 'error', status: 200})
    });
  }

}

export default IndexService;