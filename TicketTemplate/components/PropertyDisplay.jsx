import React, {Component} from 'react';
import { ELEMENTS, SPLITOR } from '../const';
import OperationBar from './OperationBar/index';

class PropertyDisplay extends Component {

    dragEnd = (property, e) => {
        const { dragEnd, propertyInfo } = this.props;
        dragEnd(property, this[property[propertyInfo.primaryKey]], e);
    }

    renderProperties = () => {
        const {
            properties,
            propertyInfo,
            title
        } = this.props;
        const {
            primaryKey,
            labelKey
        } = propertyInfo;
        return <div className="properties">
            {title && <p className="title"> {title} </p>}
            <div className="board">
                {
                    properties.map(property => {
                        return <div
                            draggable
                            onDragEnd={this.dragEnd.bind(this, property)}
                            onDragStart={this.props.dragStart}
                            className="property"
                            ref={ins => { this[property[primaryKey]] = ins; }}
                            key={property[primaryKey]}
                            id={`${ELEMENTS.PROPERTY}${SPLITOR}${property[primaryKey]}`}
                        >
                            {OperationBar.renderSvgIcon(property[primaryKey],  property[labelKey], property[labelKey])}
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