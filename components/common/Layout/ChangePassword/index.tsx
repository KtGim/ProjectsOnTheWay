import React from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { Interface } from 'readline';

const USER_REG = {
  password: /^.{6,15}$/,
  //密码 数字、字母、特殊字符，
  password2: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,15}$/
};
const FormItem = Form.Item;

interface Props {
  txt: object,
  user: object,
  allModalDate: {
    closeModal: () => void,
  }
}
class ChangePasswordModal extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      txt: props.txt,
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      confirmDirty: false,
      userInfo: props.user,
      user: null
    };
  }

  clickCancel = () => {
    this.props.allModalDate.closeModal();
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    let txt = this.state.txt;
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback(`${txt.passwordSame}`);
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmNewPassword'], { force: true });
    }
    callback();
  }

  componentDidMount() {
    const {
      allModalDate,
      user
    } = this.props;
    this.setState({
      userInfo: user,
      user: allModalDate.key=='LOGIN' ? allModalDate.loginUserCode: user.loginCode,
      userId:allModalDate.key=='LOGIN'? allModalDate.loginUserCode: user.loginCode
    });
  }

  clickSave = (e) => {
    const { save } = this.props.allModalDate;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.userCode = this.state.userId;
        save && save(values);
      }
    });
}

  render() {
    let { visible, complex } = this.props.allModalDate;
    const { getFieldDecorator } = this.props.form;
    let { user, txt} = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    const userReg = complex ? USER_REG.password2: USER_REG.password;
    const waringWords = complex ? txt.directWords:txt.words;

    return (
      <div>
        <Modal
          width={400}
          title={txt.changePassword}
          visible={visible}
          footer={null}
          className="module-change-password"
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label={txt.loginId}
            >
              {<Input disabled value={user} />}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={txt.oldPassword}
            >
              {getFieldDecorator('oldPassword', {
                rules: [{
                  required: true, message: txt.required
                }]
              })(
                <Input placeholder={txt.txtoldPassword} type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={txt.newPassword}
            >
              {getFieldDecorator('newPassword', {
                rules: [{
                  required: true,message: txt.required
                },{
                  pattern: userReg,message: txt.notValid
                },{
                   validator: this.checkConfirm
                }]
              })(
                <Input placeholder={txt.txtnewPassword} type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={txt.confirmPassword}
            >
              {getFieldDecorator('confirmNewPassword', {
                rules: [{
                  required: true, message: txt.required
                },
                {
                  pattern: userReg,message: txt.notValid
                }, {
                 validator: this.checkPassword
                }]
              })(
                <Input placeholder={txt.txtconfirmPassword} type="password" onBlur={this.handleConfirmBlur}/>
              )}
            </FormItem>
            <div className="specail-btns">
              <Button  onClick={this.clickSave} type="primary">{txt.save}</Button>
            </div>
            <div className="specail-btns">
              <Button onClick={this.clickCancel} className="no-style">{txt.cancel}</Button>
            </div>
            <div className="specail-btns">
              <div style={{ textAlign: 'center' }}>{waringWords}</div>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
const ChangePasswordModalForm = Form.create()(ChangePasswordModal);
export default ChangePasswordModalForm;