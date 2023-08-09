import React from 'react';
import { Col, Form, Input, Row, Button } from 'wmstool';
import { CAPTCHA_URL, EASY_FORM_RULE, INPUT_REG } from '@/Tool/const';
import Template from '../Template';
import { handleError, encryptPassword } from '@/Tool/common';
import { getPublicKey } from '@/Tool/remote';
const FormItem = Form.Item;
class ForgotPasswordLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sendBtn: false,
      sum: 120
    };
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  //切换验证码
  switchCaptcha = () => {
    this.captcha.src = CAPTCHA_URL + '?' + Math.random();
  };
  reSetPasswordForm = () => {
    const {
      getFieldDecorator
    } = this.props.form;
    return <div>
          <h3 className="account-password-login">{window.language.Login.resetPassword}</h3>
        <FormItem>
          {getFieldDecorator('phone', {
          rules: [{
            required: true,
            message: '请输入手机号码'
          }, EASY_FORM_RULE.PHONE_NUM]
        })(<Input addonBefore="手机号码" placeholder={window.language.Login.enterPhoneNumber} />)}
        </FormItem>
        <FormItem>
          <Row gutter={8}>
            <Col span={15}>
              {getFieldDecorator('validateCode', {
              rules: [{
                required: true,
                message: window.language.Login.verificationCode
              }]
            })(<Input addonBefore={window.language.Login.verificationCode} placeholder={window.language.Login.enterVerificationCode} />)}
            </Col>
            <Col span={9}>
            <div className="captcha-wrap fr">
                    <img onClick={this.switchCaptcha} ref={captcha => {
                this.captcha = captcha;
              }} src={CAPTCHA_URL} />
                  </div>
            </Col>
          </Row>
        </FormItem>
      </div>;
  };
  //获取手机号验证码
  getPhoneVerfication = () => {
    if (this.state.sendBtn) {
      return;
    }
    this.props.getPhoneNumberValidateCode();
    this.setState({
      sendBtn: true
    }, () => {
      this.waitTime();
    });
  };
  waitTime() {
    this.timer = setInterval(() => {
      let {
        sum
      } = this.state;
      if (sum > 0) {
        this.setState({
          sum: sum - 1
        });
        return;
      }
      if (sum < 1) {
        this.setState({
          sum: 120,
          sendBtn: false
        }, () => {
          clearInterval(this.timer);
        });
        return;
      }
    }, 1000);
  }
  safeVerficationForm = () => {
    let {
      phone
    } = this.props.setLoginData;
    const {
      getFieldDecorator
    } = this.props.form;
    let {
      sum
    } = this.state;
    return <div>
         <h3 className="account-password-login">{window.language.Login.accountSecurityVerification}</h3>
         <div className="account-safety-text">{window.language.Login.validityOfTheAccount}</div>
         <div className="account-safety-text-color">{window.language.Login.clickToGetTheVerificationCode}<span>{phone}</span>的验证码.</div>
         <FormItem>
          {getFieldDecorator('smsCode', {
          rules: [{
            required: true,
            message: window.language.Login.enterVerificationCode
          }]
        })(<Input addonAfter={<span id="waitTime" onClick={this.getPhoneVerfication} style={{
          cursor: 'pointer'
        }}>{sum == 0 || sum == 120 ? window.language.Login.getVerificationCode : `${window.language.Login.countdown}${sum}`}</span>} addonBefore={window.language.Login.verificationCode} placeholder={window.language.Login.getVerificationCode} />)}
        </FormItem>
      </div>;
  };
  checkNewPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback(window.language.Login.thePasswordIsDifferentTwice);
    } else {
      callback();
    }
  };
  newPasswordSetForm = () => {
    const {
      getFieldDecorator
    } = this.props.form;
    return <div>
        <h3 className="account-password-login">{window.language.Login.newPasswordSettings}</h3>
        <div className="account-safety-text">{window.language.Login.resetAccountPassword}</div>
        <FormItem>
          {getFieldDecorator('newPassword', {
          rules: [{
            required: true,
            message: window.language.Login.enterNewLoginPassword
          }, {
            pattern: INPUT_REG.password,
            message: window.language.Login.noteThePasswordFormat
          }]
        })(<Input addonBefore={window.language.Login.password} placeholder={window.language.Login.enterNewLoginPassword} type="password" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirmPassword', {
          rules: [{
            required: true,
            message: window.language.Login.pleaseEnterThePasswordAgain
          }, {
            validator: this.checkNewPassword
          }]
        })(<Input addonBefore={window.language.Login.confirmPassword} placeholder={window.language.Login.pleaseEnterThePasswordAgain} type="password" />)}
        </FormItem>
        <div className="account-safety-text-color">{window.language.Login.passwordRequirements}</div>
      </div>;
  };
  clickStep = step => {
    let newStep = parseInt(step);
    if (newStep == 3) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (values.newPassword != values.confirmPassword) {
            return handleError({
              message: window.language.Login.twoPasswordsAreDifferent
            });
          }
          getPublicKey().then(publicKey => {
            this.props.confirmChangePassword(encryptPassword(values.newPassword, publicKey));
          });
        }
      });
    } else {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          //手机号和验证码都通过
          if (newStep == 1) {
            //请求接口验证验证码是否正确，正确进行下一步，错误停留在当前页面
            this.props.checkImgValidateCode({
              phone: values.phone,
              validateCode: values.validateCode
            });
          } else {
            //点击下一步的时候，终止倒计时计算
            clearInterval(this.timer);
            this.setState({
              sum: 120,
              sendBtn: false
            });
            //验证短信验证码是否正确
            this.props.checkPhoneVerfication(values.smsCode);
          }
        }
      });
    }
  };
  render() {
    let {
      resetPasswordStep
    } = this.props.setLoginData;
    return <Form className="forgot-password-main-page">
          {/*重置密码 */}
          {resetPasswordStep === '1' && this.reSetPasswordForm()}
          {/* 账号安全验证 */}
          {resetPasswordStep === '2' && this.safeVerficationForm()}
          {/* 新密码设定 */}
          {resetPasswordStep === '3' && this.newPasswordSetForm()}
          <Button className="login-form-button" onClick={this.clickStep.bind(this, resetPasswordStep)} type="green">
           {resetPasswordStep === '3' ? window.language.Login.confirm : window.language.Login.next}
                 </Button>
      </Form>;
  }
}
const ForgotPasswordLoginForm = Form.create()(ForgotPasswordLogin);
export default Template({
  id: 'Login',
  component: ForgotPasswordLoginForm,
  url: '',
  simpleAction: {
    state: ['setLoginData'],
    action: 'login'
  }
});