import Warrant from './Warrant';
import Token from './TokenOperations';
import { TokenEnum } from './types';

// 权限校验拦截
export function tokenCheckOperation<T>(fn?: () => T): T | null {
  // 获取当前 token 类型
  const currentTokenType: string = Token.validateToken();
  let renderFnType: 'render' | 'initRender' = 'render';
  switch (currentTokenType) {
    case TokenEnum.NONE:
      renderFnType = 'initRender';
      break;
    case TokenEnum.EXPIRE:
      renderFnType = Token.refreshToken() ? 'render' : 'initRender';
      break;
    case TokenEnum.LIVE:
    default:
      renderFnType = 'render';
  }
  let renderReturn: T | null = null;
  if (fn && renderFnType === 'render') {
    renderReturn = fn();
  } else {
    Warrant.init(() => {
      fn && fn();
    });
  }
  return renderReturn;
}
