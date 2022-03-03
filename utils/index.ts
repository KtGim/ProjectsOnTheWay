const getClassPrefix:<T>(theme: T, content: string[]) => (desc: string) => string = (
    theme,
    content = []
) => {
    const prefix = `${theme}__${content.join('__')}`
    return (desc) => {
        return `${prefix}--${desc}`;
    }
}

const capitalize: (s: string) => string = s => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export  {
    getClassPrefix,
    capitalize
}