import React, { PureComponent } from 'react';
import { UNIT } from '../../const';
import { CSSPROP2DPI, getSizeValue } from '../../size';

class InputChange extends PureComponent {

    handleChange = (e) => {
        const { type, handleChange, inputType='number', unit = UNIT.MM, needTrans = true } = this.props;
        if(!handleChange) {
            console.warn('handleChange is not defined');
            return;
        }
        if(inputType === 'number') {
            let returnValue = Number(e.target.value);
            if(needTrans && unit === UNIT.MM) {
                returnValue = getSizeValue(returnValue, UNIT.PX,  CSSPROP2DPI[type]);
            }
            handleChange(returnValue, type);
        } else if(inputType === 'text') {
            handleChange(e.target.value, type);
        }
    }

    render() {
        const { value, title, type, showUnit = false, unit = UNIT.PX, onAfter = true, inputType='number', step = 1, needTrans = true } = this.props;
        let showValue = value;
        if(needTrans && unit === UNIT.MM) {
            showValue = parseInt(getSizeValue(value, UNIT.MM, CSSPROP2DPI[type]), 10);
        }
        return <div className="input-change" key={type}>
            <span>{!onAfter && title}</span><input step={step} value={showValue} type={inputType} onChange={this.handleChange} /> {showUnit && unit} {onAfter && title}
        </div>;
    }
}

export default InputChange;