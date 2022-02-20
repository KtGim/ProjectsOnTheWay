import React, { useState } from 'react';
import { Button } from 'antd';

const A = () => {
    const [a, setA] = useState(0);
    return (
        <div>
            {a}
            <Button onClick={() => {
                setA(a + 1);
            }}>Button</Button>
        </div>
    )
};

export default A;