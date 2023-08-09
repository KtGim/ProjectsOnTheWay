import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Row, Col, message } from 'antd';
import { Modal, Card } from '@/components';
import { State } from '@/types';
import style from '../index.less';
import { SoubanAlert } from 'components';

class TagModel extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            value: props.name || '',
            prevValue: undefined,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const newState: any = {
            prevValue: nextProps.name,
        };
        if (prevState.prevValue !== nextProps.name) {
            newState.value = nextProps.name || '';
        }
        return newState;
    }
    private handleSubmit = () => {
        const { isEdit, type, parentId, name } = this.props;
        if (!isEdit && !this.state.value) {
            return message.error('标签名称不能为空');
        }
        if (!isEdit) {
            this.props.dispatch({
                type: 'tagModel/add',
                payload: {
                    name: this.state.value,
                    typeEnum: type,
                    parentId: parentId || '',
                },
                successCallBack: () => {
                    this.setState({
                        value: '',
                    });
                },
            });
        } else {
            this.props.dispatch({
                type: 'tagModel/update',
                payload: {
                    name: this.state.value || name,
                    parentId: parentId || '',
                    typeEnum: type,
                },
                successCallBack: () => {
                    this.setState({
                        value: '',
                    });
                },
            });
        }
    };
    submit = (next: boolean) => () => {
        const { value } = this.state;
        if (value.includes('&')) {
            return SoubanAlert.alert({
                content: '标签名称内不能包含&',
            });
        }
        if (next) {
            this.handleSubmitAndNext();
        } else {
            this.handleSubmit();
        }
    };
    private handleSubmitAndNext = () => {
        const { type, parentId } = this.props;
        if (!this.state.value) {
            return message.error('标签名称不能为空');
        }
        this.props.dispatch({
            type: 'tagModel/addAndCreate',
            payload: {
                name: this.state.value,
                typeEnum: type,
                parentId: parentId || '',
            },
        });
        this.setState({
            value: '',
        });
    };
    public handleCancel = () => {
        this.setState({
            value: '',
        });
        this.props.dispatch({
            type: 'tagModel/toggleVisible',
            payload: { visible: false, parentId: '' },
        });
    };
    private onChange = (e: any) => {
        this.setState({
            value: e.target.value,
        });
    };
    render() {
        const { visible, name, isEdit, type, parentId, parentName, isLevel1 } = this.props;
        const footerButton = [
            <Button key="cancel" style={{ float: 'left' }} onClick={this.handleCancel}>
                取消
            </Button>,
            <Button key="save" type="primary" onClick={this.submit(false)}>
                保存
            </Button>,
        ];
        const element =
            type === 'BUILDING' ? (
                <div className={style.tagName}>
                    <Card>
                        <Row gutter={20}>
                            {!parentId && isLevel1 && (
                                <Col span={12}>
                                    <span>一级标签</span>
                                    <Input
                                        placeholder="请输入标签名称"
                                        onChange={this.onChange}
                                        defaultValue={name}
                                    />
                                </Col>
                            )}
                            {!parentId && !isLevel1 && (
                                <Col span={12}>
                                    <span>二级标签</span>
                                    <Input
                                        placeholder="请输入标签名称"
                                        onChange={this.onChange}
                                        defaultValue={name}
                                    />
                                </Col>
                            )}
                            {parentId && (
                                <>
                                    <Col span={12}>
                                        <span>一级标签</span>
                                        <Input defaultValue={parentName} disabled />
                                    </Col>
                                    <Col span={12}>
                                        <span>二级标签</span>
                                        <Input
                                            placeholder="请输入标签名称"
                                            onChange={this.onChange}
                                            defaultValue={name}
                                        />
                                    </Col>
                                </>
                            )}
                        </Row>
                    </Card>
                </div>
            ) : (
                <div className={style.tagName}>
                    <span>标签名称</span>
                    <Input
                        placeholder="请输入标签名称"
                        onChange={this.onChange}
                        defaultValue={name}
                        value={this.state.value}
                    />
                </div>
            );
        if (!isEdit) {
            footerButton.splice(
                1,
                0,
                <Button key="saveAndNext" onClick={this.submit(true)}>
                    保存&新建下一个
                </Button>
            );
        }
        return (
            <Modal
                visible={visible}
                onCancel={this.handleCancel}
                width={490}
                // eslint-disable-next-line react/no-children-prop
                children={visible && element}
                title={!isEdit ? '添加标签' : '编辑标签'}
                footer={footerButton}
                maskClosable={false}
                // height={90}
            />
        );
    }
}
export default connect((state: State) => {
    return {
        visible: state.tagModel.visible,
        current: state.tagModel.current,
        type: state.tagModel.type,
        name: state.tagModel.name,
        isEdit: state.tagModel.isEdit,
        parentId: state.tagModel.parentId,
        parentName: state.tagModel.parentName,
        isLevel1: state.tagModel.isLevel1,
    };
})(TagModel);
