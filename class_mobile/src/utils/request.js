import Taro from "@tarojs/taro";
import { AUTH_KEY } from "./const";

const getAuthority = () => {
  const authorityString = localStorage.getItem(AUTH_KEY);
  let authority = {};
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    } else {
      authority = {
        userId: 1,
        corpId: 1
      }
    }
  } catch (e) {
    console.error('获取本地缓存用户信息失败！');
    // history.push('/user/login');  // 用户信息解析失败跳转到首页进行重新登录
    authority = {
      userId: 1,
      corpId: 1
    }
  }
  return authority;
}

const request = ({
  path,
  data,
  method = 'POST',
  showSuccessTips = false,
  successTxt = '请求成功',
  failedTxt = '请求失败',
  header = {
    "Content-Type": "application/json;charset=UTF-8"
  }
}) => {

  return new Promise((res, rej) => {
    fetch(path, {
      headers: {
        ...getAuthority(),
        ...header
      },
      method,
      body: (typeof data == 'object' && data !== null) ? JSON.stringify(data) : data
    }).then(response => {
      return response.json()
    }).then(response => {
      const { code, message } = response;
      if(code == '10000') {
        showSuccessTips && Taro.showToast({
          title: successTxt,
          icon: 'success'
        });
        res(response.data);
        return response.data;
      } else {
        Taro.showToast({
          title: message || failedTxt,
          icon: 'error'
        });
        rej(response);
        return response;
      }
    });
  }).catch(e => {
    Taro.showToast({
      title: e.message || failedTxt,
      icon: 'error'
    });
  })
}

export {
  getAuthority,
  request
}