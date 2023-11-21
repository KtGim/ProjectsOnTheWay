import React, { Component } from 'react';
import { message, Modal, Row, Col, Select, InputNumber, Spin, Radio } from 'wmstool';
import TicketTemplate from '../Common/TicketTemplate/index';
import { getCodeById, getLabel, getLanguage, handleSuccess } from 'Gwmscommon';
import { OPERATIONS, SHOW_ELEMENTS } from '../Common/TicketTemplate/componentConfig';

import './index.less';
import { CODE } from 'Gwmsconst';
import { promiseAjax } from 'Tool/remote';
import { IndexContext } from '../Main/Layout/index';
import { reportCacheLog } from 'Tool/webLogFunc';
import { CACHE_STEP, REPORT_TYPE } from 'Tool/webLogConst';
import { PAGE_SIZE_INFO, PAGE_TYPE, paperTypes } from './const';
import { mm2px, px2mm } from '../Common/TicketTemplate/size';
import ShortCutKeysDescModal from './ShortcutKeysDescModal';
const RadioGroup = Radio.Group;

const Option = Select.Option;
class TicketTemplatePage extends Component {
    static contextType = IndexContext;

    constructor(props) {
        super(props);
        this.state = {
            pageType: props.pageType || OPERATIONS.EDIT,
            socket: null,
            /**
             * 数据源属性
             * @type {Array}
             * @example
             * [
             *  {
                    sourceCode: 'SimpleLpnLabelHeaderVo',
                    sourceName: 'SimpleLpnLabelHeaderVo',
                    isDetail: false,  // 是否是明细
                    columns: [
                        {   // 数据源属性，这个是根据后台接口返回的可以通过 this.props.content.dataInfo 校正, 也可以直接写死
                            columnName: '订单号',
                            column: 'orderNo',
                            ...
                        }
                    ]
                }
             * ]
             */
            sourceProperties: [],
            // historyList: [],
            loading: true,
            showDescModal: false, // 快捷键说明
            recommendPageId: null,
            radioValue: null
        };
        this.dataInfo = {
            labelKey: 'columnName',
            primaryKey: 'column',
            fieldKey: 'column'
        };
        this.customerValue = {
            width: null,
            height: null
        };

        this.renderTicketBase = null;
        this.txt = getLabel('templateConfig');
    }

    componentDidMount() {
        this.getSourceProperties();
        this.getContent();
        setTimeout(() => {
            this.setState({
                loading: false
            });
        }, 800);
    }

    getCurrentTemplateStep = () => {
        const { addSubPanelInfo } = this.context;
        const { templateId } = this.props;
        addSubPanelInfo(templateId, {
            close: (func) => {
                Modal.confirm({
                    title: this.txt.closeTipTitle,
                    content: this.txt.closeTip,
                    onOk: () => {
                        // this.saveTemplate(info); // 关闭自动保存
                        func();
                    }
                });
            }
        });
    }

    hidePage = (props) => {
        message.info(`隐藏页面${props.templateId}`);
    }

    saveTemplate = (props = {}) => {
        const {
            templateRenderedProperties
        } = props;
        const {
            name,
            type,
            sourceId,
            status,
            id,
            paperType,
            afterSaveFunc
        } = this.props;
        if(!templateRenderedProperties || !templateRenderedProperties.length) {
            message.error(`${this.txt.setFirst}`);
            return;
        }
        promiseAjax({
            path: '/template/online/createOrEdit',
            postData: {
                vo: {
                    name,
                    type,
                    sourceId,
                    status,
                    id,
                    paperType
                },
                snapVo: {
                    content: JSON.stringify({ ...props, radioValue: this.state.radioValue })
                }
            }
        }).then((res) => {
            // this.setState({
            //     historyList: (res.row || {}).onlineSnapVos || []
            // });
            afterSaveFunc && afterSaveFunc(res.row);
            handleSuccess({message: getLabel('templateConfig', 'saveSuccess')});
        });
    }

