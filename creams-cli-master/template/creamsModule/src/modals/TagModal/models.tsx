import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Radio } from 'antd';
import { Modal } from '@/components';
import { State } from '@/types';
import style from '../index.less';
class TagModel extends React.Component<any, {}> {
    state = {
        value: '',
        billType: 'notDeposit',
    };
    private handleSubmit = () => {
        const { isEdit, type } = this.props;
        if (!isEdit) {
            this.props.dispatch({
                type: 'categoryModel/add',
                payload: {
                    name: this.state.value,
                    categoryEnum: type,
                    deposit: this.state.billType === 'deposit',
                },
            });
        } else {
            this.props.dispatch({
                type: 'categoryModel/update',
                payload: {
                    name: this.state.value || name,
                    categoryEnum: type,
                },
            });
        }
        this.setState({
            value: '',
            billType: 'notDeposit',
        });
    };
    private handleSubmitAndNext = () => {
        const { type } = this.props;
        this.props.dispatch({
            type: 'categoryModel/addAndCreate',
            payload: {
                name: this.state.value || name,
                categoryEnum: type,
                deposit: this.state.billType === 'deposit',
            },
        });
        this.setState({
            value: '',
            billType: 'notDeposit',
        });
    };
    public handleCancel = () => {
        this.setState({
            value: '',
            billType: 'notDeposit',
        });
        this.props.dispatch({
            type: 'categoryModel/toggleVisible',
            payload: { visible: false },
        });
    };
    private onChange = (e: any) => {
        this.setState({
            value: e.target.value,
        });
    };
    private onChangeType = e => {
        this.setState({
            billType: e.target.value,
        });
    };
    render() {
        const { visible, isEdit, headTitle, subTitle, name, type } = this.props;
        const footerButton = [
            <Button key="cancel" style={{ float: 'left' }} onClick={this.handleCancel}>
                取消
            </Button>,
            <Button key="save" type="primary" onClick={this.handleSubmit}>
                保存
            </Button>,
        ];
        if (!isEdit) {
            footerButton.splice(
                1,
                0,
                <Button key="saveAndNext" onClick={this.handleSubmitAndNext}>
                    保存&新建下一个
                </Button>
            );
        }
        return (
            <Modal
                visible={visible}
                onCancel={this.handleCancel}
                width={490}
                maskClosable={false}
                // eslint-disable-next-line react/no-children-prop
                children={
                    <div className={style.tagName}>
                        <span>{subTitle}</span>
                        {visible && (
                            <Input
                                placeholder={`请输入${subTitle}`}
                                onChange={this.onChange}
                                defaultValue={name}
                            />
                        )}
                        {type === 'BILL' && (
                            <Fragment>
                                <span className={style.subItem}>费用类型</span>
                                <Radio.Group
                                    onChange={this.onChangeType}
                                    value={this.state.billType}
                                >
                                    <Radio value={'notDeposit'} className={style.subRadio}>
                                        非押金类型
                                    </Radio>
                                    <Radio value={'deposit'} className={style.subRadio}>
                                        押金类型
                                    </Radio>
                                </Radio.Group>
                            </Fragment>
                        )}
                    </div>
                }
                title={headTitle}
                footer={footerButton}
                height={90}
            />
        );
    }
}
export default connect((state: State) => {
    return {
        visible: state.categoryModel.visible,
        type: state.categoryModel.type,
        name: state.categoryModel.name,
        isEdit: state.categoryModel.isEdit,
        headTitle: state.categoryModel.headTitle,
        subTitle: state.categoryModel.subTitle,
    };
})(TagModel);
