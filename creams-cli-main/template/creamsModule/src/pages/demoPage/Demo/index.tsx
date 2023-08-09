import React, { useEffect, useState } from 'react';
import { TableHeader } from '@/components';
import { GetUsersUserChangeLogsQuery } from '@/services/Users';
import { ChangeLogResponse } from '@/services/interfaces';
import { isError } from '@/utils';

import Table from '@/containers/Table';

import moment from 'moment';

const columns = [
    {
        title: '账号',
        dataIndex: 'username',
        key: 'username',
        width: '33%',
        render: (_, rc) => {
            return <span>{rc?.createdBy?.name || '-'}</span>;
        },
    },
    {
        title: '操作时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: text => moment(text).format('YYYY/MM/DD'),
        width: '33%',
    },
    {
        title: '操作内容',
        dataIndex: 'changes',
        key: 'changes',
        width: '33%',
        render: text => {
            return (text && text[0]) || '-';
        },
    },
];

const DeleteLogsTable = () => {
    const [list, setList] = useState<ChangeLogResponse[]>([]);
    useEffect(() => {
        // fetchList({
        //     page: 1,
        //     size: 10,
        // });
    }, []);
    const fetchList = (query: GetUsersUserChangeLogsQuery) => {
        // getUsersUserChangeLogs({
        //     query,
        // }).then(res => {
        //     const error = isError(res);
        //     if (error) {
        //         return;
        //     }
        setList([]);
        // });
    };

    return (
        <div style={{ padding: 20 }}>
            <Table
                title={() => <TableHeader>表格</TableHeader>}
                columns={columns}
                dataSource={list}
                onChange={pagination => {
                    // fetchList({
                    //     page: pagination.current,
                    //     size: pagination.pageSize,
                    // });
                }}
            />
        </div>
    );
};

export default DeleteLogsTable;
