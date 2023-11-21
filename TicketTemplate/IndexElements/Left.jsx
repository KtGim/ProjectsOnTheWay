import React, { PureComponent } from 'react';
import DataIndexDisplay from '../components/DataIndexDisplay';
import { COMMON_ELEMENTS } from '../componentConfig';
import { ComponentsDisplay } from './index';

class Left extends PureComponent {
    render() {
        const {
            properties,
            dataInfo,
            currencyComponent,
            txtInfo,
            templatePropertiesSetting,
            dragEnd,
            onDragStart
        } = this.props;

        const {
            commonComponent,
            noData
        } = txtInfo;
        return <div className="left-setting-list">
            {/* 数据源属性 */}
            {
                properties && properties.map(({sourceCode, sourceName, isDetail, columns}) => {
                    return <DataIndexDisplay
                        key={sourceCode}
                        title={sourceName}
                        isDetail={isDetail}
                        noData={noData}
                        dataList={columns}
                        dataInfo={dataInfo}
                        dragEnd={dragEnd}
                        dragStart={onDragStart}
                    />;
                })
            }
            {/* 常用组件渲染 */}
            <ComponentsDisplay
                dragEnd={dragEnd}
                dragStart={onDragStart}
                txtInfo={txtInfo}
                title={commonComponent || currencyComponent}
                displayElements={COMMON_ELEMENTS}
                templatePropertiesSetting={templatePropertiesSetting}
            />
        </div>;
    }
}

export default Left;