import React, { PureComponent } from 'react';
import PropertyDisplay from '../components/PropertyDisplay';
import { SHOW_ELEMENTS } from '../componentConfig';

class ComponentsDisplay extends PureComponent {
    render () {
        const {
            txtInfo,
            title = '',
            displayElements = SHOW_ELEMENTS,
            templatePropertiesSetting,
            dragEnd,
            dragStart,
            visible = true,
            showIcon = false,
            renderRightConfig
        } = this.props;
        const className = ['right-setting-list'];
        if(!visible) {
            className.push('dis_visible');
        }
        return <div className={className.join(' ')}>
            <PropertyDisplay
                title={title}
                properties={Object.keys(displayElements).map(key => {
                    return {
                        field: key,
                        name: txtInfo[key]
                    };
                })}
                propertyInfo={templatePropertiesSetting}
                dragEnd={dragEnd}
                dragStart={dragStart}
                showIcon={showIcon}
            />
            {
                renderRightConfig && renderRightConfig()
            }
        </div>;
    }
}

export default ComponentsDisplay;