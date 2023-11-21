import React, {Component} from 'react';
import { ELEMENTS, SPLITOR } from '../const';
import OperationBar from './OperationBar/index';

class PropertyDisplay extends Component {

    state = {
        show: false
    }

    dragEnd = (property, e) => {
        const { dragEnd, propertyInfo } = this.props;
        dragEnd(property, this[property[propertyInfo.primaryKey]], e);
    }

    onClick = () => {
        this.setState({
            show: !this.state.show
        });
    }

    renderProperties = () => {
        const {
            properties,
            propertyInfo,
            title,
            dragStart,
            showIcon
        } = this.props;
        const {
            primaryKey,
            labelKey
        } = propertyInfo;
        const { show } = this.state;

        return <div className="properties" onClick={this.onClick}>
            {title && <p className={`title ${show ? 'up': 'down'}`}> {title} </p>}
            <div className={`board ${show ? 'show': 'hide'}`}>
                {
                    properties.map(property => {
                        return <div
                            draggable
                            onDragEnd={this.dragEnd.bind(this, property)}
                            onDragStart={dragStart}
                            className="property"
                            ref={ins => { this[property[primaryKey]] = ins; }}
                            key={property[primaryKey]}
                            id={`${ELEMENTS.PROPERTY}${SPLITOR}${property[primaryKey]}`}
                        >
                            {OperationBar.renderSvgIcon(property[primaryKey],  property[labelKey], showIcon)}
                        </div>;
                    })
                }
            </div>
        </div>;
    }

    render() {
        return <div className="property-setting">
            {this.renderProperties()}
        </div>;
    }
}

export default PropertyDisplay;