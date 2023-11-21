import React, { PureComponent } from 'react';
import OperationBar from './OperationBar/index';
import { ELEMENTS } from '../const';
import { DISPLAY_ITEMS } from './OperationBar/const';
import { ComponentsDisplay } from '../IndexElements/index';
import { OPERATIONS, SHOW_ELEMENTS } from '../componentConfig';


class HeaderInfo extends PureComponent {
    constructor(props) {
        super(props);

        this.headerInfoRef = null;
        this.spanRefs = {};
    }

    renderButtons = () => {
        const { txtInfo, handleActions, isEdit, activeElements = [], showQuit = true, canPrint = true } = this.props;
        const isBatch = activeElements.length;
        if(isEdit) {
            return [
                <span key="desc" onClick={handleActions.bind(this, OPERATIONS.DESC)}>{txtInfo.descForQuick}</span>,
                <span key="delete" className={isBatch ? '' : 'disabled no_border'} onClick={isBatch ? handleActions.bind(this, OPERATIONS.DELETE) : undefined}>{txtInfo.DELETE}</span>,
                <span key="preview" onClick={handleActions.bind(this, OPERATIONS.VIEW)}>{txtInfo.preview}</span>,
                showQuit && <span key="quit" onClick={handleActions.bind(this, OPERATIONS.QUIT)}>{txtInfo.quit}</span>,
                <span key="save" className="save" onClick={handleActions.bind(this, OPERATIONS.SAVE)}>{txtInfo.SAVE}</span>
            ].filter(Boolean);
        } else {
            return [
                <span key="edit" onClick={handleActions.bind(this, OPERATIONS.EDIT)}>{txtInfo.edit}</span>,
                canPrint && <span key="print" onClick={handleActions.bind(this, OPERATIONS.PRINT)}>{txtInfo.print}</span>,
                showQuit && <span key="quit" onClick={handleActions.bind(this, OPERATIONS.QUIT)}>{txtInfo.quit}</span>
            ].filter(Boolean);
        }
    }

    preventEvent = (e) => {
        e.preventDefault();
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
            onDragStart,
            isEdit = false,
            onElement = false
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
                visible={isEdit}
                txtInfo={txtInfo}
                elementInfo={elementInfo}
                handleStyleChange={onChange}
                restProps={{ // 已通过透传，将子组件的属性全部传递进去, 所有组件的通用配置
                    // showUnit: true,
                    onAfter: false
                }}
                customProps={{ // 自定义组件的特殊配置, 组件类型 -> 属性
                    [SHOW_ELEMENTS.BARCODE]: {  // SHOW_ELEMENTS 或者 COMMON_ELEMENTS
                        [DISPLAY_ITEMS.WIDTH]: {
                            step: 0.1,
                            needTrans: false
                        }
                    }
                }}
                onElement={onElement}
            />
            <div
                className="operations"
                onDragOver={this.preventEvent}
                onDragEnd={this.preventEvent}
            >
                <ComponentsDisplay
                    visible={isEdit}
                    txtInfo={txtInfo}
                    templatePropertiesSetting={propertyInfo}
                    dragEnd={dragEnd}
                    dragStart={onDragStart}
                    showIcon
                />
                <div className="button-group">{this.renderButtons()}</div>
            </div>
        </div>;
    }
}

export default HeaderInfo;