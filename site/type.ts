interface CodeProviderProps {
    markdown: string | any;
    components: Record<string, React.FunctionComponent<any>>;
}

type ThemeType = 'light' | 'dark';
type Setting = {
    theme: ThemeType;
}

type ActionType = 'CHANGE_THEME';

type Action = {
    type: ActionType,
    payload: Setting
}

interface ContextProps {
    state: Setting,
    dispatch?: React.Dispatch<Action>
}

export {
    CodeProviderProps,

    ThemeType,
    Setting,
    ActionType,
    Action,
    ContextProps
}