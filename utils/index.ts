const getClassPrefix:<T>(theme: T, content: string[]) => (desc: string) => string = (
    theme,
    content = []
) => {
    const prefix = `${theme}__${content.join('__')}`
    return (desc) => {
        return `${prefix}--${desc}`;
    }
}

export  {
    getClassPrefix
}