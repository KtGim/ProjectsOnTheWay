import { createModel, isError } from '@/utils';
import { pageModel } from '@/utils/models';
// 获取接口
// import {} from '@/services/Accounting';
// import {} from '@/services/interfaces';
// import {} from '@/services/BusinessCommon';

interface IState {};

export default createModel<IState>(pageModel, {
    namespace: '{modelName}',
    state: {
    },
    effects: {
        query: [
            function* ({ payload }, { put, select, call }) {
                /** 
                 * 通用分页设置
                  yield put({
                      type: 'setQuery',
                      payload,
                  });
                  const query = yield select((state: State) => ({
                      pagination: state.demoModel.pagination,
                  }));
                  const error = isError(result);
                  if (error) {
                      return;
                  }
                  // setItems 设置分页数据到 全局 store 中
                  yield put({
                      type: 'setItems',
                      payload: {
                          items: result.items,
                          total: result.totalCount,
                          current: query.pagination.current,
                      },
                  });
                */
            },
            { type: 'takeLatest' },
        ],
    },
    reducers: {
        // 更改数据
        update(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
});