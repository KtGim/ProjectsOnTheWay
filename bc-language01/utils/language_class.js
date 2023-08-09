import React from 'react';
import * as Lan from '../Lan/index';

const language_class = (param) => (Com) => {
    console.log(Com.name, param);
    return class extends React.Component{
        render() {
            return <Com aaa="aaaa" lang={Lan.zh} />
        }
    }
}

export default language_class;