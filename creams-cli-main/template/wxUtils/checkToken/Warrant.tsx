import { paramsParse } from '../locationParse';
import Token from './TokenOperations';
import { UserAccessTokenModel } from './types';
import { codeFetchUrl } from './config';

class Warrant {
  // 保存用户信息 token
  private userToken: UserAccessTokenModel | null;
  // 请求 code 的链接
  private codeFetchUrl: string;

  public href: string;

  constructor() {
    this.href = location.href;
    this.userToken = null;
    this.codeFetchUrl = codeFetchUrl;
  }

  async init(fn: () => void) {
    // 判断路由中是否包含 code 字段
    const params = paramsParse(location.search);
    // 当前路径是否 包含 code 和 state 参数
    if (params && params.code && params.state) {
      // 初始化 token 操作
      await Token.initToken(location.href, params.state, fn);
    } else {
      // 重新获取 code
      window.location.href = this.codeFetchUrl;
      fn && fn();
    }
  }

  logout() {
    Token.clearToken();
  }
}

const WarrantInstance = new Warrant();

export default WarrantInstance;
