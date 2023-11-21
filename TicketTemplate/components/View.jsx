import React from 'react';
import { render } from 'react-dom';
import { LANGUAGE_KEY, MODES } from '../const';
import Main from './Main';
import { DATA_ICONS, SHOW_ELEMENTS } from '../componentConfig';
import * as language from '../language/index';

import '../index.less';
import { createViewRoot, injectIcon } from '../funcs';

/**
 * action === DATA_ICONS.OPEN_EYES 预览通用
 */
class View extends React.Component {

    state = {
        txtInfo: {},
        current: 0            // 当前打印的页数，也可用于判断是否需要重新渲染
    }

    static openView = (props) => {
        render(<View key={props.id} id={props.id} {...props} />, createViewRoot());
    }

    static closeView = () => {
        const root = createViewRoot();
        root && root.remove();
    }

    componentDidMount() {
        injectIcon();
        const { print } = this.props;
        if(print) {
            print();
        }
    }

    static getDerivedStateFromProps(props) {
        const { lan } = props;
        return {
            txtInfo: language[lan || LANGUAGE_KEY.ZH] || language[LANGUAGE_KEY.ZH]
        };
    }

    componentDidUpdate(props) {
        const { print, current, total } = props;
        if(print && current !== this.state.current) { // 增加判断，避免重复打印和渲染
            this.setState({
                current
            }, () => {
                if(total !== current) { // 初始的时候会自动打印一份，所以最后一页不需要再打印一次
                    print();
                }
            });
        }
    }

    /**
     * https://best-inc.feishu.cn/wiki/QxEywSIEqiOX3oko8W3cdMYNnoe
     * @returns {{Array}} 返回数据源绑定的数据
     */
    renderSource = () => {
        const { dataSource, templateRenderedProperties, isView = false } = this.props;
        if(!dataSource && !isView) {
            return templateRenderedProperties;
        }
        // console.log(dataSource, templateRenderedProperties, 'View');
        return templateRenderedProperties.map(item => {
            const { field } = item;
            // 如果是label，直接展示label
            item.showData = (field !== SHOW_ELEMENTS.LABEL) ?
                (
                    isView ? 'XXXXXX' : dataSource[item.dataKey]
                ) : item.showData;
            return item;
        });
    }

    handleActions = (action) => {
        const { handleActions } = this.props;
        handleActions && handleActions(action);
    }

    render() {
        /**
         * 直接把模板数据的所有属性传入就可以生成预览
         * 具体数据需要展示时，直接把 templateRenderedProperties 的展示属性修改掉即可
         */
        const {
            layoutInfo,
            templateOriginHeight,
            templateOriginWidth,
            baseInfo,
            templatePropertiesSetting,

            actionItems,
            total,
            current,
            isHide = false
        } = this.props;
        const classNames = ['ticket-show-in-time'];
        if(isHide) {
            classNames.push('print-in-hide');
        } else {
            classNames.push('print-in-view');
        }
        return <Main
            key="ticket-show-in-time"
            className={classNames.join(' ')}
            layoutInfo={layoutInfo}
            templateOriginHeight={templateOriginHeight}
            templateOriginWidth={templateOriginWidth}
            baseInfo={baseInfo}
            txtInfo={this.state.txtInfo}
            mode={MODES.SHOW}
            templateRenderedProperties={this.renderSource()}
            propertyInfo={templatePropertiesSetting}
            handleActions={this.handleActions}
            actionItems={actionItems}
            action={DATA_ICONS.OPEN_EYES}
            total={total}
            current={current}
            isPreview
        />;
    }
}

export default View;