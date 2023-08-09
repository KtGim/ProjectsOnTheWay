import { createModel, isError } from '@/utils';
import { message } from 'antd';
import { pageModel } from '@/utils/models';
import { State as PageModalState } from '@/utils/models/pageModel';
import { CustomCategoryFeignModel } from '@/services/interfaces';
import {
    postCommonsCustomCategory,
    PostCommonsCustomCategoryPayload,
    deleteCommonsCustomCategoryId,
    DeleteCommonsCustomCategoryIdPayload,
    putTagsId,
    PutTagsIdPayload,
    GetCommonsCustomCategoryPagingPayload,
    getCommonsCustomCategoryPaging,
    GetCommonsCustomCategoryPayload,
    getCommonsCustomCategory,
    putCommonsCustomCategoryId,
} from '@/services/BusinessCommon';
import { State } from '@/types';

export interface IState extends PageModalState<any> {
    categoryEnum: string;
    customId: number;
    page: number;
    size: number;
    type: string;
    id?: number;
    getCommonsCustomCategory: any;
    visible: boolean;
    name: string;
    isEdit: boolean;
    headTitle: string;
    subTitle: string;
}

export default createModel<IState>(pageModel, {
    namespace: 'categoryModel',
    state: {
        getCommonsCustomCategory: [],
    },
    effects: {
        query: [
            function*({ payload }, { put, call, select }) {
                if (payload.categoryEnum) {
                    const result = yield call<GetCommonsCustomCategoryPayload>(
                        getCommonsCustomCategory,
                        {
                            query: {
                                categoryEnum: 'BILL',
                                concernForbid: false
                            },
                        }
                    );

                    const error = isError(result);
                    if (error) {
                        return;
                    }

                    yield put({
                        type: 'save',
                        payload: {
                            getCommonsCustomCategory: result,
                        },
                    });
                } else {
                    yield put({
                        type: 'setQuery',
                        payload,
                    });
                    const query = yield select((state: State) => ({
                        pagination: state.categoryModel.pagination,
                        type: state.categoryModel.type,
                        customerId: state.Auth.user.user.customerId,
                    }));
                    const result = yield call<GetCommonsCustomCategoryPagingPayload>(
                        getCommonsCustomCategoryPaging,
                        {
                            query: {
                                page: query.pagination.current,
                                size: query.pagination.pageSize,
                                categoryEnum: query.type,
                                customId: query.customerId,
                            },
                        }
                    );

                    const error = isError(result);
                    if (error) {
                        return;
                    }
                    yield put({
                        type: 'setItems',
                        payload: {
                            items: result.items,
                            total: result.totalCount,
                            current: query.pagination.current,
                        },
                    });
                }
            },
            { type: 'takeLatest' },
        ],
        *update({ payload }, { call, put, select }) {
            const { id } = yield select((state: State) => ({
                id: state.categoryModel.id,
            }));
            const result = yield call<PutTagsIdPayload>(putTagsId, {
                id,
                body: payload,
            });
            const error = isError(result);
            if (error) {
                return;
            }
            yield put({
                type: 'toggleVisible',
                payload: {
                    visible: false,
                },
            });
            yield put({
                type: 'global/refreshBox',
            });
            message.success('修改成功!');
        },
        *add({ payload }, { call, put }) {
            const result: CustomCategoryFeignModel = yield call<PostCommonsCustomCategoryPayload>(
                postCommonsCustomCategory,
                {
                    body: payload,
                }
            );
            const error = isError(result);
            if (error) {
                return;
            }
            yield put({
                type: 'toggleVisible',
                payload: {
                    visible: false,
                },
            });
            yield put({
                type: 'global/refreshBox',
            });
            message.success('保存成功!');
        },
        *addAndCreate({ payload }, { call, put }) {
            const result: CustomCategoryFeignModel = yield call<PostCommonsCustomCategoryPayload>(
                postCommonsCustomCategory,
                {
                    body: payload,
                }
            );
            const error = isError(result);
            if (error) {
                return;
            }
            yield put({
                type: 'toggleVisible',
                payload: {
                    visible: false,
                },
            });
            yield put({
                type: 'global/refreshBox',
            });
            message.success('保存成功!');
            yield put({
                type: 'toggleVisible',
                payload: {
                    visible: true,
                },
            });
        },
        *delete({ payload }, { call, put }) {
            const result: any = yield call<DeleteCommonsCustomCategoryIdPayload>(
                deleteCommonsCustomCategoryId,
                {
                    id: payload.id,
                    query: payload.query,
                }
            );
            const error = isError(result);
            if (error) {
                return;
            }
            if (payload.pagination) {
                yield put({
                    type: 'save',
                    payload: {
                        pagination: payload.pagination,
                    },
                });
            }
            yield put({
                type: 'query',
                payload: {},
            });
            message.success('删除成功!');
        },
        *editFeeType({ payload }, { call, put }){
            const result: any = yield call(putCommonsCustomCategoryId,
                {
                    id: payload.id,
                    query: payload.query,
                }
            );
            const error = isError(result);
            if (error) {
                return;
            }
            message.success('编辑成功!');
            yield put({
                type: 'global/refreshBox',
            });
        },
    },
    reducers: {
        toggleVisible(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        save(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        clear(state) {
            return {
                ...state,
                current: {},
                id: undefined,
            };
        },
    },
});
