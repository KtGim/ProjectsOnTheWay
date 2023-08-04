import React, { PureComponent } from 'react';
import OperationBar from './OperationBar/index';
import { ELEMENTS } from '../const';
import { DISPLAY_ITEMS } from './OperationBar/const';
import { ComponentsDisplay } from '../IndexElements/index';
import { SHOW_ELEMENTS } from '../componentConfig';


class HeaderInfo extends PureComponent {
    constructor(props) {
        super(props);

        this.headerInfoRef = null;
        this.spanRefs = {};
    }

    render() {
        const {
            baseInfo,
            layoutInfo,
            activeElementInfo,
            txtInfo,
            onChange,
            propertyInfo,
            dragEnd,
            onDragStart
        } = this.props;
        const elementInfo = activeElementInfo || {
            id: ELEMENTS.MAIN,
            style: {
                ...baseInfo,
                left: baseInfo.left - layoutInfo.left,
                top: baseInfo.top - layoutInfo.top
            }
        };
        return <div className="ticket_info" ref={(ins) => { this.headerInfoRef = ins; }}>
            <OperationBar
                txtInfo={txtInfo}
                elementInfo={elementInfo}
                handleStyleChange={onChange}
                restProps={{ // 已通过透传，将子组件的属性全部传递进去, 所有组件的通用配置
                    showUnit: true,
                    onAfter: false
                }}
                customProps={{ // 自定义组件的特殊配置, 组件类型 -> 属性
                    [SHOW_ELEMENTS.BARCODE]: {  // SHOW_ELEMENTS 或者 COMMON_ELEMENTS
                        [DISPLAY_ITEMS.WIDTH]: {
                            step: 0.1
                        }
                    }
                }}
            />
            <ComponentsDisplay
                txtInfo={txtInfo}
                templatePropertiesSetting={propertyInfo}
                dragEnd={dragEnd}
                onDragStart={onDragStart}
            />
        </div>;
    }
}

export default HeaderInfo;