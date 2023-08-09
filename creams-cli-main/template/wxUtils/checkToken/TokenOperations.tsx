import ClientOAuth2 from 'client-oauth2';
import { parseJwt } from '../locationParse';
import { clientOAuth2Params, approachingExpirationTime } from './config';
import { TokenEnum } from './types';

class TokenOperations {
  private artisanAuth: ClientOAuth2;

  constructor() {
    // ClientOAuth2 权限对象
    this.artisanAuth = new ClientOAuth2(clientOAuth2Params);
  }

  async initToken(href: string, state: string, fn?: () => void) {
    await this.artisanAuth.code.getToken(href, { state }).then(res => {
      const { data } = res;
      this.setStorage({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
      fn && fn();
    });
  }

  // 校验 token 类型
  validateToken() {
    const { refreshToken, accessToken } = window.localStorage;
    if (!refreshToken || !accessToken) return TokenEnum.NONE;
    if (this.isExpiredTime()) return TokenEnum.EXPIRE;
    return TokenEnum.LIVE;
  }

  /**
   * @returns {boolean} 是否刷新成功
   */
  async refreshToken() {
    const { refreshToken, accessToken } = window.localStorage;
    const token = this.artisanAuth.createToken(
      accessToken,
      refreshToken,
      'bearer',
      {},
    );
    let setTokenReady = false;
    await token.refresh().then(data => {
      if (data.accessToken && data.refreshToken) {
        this.setStorage({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        setTokenReady = true;
      }
    });
    return setTokenReady;
  }

  isExpiredTime() {
    const { tokenExp } = window.localStorage;
    const now = Date.now();
    const expireTime = tokenExp ? tokenExp * 1000 : now;
    return expireTime - now < approachingExpirationTime;
  }

  clearToken() {
    window.localStorage.removeItem('tokenExp');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('wxConfig');
  }

  private setStorage(data: { accessToken: string; refreshToken: string }) {
    window.localStorage.setItem('accessToken', data.accessToken);
    window.localStorage.setItem('refreshToken', data.refreshToken);
    window.localStorage.setItem('tokenExp', parseJwt(data.accessToken).exp);
  }
}

export default new TokenOperations();
