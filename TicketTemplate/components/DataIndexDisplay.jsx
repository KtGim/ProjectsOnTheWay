import React, {Component} from 'react';
import { ELEMENTS } from '../const';
import OperationBar from './OperationBar/index';
import { DATA_ICONS } from '../componentConfig';

class DataIndexDisplay extends Component {
    state = {
        show: false
    }

    dragEnd = (property, type, e) => {
        const { dragEnd, dataInfo } = this.props;
        dragEnd(property, this[`${ELEMENTS.DATA}_${property[dataInfo.primaryKey]}`], e);
    }

    onClick = () => {
        this.setState({
            show: !this.state.show
        });
    }

    renderFields = () => {
        const {
            dataList,
            dataInfo,
            noData,
            title,
            isDetail
        } = this.props;
        const {
            primaryKey,
            labelKey
        } = dataInfo || {};
        const { show } = this.state;

        return <div className="properties" onClick={this.onClick}>
            <p className={`title ${show ? 'up': 'down'}`}> {title} </p>
            <div className={`board ${show ? 'show': 'hide'}`}>
                {
                    (dataList && dataList.length) ? dataList.map(data => {
                        return <div
                            draggable
                            onDragEnd={this.dragEnd.bind(this, {...data, isDetail}, ELEMENTS.DATA)}
                            onDragStart={this.props.dragStart}
                            className="property"
                            ref={ins => { this[`${ELEMENTS.DATA}_${data[primaryKey]}`] = ins; }}
                            key={data[primaryKey]}
                            id={`${ELEMENTS.DATA}_${data[primaryKey]}`}
                        >
                            {data[labelKey]}
                        </div>;
                    }) :  <div className="no-property">
                        {OperationBar.renderSvgIcon(DATA_ICONS.NO_DATA, noData)}
                        <p>{noData}</p>
                    </div>
                }
            </div>
        </div>;
    }

    render() {
        return <div className="property-setting">
            {this.renderFields()}
        </div>;
    }
}

export default DataIndexDisplay;