const injectCommon = (template, content) => {
    const contentLines = content.split('\n');
    let cur = contentLines.length - 1;
    let line = contentLines[cur];
    while(cur >= 0 && !line.includes('</body>')) {
        line = contentLines[--cur];
    }
    contentLines.splice(cur + 1, 0, ...(template.split('\n')))
    return contentLines.join('\n');
}

const injectLink = (template, content) => {
    const contentLines = content.split('\n');
    let cur = 0;
    let line = contentLines[cur];
    while(!line.includes('</head>')) {
        line = contentLines[++cur];
    }
    contentLines.splice(cur - 1, 0, ...(template.split('\n')))
    return contentLines.join('\n');
}

module.exports = {
    injectCommon,
    injectLink
}