    handleActions = (props) => {
        const { pageType, action, ...rest } = props;
        const { closeSubPanel } = this.context;
        const { templateId, printerFunc } = this.props;
        switch (action) {
            case OPERATIONS.SAVE:
                if(!rest.templateRenderedProperties || !rest.templateRenderedProperties.length) {
                    message.error(`${action}: ${this.txt.setFirst}`);
                    return;
                }
                this.saveTemplate(rest);
                break;
            case OPERATIONS.PRINT:
                printerFunc && printerFunc();
                break;
            case OPERATIONS.DESC:
                {
                    this.setState({
                        showDescModal: true
                    }); // 重新渲染
                }
                break;
            case OPERATIONS.QUIT:
                {
                    if(pageType == OPERATIONS.EDIT) {
                        const closeTip = getLabel('templateConfig');
                        Modal.confirm({
                            title: closeTip.closeTipTitle,
                            content: closeTip.closeTip,
                            onOk: () => {
                                closeSubPanel(templateId);
                            }
                        });
                    } else {
                        closeSubPanel(templateId);
                    }
                }
                break;
        }
        this.setState({
            pageType
        });
    }

    getSourceProperties = () => {
        const {
            type
        } = this.props;
        if(!type) return;
        promiseAjax({
            path: '/template/online/datasource/get',
            postData: {
                CIC: getCodeById(CODE.templateType, type)
            }
        }).then(res => {
            const {
                details,
                header
            } = res.row;
            this.setState({
                sourceProperties: [
                    header,
                    ...(details|| []).map((item) => { item.isDetail = true; return item; })
                ]
            });
        });
    }

    getContent = () => {
        const {
            onlineSnapVos,
            id,
            viewSource,
            type
        } = this.props;
        const onlineSnapVo = onlineSnapVos[0] || {};
        let content = { templateId: id };
        try {
            content = {...content, ...(JSON.parse(onlineSnapVo && onlineSnapVo.content || '{}'))};
        } catch(e) {
            content = { templateId: id };
            reportCacheLog(`${CACHE_STEP.TEMPLATE} -> content ${content}`, REPORT_TYPE.TEMPLATE);
        }
        const templateType = getCodeById(CODE.templateType, type);
        let templateOriginHeight = 550;
        let templateOriginWidth = 400;
        let recommendPageId = null;
        switch (templateType) { // 设置默认的纸张大小, 需要注意下面的模板大小是px，展示时会转换成 mm, 可以在页面获取到想要的 px 再填入默认值
            case 'SKU_LABEL':
            case 'BARCODE_LABEL':
            case 'LPN_LABEL':
                templateOriginHeight = 151.18;
                templateOriginWidth = 226.77;
                recommendPageId = PAGE_SIZE_INFO.CUS_2.id;
                break;
            case 'LOCATION_LABEL':
                templateOriginHeight = 566.93;
                templateOriginWidth = 377.95;
                recommendPageId = PAGE_SIZE_INFO.CUS_3.id;
                break;
        }
        content.templateOriginHeight = templateOriginHeight;
        content.templateOriginWidth = templateOriginWidth;
        let sourceProperties = JSON.parse(JSON.stringify(content.templateRenderedProperties || []));
        let viewSourceList = []; // 用于预览的数据源
        if(viewSource && viewSource.length) {
            (viewSource || []).forEach(({header}, index) => {
                sourceProperties = JSON.parse(JSON.stringify(content.templateRenderedProperties || []));
                const list = sourceProperties.map(item => {
                    const { field } = item;
                    // 如果是label，直接展示label
                    const value = (header || {})[item.dataKey];
                    if(value) {
                        item.showData = (field !== SHOW_ELEMENTS.LABEL) ? value: item.showData;
                        item.isRealData = true;
                    }
                    return item;
                });
                viewSourceList[index] = list;
            });
            sourceProperties = viewSourceList[0];
        }
        this.customerValue = {
            width: content.baseInfo ? content.baseInfo.width : content.templateOriginWidth,
            height: content.baseInfo ? content.baseInfo.height  : content.templateOriginHeight
        };
        this.setState({
            content: {
                ...content,
                templateRenderedProperties: sourceProperties,
                viewSourceList
            },
            radioValue: content.radioValue || PAGE_TYPE.RECOMMEND,
            recommendPageId: content.recommendPageId || recommendPageId
        });
    }

    onChange = (e) => {
        const t = e.target.value;
        if(this.state.radioValue !== t) {
            this.state.radioValue = e.target.value;
            if(t == PAGE_TYPE.CUSTOM) {
                this.renderTicketBase({ width: this.customerValue.width, height: this.customerValue.height }); // 重新渲染
            } else if(t == PAGE_TYPE.RECOMMEND) {
                const { recommendPageId } = this.state;
                const pageList = this.getPageRecommendList();
                const info = pageList.find(item => item.id == recommendPageId);
                this.renderTicketBase({ width: mm2px(info.width), height: mm2px(info.height) }); // 重新渲染
            }
        }
    }

