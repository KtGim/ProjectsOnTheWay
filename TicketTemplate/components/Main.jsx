import React, { Component } from 'react';

import { BASE_DISTANCE, DRAG_ITEM_BASE_CLASS, ELEMENTS, MODES, SPLITOR } from '../const';
import HeaderInfo from './HeaderInfo';
import Element from './ElementsBoundry/index';
import { calculatePosition, doNotShowDragBar, renderInitData } from '../funcs';
import SettingIcon from './OperationBar/SettingIcon';
import { DATA_ICONS, SHOW_ELEMENTS_KEY_TO_COMPONENT } from '../componentConfig';
import { Actions } from './common/index';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDrag: MODES.SHOW == this.props.mode, // 是否可以进行拖拽

            activeIndex: -1,
            styleList: [
                {
                    left: 0,
                    top: 0
                }, // left_top
                {
                    left: 0,
                    top: 0
                }, // right_top
                {
                    left: 0,
                    top: 0
                }, // left_bottom
                {
                    left: 0,
                    top: 0
                } // rignt_bottom
            ],
            showDragIndex: 4, // 显示某一个拖拽按钮, 目前默认右下角
            // 预览模式下的拖拽样式
            viewStyle: {
                left: 0,
                top: 0,
                isDrag: false
            },
            hoverElement: null // 鼠标悬浮的元素

            // maxBoundry: {   // 计算拖拽极值
            //     right: 0,
            //     bottom: 0,
            //     left: 0,
            //     top: 0
            // },
        };

        this.ref = null;     // 拖拽区域信息
        this.headerRef = null; // 信息头实例
        this.mainRef = null; // 画布实例
        this.elementRef = null; // 元素实例
        this.settingIconRef = null; // 设置图标实例

        DRAG_ITEM_BASE_CLASS.forEach(key => {
            this[key] = null;
        });

    }

    /**
     * 获取当前主区域的信息
     * @param {是否是页面初始化时的计算} init boolean
     */
    computedCurrentMainArea = (init) => {
        // 原始宽高
        const {
            layoutInfo,
            baseInfo
        } = this.props;
        if(!this.mainRef) {
            console.error('Render View occurred error');
            return;
        }

        const {  // 背景大小
            height,
            width,
            top,
            left,
            right,
            bottom
        } = this.mainRef.getBoundingClientRect();

        let baseHeight = baseInfo.height;
        let baseWidth = baseInfo.width;
        // let baseTop = top + Math.abs(BASE_DISTANCE);
        let baseTop = top;
        // let baseLeft = (width - baseWidth) / 2 + left; // 居中
        // let baseLeft = left + Math.abs(BASE_DISTANCE);
        let baseLeft = left;
        if(!init) {
            baseTop = baseInfo.top;
            baseLeft = baseInfo.left;
        }
        // 使用 this.state 临时储存一下 数据
        const baseInfoTemp = {
            // 初始化时模板的原始宽高取默认值
            height: baseHeight,
            width: baseWidth,
            top: baseTop,
            left: baseLeft,
            right: baseLeft + baseWidth,
            bottom: baseTop + baseHeight
        };
        const layoutInfoTemp = {
            ...layoutInfo,
            height: height,
            width,
            top,
            left,
            right,
            bottom
        };
        this.setArea(baseWidth, baseHeight, baseInfoTemp, layoutInfoTemp);
    }

    // 区域元素拖拽
    onStart = (index) => {
        const {
            activeIndex
        } = this.state;
        let actIndex = activeIndex;
        if(actIndex == -1) {
            actIndex = index;
        } else {
            // 拖拽结束时调用，保存步骤
            actIndex = -1;
        }
        this.setState({
            activeIndex: actIndex
        });
    }

    setArea = (widthTemp, heightTemp, baseInfoInit = this.props.baseInfo, layoutInfoInit = this.props.layoutInfo) => {
        const styleList = calculatePosition(widthTemp, heightTemp);
        this.setState({
            styleList
        }, () => {
            this.props.handleInfo && this.props.handleInfo({
                baseInfo: {
                    height: heightTemp,
                    width: widthTemp,
                    ...baseInfoInit
                },
                layoutInfo: {...layoutInfoInit}
            });
        });
    }

    static getDerivedStateFromProps(nextProps) {
        const { baseInfo, activeElementInfo } = nextProps;
        if(!baseInfo) {
            console.error('baseInfo is required');
            return {};
        }
        if(!activeElementInfo) {
            return {
                hoverElement: null,
                hoverStyle: {},
                styleList: calculatePosition(baseInfo.width, baseInfo.height)
            };
        } else {
            const { style } = activeElementInfo;
            return {
                hoverElement: activeElementInfo,
                hoverStyle: {
                    top: style.top + baseInfo.top,
                    left: style.left + baseInfo.left,
                    width: style.width,
                    height: style.height
                },
                styleList: calculatePosition(baseInfo.width, baseInfo.height)
            };
        }
    }

    // 若拽按钮元素拖拽
    handleMouseMove = ({clientY, clientX}) => {
        const {
            showDrag,
            activeIndex
        } = this.state;
        if(!showDrag || activeIndex < 0) return;
        const {
            layoutInfo,
            baseInfo
        } = this.props;
        // 超出画布不允许 达到极值不做更改
        if(
            clientY <= layoutInfo.top ||
            clientY >= layoutInfo.bottom ||
            clientX <= layoutInfo.left ||
            clientX >= layoutInfo.right
        ) {
            return;
        }
        const { top, left, width, height } = baseInfo;
        let heightTemp = 0;
        let widthTemp = 0;
        let baseInfoInit = {};
        if(activeIndex == 3) { // 右下， top left 不会变
            if(
                clientX <= left || clientY <= top
            ) {
                return;
            }
            heightTemp = clientY - top;
            widthTemp = clientX - left;
            baseInfoInit = { left, top };
        } else if(activeIndex == 2) { // 左下， top right 不会变
            const maxLeft = left + width;
            if(
                clientX >= maxLeft ||
                clientY <= top
            ) {
                return;
            }
            heightTemp = clientY - top;
            widthTemp = maxLeft - clientX;
            baseInfoInit = { left: clientX, top };
        } else if(activeIndex == 1) { // 右上  bottom left 不会变
            const maxTop = top + height;
            if(clientX <= left || top >= maxTop) {
                return;
            }
            heightTemp = maxTop - clientY;
            widthTemp = clientX - left;
            baseInfoInit = { left, top: clientY };
        } else if(activeIndex == 0) { //左上   bottom right 不会变
            const maxTop = top + height;
            const maxLeft = left + width;
            if(clientX >= maxLeft || top >= maxTop) {
                return;
            }
            heightTemp = maxTop - clientY;
            widthTemp = maxLeft - clientX;
            baseInfoInit = { left: clientX, top: clientY };
        }
        this.setArea(widthTemp, heightTemp, baseInfoInit);
    }

    dragEnd = (element, e) => {
        e.preventDefault();
        const { dragEnd } = this.props;
        if(element) { // 拖拽元素
            dragEnd(element, this[this.getElementKey(element)], e);
        } else { // 拖拽画布
            dragEnd(element, this.ref, e);
        }
    }

    getElementKey = (element) => {
        const { propertyInfo } = this.props;
        return `${element[propertyInfo.primaryKey]}${SPLITOR}${element.id}`;
    }

    renderDragItemLayouts = (templateRenderedProperties, index) => {
        const {
            hoverElement,
            showDrag
        } = this.state;
        const {
            layoutInfo, baseInfo, onDragOver, dragStart, dragEnd, activeElement, activeElementInfo, isEdit, isPreview
        } = this.props;
        const { top, left, height = 0, width = 0 } = baseInfo;
        const style = {
            left: (left || 0) - (layoutInfo.left || 0),
            top: (top || 0) - (layoutInfo.top || 0),
            height,
            width,
            backgroundColor: isEdit ? '#5d5c1317' : undefined
        };
        const clas = ['ticket-main--content'];
        if(!isEdit) {
            clas.push('inherit');
        }
        if(isPreview) {
            clas.push('origin');
        }
        if(index > 0) {
            clas.push('siblings');
        }
        return <div
            ref={(ins) => { this.ref = ins; }}
            className={clas.join(' ')}
            id={ELEMENTS.MAIN}
            key={`${ELEMENTS.MAIN}${SPLITOR}${index}`}
            draggable={false}
            style={style}
            onDragOver={isEdit ? onDragOver : undefined}
            onClick={isEdit ? activeElement : undefined}
        >
            <Element
                baseInfo={baseInfo}
                onDragEnd={dragEnd}
                onDragStart={dragStart}
                activeElementInfo={activeElementInfo}
                showDragActionBar={activeElementInfo && !doNotShowDragBar(activeElementInfo.field)}
                ref={(ins) => { this.elementRef = ins; }}
            >
                {
                    this.renderDragItems(templateRenderedProperties)
                }
            </Element>
            {
                this.showDragBars(showDrag)
            }
            {isEdit && hoverElement && this.renderOperationBar(true)}
        </div>;
    }

    renderDragItems = (templateRenderedProperties) => {
        const { propertyInfo, dragStart, activeElementInfo, activeElements,
            replaceActiveElementsInfo, isEdit, total, current, isPreview, pageType} = this.props;
        return (templateRenderedProperties || []).map(element => {
            const { field, info, componentProps } = renderInitData(element, propertyInfo.labelKey, total, current, pageType);
            const Com = SHOW_ELEMENTS_KEY_TO_COMPONENT[field];
            let className = (activeElementInfo && activeElementInfo.id == element.id) ? 'property drawing' : (isEdit ? 'property' : 'property no_border');
            const isInBatch = activeElements && activeElements.length > 0 && activeElements.some(item => item.id == element.id);
            className = isInBatch ? `${className} batch-item` : className;
            return <div
                draggable={isEdit}
                className={className}
                style={element.style}
                ref={ins => { this[this.getElementKey(element)] = ins; }}
                key={element.id}
                onDragEnd={isEdit ? this.dragEnd.bind(this, element) : undefined}
                onDragStart={isEdit ? dragStart : undefined}
                id={`${ELEMENTS.PROPERTY_IN_DRAW}${SPLITOR}${element.id}`}
            >
                {Com ? <Com isPreview={!isEdit || isPreview} elementProps={element} componentProps={componentProps} value={info} onChange={replaceActiveElementsInfo}  /> : (info)}
            </div>;
        });
    }

    onBarDragEnd = ({clientX, clientY}) => {
        if(this.state.barItem) {
            this.setArea(clientX + BASE_DISTANCE - this.currentBaseInfo.left, clientY + BASE_DISTANCE - this.currentBaseInfo.top, {
                left: this.currentBaseInfo.left,
                top: this.currentBaseInfo.top
            }, {
                left: this.currentLayoutInfo.left,
                top: this.currentLayoutInfo.top,
                width: this.currentLayoutInfo.width,
                height: this.currentLayoutInfo.height
            });
            this.state.barItem.style.display = 'block';
            this.state.barItem.target = null;
            this.state.barItem = null;
            this.currentLayoutInfo = null;
            this.currentBaseInfo = null;
        }
    }

    onBarDragStart = (e) => {
        this.state.barItem = e.target;
        this.currentLayoutInfo = this.mainRef.getBoundingClientRect();
        this.currentBaseInfo = this.ref.getBoundingClientRect();
    }

    onDragOver = (e) => {
        e.preventDefault();
        const { onDragOver } = this.props;
        const { showDragIndex } = this.state;
        if(this.state.barItem && this.currentBaseInfo && this.currentLayoutInfo && showDragIndex >= 1) {
            const target = this.state.barItem;
            const { clientX, clientY } = e;
            const { left, top } = this.currentLayoutInfo;
            target.style.left = `${clientX - left + BASE_DISTANCE + ((BASE_DISTANCE) / 2)}px`;
            target.style.top = `${clientY - top + BASE_DISTANCE + ((BASE_DISTANCE) / 2)}px`;
            target.style.display = 'none';
            // this.setArea(clientX + BASE_DISTANCE - baseInfo.left, clientY + BASE_DISTANCE - baseInfo.top);  // 比较卡
            // 下面的方式比较流畅， 本身 react 最终也是需要经过 dom 操作的，而且还有其本身的框架逻辑所以直接使用 style 效果比使用 state 更好
            this.ref.style.width = `${clientX + BASE_DISTANCE - this.currentBaseInfo.left}px`;
            this.ref.style.height = `${clientY + BASE_DISTANCE - this.currentBaseInfo.top}px`;
        } else {
            onDragOver && onDragOver(e);
        }
    }

    showDragBars = (showDrag) => {
        const { styleList, showDragIndex } = this.state;
        const { isEdit } = this.props;
        if(!isEdit) return null;
        if(showDragIndex >= 1) {
            const index = showDragIndex - 1;
            return <div
                key={DRAG_ITEM_BASE_CLASS[index]}
                ref={(ins) => { this[DRAG_ITEM_BASE_CLASS[index]] = ins; }}
                className={`drag_item ${DRAG_ITEM_BASE_CLASS[index]} show`}
                style={styleList[index]}
                draggable={showDrag}
                onDragStart={this.onBarDragStart}
                onDragEnd={this.onBarDragEnd}
                // onClick={this.onStart.bind(this, index)} // 目前不支持点击拖拽
            />;
        } else {
            return styleList.map((style, index) => {
                const className = showDrag ? `drag_item ${DRAG_ITEM_BASE_CLASS[index]} show` : `drag_item ${DRAG_ITEM_BASE_CLASS[index]} hide`;
                return  <div
                    key={DRAG_ITEM_BASE_CLASS[index]}
                    ref={(ins) => { this[DRAG_ITEM_BASE_CLASS[index]] = ins; }}
                    className={className}
                    style={style}
                    draggable={showDrag}
                    // onClick={this.onStart.bind(this, index)}
                />;
            });
        }
    }

    /**
     * 根据 props.renderExtraction 返回想要的DOM
     * @param {boolean} 是否正在拖拽种 isDrag
     * @returns {ReactNode}
     */
    renderOperations = (isDrag) => {
        const {
            layoutInfo,
            renderExtraction,
            isEdit
        } = this.props;

        const operationStyle = {
            width: layoutInfo.width
        };
        const operationClassName = 'ticket-main--operation';
        return (isEdit && renderExtraction && !isDrag) ? <div className={operationClassName} style={operationStyle}>
            {renderExtraction && renderExtraction()}
        </div> : null;
    }

    /**
     * 操作栏图标
     * @returns {ReactNode}
     */
    renderOperationBar = (onElement = false) => {
        const { hoverStyle } = this.state;
        const { replaceActiveElementsInfo, activeElementInfo, onDelete } = this.props;
        return <SettingIcon
            activeStyle={hoverStyle}
            txtInfo={this.props.txtInfo}
            elementInfo={activeElementInfo}
            getInstance={(ins) => { this.settingIconRef = ins; }}
            onClick={replaceActiveElementsInfo}
            onDelete={onDelete}
            onElement={onElement}
        />;
    }

    // 预览模式下的拖拽
    dragContainerStart = (e) => {
        const {
            left,
            top
        } = e.target.getBoundingClientRect();
        this.state.viewStyle = {
            leftDistance: e.clientX - left,
            topDistance: e.clientY - top,
            startTarget: e.target,
            isDrag: true
        };
    }

    // 预览模式下的拖拽
    dragContainerEnd = (e) => {
        e.preventDefault();
        const {leftDistance, topDistance} = this.state.viewStyle;
        this.state.viewStyle = {
            left: e.clientX - leftDistance,
            top: e.clientY - topDistance,
            isDrag: false
        };
    }

    // 预览模式下的拖拽
    onMouseMove = (e) => {
        e.preventDefault();
        const { clientX, clientY } = e;
        const viewStyle = this.state.viewStyle;
        if(viewStyle.isDrag) {
            viewStyle.startTarget.style.left = `${clientX - viewStyle.leftDistance}px`;
            viewStyle.startTarget.style.top = `${clientY - viewStyle.topDistance}px`;
            viewStyle.startTarget.style.transform = 'translateX(0)';
        }
    }

    render() {
        const { showDrag, activeIndex } = this.state;
        const {
            txtInfo, baseInfo, layoutInfo, replaceActiveElementsInfo,
            handleActions, isEdit, action, className, actionItems, propertyInfo, dragStart, dragEnd,
            isPreview = false, showActions = false, activeElementInfo, activeElements, showQuit,
            viewSourceList = [], sourceMax = 2, templateRenderedProperties, onElement = false
        } = this.props;
        if(!baseInfo) {
            console.error('baseInfo is required');
            return null;
        }
        // 此时可以改变模板的大小
        const canChangeTemplate = !(!showDrag || activeIndex < 0);
        let containerStyle = {
            // minWidth: baseInfo.width
        };
        const cls = isEdit ? 'draw-container' : 'draw-container ticket-center';
        const mainProps = isEdit ? {
            draggable: true,
            onMouseMove: this.handleMouseMove,
            onDragOver: this.onDragOver
        } : {};
        let containerProps = {};
        if(isPreview) { // // View.OpenView 的参数 和 pageType 不同
            containerStyle = this.state.viewStyle.isDrag ? {
                width: baseInfo.width,
                height: baseInfo.height,
                left: this.state.viewStyle.left,
                top: this.state.viewStyle.top
            } : {
                width: baseInfo.width,
                height: baseInfo.height
            };
            //  预览模式 展示边框
            containerStyle.height = containerStyle.height + 2;
            containerStyle.width = containerStyle.width + 2;

            //  预览模式 直接可以拖拽
            containerProps = {
                draggable: true,
                onDragStart: this.dragContainerStart,
                onDragEnd: this.dragContainerEnd,
                onDragOver: this.onMouseMove
            };
        }
        let showSource = [templateRenderedProperties];
        if(!isEdit && viewSourceList && viewSourceList.length) { // 最多只展示两张
            showSource = viewSourceList.slice(0, sourceMax);
        }
        return <div
            className={className ? `${cls} ${className}` : cls}
            style={containerStyle}
            {...containerProps}
        >
            {!isPreview && <HeaderInfo
                baseInfo={baseInfo}
                layoutInfo={layoutInfo}
                activeElementInfo={activeElementInfo}
                activeElements={activeElements}
                txtInfo={txtInfo}
                ref={(ins) => { this.headerRef = ins; }}
                propertyInfo={propertyInfo}
                onChange={replaceActiveElementsInfo}
                dragEnd={dragEnd}
                onDragStart={dragStart}
                handleActions={handleActions}
                isEdit={isEdit}
                showQuit={showQuit}
                onElement={onElement}
            />}
            <div
                ref={(ins) => { this.mainRef = ins; }}
                className={isEdit ? 'ticket-main' : 'ticket-main inherit'}
                id={ELEMENTS.LAYOUT}
                {...mainProps}
            >
                {
                    showSource.map(this.renderDragItemLayouts)
                }
                {this.renderOperations(canChangeTemplate)}
            </div>
            {showActions && <Actions
                textInfo={txtInfo}
                handleClick={handleActions}
                isEdit={isEdit}
                showInTime={action == DATA_ICONS.OPEN_EYES}
                showItems={actionItems}
            />}
        </div>;
    }
}

export default Main;