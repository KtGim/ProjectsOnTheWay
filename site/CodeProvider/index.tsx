import React from 'react';
import MarkdownView from 'react-showdown';
import showdownHighlight from 'showdown-highlight';
import { CodeProviderProps } from 'site/type';

const CodeProvider  = ({
    markdown,
    components
}: CodeProviderProps) => {
    console.log(components, 'components');
    return (
        <MarkdownView
            markdown={markdown}
            components={components}
            extensions={showdownHighlight({pre: true})}
        />
    )
}

export default CodeProvider;