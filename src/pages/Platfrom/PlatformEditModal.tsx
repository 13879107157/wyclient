import  { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Space} from 'antd';
import { updatePlatform, type Platform } from '../../api/platformApi';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
const { Option } = Select;

interface PlatformEditModalProps {
    visible: boolean;
    platform: Platform;
    platformGroups: any[];
    platformTypes: any[];
    onCancel: () => void;
    onSuccess: () => void;
}

const PlatformEditModal = ({
    visible,
    platform,
    platformGroups,
    platformTypes,
    onCancel,
    onSuccess,
}: PlatformEditModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // 解析初始规则字符串为数组
    const parseRules = (ruleString: string | null | undefined): string[] => {
        if (!ruleString) return [];
        try {
            // 处理类似 "['rule1', 'rule2']" 的格式
            return JSON.parse(ruleString.replace(/'/g, '"'));
        } catch (error) {
            // 如果解析失败，尝试按逗号分割
            return ruleString.split(',').map(rule => rule.trim());
        }
    };

    // 确保数据变化时重置表单
    useEffect(() => {
        if (visible && platform) {
            form.setFieldsValue({
                platformGroupId: platform.platform_group_id,
                platformTypeId: platform.platform_type_id,
                name: platform.name,
                description: platform.description,
                order: platform.order,
            });

            // 设置匹配规则和排除规则的初始值
            form.setFields([
                {
                    name: ['matchRules', 0],
                    value: parseRules(platform.match_rule)[0] || '',
                },
                {
                    name: ['exclusionRules', 0],
                    value: parseRules(platform.exclusion_rule)[0] || '',
                },
            ]);

            // 添加剩余的匹配规则
            const matchRules = parseRules(platform.match_rule);
            if (matchRules.length > 1) {
                matchRules.slice(1).forEach((rule, index) => {
                    form.setFields([
                        {
                            name: ['matchRules', index + 1],
                            value: rule,
                        },
                    ]);
                });
            }

            // 添加剩余的排除规则
            const exclusionRules = parseRules(platform.exclusion_rule);
            if (exclusionRules.length > 1) {
                exclusionRules.slice(1).forEach((rule, index) => {
                    form.setFields([
                        {
                            name: ['exclusionRules', index + 1],
                            value: rule,
                        },
                    ]);
                });
            }
        }
    }, [visible, platform, form]);

    // 表单提交处理
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            console.log("form.validateFields()", values)
            // 处理匹配规则和排除规则为数组
            const formattedValues = {
                ...values,
                matchRule: JSON.stringify(values.matchRules.filter((rule: string) => rule.trim() !== '')),
                exclusionRule: JSON.stringify(values.exclusionRules.filter((rule: string) => rule.trim() !== ''))
            };

            // 移除临时字段
            // delete formattedValues.matchRules;
            // delete formattedValues.exclusionRules;
            console.log("formattedValues", formattedValues)

            await updatePlatform(platform.id, formattedValues);
            onSuccess();
        } catch (error) {
            console.error('更新失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 模态框关闭时重置表单
    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="编辑平台"
            visible={visible}
            onCancel={handleCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={800}
        >
            <Form
                form={form}
                className="space-y-4"
                labelCol={{ span: 3 }}
            >
         
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

                        <Form.Item
                            name="name"
                            label="平台名称"
                            rules={[{ required: true, message: '请输入平台名称' }]}
                        >
                            <Input placeholder="请输入平台名称" />
                        </Form.Item>

                        <Form.Item
                            name="order"
                            label="排序"
                            rules={[{ required: true, message: '请输入排序值' }]}
                        >
                            <InputNumber placeholder="请输入排序值" />
                        </Form.Item>
             
                        <Form.Item
                            name="description"
                            label="描述"
                        >
                            <Input.TextArea placeholder="请输入描述" rows={4} />
                        </Form.Item>

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
                                                    rules={[{ required: index === 0, message: '请输入匹配规则' }]}
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
                        </Form.Item>

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
                  
            </Form>
        </Modal>
    );
};

export default PlatformEditModal;