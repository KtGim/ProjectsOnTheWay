import React, { createContext, useReducer } from 'react';

import 'highlight.js/styles/a11y-light.css'
import './app.less';
import 'antd/dist/antd.css';

import Routers from './.routerConfig/index';

import { Setting, ActionType, ContextProps, Action  } from './type';

const defaultSetting: Setting = {
  theme: 'light'
};

const CHANGE_THEME: ActionType = 'CHANGE_THEME';

const ProviderContext = createContext<ContextProps>({state: defaultSetting});

const outboundPreContainerReducer:(state: Setting, action: Action) => Setting  = (state, action) => {
  switch(action.type) {
      case CHANGE_THEME:
        return {
          ...state,
          ...action.payload
        };
      default:
        return state;
  }
};

function App(){

  const [state, dispatch] = useReducer(outboundPreContainerReducer, defaultSetting);
  return (
    <ProviderContext.Provider value={{ state, dispatch }}>
      <div className={state.theme}>
        <Routers />
      </div>
    </ProviderContext.Provider>
  );
}
export default App;

export {
  ProviderContext
}