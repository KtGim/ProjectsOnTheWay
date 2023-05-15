import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { Component } from 'react';
import dd from 'dingtalk-jsapi';
import { Provider } from 'react-redux'

import { View } from '@tarojs/components';
import { getNoAuthLoad } from './service';
import { AUTH_KEY, CORP_ID, getPageQuery } from './utils';
import './app.less';
import configStore from './redux/store';
import { navigatorPages } from './pages';

const store = configStore();

class App extends Component {

  $instance = getCurrentInstance();

  componentDidMount () {
    const params = getPageQuery();
    if(params.corpId) {
      dd.ready(function() {
        // https://www.dingtalk.com?corpId=$CORPID$
        dd.runtime.permission.requestAuthCode({
          corpId: params.corpId
        }).then(res => {
          // console.log(res, 'dd ready');
          getNoAuthLoad({
            code: res.code,
            corpId: params.corpId
          }).then(response => {
            localStorage.setItem(AUTH_KEY, JSON.stringify(response.data));
            localStorage.setItem(CORP_ID, JSON.stringify(params.corpId));
            Taro.switchTab({
              url: 'pages/ClassAudit/index'
            });
          });
        });
      });
    } else {
      if(!localStorage.getItem(CORP_ID)) {
        Taro.showToast({
          title: '请退出重新登录',
          icon: 'error',
          duration: 1000
        });
      }
    }
  }

  ref = null;

  componentDidShow () {
    if(!localStorage.getItem(CORP_ID)) {
      Taro.showToast({
        title: '请退出重新登录',
        icon: 'error',
        duration: 1000
      });
    }
  }

  componentDidHide () {

  }

  render () {
    const showCommon = navigatorPages.some(nP => (this.$instance.router.path).includes(nP));
    return <Provider store={store}>
      <View className='yl-main'>
        {
          showCommon ? (
            <div className='bg01'>
              <div className='logo'></div>
            </div>
          ) : null
        }
        <div className='container'>
          {this.props.children}
        </div>
      </View>
    </Provider>
  }
}

export default App;