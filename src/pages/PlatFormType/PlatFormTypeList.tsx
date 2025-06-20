import React, { useEffect, useState } from 'react';
import { Table, Input, Button, message, Popconfirm } from 'antd';
import { getAllPlatformTypes, deletePlatformType } from '../../api/platFromTypeApi';
import PlatformTypeEditModal from './PlatformTypeEditModal';

// 格式化日期时间
const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

export default function PlatFormTypeList() {
    const [platformTypes, setPlatformTypes] = useState<{
        id: number;
        name: string;
        description: string;
        createdAt: string;
        updatedAt: string;
    }[]>([]);
    const [searchText, setSearchText] = useState('');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentPlatformType, setCurrentPlatformType] = useState<{
        id: number;
        name: string;
        description: string;
    } | null>(null);

    useEffect(() => {
        fetchPlatformTypes();
    }, []);

    const fetchPlatformTypes = async () => {
        try {
            const types = await getAllPlatformTypes();
            setPlatformTypes(types);
        } catch (error) {
            console.error('获取平台类型列表失败:', error);
            message.error('获取平台类型列表失败');
        }
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const handleDelete = async (id: number) => {
        try {
            await deletePlatformType(id);
            setPlatformTypes(platformTypes.filter((type) => type.id !== id));
            message.success('删除成功');
        } catch (error) {
            console.error('删除平台类型失败:', error);
            message.error('删除失败');
        }
    };

    const handleEdit = (record: any) => {
        setCurrentPlatformType(record);
        setEditModalVisible(true);
    };

    const handleEditModalCancel = () => {
        setEditModalVisible(false);
    };

    const handleEditSuccess = async () => {
        setEditModalVisible(false);
        message.success('更新成功');
        await fetchPlatformTypes(); // 刷新数据
    };

    const filteredPlatformTypes = platformTypes.filter((type) =>
        type.name.includes(searchText) ||
        type.description.includes(searchText)
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => formatDateTime(text),
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => formatDateTime(text),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: 8 }}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除这个平台类型吗？"
                        description="删除后将无法恢复，请谨慎操作。"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确认"
                        cancelText="取消"
                        okType="danger"
                    >
                        <Button
                            type="text"
                            danger
                            size="small"
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="page-title">
                <h1>平台组类型列表</h1>
            </div>
            <Input.Search
                placeholder="搜索平台类型"
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
            />
            <Table dataSource={filteredPlatformTypes} columns={columns} />

            {/* 编辑弹窗 */}
            {currentPlatformType && (
                <PlatformTypeEditModal
                    visible={editModalVisible}
                    onCancel={handleEditModalCancel}
                    onSuccess={handleEditSuccess}
                    initialValues={currentPlatformType}
                />
            )}
        </div>
    );
}