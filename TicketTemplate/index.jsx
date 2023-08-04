import React, { Component } from 'react';

import Main from './components/Main';
import { ELEMENTS, LAYOUT_INDEX, MODES, SAVE_STEP_BY_TIMELINE, SPLITOR, PRE_FIX_KEY, LINE_POSITION, BAR_FIX_POSITION, LANGUAGE_KEY, TEMPLATE_PREFIX } from './const';
import { findParent, getDraggingElement, getFinalHeight, getFinalLeft, getFinalTop, getFinalWidth, getMainByDrop, injectIcon, isNotBindField, setDragBarPosition, sourceModalEdit, toImage } from './funcs';
import * as language from './language/index';
import { DATA_ICONS, OPERATIONS, SHOW_ELEMENTS } from './componentConfig';
import { OPERATION_BAR_ID } from './components/OperationBar/const';
import View from './components/View';
import { ComponentsDisplay, Left } from './IndexElements/index';

import './index.less';
/**
 * 每次停止拖动就会存储历史，目前缓存在本地
 * STPES_INFO：
 *  [key]: 操作时间
 *  [value]: 这个时间段保存的模板班数据
 */
const STPES_INFO = JSON.parse(localStorage.getItem(SAVE_STEP_BY_TIMELINE) || '[]');

class TicketTemplate extends Component {

    constructor(props) {
        super(props);
        // 初始化时生成当前元素的 id
        this.templateId = `${TEMPLATE_PREFIX}${SPLITOR}${new Date().getTime()}`;
        this.state = {
            templateOriginWidth: 400,
            templateOriginHeight: 550,
            baseInfo: { // 当前编辑区域在页面中的位置和大小信息
                left: 0,
                top: 0,
                height: 0,
                width: 0
            },
            layoutInfo: { // 模板固定大小
                left: 0,
                top: 0,
                height: 700,
                width: '100%'
            },

            limitMaxSteps: 10,
            /**
             * templateRenderedProperties 元素
             * {
                    id,             // 当前属性的唯一值，由前端生成
                    ...elementInfo, // 模板属性的基础信息
                    style: {        // 样式信息
                        position: 'absolute',
                        zIndex: LAYOUT_INDEX.PROPERTY_IN_DRAW,
                        height: elementProperty.height,
                        width: elementProperty.width,
                        left: clientX + elementProperty.width > (left + width) ? (clientX - ((clientX + elementProperty.width) - (left + width)) - left) : clientX - left,
                        top: clientY + elementProperty.height > (top + height) ? (clientY - ((clientY + elementProperty.height) - (top + height)) - top) : clientY - top
                    },
                    field,          // 元素所属的组件类型 SHOW_ELEMENTS, COMMON_ELEMENTS 的枚举值
                    showData,       // 匹配数据项后需要需要展示的值 item[dataKey] = showData, 也可以固定写死不随数据源变化，比如标签组件 SHOW_ELEMENTS.LABEL
                    dataKey,        // 数据项的key, 依据这个和数据源进行匹配
                    dataKeyLabel    // 数据项的名称, 模板编辑时使用
                };
             */
            templateRenderedProperties: [],
            pageType: OPERATIONS.EDIT,  // 页面类型，编辑或者预览
            action: OPERATIONS.EDIT,    // 当前操作类型，编辑或者预览

            currentDragItemPosition: {},   // 当前拖拽的对象的位置信息
            showElementKey: 1,               // 元素属性的 唯一属性,递增,前端控制

            activeElementInfo: null   // 当前鼠标激活对象
        };

        this.ticketRef = null;
        this.mainRef = null;
        this.templatePropertiesSetting= {
            labelKey: 'name',
            primaryKey: 'field',
            fieldKey: 'field'
        };

        /**
         * 不会实时更新数据
         * 可以存储变化的值
         */
        this.draggingElementProperty = null; // 拖拽中的元素信息

        injectIcon();
    }

    static toImage = toImage;

