/*
 * @Author: Wrappers
 * @Date: 2019-03-11 16:09:50
 * @Last Modified by: Wrappers
 * @Last Modified time: 2019-03-11 17:05:07
 */
import React, { StatelessComponent, useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Content as ContentBase } from '@/containers/RightPanel';
import { Box, Card } from '@/components';
import { State } from '@/types';
import { AuthorityTree } from '@/containers/AuthorityTree';
import { CustomRoleModel } from '@/services/interfaces';
import { PermissionList } from '@/containers/AuthorityTree/types';

interface IProps {
    data: CustomRoleModel;
    rolePermissionList?: PermissionList[];
    loading: boolean;
    fetchRoleDetail: (id: number) => void;
    clearData: () => void;
}

const Content: StatelessComponent<IProps> = ({
    rolePermissionList = [],
    data,
    loading,
    fetchRoleDetail,
    clearData,
}) => {
    useEffect(() => {
        const { id = -1 } = data;
        fetchRoleDetail(id);
        return () => {
            clearData();
        };
    }, []);

    return (
        <ContentBase loading={loading}>
            <Box noPadding={true} bordered={false}>
                <Card outTitle="权限树">
                    <AuthorityTree permissionList={rolePermissionList} isEdit={false} />
                </Card>
            </Box>
        </ContentBase>
    );
};

export default hot(module)(
    connect(
        (state: State) => ({
            data: state.sidebarRight.payload.data,
            rolePermissionList: state.role.rolePermissionList,
            loading: state.loading.effects['role/fetchRoleDetail'],
        }),
        dispatch => {
            return {
                fetchRoleDetail: id => {
                    dispatch({
                        type: 'role/fetchRoleDetail',
                        id,
                    });
                },
                clearData: () =>
                    dispatch({
                        type: 'role/clearData',
                    }),
            };
        }
    )(Content)
);