    getPageRecommendList = () => {
        const {
            type
        } = this.props;
        if(!type) return [];
        const templateType = getCodeById(CODE.templateType, type);
        if(!paperTypes[templateType]) return [];
        return paperTypes[templateType];
    }

    renderRightConfig = () => {
        const { recommendPageId, radioValue } = this.state;
        const pageList = this.getPageRecommendList();
        const handleChange = (prop, val) => {
            const value = mm2px(val * 10); // cm -> mm
            this.customerValue[prop] = value;
            if(this.state.radioValue == PAGE_TYPE.CUSTOM) {
                this.renderTicketBase({ [prop]: value }); // 重新渲染
            }
        };
        return <div className="property-setting">
            <div className="properties">
                <p className="title"> {this.txt.pagerSetting} </p>
                <RadioGroup onChange={this.onChange} defaultValue={radioValue}>
                    <div className="board">
                        <Row>
                            <Col span={11} offset={1}><Radio value={PAGE_TYPE.RECOMMEND}>{this.txt.recommend}:</Radio></Col>
                            <Col span={9} offset={1}>
                                <Select
                                    style={{width: '100%'}}
                                    showSearch
                                    dropdownMatchSelectWidth={false}
                                    defaultValue={recommendPageId}
                                    onChange={(id) => {
                                        const info = pageList.find(item => item.id == id);
                                        this.state.recommendPageId = id;
                                        if(this.state.radioValue == PAGE_TYPE.RECOMMEND) {
                                            this.renderTicketBase({ width: mm2px(info.width), height: mm2px(info.height) }); // 重新渲染
                                        }
                                    }}
                                >
                                    {
                                        pageList.map((item) => {
                                            return <Option key={item.id} value={item.id}>{item.id}</Option>;
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={23} offset={1}><Radio value={PAGE_TYPE.CUSTOM}>{this.txt.customize}:</Radio></Col>
                        </Row>
                        <Row>
                            <Col span={16} offset={3} >
                                <Row>
                                    <Col span={8}>{this.txt.width}</Col>
                                    <Col span={12}><InputNumber min={1} defaultValue={px2mm(this.customerValue.width) / 10} onChange={handleChange.bind(this, 'width')}/></Col>
                                    <Col span={4}>cm</Col>
                                </Row>
                                <Row>
                                    <Col span={8}>{this.txt.height}</Col>
                                    <Col span={12}><InputNumber min={1} defaultValue={px2mm(this.customerValue.height) / 10} onChange={handleChange.bind(this, 'height')} /></Col>
                                    <Col span={4}>cm</Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </RadioGroup>
            </div>
        </div>;
    }

    keyDownCb = (templateCbId, cbInfo, currentTemplateInfo) => {
        const { activeKey } = this.context;
        if(templateCbId.includes(activeKey)) {
            const { operation } = cbInfo;
            switch (operation) {
                case OPERATIONS.SAVE:
                    this.saveTemplate(currentTemplateInfo);
                    break;
            }
        }
    }

    exceedFunc = () => {
        message.error(this.txt.exceedPrintArea);
    }

    render() {
        const { pageType, sourceProperties, content, loading, showDescModal } = this.state;
        const { showQuit, onElement } = this.props;
        return loading ? <Spin spinning={loading}></Spin> : <div className="ticket-template_page">
            <TicketTemplate
                getCurrentTemplateStep={this.getCurrentTemplateStep}
                lan={getLanguage()}
                pageType={pageType}
                handleActions={this.handleActions}
                // 页面渲染相关 getCOntent content
                // templateId={templateId}
                // templateOriginHeight={templateOriginHeight}
                // templateOriginWidth={templateOriginWidth}
                // templateRenderedProperties={templateRenderedProperties}
                // showElementKey={showElementKey}
                // baseInfo={baseInfo}
                // layoutInfo={layoutInfo}
                {...content}
                properties={sourceProperties}
                showQuit={showQuit}
                onElement={onElement}
                dataInfo={this.dataInfo}
                renderRightConfig={this.renderRightConfig}
                renderTicketBase={(func) => this.renderTicketBase = func}
                keyDownCb={this.keyDownCb}
                exceedFunc={this.exceedFunc}
            />
            {
                showDescModal && <ShortCutKeysDescModal
                    title={this.txt.shortcutKeys}
                    onCancel={() => {
                        this.setState({
                            showDescModal: false
                        });
                    }}
                    txt={this.txt}
                />
            }
        </div>;
    }
}

export default TicketTemplatePage;