import React, { useState } from 'react';
import './index.less';

interface SwitchProps {
    onChange?: (checked: boolean) => void,
    className?: string
}

const Switch = (props: SwitchProps) => {
    const [checked, setChecked] = useState(false);
    const handleClick = () => {
        setChecked(!checked);
        if(props.onChange) {
            props.onChange(!checked);
        }
    }
    return <span className={`switch ${props.className} ${checked ? "switch--active" : ''}`} onClick={handleClick} />
};

export default Switch;