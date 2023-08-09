// 用户信息类型
export interface UserAccessTokenModel {
  access_token: string;
  expires_in?: number;
  jti?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  redirect_uri?: string;
  open_id?: string;
  union_id?: string;
}

// Token 失效类型
export enum TokenEnum {
  EXPIRE = 'EXPIRE', // 过期
  NONE = 'NONE', // 本地未缓存
  LIVE = 'LIVE', // 正常
}
