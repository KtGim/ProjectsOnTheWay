import React, { Component } from 'react';
import { message } from 'wmstool';
import TicketTemplate from '../Common/TicketTemplate/index';

import { getLanguage } from 'Gwmscommon';
import { OPERATIONS } from '../Common/TicketTemplate/componentConfig';
import { SessionStorage } from 'Tool/storage';
const TicketTemplateKey = '$$ticket$$template$$info$$';

import './index.less';
import PrintPet from '../../Tool/Pet/PrinterPet';
import { PRINTER_TYPES } from '../../Tool/Pet/printerConst';
import { toImage } from '../Common/TicketTemplate/funcs';

class TicketTemplatePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pageType: OPERATIONS.EDIT,
            socket: null
        };

        this.sourceProperties = [
            {
                sourceCode: 'SimpleLpnLabelHeaderVo',
                sourceName: 'SimpleLpnLabelHeaderVo',
                isDetail: false,
                columns: [
                    {
                        name: '订单号',
                        fieldName: 'orderNo',
                        id: 1
                    }, {
                        name: 'tracking号',
                        fieldName: 'trackingNo',
                        id: 2
                    }, {
                        name: '状态',
                        fieldName: 'status',
                        id: 3
                    },
                    {
                        name: '图片',
                        fieldName: 'src',
                        id: 4
                    }
                ]
            }
            // ,
            // {
            //     sourceCode: 'SimpleLpnLabelDetailVo',
            //     sourceName: 'SimpleLpnLabelDetailVo',
            //     isDetail: true,
            //     columns: [
            //         {
            //             name: '商品名称',
            //             fieldName: 'skuName',
            //             id: 1
            //         }, {
            //             name: '商品编码',
            //             fieldName: 'skuCode',
            //             id: 2
            //         }
            //     ]
            // }
        ];
        this.dataInfo = {
            labelKey: 'name',
            primaryKey: 'id',
            fieldKey: 'fieldName'
        };
    }

    componentDidMount() {
        new PrintPet().connectPromise().then(socket => {
            console.info('socket:', socket);
            this.setState({
                socket: socket.socket
            });
        });
    }

    getCurrentTemplateStep = (info) => {
        console.info('step info:', info);
    }

    hidePage = (props) => {
        message.info(`隐藏页面${props.templateId}`);
    }

    handleActions = (props) => {
        const { pageType, action, templateRenderedProperties } = props;
        if(!templateRenderedProperties || !templateRenderedProperties.length) {
            message.error(`${action}: 请先配置模板属性`);
            return;
        }
        switch (action) {
            case OPERATIONS.SAVE:
                message.success('保存成功');
                SessionStorage.setItem(TicketTemplateKey, props);
                break;
            case OPERATIONS.PRINT:
                toImage(props, this.state.socket, localStorage.getItem(PRINTER_TYPES.commercialprinter));
                break;
        }
        this.setState({
            pageType
        });
    }

    render() {
        const { pageType } = this.state;
        return <div className="ticket-template_page">
            <TicketTemplate
                getCurrentTemplateStep={this.getCurrentTemplateStep}
                properties={this.sourceProperties}
                dataInfo={this.dataInfo}
                lan={getLanguage()}
                currentPageNo={0}
                pageType={pageType}
                hidePage={this.hidePage}
                handleActions={this.handleActions}
            />
        </div>;
    }
}

export default TicketTemplatePage;

export {
    TicketTemplateKey
};