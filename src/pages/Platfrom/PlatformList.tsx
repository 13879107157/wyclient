import { useEffect, useState, useMemo } from 'react';
import { Table, Input, Button, message, Space, Popconfirm, Tag } from 'antd';
import {
    getAllPlatforms,
    deletePlatform,
    type Platform
} from '../../api/platformApi';
import { getAllPlatformGroups } from '../../api/platformGroupApi';
import { getAllPlatformTypes } from '../../api/platFromTypeApi';
import PlatformEditModal from './PlatformEditModal';

const PlatformList = () => {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [rawPlatformGroups, setRawPlatformGroups] = useState<any[]>([]);
    const [rawPlatformTypes, setRawPlatformTypes] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    // @ts-ignore
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentPlatform, setCurrentPlatform] = useState<Platform | null>(null);

    // 数据加载状态
    const [groupsLoading, setGroupsLoading] = useState(true);
    const [typesLoading, setTypesLoading] = useState(true);
    const [platformsLoading, setPlatformsLoading] = useState(true);

    // 转换平台组数据，提取名称字段
    const platformGroups = useMemo(() => {
        return rawPlatformGroups.map(group => ({
            id: group.id,
            name: group.name || group.title || group.group_name || '未知组',
        }));
    }, [rawPlatformGroups]);

    // 转换平台类型数据，提取名称字段
    const platformTypes = useMemo(() => {
        return rawPlatformTypes.map(type => ({
            id: type.id,
            name: type.name || type.title || type.type_name || '未知类型',
        }));
    }, [rawPlatformTypes]);

    //@ts-ignore
    // 创建映射表 
    const platformGroupMap = useMemo(() => {
        return platformGroups.reduce((map, group) => {
            map[group.id] = group.name;
            return map;
        }, {} as Record<number, string>);
    }, [platformGroups]);

    const platformTypeMap = useMemo(() => {
        return platformTypes.reduce((map, type) => {
            map[type.id] = type.name;
            return map;
        }, {} as Record<number, string>);
    }, [platformTypes]);

    // 加载数据
    useEffect(() => {
        fetchPlatforms();
        fetchPlatformGroups();
        fetchPlatformTypes();
    }, []);

    // 获取平台列表
    const fetchPlatforms = async () => {
        setPlatformsLoading(true);
        try {
            const platforms = await getAllPlatforms();
            setPlatforms(platforms);
        } catch (error) {
            message.error('获取平台列表失败');
        } finally {
            setPlatformsLoading(false);
        }
    };

    // 获取平台组列表
    const fetchPlatformGroups = async () => {
        setGroupsLoading(true);
        try {
            const groups = await getAllPlatformGroups();
            setRawPlatformGroups(groups);
        } catch (error) {
            console.error('获取平台组列表失败:', error);
        } finally {
            setGroupsLoading(false);
        }
    };

    // 获取平台类型列表
    const fetchPlatformTypes = async () => {
        setTypesLoading(true);
        try {
            const types = await getAllPlatformTypes();
            setRawPlatformTypes(types);
        } catch (error) {
            console.error('获取平台类型列表失败:', error);
        } finally {
            setTypesLoading(false);
        }
    };

    // 处理搜索
    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    // 处理删除
    const handleDelete = async (id: number) => {
        try {
            await deletePlatform(id);
            setPlatforms(platforms.filter(platform => platform.id !== id));
            message.success('删除成功');
        } catch (error) {
            message.error('删除失败');
        }
    };

    // 处理编辑
    const handleEdit = (platform: Platform) => {
        console.log("platform数据", platform);
        setCurrentPlatform(platform);
        setEditModalVisible(true);
    };

    // 编辑成功后的回调
    const handleEditSuccess = () => {
        setEditModalVisible(false);
        fetchPlatforms(); // 刷新列表
        message.success('更新成功');
    };

    // 过滤搜索结果（修复空值问题）
    const filteredPlatforms = platforms.filter(platform => {
        const name = platform.name || '';
        const description = platform.description || '';
        return name.includes(searchText) || description.includes(searchText);
    });

    // 按平台组 ID 分组
    const groupedPlatforms = useMemo(() => {
        const groups: Record<number, Platform[]> = {};
        filteredPlatforms.forEach(platform => {
            if (!groups[platform.platform_group_id]) {
                groups[platform.platform_group_id] = [];
            }
            groups[platform.platform_group_id].push(platform);
        });
        return groups;
    }, [filteredPlatforms]);

    // 主表列定义
    const mainColumns = [
        {
            title: '平台组名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '平台组ID',
            dataIndex: 'id',
            key: 'id',
        },

        {
            title: '平台数量',
            key: 'platformCount',
            render: (_, record) => {
                const count = groupedPlatforms[record.id]?.length || 0;
                return <Tag color="blue">{count}</Tag>;
            },
        },
    ];

    // 子表列定义
    const subColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '平台名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '平台类型',
            key: 'platform_type_id',
            render: (_, record) => {
                if (typesLoading) return '加载中...';
                const typeId = record.platform_type_id;
                const typeName = platformTypeMap[typeId] || '-';
                return `${typeName}-[类型ID：${typeId}]`;
            },
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
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
                        title="确定要删除这个平台吗？"
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

    // 所有数据加载完成状态
    const isDataLoaded = !platformsLoading && !groupsLoading && !typesLoading;

    return (
        <div>
            <div className="page-title">
                <h1>平台列表</h1>
            </div>
            <Input.Search
                placeholder="搜索平台"
                onSearch={handleSearch}
                style={{ marginBottom: 16 }}
                enterButton
            />

            {!isDataLoaded && (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-gray-500">加载中...</p>
                </div>
            )}

            {isDataLoaded && Object.keys(groupedPlatforms).length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">暂无平台数据</p>
                </div>
            )}

            {isDataLoaded && Object.keys(groupedPlatforms).length > 0 && (
                <Table
                    dataSource={platformGroups}
                    columns={mainColumns}
                    loading={loading}
                    rowKey="id"
                    expandable={{
                        expandedRowRender: (record) => {
                            const platformsInGroup = groupedPlatforms[record.id] || [];
                            return (
                                <Table
                                    dataSource={platformsInGroup}
                                    columns={subColumns}
                                    pagination={false}
                                    size="small"
                                />
                            );
                        },
                        rowExpandable: (record) => groupedPlatforms[record.id]?.length > 0,
                        defaultExpandedRowKeys: [], // 默认不展开任何行
                    }}
                />
            )}

            {/* 编辑模态框 */}
            {currentPlatform && (
                <PlatformEditModal
                    visible={editModalVisible}
                    platform={currentPlatform}
                    platformGroups={platformGroups}
                    platformTypes={platformTypes}
                    onCancel={() => setEditModalVisible(false)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default PlatformList;