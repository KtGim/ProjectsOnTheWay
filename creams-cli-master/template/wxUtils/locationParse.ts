import jwt from 'jsonwebtoken';

/**
 * @param search url 参数  location.search
 * @returns searchObj {返回对象} object
 */
const paramsParse: (
  search: string,
) => {
  code?: string;
  state?: string;
} | null = search => {
  if (!search || typeof search !== 'string') {
    return null;
  }
  const realSearch = search.startsWith('?') ? search.slice(1) : search;
  const searchObj: { [key: string]: string } = {};
  realSearch.split('&').forEach(param => {
    if (param) {
      const [key, value] = param.split('=');
      searchObj[key] = value;
    }
  });
  return searchObj;
};

const stringify = (obj: { [key: string]: string | number }) => {
  return Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&');
};

const parseJwt = (token: string) => {
  const decoded = jwt.decode(token, {
    complete: true,
  });
  return decoded?.payload;
};

/**
 * 解析 类 url 字符串
 * @param keys 需要校验的是否存在的 key 的数组 或者 单个 key
 * @param search location.search 或者 类似 字符串
 * @param marker 截取标志
 * @param splitter 键值对 赋值符号
 *
 * @returns {searchObj, existKeysObj} {参数对象数组 {key: value}, 是否存在传入的 key 的 对象 {key: boolean}}
 */
const existKeys = (
  keys: string | string[],
  search: string,
  marker: string = '&',
  splitter: string = '=',
) => {
  // 参数 对象 数组
  const searchObj: { [key: string]: string } = {};
  // 传入的参数是否存在的数组
  const existKeysObj: { [key: string]: boolean } = {};
  if (
    !keys ||
    (Array.isArray(keys) && !keys.length) ||
    !search ||
    typeof search !== 'string'
  ) {
    return {
      searchObj,
      existKeysObj,
    };
  }
  keys = Array.isArray(keys) ? keys : [keys];
  const realSearch = search.startsWith('?') ? search.slice(1) : search;
  // 参数 key 值数组
  const paramsKeys: string[] = [];
  // 解析 url
  realSearch.split(marker).forEach(param => {
    if (param) {
      const [key, value] = param.split(splitter);
      searchObj[key] = value;
      paramsKeys.push(key);
    }
  });
  keys.forEach(key => {
    existKeysObj[key] = paramsKeys.indexOf(key) > -1;
  });

  return {
    searchObj,
    existKeysObj,
  };
};

/**
 *
 * @param keys 需要判断 是否存在的 key 或者 key 数组, 取并集
 * @param str 类 url 结构 字符串
 * @returns {searchObj, had} {参数对象数组 {key: value}, key是否存在: boolean}
 */
const hasKey = (keys: string | string[], str: string) => {
  const { searchObj, existKeysObj } = existKeys(keys, str);
  if (
    !keys ||
    (Array.isArray(keys) && !keys.length) ||
    !str ||
    typeof str !== 'string'
  ) {
    return { searchObj, had: false };
  }
  if (Array.isArray(keys)) {
    return { searchObj, had: keys.every(v => existKeysObj[v]) };
  } else {
    return { searchObj, had: existKeysObj[keys] };
  }
};

export { paramsParse, stringify, parseJwt, existKeys, hasKey };