    componentDidMount() {
        const { lan } = this.props;
        this.setState({
            txtInfo: language[lan || LANGUAGE_KEY.ZH] || language[LANGUAGE_KEY.ZH]
        });

        /**
         * 窗口或元素变化时需要对位置进行的计算
         * https://best-inc.feishu.cn/wiki/BYrnwo4k2i10iOkuKkVcgKAmn6b
         * 
         * 1. 监听窗口变化时，更改 画布 的位置信息
         * 
         * 2. TODO: 当主要 DOM style 变化时需要更改画布的位置信息, 此时需要传入一个回调函数返回重新计算的函数（暂时未实现）
         * 
         * 3. 监听元素是否被叠加（挡住）
         */
        // 监听窗口变化时，更改 画布 的位置信息
        this.addResizeFunction(true);
        // 监听元素是否被叠加（挡住）
        // this.isIntersecting();
    }

    isIntersecting = () => {
        const root = this.ticketRef.parentNode;
        if(!root) return;
        const options = {
            // 表示重叠面积占被观察者的比例，从 0 - 1 取值，
            // 1 表示完全被包含
            threshold: 1.0,
            root // 必须是目标元素的父级元素
        };
        const observer = new IntersectionObserver((entries) => {
            /**
             * 似乎具有迟滞性，
             * 当 isIntersecting （是否折叠） 为 false 时，元素不在在可视区域内： false => 隐藏
             * 当 isIntersecting 为 true 时，元素在可视区域内: true => 展示
             * 
             * 提供 hideTemplate 方法用于矫正不同情况下的值
             * */
            const { isIntersecting } = entries[0];
            this.isIntersecting = isIntersecting;
            if(!this.isIntersecting) {
                const { hidePage } = this.props;
                hidePage && hidePage({...this.saveTemplateInfo(), templateId: this.templateId });
            }
        }, options);

        observer.observe(this.ticketRef);
    }

    addResizeFunction = (subscribe) => {
        // 窗口变化时，重新计算相关属性
        if(subscribe) {
            window.onresize = () => {
                // 当前的模板才需要重新计算
                if(this.ticketRef.id == this.templateId && this.isIntersecting) {
                    this.mainRef.computedCurrentMainArea();
                }
            };
        } else {
            window.onresize = null;
        }
    }

    componentWillUnmount() {
        this.addResizeFunction(false);
    }

    static getDerivedStateFromProps(props) {
        const { lan, pageType } = props;
        return {
            txtInfo: language[lan || LANGUAGE_KEY.ZH] || language[LANGUAGE_KEY.ZH],
            pageType
        };
    }

    getTemplateInfo = (templateInfo) => {
        this.setState(templateInfo);
    }

    saveInfo = () => {
        const {
            saveTemplateInfo
        } = this.props;
        const {
            limitMaxSteps,
            baseInfo,
            layoutInfo,
            templateRenderedProperties,
            templateOriginWidth,
            templateOriginHeight,
            showElementKey,
            dragBar
        } = this.state;

        const date = new Date();
        if(STPES_INFO.length >= limitMaxSteps) {
            STPES_INFO.shift();
        }
        STPES_INFO.push({
            time: [`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`],
            props: {
                baseInfo,
                layoutInfo,
                templateRenderedProperties,
                templateOriginWidth,
                templateOriginHeight,
                showElementKey,
                dragBar
            }
        });

        localStorage.setItem(SAVE_STEP_BY_TIMELINE, JSON.stringify(STPES_INFO));

        saveTemplateInfo && saveTemplateInfo(STPES_INFO);
    }

    /**
     * @param {查看历史操作记录} showHistory
     */
    showHistory = (showHistory) => {
        this.setState({
            showHistory
        });
    }

    /**
     * 拖拽过程中记录一下拖拽的位置和当前的对象
     * @param {e} param0
     */
    onDragOver = ({clientX, clientY, target}) => {
        // console.log(target.id);
        if(this.state.activeElementInfo) { // 在画布中拖拽
            this.onMove({ clientX, clientY });
        } else { // 元素拖入画布中
            this.setState({
                currentDragItemPosition: {
                    ...this.state.currentDragItemPosition,
                    clientX,
                    clientY,
                    dropTarget: target.id,
                    dropTargetItem: target
                }
            });
        }
    }

    getComputedStyle = (clientX, clientY) => {
        const { baseInfo, currentDragItemPosition } = this.state;
        const { canDragOut = true } = this.props;
        let { left, top, height, width } = baseInfo;
        const { startClientX, startClientY } = currentDragItemPosition;
        const { left:el, top:et, height:eh, width:ew } = this.draggingElementProperty;
        const elementRight = clientX + ew - (startClientX - el);   // 元素右边
        const elementBottom = clientY + eh - (startClientY - et);  // 元素底边
        // 左右不做限制，可以随意拖拽，注释部分不能拖出最右和最下边区域
        let draggingLeft = 0;
        let draggingTop = 0;
        if(canDragOut) {
            draggingLeft = clientX - left - (startClientX - el);
            draggingTop = clientY - top - (startClientY - et);
        } else {
            draggingLeft = elementRight > (left + width) ? (clientX - ((clientX + ew) - (left + width)) - left): clientX - left - (startClientX - el);
            draggingTop = elementBottom > (top + height) ? (clientY - ((clientY + eh) - (top + height)) - top): clientY - top - (startClientY - et);
        }
        return {
            draggingLeft,
            draggingTop
        };
    }

    onMove = ({clientX, clientY}) => {
        const { activeElementInfo, dragBar, txtInfo } = this.state;
        const element = this.mainRef[this.mainRef.getElementKey(activeElementInfo)]; // 当前数据元素
        const elementRef = this.mainRef.elementRef;
        const barRef = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.BAR)]; // 拖拽移动元素
        const drag_linner_left = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.DRAG_LINNER_LEFT)]; // 标齐线竖线
        const drag_linner_bottom = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.DRAG_LINNER_BOTTOM)]; // 标齐线横线
        const barInfoRef = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.ACTIVE_INFO)]; // 拖拽时展示信息元素
        const drag_linner_left_info_Ref = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.ACTIVE_INFO_LEFT)]; // 拖拽时展示信息元素
        const drag_linner_bottom_info_Ref = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.ACTIVE_INFO_BOTTOM)]; // 拖拽时展示信息元素
        // const spansRef = this.mainRef.headerRef.spanRefs;
        if(!this.draggingElementProperty) {
            this.draggingElementProperty = element.getBoundingClientRect();
        }
        const { draggingLeft, draggingTop } = this.getComputedStyle(clientX, clientY);
        if(dragBar) { // 放大缩小元素时，不能需要移动元素，改变元素宽高
            const { style, field } = activeElementInfo;
            const { left, top, height, width } = style;
            const draggingWidth = draggingLeft - left + width + 1;
            const draggingHeight = getFinalHeight({field, height: draggingTop - top + height, width: draggingWidth, init: false});
            element.style.width = `${draggingWidth}px`;
            element.style.height = `${draggingHeight}px`;
            const dotStyle = setDragBarPosition({...element.style, height: draggingHeight, width: draggingWidth, fixPosition: BAR_FIX_POSITION}, 'px');
            barRef.style.left = dotStyle.left;
            barRef.style.top = dotStyle.top;
            barInfoRef.innerHTML = `H: ${draggingHeight}<br/> W: ${draggingWidth}`;

            this.draggingElementProperty.draggingWidth = draggingWidth;
            this.draggingElementProperty.draggingHeight = draggingHeight;
        } else { // 移动元素时，改变元素位置
            element.style.left = `${draggingLeft}px`;
            element.style.top = `${draggingTop}px`;
            const dotStyle = setDragBarPosition({...element.style, fixPosition: BAR_FIX_POSITION}, 'px');
            barRef.style.left = dotStyle.left;
            barRef.style.top = dotStyle.top;

            barInfoRef.innerHTML = `${txtInfo.height}: ${activeElementInfo.style.height}<br/> ${txtInfo.width}: ${activeElementInfo.style.width}`;

            this.draggingElementProperty.draggingTop = draggingTop;
            this.draggingElementProperty.draggingLeft = draggingLeft;
        }

        drag_linner_left_info_Ref.innerHTML = `${txtInfo.left}: ${this.draggingElementProperty.draggingLeft || activeElementInfo.style.left}`;
        drag_linner_bottom_info_Ref.innerHTML = `${txtInfo.top}: ${this.draggingElementProperty.draggingTop || activeElementInfo.style.top}`;

        drag_linner_left.style.left = `${this.draggingElementProperty.draggingLeft}px`;
        drag_linner_bottom.style.top = `${this.draggingElementProperty.draggingTop}px`;
    }

    onDragStart = ({clientX, clientY, target}) => {
        console.log(target.id, 'onDragStart');
        if(this.mainRef.settingIconRef) {
            this.mainRef.settingIconRef.style.display = 'none';
        }
        let activeElementInfo = null;
        let dragBar = false;
        const { templateRenderedProperties } = this.state;
        if(target.id.includes(ELEMENTS.PROPERTY_IN_DRAW)) {
            activeElementInfo = templateRenderedProperties.find(({id}) => id == target.id.replace(`${ELEMENTS.PROPERTY_IN_DRAW}${SPLITOR}`, ''));
        } else if(target.id == this.mainRef.elementRef.getDoitKet(LINE_POSITION.BAR)) {
            console.log('drag BAR');
            activeElementInfo = this.state.activeElementInfo;
            dragBar = true;
        }
        this.setState({
            currentDragItemPosition: {
                ...this.state.currentDragItemPosition,
                startClientX: clientX,
                startClientY: clientY,
                startTarget: target.id
            },
            activeElementInfo,
            dragBar
        });
    }

    /**
     *  elementInfo 包含的信息
     *  dataKey         数据项的key
     *  dataKeyLabel    数据项的名称
     *  elementBottom   元素在画板中的位置 下
     *  elementLeft     元素在画板中的位置 左
     *  elementRight    元素在画板中的位置 右
     *  elementTop      元素在画板中的位置 上
     *  field           元素所属的模板类型
     *  id              元素id
     *  name            元素模板名称
     *  style           元素自身样式
     * @param {当前拖拽元素的数据信息} elementInfo
     * @param {拖拽元素的 dom 引用} element
     * @param {是否改变元素的样式} changeStyle
     */
    dropProperty = (elementInfo, element, changeStyle = true) => {
        const { currentDragItemPosition, showElementKey, baseInfo, templateRenderedProperties } = this.state;
        const elementProperty = element.getBoundingClientRect();
        const { left, top, height, width } = baseInfo;
        const { clientX, clientY, startClientX, startClientY } = currentDragItemPosition;
        const { field, style, id } = elementInfo || {};
        if(elementInfo && left <= clientX && top <= clientY && clientX <= (left + width) && clientY <= (top + height)) {
            const finalHeight = getFinalHeight({field, height: elementProperty.height, width: elementProperty.width});
            const elementRight = clientX + elementProperty.width - (startClientX - elementProperty.left);   // 元素右边
            const elementBottom = clientY + finalHeight - (startClientY - elementProperty.top);  // 元素底边
            const elementLeft = clientX + elementProperty.width - (startClientX - elementProperty.left) - elementProperty.width;   // 元素左边
            const elementTop = clientY + finalHeight - (startClientY - elementProperty.top) - finalHeight;  // 元素上边

            const dragLeft = elementRight > (left + width) ? (clientX - ((clientX + elementProperty.width) - (left + width)) - left): clientX - left - (startClientX - elementProperty.left);
            const dragTop = elementBottom > (top + height) ? (clientY - ((clientY + elementProperty.height) - (top + height)) - top): clientY - top - (startClientY - elementProperty.top);
            const propertyInfo = changeStyle ? {
                ...elementInfo,
                elementRight,
                elementBottom,
                elementLeft,
                elementTop,
                style: {
                    position: 'absolute',
                    zIndex: LAYOUT_INDEX.PROPERTY_IN_DRAW,
                    height: finalHeight,
                    width: getFinalWidth({field, height: elementProperty.height, width: elementProperty.width, baseWidth: width, baseHeight: height, init: false}),
                    /**
                     * 超过临界值那么取临界值 （鼠标越界直接删除元素）
                     * 否则
                     * 鼠标位置 (clientX)  - 初始画布的左上角位置(left) - 拖拽元素时鼠标停留的距离元素的偏移量位置 (startClientX - elementProperty.left)
                     */
                    left: getFinalLeft({field, left: dragLeft, baseInfo, init: false}),
                    top: getFinalTop({field, top: dragTop, baseInfo, init: false})
                }
            } : {
                ...elementInfo,
                elementRight,
                elementBottom,
                elementLeft,
                elementTop,
                style: {
                    ...(style || {}),
                    // 可以进行宽高的初始设定
                    width: getFinalWidth({field, height: (style || {}).height, width: (style || {}).width, baseWidth: width, baseHeight: height, init: true}),
                    height: getFinalHeight({field, height: (style || {}).height, width: (style || {}).width, baseWidth: width, baseHeight: height, init: true})
                }
            };
            if(id) { // 移动
                const index = (templateRenderedProperties || []).findIndex(({id: fId}) => fId == id);
                templateRenderedProperties.splice(index, 1, propertyInfo);
            } else { // 创建
                propertyInfo.id = `${PRE_FIX_KEY}${SPLITOR}${showElementKey}`;
                templateRenderedProperties.push(propertyInfo);
            }
            this.setState({
                currentDragItemPosition: {},
                templateRenderedProperties,
                showElementKey: id ? showElementKey : showElementKey + 1
            });
            this.setState({
                activeElementInfo: propertyInfo
            });
        } else {
            // 超出范围
            console.log('超出范围');
        }
    }

    /**
     * 参数: elementInfo, element
     */
    dropDataItem = (elementInfo, element) => {
        const { dataInfo } = this.props;
        const { templateRenderedProperties } = this.state;
        // const elementProperty = element.getBoundingClientRect();
        const propertyId = (element.id || '').replace(`${ELEMENTS.PROPERTY_IN_DRAW}${SPLITOR}`, '');
        const index = templateRenderedProperties.findIndex(({id}) => id == propertyId);
        const item = templateRenderedProperties[index];
        item.dataKey = elementInfo[dataInfo.fieldKey];  // 将数据项的 key 设置进来
        item.dataKeyLabel = elementInfo[dataInfo.labelKey];  // 将数据项的 key 设置进来
        // item.style = {
        //     ...item.style,
        //     height: elementProperty.height,              // todo 超越边界的时候最好移动一下
        //     width: elementProperty.width,
        // }
        templateRenderedProperties.splice(index, 1, item);
        this.setState({
            currentDragItemPosition: {},
            templateRenderedProperties
        });
    }

    /**
     * 数据项本身可能会存在 id 属性, 因为来源于服务端接口数据
     * dropProperty 会根据是否含有 id 属性来判断是创建还是移动
     * 拖拽到画布上时，删除数据项的 id 属性, 表示创建改元素
     */
    dropDataItemInit = (elementInfo, element) => {
        const { dataInfo } = this.props;
        const elementInfoTemp = JSON.parse(JSON.stringify(elementInfo)); // 深拷贝, 防止修改原始数据
        elementInfoTemp.id = null;
        elementInfoTemp.dataKey = elementInfo[dataInfo.fieldKey];  // 将数据项的 key 设置进来
        elementInfoTemp.dataKeyLabel = elementInfo[dataInfo.labelKey];  // 将数据项的 key 设置进来
        elementInfoTemp.field = SHOW_ELEMENTS.TEXT;  // 默认展示为联动的数据项
        this.dropProperty(elementInfoTemp, element);
    }

    /**
     * 元素拖拽结束
     * @param {元素属性信息} elementInfo 元素本身包含的数据属性
     * @param {Dom} element 元素对应的 Dom 实例
     */
    dragEnd = (elementInfo, element, e) => {
        const { canDragOut = true } = this.props;
        const { dragBar, currentDragItemPosition, templateRenderedProperties, activeElementInfo, baseInfo } = this.state;
        const { clientX, clientY } = e || {};
        const { left, top, height, width } = baseInfo;
        const { startTarget, dropTarget, dropTargetItem } = currentDragItemPosition;
        if(startTarget == ELEMENTS.MAIN) { // 拖拽画布
            this.setState({ baseInfo: getMainByDrop(this.state) });
        }
        // 从画布内拖出来, 超出任意范围，删除元素。（本期不做处理）
        // 判断的位置不要改动，否则会影响交互行为
        else if (!canDragOut && !dropTarget && (left > clientX || top > clientY || clientY > (height + top) || clientX > (left + width))) { 
            // 拖出的距离没有做精细的计算，鼠标拖出即为拖出
            // 不能拖出去就直接从面板删除
            if(elementInfo) {
                this.setState({
                    currentDragItemPosition: {},
                    templateRenderedProperties: templateRenderedProperties.filter(({id}) => id !== elementInfo.id),
                    activeElementInfo: null
                }, () => {
                    this.draggingElementProperty = null;
                });
            }
        }
        else if(this.draggingElementProperty) { // 画布中拖拽后的行为
            const activeElementInfoTemp = getDraggingElement(this.draggingElementProperty, activeElementInfo, dragBar);
            templateRenderedProperties.splice(templateRenderedProperties.findIndex(({id}) => id == activeElementInfo.id), 1, activeElementInfoTemp);
            this.replaceActiveElementsInfo(activeElementInfoTemp, () => {
                this.draggingElementProperty = null;
            });
        } else { // 拖进或者拖出画布
            if(element) {
                let dropTargetItemInfo = {};
                let dropTargetItemId = dropTarget;
                if(!dropTarget) {
                    dropTargetItemInfo = findParent(dropTargetItem) || {};
                    dropTargetItemId = dropTargetItemInfo.id;
                }
                if(dropTargetItemId == ELEMENTS.MAIN) { // 属性停在画布内进行渲染
                    if((startTarget || '').includes(ELEMENTS.PROPERTY)) { // 拖拽组件到画布中
                        this.dropProperty(elementInfo, element);
                    } else if((startTarget || '').includes(ELEMENTS.DATA)) { // 拖拽数据项到画布中
                        this.dropDataItemInit(elementInfo, element);
                    }
                } else if ((dropTargetItemId || '').includes(ELEMENTS.PROPERTY_IN_DRAW)) { // 数据项和属性项的拖拽
                    if((startTarget || '').includes(ELEMENTS.DATA)) { // 拖拽完后都会成为组件类型数据
                        if(dropTargetItemId) {
                            const field = ((templateRenderedProperties.find(({id}) => id == dropTargetItemId.replace(`${ELEMENTS.PROPERTY_IN_DRAW}${SPLITOR}`, ''))) || {}).field;
                            // label 不支持动态数据，仅支持手动编写，请使用 text
                            if(isNotBindField(field)) {
                                console.error('不支持动态绑定数据项的组件');
                                return;
                            }
                        }
                        this.dropDataItem(elementInfo, dropTarget ? element : dropTargetItemInfo);
                    } else if ((startTarget || '').includes(ELEMENTS.PROPERTY)) { // 属性拖到属性上替换原来的属性
                        const dropTargetId = dropTargetItemId.replace(`${ELEMENTS.PROPERTY_IN_DRAW}${SPLITOR}`, '');
                        const inDrawItem = templateRenderedProperties.find(({id}) => id == dropTargetId);
                        this.dropProperty({...(inDrawItem || {}), ...elementInfo}, element, false);
                    }
                } else if (elementInfo && elementInfo.id && !canDragOut) { // 不能拖出去那就删除
                    // 从画布内拖出来, 拖拽过的都是有 id 的
                    // 拖拽出画布自动删除
                    this.setState({
                        currentDragItemPosition: {},
                        templateRenderedProperties: templateRenderedProperties.filter(({id}) => id !== elementInfo.id),
                        activeElementInfo: null
                    });
                }
                if(elementInfo && elementInfo.id) {
                    // 操作完后进行保存
                    this.saveInfo();
                }
            }
        }
        if(this.mainRef.settingIconRef) {
            this.mainRef.settingIconRef.style.display = 'block';
        }
    }

    activeElement = (e) => {
        const { activeElementInfo, templateRenderedProperties, pageType } = this.state;
        if(pageType !== OPERATIONS.EDIT) return;

        const targetId = e.target && e.target.id && e.target.id.replace(`${ELEMENTS.PROPERTY_IN_DRAW}${SPLITOR}`, '');
        if(targetId == ELEMENTS.MAIN) {
            this.setState({
                activeElementInfo: null
            });
        } else if(targetId && targetId !== OPERATION_BAR_ID && (!activeElementInfo || (targetId !== activeElementInfo.id))) {
            // console.log(templateRenderedProperties.find(({id}) => targetId == id), 'activeElement')
            this.setState({
                activeElementInfo: templateRenderedProperties.find(({id}) => targetId == id)
            });
        } else if(!targetId && e.target) { // 查找点击元素的父元素
            this.activeElement({target: e.target.parentNode});
        }
    }

    /**
     * 更改激活元素的信息
     * TODO： 兼容批量的样式
     * @param {object} activeElementInfo 当前激活的对象
     * @param {function} cb 状态更改后的回调函数
     */
    replaceActiveElementsInfo = (activeElementInfo, cb) => {
        if(activeElementInfo.id == ELEMENTS.MAIN) {
            const {
                style
            } = activeElementInfo;
            const { layoutInfo } = this.state;
            this.setState({
                baseInfo: {
                    ...(style || {}),
                    left: style.left + layoutInfo.left,
                    top: style.top + layoutInfo.top
                }
            });
        } else {
            const { templateRenderedProperties } = this.state;
            const index = templateRenderedProperties.findIndex(({id}) => id == activeElementInfo.id);
            templateRenderedProperties.splice(index, 1, activeElementInfo);
            this.setState({
                activeElementInfo,
                templateRenderedProperties
            },  () => {
                cb && cb();
            });
        }
    }

    /**
     * 删除元素操作
     */
    onDelete = () => {
        const { activeElementInfo, txtInfo } = this.state;
        if(!activeElementInfo) {
            return;
        } else if(!activeElementInfo.id) {
            console.error(activeElementInfo.id, `id ${txtInfo.isNull}`);
            return;
        }
        const { templateRenderedProperties } = this.state;
        this.setState({
            templateRenderedProperties: templateRenderedProperties.filter(({id}) => id !== activeElementInfo.id),
            activeElementInfo: null
        });
    }

    resetTo = (props) => {
        this.setState({
            ...this.state,
            ...props
        }, () => {
            this.mainRef.computedCurrentMainArea();
        });
    }

    handleActions = (action) => {
        this.setState({
            activeElementInfo: null,
            action
        });
        if(action == DATA_ICONS.SOURCE) {
            sourceModalEdit(this.templateId, this.state.templateRenderedProperties, this.saveTemplateInfo());
        }
        const { handleActions } = this.props;
        handleActions && handleActions({
            ...this.saveTemplateInfo(),
            pageType: [OPERATIONS.EDIT, OPERATIONS.VIEW].includes(action) ? action : this.state.pageType,
            action
        });
    };

    saveTemplateInfo = () => {
        const { layoutInfo, templateOriginHeight, templateOriginWidth, baseInfo, templateRenderedProperties} = this.state;
        return JSON.parse(JSON.stringify({
            layoutInfo,
            templateOriginHeight,
            templateOriginWidth,
            baseInfo,
            templatePropertiesSetting: this.templatePropertiesSetting,
            templateRenderedProperties,
            templateId: this.templateId
        }));
    }

    render() {
        const {
            layoutInfo,
            baseInfo,
            templateOriginWidth,
            templateOriginHeight,

            templateRenderedProperties,

            activeElementInfo,

            txtInfo,
            pageType,
            action
        } = this.state;
        const {
            componentTitle,
            properties,
            dataInfo,
            currencyComponent,
            renderExtraction
        } = this.props;
        const isEdit = pageType == OPERATIONS.EDIT;
        return <div className="ticket-template" ref={ins => { this.ticketRef = ins; }} id={this.templateId}>
            {isEdit && <Left dragEnd={this.dragEnd} onDragStart={this.onDragStart} txtInfo={txtInfo} properties={properties} dataInfo={dataInfo} currencyComponent={currencyComponent} templatePropertiesSetting={this.templatePropertiesSetting} />}
            <Main
                layoutInfo={layoutInfo}
                templateOriginHeight={templateOriginHeight}
                templateOriginWidth={templateOriginWidth}
                baseInfo={baseInfo}
                handleInfo={this.getTemplateInfo}
                txtInfo={txtInfo}
                mode={MODES.SHOW}
                renderExtraction={renderExtraction}
                saveTemplateInfo={this.saveInfo}
                onDragOver={this.onDragOver}
                dragEnd={this.dragEnd}
                dragStart={this.onDragStart}
                templateRenderedProperties={templateRenderedProperties}
                propertyInfo={this.templatePropertiesSetting}
                activeElement={this.activeElement}
                replaceActiveElementsInfo={this.replaceActiveElementsInfo}
                activeElementInfo={activeElementInfo}
                ref={(ins) => { this.mainRef = ins; }}
                onDelete={this.onDelete}
                handleActions={this.handleActions}
                action={action}
                isEdit={isEdit}
                total={1}
                current={1}
            />
            {/* action == DATA_ICONS.OPEN_EYES 这个条件再渲染, 不然一直触发 */}
            {action == DATA_ICONS.OPEN_EYES && <View {...this.state} handleActions={this.handleActions} templatePropertiesSetting={this.templatePropertiesSetting}/>}
            {isEdit && <ComponentsDisplay txtInfo={txtInfo} title={txtInfo.component || componentTitle} templatePropertiesSetting={this.templatePropertiesSetting} dragEnd={this.dragEnd} onDragStart={this.onDragStart}/>}
        </div>;
    }
}

export default TicketTemplate;