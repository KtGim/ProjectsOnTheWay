/*
 * @Author: Wrappers
 * @Date: 2019-03-11 16:10:12
 * @Last Modified by: Wrappers
 * @Last Modified time: 2019-04-04 14:46:42
 */
import React, { StatelessComponent } from 'react';
import { InfoCard, Box, ActionButton } from '@/components';
import { Header as HeaderBase } from '@/containers/RightPanel';
import { CustomRoleModel, CustomRoleDetailModel } from '@/services/interfaces';
import { hot } from 'react-hot-loader';
import { State } from '@/types';
import { connect } from 'react-redux';
import { leftInfoConfig } from '../config';
import { ModalType } from 'creams-setting/pages/authority/role/model/types';
import { CreamsCheck, DisplayLevel, AuthEnum } from '@/authorities';

const ActionButtonGroup = ActionButton.Group;
const { InfoBox } = Box;

interface IProps {
    data: CustomRoleModel;
    roleDetail: CustomRoleDetailModel;
    loading: boolean;
    edit: (id: number) => void;
}

const Header: StatelessComponent<IProps> = ({ data, roleDetail, loading, edit }) => {
    const { id = -1 } = data;

    const action = (
        <ActionButtonGroup>
            <CreamsCheck level={DisplayLevel.VIEW_HIDDEN} auth={[AuthEnum.enum.USER_ROLE_EDIT.key]}>
                <ActionButton onClick={() => edit(id)} icon={'creams-CommonEdit'}>
                    编辑
                </ActionButton>
            </CreamsCheck>
        </ActionButtonGroup>
    );

    return (
        <HeaderBase label={roleDetail.name || ''} action={action} loading={loading}>
            <InfoBox bordered={false} style={{ marginBottom: 0 }}>
                <InfoCard data={roleDetail} config={leftInfoConfig} bordered={false} />
            </InfoBox>
        </HeaderBase>
    );
};

export default hot(module)(
    connect(
        (state: State) => ({
            data: state.sidebarRight.payload.data,
            roleDetail: state.role.roleDetail || {},
            loading: state.loading.effects['role/fetchRoleDetail'],
        }),
        dispatch => {
            return {
                edit: (id: number) => {
                    dispatch({
                        type: 'role/setModalVisible',
                        visible: true,
                        modalType: ModalType.edit,
                        editDataId: id,
                    });
                },
            };
        }
    )(Header)
);
