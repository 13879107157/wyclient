import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { updatePlatformType } from '../../api/platFromTypeApi';

interface PlatformTypeEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialValues?: {
    id: number;
    name: string;
    description: string;
  };
}

const PlatformTypeEditModal = ({
  visible,
  onCancel,
  onSuccess,
  initialValues = { id: 0, name: '', description: '' },
}: PlatformTypeEditModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await updatePlatformType(initialValues.id, values);
      onSuccess();
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑平台类型"
      visible={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        initialValues={{ ...initialValues }}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlatformTypeEditModal;