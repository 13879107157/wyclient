// PlatformGroupAdd.tsx
// import React from 'react';
import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import { createPlatformGroup } from '../../api/platformGroupApi';
import { useNavigate } from 'react-router-dom';
// import { ArrowLeftOutlined } from '@ant-design/icons';

const PlatformGroupAdd = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // 表单提交处理
    const handleSubmit = async (values: any) => {
        try {
            await createPlatformGroup(values);
            message.success('平台组创建成功');
            navigate(-1);
        } catch (error: any) {
            message.error(error.message || '创建平台组失败');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            {/* 页面标题和操作区 */}
            <div className="page-title">
                <h1>
                    添加平台组
                </h1>
            </div>

            {/* 表单区域 */}
            <Form
                form={form}
                name="platformGroupForm"
                onFinish={handleSubmit}
                initialValues={{ status: true, }}
                scrollToFirstError
                layout="vertical"
                labelCol={{ span: 3 }}
                style={{
                    width: '800px',
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 左侧字段 */}
                    <div>
                        <Form.Item
                            name="name"
                            label="平台组名称"
                            rules={[
                                { required: true, message: '请输入平台组名称' },
                                { max: 50, message: '名称长度不能超过50个字符' },
                            ]}
                        >
                            <Input
                                placeholder="请输入平台组名称"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="状态"
                            rules={[{ required: true, message: '请选择平台组状态' }]}
                        >
                            <Select size="large">
                                <Select.Option value={true}>启用</Select.Option>
                                <Select.Option value={false}>禁用</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div>
                        <Form.Item
                            name="order"
                            label="排序"
                            rules={[
                                { required: true, message: '请输入排序值' },
                                { type: 'number', min: 0, message: '排序值必须为非负整数' },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                max={9999}
                                placeholder="请输入排序值"
                                variant="outlined"
                                size="large"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </div>
                    {/* 右侧字段 */}
                    <div>


                        <Form.Item
                            name="description"
                            label="描述"
                            rules={[
                                { required: true, message: '请输入平台组描述' },
                                { max: 200, message: '描述长度不能超过200个字符' },
                            ]}
                        >
                            <Input.TextArea
                                placeholder="请输入平台组描述"
                                rows={4}
                                size="large"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* 操作按钮 */}
                <Form.Item className="mt-8 flex justify-end space-x-4">
                    <Button
                        onClick={() => navigate(-1)}
                        size="large"
                        className="px-6"
                    >
                        取消
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="px-6"
                    >
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PlatformGroupAdd;