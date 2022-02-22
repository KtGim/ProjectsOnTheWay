import React, { useState } from 'react';
import { Button } from 'antd';
import { AP } from './type';
interface Props extends AP {
    name?: string;
    age: number;
}

type AType = "A";

const A = (props: Props) => {
    const [a, setA] = useState(0);
    const aa: AType = 'A';

    return (
        <div className="a-component">
            {a}
            <Button onClick={() => {
                setA(a + 1);
            }}>Button</Button>
        </div>
    )
};

export default A;