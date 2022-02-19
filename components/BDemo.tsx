import React from 'react';
import CodeProvider from 'site/CodeProvider';

import Amd from './a.md';
import B from './B';
import A from './A';
const BDemo = () => {
    return (
        <CodeProvider
            markdown={Amd}
            components={{ B, A }}
        />
    )
}

export default BDemo;