import React from 'react';
import MarkdownView from 'react-showdown';
import showdownHighlight from 'showdown-highlight';
import { CodeProviderProps } from 'site/type';

const CodeProvider  = ({
    markdown,
    components
}: CodeProviderProps) => {
    return (
        <MarkdownView
            markdown={markdown}
            components={components}
            options={{
                tables: true,
                emoji: true,
                omitExtraWLInCodeBlocks: true,
                headerLevelStart: 1,
                parseImgDimensions: true,
                simplifiedAutoLink: true,
                tablesHeaderId: true,
                tasklists: true,
                smoothLivePreview: true,
                smartIndentationFix: true,
                openLinksInNewWindow: true,
                splitAdjacentBlockquotes: true
            }}
            extensions={showdownHighlight({pre: true})}
            className="demo-display-area"
        />
    )
}

export default CodeProvider;