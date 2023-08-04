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
            layoutInfo: {
                left: 0,
                top: 0
            },
            baseInfo: {},  // 左上角的相对于屏幕
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

    componentDidMount() {
        this.computedCurrentMainArea(true);
    }

    componentDidUpdate(nextProps, nextState) {
        /**
         * 不用 setTimeout 的话这个数据的改变总是会滞后，导致获取的信息不准确
         * 保证在 react 渲染之后获取到正确的 UI 布局数据
         */
        const {
            baseInfo,
            layoutInfo
        } = nextProps;
        setTimeout(() => {
            const {
                left
            } = this.mainRef.getBoundingClientRect();
            /**
             * 通过 state 的 一致性确定是否需要更改数据
             */
            if(nextState.layoutInfo.left !== left) {
                const leftDistance = layoutInfo.left - left;

                const baseInfoTemp = {
                    ...baseInfo,
                    left: baseInfo.left - leftDistance
                };

                const layoutInfoTemp = {
                    ...layoutInfo,
                    left
                };
                this.setState({
                    baseInfo: baseInfoTemp,
                    layoutInfo: layoutInfoTemp
                }, () => {
                    nextProps.handleInfo && nextProps.handleInfo({
                        baseInfo: baseInfoTemp,
                        layoutInfo: layoutInfoTemp
                    });
                });
            }
        }, 0);
    }

    /**
     * 获取当前主区域的信息
     * @param {是否是页面初始化时的计算} init boolean
     */
    computedCurrentMainArea = (init) => {
        // 原始宽高
        const {
            templateOriginWidth,
            templateOriginHeight,
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

        let baseHeight = templateOriginHeight;
        let baseWidth = templateOriginWidth;
        let baseTop = top + Math.abs(BASE_DISTANCE);
        // let baseLeft = (width - baseWidth) / 2 + left; // 居中
        let baseLeft = left + Math.abs(BASE_DISTANCE);
        if(!init) {
            baseHeight = baseInfo.height;
            baseWidth = baseInfo.width;
            baseTop = baseInfo.top;
            baseLeft = baseInfo.left;
        }
        // 使用 this.state 临时储存一下 数据
        this.state.baseInfo = {
            // 初始化时模板的原始宽高取默认值
            height: baseHeight,
            width: baseWidth,
            top: baseTop,
            left: baseLeft,
            right: baseLeft + baseWidth,
            bottom: baseTop + baseHeight
        };
        this.state.layoutInfo = {
            ...layoutInfo,
            height: height,
            width,
            top,
            left,
            right,
            bottom
        };
        this.setArea(baseWidth, baseHeight);
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
            this.props.saveTemplateInfo();
        }
        this.setState({
            activeIndex: actIndex
        });
    }

    setArea = (widthTemp, heightTemp, baseInfoInit = {}) => {
        const styleList = calculatePosition(widthTemp, heightTemp);
        this.setState({
            styleList,
            baseInfo: {
                ...this.state.baseInfo,
                height: heightTemp,
                width: widthTemp,
                ...baseInfoInit
            },
            layoutInfo: { ...this.state.layoutInfo }
        }, () => {
            this.props.handleInfo && this.props.handleInfo({
                baseInfo: this.state.baseInfo,
                layoutInfo: this.state.layoutInfo
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
                    top: style.top,
                    left: style.left,
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

    renderDragItems = (showDrag) => {
        const {
            styleList,
            hoverElement
        } = this.state;
        const {
            layoutInfo, baseInfo, templateRenderedProperties,
            propertyInfo, onDragOver, dragStart, dragEnd, activeElement, activeElementInfo,
            replaceActiveElementsInfo, isEdit, total, current
        } = this.props;
        const { top, left, height = 0, width = 0 } = baseInfo;
        const style = {
            left: (left || 0) - (layoutInfo.left || 0),
            top: (top || 0) - (layoutInfo.top || 0),
            height,
            width
        };
        return <div
            ref={(ins) => { this.ref = ins; }}
            className={isEdit ? 'ticket-main--content' : 'ticket-main--content inherit'}
            id={ELEMENTS.MAIN}
            onDragEnd={isEdit ? this.dragEnd.bind(this, null) : undefined}
            onDragStart={isEdit ? dragStart : undefined}
            draggable={isEdit}
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
                    (templateRenderedProperties || []).map(element => {
                        const { field, info, componentProps } = renderInitData(element, propertyInfo.labelKey, total, current);
                        const Com = SHOW_ELEMENTS_KEY_TO_COMPONENT[field];
                        const className = (activeElementInfo && activeElementInfo.id == element.id) ? 'property drawing' : (isEdit ? 'property' : 'property no_border');
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
                            {Com ? <Com elementProps={element} componentProps={componentProps} value={info} onChange={replaceActiveElementsInfo}  /> : (info)}
                        </div>;
                    })
                }
            </Element>
            {
                isEdit && styleList.map((style, index) => {
                    const className = showDrag ? `drag_item ${DRAG_ITEM_BASE_CLASS[index]} show` : `drag_item ${DRAG_ITEM_BASE_CLASS[index]} hide`;
                    return  <div
                        key={DRAG_ITEM_BASE_CLASS[index]}
                        ref={(ins) => { this[DRAG_ITEM_BASE_CLASS[index]] = ins; }}
                        className={className} style={style}
                        draggable={showDrag}
                        onClick={this.onStart.bind(this, index)}
                    />;
                })
            }
            {isEdit && hoverElement && this.renderOperationBar()}
        </div>;
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
    renderOperationBar = () => {
        const { hoverStyle } = this.state;
        const { baseInfo, layoutInfo, replaceActiveElementsInfo, activeElementInfo, onDelete } = this.props;
        return <SettingIcon
            activeStyle={hoverStyle}
            txtInfo={this.props.txtInfo}
            elementInfo={activeElementInfo}
            getInstance={(ins) => { this.settingIconRef = ins; }}
            style={{
                width: layoutInfo.width - baseInfo.left + layoutInfo.left - hoverStyle.left - 5
            }}
            onClick={replaceActiveElementsInfo}
            onDelete={onDelete}
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
        const { showDrag, activeIndex, layoutInfo } = this.state;
        const {
            txtInfo, baseInfo, activeElementInfo, layoutInfo: layoutInfoProps, replaceActiveElementsInfo,
            handleActions, isEdit, action, className, actionItems, propertyInfo, dragStart, dragEnd
        } = this.props;
        if(!baseInfo) {
            console.error('baseInfo is required');
            return null;
        }
        // 此时可以改变模板的大小
        const canChangeTemplate = !(!showDrag || activeIndex < 0);
        const mainStyle= isEdit ?{
            height: layoutInfo.height || layoutInfoProps.height
        } : {};
        const containerStyle = isEdit ? {
            minWidth: baseInfo.width
        } : {
            width: baseInfo.width,
            height: baseInfo.height
        };
        const cls = isEdit ? 'draw-container' : 'draw-container ticket-center';
        const props = isEdit ? {
            draggable: false
        } : {
            draggable: true,
            onDragStart: this.dragContainerStart,
            onDragEnd: this.dragContainerEnd,
            onDragOver: this.onMouseMove
        };
        return <div
            className={className ? `${cls} ${className}` : cls}
            style={containerStyle}
            {...props}
        >
            {isEdit && <HeaderInfo
                baseInfo={baseInfo}
                layoutInfo={layoutInfo}
                activeElementInfo={activeElementInfo}
                txtInfo={txtInfo}
                ref={(ins) => { this.headerRef = ins; }}
                propertyInfo={propertyInfo}
                onChange={replaceActiveElementsInfo}
                dragEnd={dragEnd}
                onDragStart={dragStart}
            />}
            <div
                ref={(ins) => { this.mainRef = ins; }}
                className={isEdit ? 'ticket-main' : 'ticket-main inherit'}
                onMouseMove={isEdit ? this.handleMouseMove : undefined}
                style={mainStyle}
                onDragOver={isEdit ? this.props.onDragOver : undefined}
                id={ELEMENTS.LAYOUT}
            >
                {this.renderDragItems(showDrag)}
                {this.renderOperations(canChangeTemplate)}
            </div>
            <Actions
                textInfo={txtInfo}
                handleClick={handleActions}
                isEdit={isEdit}
                showInTime={action == DATA_ICONS.OPEN_EYES}
                showItems={actionItems}
            />
        </div>;
    }
}

export default Main;