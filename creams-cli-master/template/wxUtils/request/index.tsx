import request from 'umi-request';
import { Toast } from 'vant';
import { Options } from './types';

const baseUrlPrefix = process.env.base_url_prefix;

request.interceptors.response.use(async response => {
  const { status } = response;
  try {
    await response
      .clone()
      .json()
      .then(res => {
        if (status >= 200 && status <= 300) {
        } else {
          Toast.fail(res?.error || res?.message || '接口出错');
          return false;
        }
      });
  } catch (e) {}
  return response;
});

export default function<T>(url: string, options: Options): Promise<T> | null {
  if (options.method?.toUpperCase() === 'POST') {
    options.data = options.body;
    options.method = 'POST';
  }
  // userinfo 没有 /web
  if (url.includes('/web')) {
    url = `https://${baseUrlPrefix}api${url}`;
  } else {
    url = `https://${baseUrlPrefix}api/web${url}`;
  }
  return request<T>(url, options);
}
