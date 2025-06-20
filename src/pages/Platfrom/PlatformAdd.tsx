import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Space, Col, Row } from 'antd';
import { createPlatform, type Platform } from '../../api/platformApi';
import { getAllPlatformGroups } from '../../api/platformGroupApi';
import { getAllPlatformTypes } from '../../api/platFromTypeApi';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Option } = Select;

const PlatformAdd = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [platformGroups, setPlatformGroups] = useState<any[]>([]);
    const [platformTypes, setPlatformTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // 加载平台组和平台类型数据
    useEffect(() => {
        fetchPlatformGroups();
        fetchPlatformTypes();
    }, []);

    const fetchPlatformGroups = async () => {
        try {
            const groups = await getAllPlatformGroups();
            setPlatformGroups(groups);
        } catch (error) {
            console.error('获取平台组列表失败:', error);
        }
    };

    const fetchPlatformTypes = async () => {
        try {
            const types = await getAllPlatformTypes();
            setPlatformTypes(types);
        } catch (error) {
            console.error('获取平台类型列表失败:', error);
        }
    };

    // 表单提交处理
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            // 处理匹配规则和排除规则为数组
            const formattedValues = {
                ...values,
                matchRule: JSON.stringify(values.matchRules.filter((rule: string) => rule.trim() !== '')),
                exclusionRule: JSON.stringify(values.exclusionRules.filter((rule: string) => rule.trim() !== '')),
            };

            // 移除临时字段
            delete formattedValues.matchRules;
            delete formattedValues.exclusionRules;

            await createPlatform(formattedValues);
            navigate(-1); // 返回上一页
        } catch (error) {
            console.error('创建平台失败:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
               <div className="page-title">
                <h1>
                   新增平台
                </h1>
            </div>

            <Form
                form={form}
                name="platformForm"
                onFinish={handleSubmit}
                layout="vertical"
                scrollToFirstError
                initialValues={{ order: 100 }}
                labelCol={{ span: 5 }}
                style={{
                    width: '800px',
                }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="platformGroupId"
                            label="平台组"
                            rules={[{ required: true, message: '请选择平台组' }]}
                        >
                            <Select placeholder="请选择平台组">
                                {platformGroups.map(group => (
                                    <Option
                                        key={group.id}
                                        value={group.id}
                                        title={group.name}
                                    >
                                        {group.name || `平台组ID: ${group.id}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>

                        <Form.Item
                            name="platformTypeId"
                            label="平台类型"
                            rules={[{ required: true, message: '请选择平台类型' }]}
                        >
                            <Select placeholder="请选择平台类型">
                                {platformTypes.map(type => (
                                    <Option
                                        key={type.id}
                                        value={type.id}
                                        title={type.name}
                                    >
                                        {type.name || `平台类型ID: ${type.id}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="平台名称"
                            rules={[
                                { required: true, message: '请输入平台名称' },
                                { max: 50, message: '名称长度不能超过50个字符' },
                            ]}
                        >
                            <Input placeholder="请输入平台名称" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="order"
                            label="排序"
                            rules={[{ required: true, message: '请输入排序值' }]}
                        >
                            <InputNumber placeholder="请输入排序值" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label="描述"
                        >
                            <Input.TextArea placeholder="请输入描述" rows={2} />
                        </Form.Item></Col>
                    <Col span={12}></Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        {/* 动态匹配规则 */}
                        <Form.Item label="匹配规则">
                            <Form.List name="matchRules">
                                {(fields, { add, remove }) => (
                                    <div>
                                        {fields.map((field, index) => (
                                            <Space
                                                key={field.key}
                                                style={{ display: 'flex', marginBottom: 8 }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...field}
                                                    rules={[{ required: index === 0, message: '请输入至少一个匹配规则' }]}
                                                    noStyle
                                                >
                                                    <Input placeholder="请输入匹配规则" style={{ width: '90%' }} />
                                                </Form.Item>
                                                {index > 0 ? (
                                                    <Button icon={<MinusOutlined />} onClick={() => remove(field.name)} />
                                                ) : null}
                                            </Space>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '100%' }}
                                            icon={<PlusOutlined />}
                                        >
                                            添加匹配规则
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </Form.Item></Col>
                    <Col span={12}>
                        {/* 动态排除规则 */}
                        <Form.Item label="排除规则">
                            <Form.List name="exclusionRules">
                                {(fields, { add, remove }) => (
                                    <div>
                                        {fields.map((field, index) => (
                                            <Space
                                                key={field.key}
                                                style={{ display: 'flex', marginBottom: 8 }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...field}
                                                    noStyle
                                                >
                                                    <Input placeholder="请输入排除规则" style={{ width: '90%' }} />
                                                </Form.Item>
                                                {index > 0 ? (
                                                    <Button icon={<MinusOutlined />} onClick={() => remove(field.name)} />
                                                ) : null}
                                            </Space>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '100%' }}
                                            icon={<PlusOutlined />}
                                        >
                                            添加排除规则
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </Form.Item>

                    </Col>
                </Row>





                {/* 操作按钮 */}
                <Form.Item >
            
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="px-6"
                        loading={loading}
                        block
                    >
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PlatformAdd;