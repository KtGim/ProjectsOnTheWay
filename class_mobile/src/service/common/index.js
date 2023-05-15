import { request } from "../../utils/request";

export async function getNoAuthLoad(data) {
  return request({
    path: '/mobile/user/info',
    data,
    method: 'GET',
  });
}