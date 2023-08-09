import { createModel, isError } from '@/utils';
import { message } from 'antd';
import { pageModel } from '@/utils/models';
import { CustomTagPageModel, CustomTagFeignModel } from '@/services/interfaces';
import {
    getTagsPaging,
    GetTagsPagingPayload,
    postTags,
    PostTagsPayload,
    deleteTagsId,
    DeleteTagsIdPayload,
    putTagsId,
    PutTagsIdPayload,
} from '@/services/BusinessCommon';
import { State } from '@/types';
interface IState {}

export default createModel<IState>(pageModel, {
    namespace: 'tagModel',
    effects: {
        query: [
            function* ({ payload }, { put, select, call }) {
                yield put({
                    type: 'setQuery',
                    payload,
                });
                const query = yield select((state: State) => ({
                    pagination: state.tagModel.pagination,
                    tagType: state.tagModel.tagType,
                    customerId: state.Auth.user.user.customerId,
                }));
                const result: CustomTagPageModel = yield call<GetTagsPagingPayload>(getTagsPaging, {
                    query: {
                        page: query.pagination.current,
                        size: query.pagination.pageSize,
                        tagType: query.tagType,
                        customerId: query.customerId,
                    },
                });
                const error = isError(result);
                if (error) {
                    message.error(error.error);
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
            },
            { type: 'takeLatest' },
        ],
        *update({ payload, successCallBack }, { call, put, select }) {
            const { id } = yield select((state: State) => ({
                id: state.tagModel.id,
            }));

            const result = yield call<PutTagsIdPayload>(putTagsId, {
                id,
                body: payload,
            });
            const error = isError(result);
            if (error) {
                message.error(error.error);
                return;
            }
            yield put({
                type: 'toggleVisible',
                payload: {
                    visible: false,
                },
            });
            yield put({
                type: 'query',
            });
            message.success('修改成功！');
            successCallBack();
        },
        *add({ payload, successCallBack }, { call, put }) {
            const result: CustomTagFeignModel = yield call<PostTagsPayload>(postTags, {
                body: payload,
            });
            const error = isError(result);
            if (error) {
                message.error(error.error);
                return;
            }
            yield put({
                type: 'toggleVisible',
                payload: {
                    visible: false,
                    parentId: '',
                },
            });
            yield put({
                type: 'query',
            });
            message.success('保存成功!');
            successCallBack();
        },
        *addAndCreate({ payload }, { call, put, select }) {
            const result = yield call<PostTagsPayload>(postTags, {
                body: payload,
            });
            const error = isError(result);
            if (error) {
                message.error(error.error);
                return;
            }
            yield put({
                type: 'toggleVisible',
                payload: {
                    visible: false,
                },
            });
            yield put({
                type: 'query',
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
            const result = yield call<DeleteTagsIdPayload>(deleteTagsId, {
                id: payload.id,
                query: {
                    typeEnum: payload.tagType,
                },
            });
            const error = isError(result);
            if (error) {
                message.error(error.error);
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
