import React, { useState } from 'react';
import './index.less';


const Switch = () => {
    const [checked, setChecked] = useState(false);
    const handleClick = () => {
        setChecked(!checked);
    }
    return <span className={`switch ${checked ? "switch--active" : ''}`} onClick={handleClick} />
};

export default Switch;