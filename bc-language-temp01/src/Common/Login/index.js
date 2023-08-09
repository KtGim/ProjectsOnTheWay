import React from 'react';
import { Button } from 'wmstool';
import best from '@/Img/best-logo.png';
import logo from '@/Img/logo_w.png';
import qq from '@/Img/qq.png';
import wechat from '@/Img/wechat.png';
import { remote } from '@/Tool/remote';
import Template from '../Template/index';
import ForgotPasswordLoginForm from './forgotPassword';
import PasswordLoginForm from './passwordLogin';
class Login extends React.Component {
  constructor(props) {
    super(props);
    const {
      resetLoginData
    } = this.props;
    resetLoginData();
    this.state = {
      url: ''
    };
  }
  componentDidMount() {
    const serviceUrl = window.location.origin;
    //跳转cas
    // remote({
    //     path: '/web/user/getCasLoginUrl',
    //     method: 'POST',
    //     postData: {},
    //     success: (result) => {
    //       if(result.success && result.vo){
    //           window.location.href=`${result.vo}?service=${serviceUrl}/#/Main`;
    //       }
    //     },
    //     error:()=>{}
    //   });
  }

  render() {
    // 彩虹登陆转移到单点登录，此处临时显示空白页
    // 加上自动跳转连接，防止浏览器安全升级自动跳转不生效
    // if(!undefined){
    //   return <p>页面跳转中...{this.state.url && <a href={this.state.url}>如未自动跳转请点击</a>}</p>;
    // }
    let {
      isForgotPasswordPage
    } = this.props.setLoginData;
    return <div className="login_bc">
        <div className="login_top_div">
          <div className="top_logo">
            <img className="top_img" src={logo} />
          </div>
          <div className="top_wechat">
            <img className="top_wechat_img" src={wechat} />{window.language.Login.followWechat}<img className="top_wechat_img" src={qq} />{window.language.Login.qqSupportGroup}</div>
        </div>
        <div className="Login_div">
          <div className="Login_show_div">
            <h1>{window.language.Login.lightFastAndAccurate}</h1>
            <h3>{window.language.Login.freeRegistrationAndUse}</h3>
            <h3>{window.language.Login.believeInProfessionalUs}</h3>
            <Button className="login_show_bt">{window.language.Login.contactUs}</Button>
          </div>
          <div className="Login_div_in">
            <h2>
              <img className="long_form_log" src={best} />{window.language.Login.rainbowSystem}</h2>
            <div className="login-form-container">
              {isForgotPasswordPage ? <ForgotPasswordLoginForm /> : <PasswordLoginForm props={this.props} />}
            </div>
          </div>
        </div>
      </div>;
  }
}
export default Template({
  id: 'Login',
  component: Login,
  url: '',
  simpleAction: {
    state: ['setLoginData'],
    action: 'login'
  }
});