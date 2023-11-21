import React, { Component } from 'react';
import { BAR_FIX_POSITION, ELEMENTS, LINE_POSITION, SPLITOR } from '../../const';
import { setDotsStyle, setDragBarPosition } from '../../funcs';

/**
 * 父组件 用于
 *  渲染组件元素的拖拽样式
 */
class Element extends Component {

    constructor(props) {
        super(props);
        this.state = {
            topLine: null,
            rightLine: null,
            bottomLine: null,
            leftLine: null,
            barStyle: {},
            dragLinnerLeftStyle: {},
            dragLinnerBottomStyle: {}
        };
        this.doitsRef = {};
    }

    static getDerivedStateFromProps(nextProps){
        const { activeElementInfo, showLine = false, baseInfo } = nextProps;
        if(!showLine) { // 暂时写死
            /**
             * 设置右下角拖拽文案
             */
            if(!activeElementInfo) {
                return {};
            } else {
                const { style } = activeElementInfo;
                return {
                    barStyle: setDragBarPosition({
                        left: style.left,
                        top: style.top,
                        height: style.height,
                        width: style.width,
                        fixPosition: BAR_FIX_POSITION
                    }),
                    dragLinnerLeftStyle: {
                        height: baseInfo.height,
                        left: style.left
                    },
                    dragLinnerBottomStyle: {
                        width: baseInfo.width,
                        top: style.top
                    }
                };
            }
        } else {
            /**
             * 设置激活的四条边
             */
            if(!activeElementInfo) {
                return {
                    [LINE_POSITION.TOP]: null,
                    [LINE_POSITION.RIGHT]: null,
                    [LINE_POSITION.BOTTOM]: null,
                    [LINE_POSITION.LEFT]: null
                };
            } else {
                const { style } = activeElementInfo;
                return setDotsStyle(style);
            }
        }
    }

    getDoitKet = (key) => {
        return `${ELEMENTS.PROPERTY_LINNER}${SPLITOR}${key}`;
    }

    // 这个版本不需要对元素边框进行拖拽
    // 元素边框效果
    renderDoits = () => {
        const {
            onDragStart,
            onDragOver,
            onDragEnd,
            activeElementInfo
        } = this.props;
        if(!activeElementInfo) return null;
        return Object.keys(LINE_POSITION).map(key => {
            return <div
                className="doit active"
                id={`${ELEMENTS.PROPERTY_LINNER}${SPLITOR}${key}`}
                ref={(ins => { this.doitsRef[this.getDoitKet(key)] =  ins; })}
                key={key}
                draggable
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd.bind(this, { id: `${ELEMENTS.PROPERTY_LINNER}${SPLITOR}${key}` })} // 保持都组件入参形式一致
                style={this.state[key]}
            />;
        });
    }

    // 右下角拖拽按钮
    renderDrag = () => {
        const {
            onDragStart,
            onDragOver,
            onDragEnd,
            showDragActionBar = true
        } = this.props;
        return <div
            className={showDragActionBar ? 'bar' : 'bar hide'}
            id={`${ELEMENTS.PROPERTY_LINNER}${SPLITOR}${LINE_POSITION.BAR}`}
            ref={(ins => { this.doitsRef[this.getDoitKet(LINE_POSITION.BAR)] =  ins; })}
            key={LINE_POSITION.BAR}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd.bind(this, { id: `${ELEMENTS.PROPERTY_LINNER}${SPLITOR}${LINE_POSITION.BAR}` })} // 保持都组件入参形式一致
            style={this.state.barStyle}
        >
            <span className="info" ref={(ins => { this.doitsRef[this.getDoitKet(LINE_POSITION.ACTIVE_INFO)] =  ins; })} />
        </div>;
    }

    // 标齐线渲染
    renderActiveLiners = () => {
        const { dragLinnerLeftStyle, dragLinnerBottomStyle } = this.state;
        return [
            <div
                className="drag_linner_left"
                id={`${ELEMENTS.PROPERTY_LINNER}${SPLITOR}${LINE_POSITION.DRAG_LINNER_LEFT}`}
                ref={(ins => { this.doitsRef[this.getDoitKet(LINE_POSITION.DRAG_LINNER_LEFT)] =  ins})}
                key={LINE_POSITION.DRAG_LINNER_LEFT}
                style={dragLinnerLeftStyle}
                onDragOver={this.preventEvent}
                onDragEnd={this.preventEvent}
            >
                <span className="info" ref={(ins => { this.doitsRef[this.getDoitKet(LINE_POSITION.ACTIVE_INFO_LEFT)] =  ins})} />
            </div>,
            <div
                className="drag_linner_bottom"
                id={`${ELEMENTS.PROPERTY_LINNER}${SPLITOR}${LINE_POSITION.DRAG_LINNER_BOTTOM}`}
                ref={(ins => { this.doitsRef[this.getDoitKet(LINE_POSITION.DRAG_LINNER_BOTTOM)] =  ins})}
                key={LINE_POSITION.DRAG_LINNER_BOTTOM}
                style={dragLinnerBottomStyle}
                onDragOver={this.preventEvent}
                onDragEnd={this.preventEvent}
            >
                <span className="info" ref={(ins => { this.doitsRef[this.getDoitKet(LINE_POSITION.ACTIVE_INFO_BOTTOM)] =  ins})} />
            </div>
        ];
    }

    preventEvent = (e) => {
        e.preventDefault();
    }

    render() {
        const {
            children,
            activeElement,
            activeElementInfo
        } = this.props;
        return (
            <div
                className="elements_boundry"
                onClick={activeElement}
                onDragOver={this.preventEvent}
                onDragEnd={this.preventEvent}
            >
                {children}
                {activeElementInfo && this.renderDrag()}
                {activeElementInfo && this.renderActiveLiners()}
            </div>
        );
    }
}

export default Element;