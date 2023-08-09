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
            dragStart
        } = this.props;
        return <div className="setting-list">
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
            />
        </div>;
    }
}

export default ComponentsDisplay;