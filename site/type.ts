
interface AppProps {
    name: String
};

interface CodeProviderProps {
    markdown: string | any;
    components: Record<string, React.FunctionComponent<any>>;
}

export {
    AppProps,
    CodeProviderProps
}