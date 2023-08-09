/*
 * @Author: Wrappers
 * @Date: 2019-03-11 16:43:50
 * @Last Modified by: Wrappers
 * @Last Modified time: 2019-03-11 16:44:28
 */
import { ItemConfig } from '@/components/InfoCard';
import { CustomRoleDetailModel } from '@/services/interfaces';

export const leftInfoConfig: ItemConfig<CustomRoleDetailModel>[] = [
    {
        title: '备注',
        dataIndex: 'memo',
        hasDivider: false,
    },
];
