import React from 'react';

import './index.less';

interface RopeSwitcherProps {
    onClick: (e: any) => void
}

const RopeSwitcher = ({
    onClick
}: RopeSwitcherProps) => {
    return (
        <div className="rope__switch">
            <div className="bulb" onClick={onClick}></div>
        </div>
    )
};

export default RopeSwitcher;