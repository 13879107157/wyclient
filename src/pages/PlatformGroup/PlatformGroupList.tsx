import { useEffect, useState } from 'react';
import { Table, Input, Button, message, Space, Popconfirm } from 'antd';
import {
    getAllPlatformGroups,
    deletePlatformGroup,
    type PlatformGroup
} from '../../api/platformGroupApi';
import PlatformGroupEditModal from './PlatformGroupEditModal';

const PlatformGroupList = () => {
    const [platformGroups, setPlatformGroups] = useState<PlatformGroup[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentGroup, setCurrentGroup] = useState<PlatformGroup | null>(null);

    // 加载平台组列表
    useEffect(() => {
        fetchPlatformGroups();
    }, []);

    const fetchPlatformGroups = async () => {
        setLoading(true);
        try {
            const groups = await getAllPlatformGroups();
            setPlatformGroups(groups);
        } catch (error) {
            message.error('获取平台组列表失败');
        } finally {
            setLoading(false);
        }
    };

    // 处理搜索
    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    // 处理删除
    const handleDelete = async (id: number) => {
        try {
            await deletePlatformGroup(id);
            setPlatformGroups(platformGroups.filter(group => group.id !== id));
            message.success('删除成功');
        } catch (error) {
            message.error('删除失败');
        }
    };

    // 处理编辑
    const handleEdit = (group: PlatformGroup) => {
        setCurrentGroup(group);
        setEditModalVisible(true);
    };

    // 编辑成功后的回调
    const handleEditSuccess = () => {
        setEditModalVisible(false);
        fetchPlatformGroups(); // 刷新列表
        message.success('更新成功');
    };

    // 过滤搜索结果
    const filteredGroups = platformGroups.filter(group =>
        group.name.includes(searchText) ||
        group.description.includes(searchText)
    );

    // 表格列定义
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
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <span>{status === 1 ? '启用' : '禁用'}</span>,
        },
        {
            title: '排序',
            dataIndex: 'order',
            key: 'order',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" size="small" onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要删除这个平台组吗？"
                        description="删除后数据将无法恢复，请谨慎操作。"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确认"
                        cancelText="取消"
                        okType="danger"
                    >
                        <Button type="text" danger size="small">
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="page-title">
                <h1>
                    平台组列表
                </h1>
            </div>
            <Input.Search
                placeholder="搜索平台组"
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
                enterButton
            />

            <Table
                dataSource={filteredGroups}
                columns={columns}
                loading={loading}
                rowKey="id"
            />

            {/* 编辑模态框 */}
            {currentGroup && (
                <PlatformGroupEditModal
                    visible={editModalVisible}
                    platformGroup={currentGroup}
                    onCancel={() => setEditModalVisible(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default PlatformGroupList;