import React, { PureComponent } from 'react';
import { filterProps } from '../../funcs';
import { getDateByFormat } from '../componentCommonFunc';
import { COMMON_ELEMENTS } from '../../componentConfig';
class DateInfo extends PureComponent {
    /**
     * 这个方法本来可以在 ../../funcs 中的 renderInitData 中实现
     * 但是那样会将多种组件的赋值逻辑混在一起，不利于维护
     * 所以在组件中重新进行编辑赋值
     */
    renderInfo = () => {
        const {
            value,
            elementProps: {
                field
            },
            componentProps: {
                format = 'yyyy-MM-dd hh:mm:ss' // Date 组件才有的属性, TODO: 格式选择器
            } = {}
        } = this.props;
        switch (field) {
            case COMMON_ELEMENTS.DATE:
                return getDateByFormat(new Date(), format);
            case COMMON_ELEMENTS.PAGINATION:
                console.log('pagination', value);
                return value;
        }
    }

    render() {
        const {
            elementProps: {
                id,
                style
            }
        } = this.props;
        return <div key={id} className="date-display" style={filterProps(style, ['position'])}>
            {this.renderInfo()}
        </div>;
    }
}

export default DateInfo;