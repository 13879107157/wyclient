import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { updatePlatformGroup, type PlatformGroup } from '../../api/platformGroupApi';

const { Option } = Select;

interface PlatformGroupEditModalProps {
    visible: boolean;
    platformGroup: PlatformGroup;
    onCancel: () => void;
    onSuccess: () => void;
}

const PlatformGroupEditModal = ({
    visible,
    platformGroup,
    onCancel,
    onSuccess,
}: PlatformGroupEditModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // 表单提交处理
    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            await updatePlatformGroup(platformGroup.id, values);
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

    // 表单初始值
    const initialValues = {
        name: platformGroup.name,
        description: platformGroup.description,
        status: platformGroup.status,
        order: platformGroup.order,
    };

    return (
        <Modal
            title="编辑平台组"
            visible={visible}
            onCancel={handleCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
        >
            <Form
                form={form}
                initialValues={initialValues}
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="名称"
                    rules={[{ required: true, message: '请输入平台组名称' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="描述"
                    rules={[{ required: true, message: '请输入平台组描述' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="状态"
                    rules={[{ required: true, message: '请选择状态' }]}
                >
                    <Select>
                        <Option value={true}>启用</Option>
                        <Option value={false}>禁用</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="order"
                    label="排序"
                    rules={[{ required: true, message: '请输入排序值' }]}
                >
                    <Input type="number" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PlatformGroupEditModal;