import React from 'react';
import { Icon, Form, Button, Input, Row, Col } from 'wmstool';
import Template from '../Template';
import { encryptPassword, Entity } from '@/Tool/common';
import { remote, getPublicKey } from '@/Tool/remote';
const FormItem = Form.Item;
class PasswordLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendBtn: false,
      loading: false
    };
  }
  //登录
  getLogin = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        }); //loding
        getPublicKey().then(publicKey => {
          let encryptPs = encryptPassword(values.password, publicKey);
          remote({
            path: '/web/user/login',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            postData: {
              username: values.username,
              password: encryptPs,
              rememberMe: 1
            },
            success: result => {
              console.log('result', result);
              this.setState({
                loading: false
              });
              if (result.success) {
                let userInfo = result.vo || {};
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                localStorage.setItem('userInfo-permission', JSON.stringify(userInfo.permissionSet));
                setTimeout(() => {
                  const permissions = Entity.safeGet(userInfo, 'menuTreeNode.children', []);
                  //如果有首页权限，跳转到首页看板，如果没有权限
                  if (permissions.find(menu => menu.key === 120000)) {
                    this.props.props.history.push('/Main/Home');
                  } else {
                    this.props.props.history.push('/Main');
                  }
                });
              }
            },
            error: () => {
              this.setState({
                loading: false
              });
            }
          });
        });
      }
    });
  };
  renderUserForm = () => {
    const {
      getFieldDecorator
    } = this.props.form;
    let {
      username,
      password
    } = this.props.setLoginData;
    return <div>
        <FormItem>
          {getFieldDecorator('username', {
          rules: [{
            required: true,
            message: '请输入用户名!'
          }],
          initialValue: username
        })(<Input onPressEnter={this.getLogin} placeholder="Username" suffix={<Icon style={{
          color: 'rgba(0,0,0,.25)'
        }} type="user" />} />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
          rules: [{
            required: true,
            message: '请输入密码!'
          }],
          initialValue: password
        })(<Input onPressEnter={this.getLogin} placeholder="Password" suffix={<Icon style={{
          color: 'rgba(0,0,0,.25)'
        }} type="lock" />} type="password" />)}
        </FormItem>
      </div>;
  };
  getVerification = () => {
    this.setState({
      sendBtn: true
    });
    //发送成功之后再倒计时（设置按钮60s之后可以再次点击）todo
    this.waitTime();
  };
  waitTime() {
    let sum = 60;
    for (var i = 1; i <= 60; i++) {
      setTimeout(() => {
        sum = sum < 0 ? 0 : sum - 1;
        document.getElementById('waitTime').innerHTML = sum > 0 ? window.language.Login.countdown + sum : window.language.Login.getVerificationCode;
        sum == 0 ? this.setState({
          sendBtn: false
        }) : '';
      }, i * 1000);
    }
  }
  renderPhoneForm = () => {
    const {
      getFieldDecorator
    } = this.props.form;
    return <div>
        <FormItem>
          {getFieldDecorator('phoneNumber', {
          rules: [{
            required: true,
            message: '请输入手机号码'
          }]
        })(<Input placeholder={window.language.Login.mobilePhoneNumber} prefix={<Icon style={{
          color: 'rgba(0,0,0,.25)'
        }} type="mobile" />} />)}
        </FormItem>
        <FormItem>
          <Row gutter={8}>
            <Col span={15}>
              {getFieldDecorator('verificationCode', {
              rules: [{
                required: true,
                message: window.language.Login.verificationCode
              }]
            })(<Input placeholder={window.language.Login.verificationCode} prefix={<Icon style={{
              color: 'rgba(0,0,0,.25)'
            }} type="mail" />} />)}
            </Col>
            <Col span={9}>
              <Button disabled={this.state.sendBtn} id="waitTime" onClick={this.getVerification} size="large">{window.language.Login.getVerificationCode}</Button>
            </Col>
          </Row>
        </FormItem>
      </div>;
  };
  tabChange = value => {
    this.props.setLoginValues({
      loginActivityTab: value
    });
  };
  forGotPassword = () => {
    this.props.setLoginValues({
      isForgotPasswordPage: true
    });
  };
  onCheckLogin = e => {
    let checked = e.target.checked ? '1' : '0';
    localStorage.setItem('rememberPassword', checked);
    this.props.setLoginValues({
      rememberMe: checked
    });
  };
  render() {
    return <div>
        <Form className="login-form">
        <h3 className="account-password-login">{window.language.Login.accountPasswordLogin}</h3>
          {this.renderUserForm()}
          {/* {loginActivityTab === 'PHONE' ? this.renderPhoneForm() : null} */}
        </Form>
        <div className="login-form-footer">
          <div style={{
          marginBottom: 10
        }}>
            <Row>
              <Col span={12}></Col>
              <Col offset={6} span={6}>  <a className="forgot-password" onClick={this.forGotPassword}>{window.language.Login.forgotPassword}</a></Col>
            </Row>
          </div>
          <Button className="login-form-button" htmlType="submit" loading={this.state.loading} onClick={this.getLogin} type="green">{window.language.Login.login}</Button>
        </div>

      </div>;
  }
}
const PasswordLoginForm = Form.create()(PasswordLogin);
export default Template({
  id: 'Login',
  component: PasswordLoginForm,
  url: '',
  simpleAction: {
    state: ['setLoginData'],
    action: 'login'
  }
});