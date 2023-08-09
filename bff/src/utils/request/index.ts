import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { infoLog } from '../Logger';
import { yellow } from 'chalk';

axios.interceptors.request.use((config) => {
  console.log(this, '====');
  infoLog.logOut && infoLog.logOut(`请求接口:`, new Date(), `${yellow(config.url)}`)
  return config;
})
axios.interceptors.response.use((config) => {
  return config;
})

type methodType = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
interface RequestOptions extends AxiosRequestConfig {
  method: methodType,
}
class AxiosInstances {
  request<T>(url: string, opt: RequestOptions): Promise<AxiosResponse<T>>  {
    const {
      method,
      headers,
      data,
    } = opt;
    const lowerMethodCase: methodType = method.toLowerCase() as methodType;
    return axios[lowerMethodCase]<T>(url, {
      url,
      method: lowerMethodCase,
      headers,
      data
    });
  }
}

const axiosInstance = new AxiosInstances();
export default axiosInstance.request;