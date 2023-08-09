import React from 'react';

const language = (com) => {
    console.log(com.name);
    return () => {
        return com({aaa: 'aaaa'})
    };
}


export default language;