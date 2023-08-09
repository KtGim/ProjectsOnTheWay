import { RequestOptionsInit } from 'umi-request/types';
export interface ExtraFetchOptions {
  noToken?: boolean; // 不携带token
  noCheckToken?: boolean; // 不验证token
  isMock?: boolean; // 是否是 mock
  hasNotification?: boolean; // 遇到错误是否默认展示提示框
}
export interface ResponseError {
  error: string;
  exception?: string;
  message: string;
  status: number;
  timestamp: string;
  path?: string;
}

export interface Options extends ExtraFetchOptions, RequestOptionsInit {}

export type RequestInterceptorProps = {
  url: string;
  options: RequestOptionsInit;
};
