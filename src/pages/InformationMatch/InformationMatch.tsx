import React, { useState, useEffect, useRef } from 'react';
import {
    Upload,
    Button,
    Table,
    Modal,
    Select,
    message,
    Space,
    Tooltip,
    Card,
    Tabs,
    Tag,
    Empty
} from 'antd';
import {
    InboxOutlined,
    CloseOutlined,
    DownloadOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { processExcelMatching, type ExcelMatchingParams } from '../../api/InformationMatchingApi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as echarts from 'echarts';

const { Dragger } = Upload;
const { Option } = Select;
const { TabPane } = Tabs;

const InformationMatch = () => {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [platformGroupFilter, setPlatformGroupFilter] = useState<string[] | null>(null);
    const [platformFilter, setPlatformFilter] = useState<string[] | null>(null);
    const [dimensionFilter, setDimensionFilter] = useState<string[] | null>(null);
    const [dataModalVisible, setDataModalVisible] = useState(false);
    const [dataModalData, setDataModalData] = useState<any[]>([]);
    const [dataModalTotal, setDataModalTotal] = useState(0);
    const [dataModalCurrentPage, setDataModalCurrentPage] = useState(1);
    const [statisticsModalVisible, setStatisticsModalVisible] = useState(false);
    const [statisticsModalData, setStatisticsModalData] = useState<any>({});
    const [statisticsModalTitle, setStatisticsModalTitle] = useState<string>('');
    const [selectedStatisticsKey, setSelectedStatisticsKey] = useState<string>('');
    const [dimensionTotals, setDimensionTotals] = useState({}); // 存储各维度总和
    const chartRef = useRef<HTMLDivElement>(null);
    const [loadingData, setLoadingData] = useState(false);
    const [originalResult, setOriginalResult] = useState<any>(null);

    // 处理文件上传
    const handleUpload = async () => {
        console.log('handleUpload file:', file);
        if (file) {
            const params: ExcelMatchingParams = {
                file,
                urlColumn: '关键字URL',
                columnsToInclude: dimensionFilter?.join(',') || undefined
            };
            try {
                setLoadingData(true);
                const response = await processExcelMatching(params);
                setResult(response);
                setOriginalResult(response);
                renderChart(calculateFilteredStatistics());
                setPlatformGroupFilter(null);
                setPlatformFilter(null);
                setDimensionFilter(null);
            } catch (error) {
                message.error('上传失败，请稍后重试');
            } finally {
                setLoadingData(false);
            }
        } else {
            message.error('请选择要上传的文件');
        }
    };

    // 清空文件并清除相关数据
    const handleClearFile = () => {
        setFile(null);
        setResult(null);
        setOriginalResult(null);
        setPlatformGroupFilter(null);
        setPlatformFilter(null);
        setDimensionFilter(null);

        const uploadComponent = document.querySelector('.ant-upload-list');
        if (uploadComponent) {
            uploadComponent.innerHTML = '';
        }

        message.success('已清空上传文件和相关数据');
    };

    // 重置查询
    const handleResetQuery = () => {
        setPlatformGroupFilter(null);
        setPlatformFilter(null);
        setDimensionFilter(null);
        setResult(originalResult);
        if (originalResult) {
            renderChart(calculateFilteredStatistics());
        }
        message.success('已重置查询条件');
    };

    // 平台组筛选
    const handlePlatformGroupFilterChange = (value: string[] | null) => {
        setPlatformGroupFilter(value);
        setPlatformFilter(null);
        renderChart(calculateFilteredStatistics());
    };

    // 平台筛选
    const handlePlatformFilterChange = (value: string[] | null) => {
        setPlatformFilter(value);
        renderChart(calculateFilteredStatistics());
    };

    // 维度筛选
    const handleDimensionFilterChange = (value: string[] | null) => {
        setDimensionFilter(value);
        renderChart(calculateFilteredStatistics());
    };

    // 维度查询
    const handleDimensionQuery = async () => {
        if (file) {
            const params: ExcelMatchingParams = {
                file,
                urlColumn: '关键字URL',
                columnsToInclude: dimensionFilter?.join(',') || undefined
            };
            try {
                setLoadingData(true);
                const response = await processExcelMatching(params);
                setResult(response);
                setOriginalResult(response);
                renderChart(calculateFilteredStatistics());
            } catch (error) {
                message.error('查询失败，请稍后重试');
            } finally {
                setLoadingData(false);
            }
        } else {
            message.error('请先上传文件');
        }
    };

    // 根据当前筛选条件计算统计数据
    const calculateFilteredStatistics = () => {
        if (!originalResult || !dimensionFilter || dimensionFilter.length === 0) return {};

        let filteredGroups = originalResult.platformStructure;
        if (platformGroupFilter && platformGroupFilter.length > 0 && !platformGroupFilter.includes('全部')) {
            filteredGroups = filteredGroups.filter(group =>
                platformGroupFilter.includes(group.platformGroupName)
            );
        }

        let filteredPlatforms = filteredGroups.flatMap(group => group.platformGroupChildren);
        if (platformFilter && platformFilter.length > 0) {
            filteredPlatforms = filteredPlatforms.filter(platform =>
                platformFilter.includes(platform.platformName)
            );
        }

        const statistics = {};

        dimensionFilter.forEach(dimension => {
            statistics[dimension] = {};

            filteredPlatforms.forEach(platform => {
                if (!platform.statistics) return;

                const platformStats = platform.statistics[dimension] || {};

                Object.entries(platformStats).forEach(([key, value]) => {
                    if (statistics[dimension][key]) {
                        statistics[dimension][key] += value;
                    } else {
                        statistics[dimension][key] = value;
                    }
                });
            });
        });

        return statistics;
    };

    // 查看数据
    const handleViewData = (matchedData: any[], total: number = 0) => {
        setDataModalData(matchedData);
        setDataModalTotal(total || matchedData.length);
        setDataModalCurrentPage(1);
        setDataModalVisible(true);
    };

    // 处理数据表格分页
    const handleDataPaginationChange = (page: number, pageSize: number) => {
        setDataModalCurrentPage(page);
        console.log(`加载第${page}页数据，每页${pageSize}条`);
    };

    // 查看统计（已添加总和计算）
    const handleViewStatistics = (statistics: any, title: string, key?: string) => {
        console.log("handleViewStatistics", statistics);

        const hasData = Object.keys(statistics).some(dimension =>
            Object.keys(statistics[dimension] || {}).length > 0
        );

        if (!hasData) {
            message.info('暂无统计数据');
            return;
        }

        // 计算每个维度的总和
        const dimensionTotals = {};
        Object.keys(statistics).forEach(dimension => {
            const dimensionData = statistics[dimension] || {};
            const total = Object.values(dimensionData).reduce((sum, value) => sum + (Number(value) || 0), 0);
            dimensionTotals[dimension] = total;
        });

        const sortedStatistics = {};
        Object.keys(statistics).forEach(dimension => {
            const dimensionData = statistics[dimension] || {};
            const sortedData = Object.entries(dimensionData)
                .sort((a, b) => b[1] - a[1])
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
            sortedStatistics[dimension] = sortedData;
        });

        setStatisticsModalData(sortedStatistics);
        setStatisticsModalTitle(title);
        setSelectedStatisticsKey(key || Object.keys(sortedStatistics)[0]);
        setDimensionTotals(dimensionTotals); // 保存各维度总和
        setStatisticsModalVisible(true);
    };

    // 导出数据
    const handleExport = () => {
        if (result) {
            const filteredPlatformStructure = result.platformStructure.filter((group: any) =>
                !platformGroupFilter ||
                platformGroupFilter.includes('全部') ||
                platformGroupFilter.includes(group.platformGroupName)
            ).map(group => ({
                ...group,
                platformGroupChildren: group.platformGroupChildren.filter(platform =>
                    !platformFilter ||
                    platformFilter.includes(platform.platformName)
                )
            }));

            const dataToExport = [];
            filteredPlatformStructure.forEach((group: any) => {
                dataToExport.push({
                    '平台组名称': group.platformGroupName,
                    '排序': group.order,
                    '匹配数量': group.matchCount
                });
                group.platformGroupChildren.forEach((platform: any) => {
                    dataToExport.push({
                        '平台名称': platform.platformName,
                        '匹配数量': platform.matchCount,
                        '平台类型名称': platform.platformTypeName
                    });
                    platform.matchedData.forEach((data: any) => {
                        dataToExport.push({ ...data });
                    });
                });
            });
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
            saveAs(blob, 'exported_data.xlsx');
        } else {
            message.error('请先上传文件并获取数据');
        }
    };

    // 二进制转换工具函数
    const s2ab = (s: string) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    // 渲染图表
    const renderChart = (statistics: any) => {
        if (chartRef.current && statistics && dimensionFilter && dimensionFilter.length > 0) {
            const myChart = echarts.init(chartRef.current);

            const dimensions = dimensionFilter;
            const legendData = [];
            const seriesData = [];

            dimensions.forEach(dimension => {
                if (statistics[dimension]) {
                    legendData.push(dimension);

                    const dimensionData = Object.entries(statistics[dimension] || {})
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 10)
                        .map(([key, value]) => ({
                            name: key,
                            value: Number(value) || 0
                        }));

                    seriesData.push({
                        name: dimension,
                        type: 'bar',
                        data: dimensionData
                    });
                }
            });

            const allValues = seriesData.flatMap(series => series.data.map(item => item.value));
            const maxValue = Math.max(...allValues);

            const option = {
                title: { text: `多维度数据对比统计` },
                legend: {
                    data: legendData,
                    type: 'scroll',
                    orient: 'horizontal',
                    bottom: 0
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: seriesData.length > 0 ? seriesData[0].data.map(item => item.name) : []
                },
                yAxis: {
                    type: 'value',
                    max: Math.ceil(maxValue * 1.1)
                },
                series: seriesData
            };

            myChart.setOption(option);
        }
    };

    // 主表列配置
    const mainTableColumns = [
        { title: '平台组名称', dataIndex: 'platformGroupName', key: 'platformGroupName' },
        { title: '排序', dataIndex: 'order', key: 'order' },
        { title: '匹配数量', dataIndex: 'matchCount', key: 'matchCount' },
        {
            title: '查看统计', key: 'viewStatistics',
            render: (_, record) => (
                <Tooltip title="查看平台组的statistics数据统计">
                    <Button type="link" onClick={() => handleViewStatistics(record.statistics, record.platformGroupName)}>
                        查看统计
                    </Button>
                </Tooltip>
            )
        }
    ];

    // 子表列配置
    const subTableColumns = [
        { title: '平台名称', dataIndex: 'platformName', key: 'platformName' },
        { title: '匹配数量', dataIndex: 'matchCount', key: 'matchCount' },
        { title: '平台类型名称', dataIndex: 'platformTypeName', key: 'platformTypeName' },
        {
            title: '查看数据', key: 'viewData',
            render: (_, record) => (
                <Tooltip title="查看平台的matchedData所有数据">
                    <Button type="link" onClick={() => handleViewData(record.matchedData, record.total)}>
                        查看数据
                    </Button>
                </Tooltip>
            )
        },
        {
            title: '查看统计', key: 'viewSubStatistics',
            render: (_, record) => (
                <Tooltip title="查看平台的statistics数据统计">
                    <Button type="link" onClick={() => handleViewStatistics(record.statistics, record.platformName)}>
                        查看统计
                    </Button>
                </Tooltip>
            )
        }
    ];

    // 筛选后的平台组数据
    const filteredPlatformStructure = result
        ? result.platformStructure.filter((group: any) =>
            !platformGroupFilter ||
            platformGroupFilter.includes('全部') ||
            platformGroupFilter.includes(group.platformGroupName)
        ).map(group => ({
            ...group,
            platformGroupChildren: group.platformGroupChildren.filter(platform =>
                !platformFilter ||
                platformFilter.includes(platform.platformName)
            )
        })).filter(group => group.platformGroupChildren.length > 0)
        : [];

    // 获取当前筛选的平台列表
    const getFilteredPlatforms = () => {
        if (!result || !platformGroupFilter) return [];

        return result.platformStructure
            .filter(group =>
                !platformGroupFilter ||
                platformGroupFilter.includes('全部') ||
                platformGroupFilter.includes(group.platformGroupName)
            )
            .flatMap(group => group.platformGroupChildren)
            .map(platform => platform.platformName);
    };

    // 图表依赖更新
    useEffect(() => {
        renderChart(calculateFilteredStatistics());
    }, [platformGroupFilter, platformFilter, dimensionFilter, originalResult]);

    // 当文件被清空时，自动清除相关数据
    useEffect(() => {
        if (!file) {
            setResult(null);
            setOriginalResult(null);
            setPlatformGroupFilter(null);
            setPlatformFilter(null);
            setDimensionFilter(null);
        }
    }, [file]);

    return (
        <div className="information-match-container">
             <div className="page-title">
                <h1>
                    3++导出数据分析
                </h1>
            </div>
            {/* 拖拽上传区域 */}
            <Dragger
                accept=".xlsx,.xls"
                beforeUpload={(file) => {
                    console.log('beforeUpload file:', file);
                    return false;
                }}
                onChange={(info) => {
                    const { fileList } = info;

                    if (fileList.length > 0) {
                        const latestFile = fileList[fileList.length - 1];
                        if (latestFile && latestFile.originFileObj) {
                            setFile(latestFile.originFileObj);
                            console.log('✅ 文件状态已更新:', latestFile.originFileObj);
                        }
                    } else {
                        setFile(null);
                        console.log('文件已移除');
                    }
                }}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">支持 .xlsx 和 .xls 格式文件</p>
            </Dragger>

            <Space style={{ marginTop: 16 }}>
                <Button type="primary" onClick={handleUpload} loading={loadingData}>
                    确认上传
                </Button>
                <Button type="default" onClick={handleClearFile}>
                    <CloseOutlined /> 清空上传文件
                </Button>

            </Space>

            {/* 筛选区域 */}
            <Space style={{ marginTop: 16, width: '100%', display: 'flex', flexWrap: 'wrap' }}>
                <Select
                    placeholder="选择平台组（可多选）"
                    value={platformGroupFilter}
                    onChange={handlePlatformGroupFilterChange}
                    mode="multiple"
                    maxTagCount={3}
                    style={{ width: 200, marginRight: 5, marginBottom: 8 }}
                >
                    <Option key="全部" value="全部">全部</Option>
                    {result?.platformStructure.map((group: any, index: number) => (
                        <Option key={`${group.platformGroupName}-${index}`} value={group.platformGroupName}>
                            {group.platformGroupName}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="选择平台（可多选）"
                    value={platformFilter}
                    onChange={handlePlatformFilterChange}
                    mode="multiple"
                    maxTagCount={3}
                    style={{ width: 200, marginRight: 5, marginBottom: 8 }}
                    disabled={!platformGroupFilter || platformGroupFilter.includes('全部') || platformGroupFilter.length === 0}
                >
                    {getFilteredPlatforms().map((platformName, index) => (
                        <Option key={`${platformName}-${index}`} value={platformName}>
                            {platformName}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="选择维度（可多选）"
                    value={dimensionFilter}
                    onChange={handleDimensionFilterChange}
                    mode="multiple"
                    maxTagCount={3}
                    style={{ width: 300, marginRight: 5, marginBottom: 8 }}
                >
                    {result?.excelColumns.map((column: string, index: number) => (
                        <Option key={`${column}-${index}`} value={column}>
                            {column}
                        </Option>
                    ))}
                </Select>
                <Button type="primary" onClick={handleDimensionQuery} style={{ marginRight: 5, marginBottom: 8 }}>
                    维度查询
                </Button>
                <Button type="default" onClick={handleResetQuery} style={{ marginRight: 5, marginBottom: 8 }}>
                    <ReloadOutlined /> 重置查询
                </Button>
                <Button type="primary" onClick={handleExport} style={{ marginBottom: 8 }}>
                    <DownloadOutlined /> 导出数据
                </Button>
            </Space>

            {/* 当前筛选条件标签 */}
            {platformGroupFilter && platformGroupFilter.length > 0 && (
                <div style={{ marginTop: 8, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                    <span style={{ marginRight: 8, color: '#8c8c8c' }}>当前筛选:</span>
                    {platformGroupFilter.map((group) => (
                        <Tag key={group} color="green">{group}</Tag>
                    ))}
                    {platformFilter && platformFilter.length > 0 && (
                        <>
                            <span style={{ margin: '0 8px', color: '#8c8c8c' }}>|</span>
                            {platformFilter.map((platform) => (
                                <Tag key={platform} color="purple">{platform}</Tag>
                            ))}
                        </>
                    )}
                    {dimensionFilter && dimensionFilter.length > 0 && (
                        <>
                            <span style={{ margin: '0 8px', color: '#8c8c8c' }}>|</span>
                            {dimensionFilter.map((dim) => (
                                <Tag key={dim} color="blue">{dim}</Tag>
                            ))}
                        </>
                    )}
                </div>
            )}

            {/* 表格展示 */}
            {result && (
                <Card title="平台数据" style={{ marginTop: 16 }}>
                    <Table
                        dataSource={filteredPlatformStructure}
                        columns={mainTableColumns}
                        rowKey="platformGroupId"
                        expandable={{
                            expandedRowRender: (record) => (
                                <Table
                                    dataSource={record.platformGroupChildren}
                                    columns={subTableColumns}
                                    rowKey="platformId"
                                    pagination={false}
                                />
                            )
                        }}
                    />
                </Card>
            )}

            {/* 图表展示 */}
            {result && dimensionFilter && dimensionFilter.length > 0 && (
                <Card title="统计图表" style={{ marginTop: 16 }}>
                    <div ref={chartRef} style={{ width: '100%', height: 400 }} />
                </Card>
            )}

            {/* 数据详情模态框 */}
            <Modal
                title="数据详情"
                visible={dataModalVisible}
                onCancel={() => setDataModalVisible(false)}
                footer={null}
                width="90%"
                style={{ top: 20 }}
            >
                <Table
                    dataSource={dataModalData}
                    columns={result?.excelColumns.map((column: string) => ({
                        title: column,
                        dataIndex: column,
                        key: column,
                        ellipsis: true,
                        width: 150
                    }))}
                    rowKey={(record: any, index: number) => index}
                    pagination={{
                        current: dataModalCurrentPage,
                        pageSize: 10,
                        total: dataModalTotal,
                        onChange: handleDataPaginationChange,
                        showSizeChanger: false,
                        showQuickJumper: true
                    }}
                    scroll={{ x: 'max-content' }}
                />
            </Modal>

            {/* 统计详情模态框（已添加总和显示） */}
            <Modal
                title={`${statisticsModalTitle} 统计详情`}
                visible={statisticsModalVisible}
                onCancel={() => setStatisticsModalVisible(false)}
                footer={null}
                width={1000}
                style={{ top: 20 }}
            >
                <Tabs activeKey={selectedStatisticsKey} onChange={setSelectedStatisticsKey}>
                    {Object.keys(statisticsModalData).map(dimension => {
                        const dimensionData = statisticsModalData[dimension] || {};
                        const dataArray = Object.entries(dimensionData);

                        return (
                            <TabPane tab={dimension} key={dimension}>
                                {dataArray.length > 0 ? (
                                    <>
                                        <Table
                                            dataSource={dataArray
                                                .sort((a, b) => b[1] - a[1])
                                                .map(([key, value]) => ({
                                                    key,
                                                    维度值: key,
                                                    数量: value
                                                }))}
                                            columns={[
                                                { title: '维度值', dataIndex: '维度值', key: '维度值', sorter: (a, b) => a.维度值.localeCompare(b.维度值) },
                                                { title: '数量', dataIndex: '数量', key: '数量', sorter: (a, b) => a.数量 - b.数量, sortOrder: 'descend' }
                                            ]}
                                            rowKey="key"
                                            pagination={{ pageSize: 10 }}
                                        />
                                        {/* 显示总和 */}
                                        <div style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4, marginTop: 12 }}>
                                            <div style={{ fontWeight: 'bold' }}>总和: {dimensionTotals[dimension] || 0}</div>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ padding: 24, textAlign: 'center' }}>
                                        <Empty description="暂无统计数据" />
                                    </div>
                                )}
                            </TabPane>
                        );
                    })}
                </Tabs>
            </Modal>
        </div>
    );
};

export default InformationMatch;