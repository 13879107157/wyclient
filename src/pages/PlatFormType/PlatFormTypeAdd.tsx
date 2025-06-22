import { Form, Input, Button, message } from 'antd';
import { createPlatformType } from '../../api/platFromTypeApi';
import { useNavigate } from 'react-router-dom';

interface PlatformTypeFormValues {
    name: string;
    description: string;
}

export default function PlatFormTypeAdd() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: PlatformTypeFormValues) => {
        try {
            // 调用API创建平台类型
            await createPlatformType(values);

            // 显示成功消息
            message.success('平台类型创建成功');

            // 导航回列表页面
            // navigate(-1);
        } catch (error) {
            console.error('创建平台类型失败:', error);
            message.error('创建平台类型失败，请重试');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="page-title">
                <h1>
                    添加平台组
                </h1>
            </div>

            <Form
                form={form}
                name="platformTypeForm"
                onFinish={onFinish}
                initialValues={{ remember: true }}
                scrollToFirstError
                    layout="vertical"
                labelCol={{ span: 3 }}
                style={{
                    width: '800px',
                }}
            >
                <Form.Item
                    name="name"
                    label="名称"
                    rules={[
                        { required: true, message: '请输入平台类型名称' },
                        { max: 50, message: '名称长度不能超过50个字符' },
                    ]}
                >
                    <Input placeholder="请输入平台类型名称" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="描述"
                    rules={[
                        { required: true, message: '请输入平台类型描述' },
                        { max: 200, message: '描述长度不能超过200个字符' },
                    ]}
                >
                    <Input.TextArea
                        placeholder="请输入平台类型描述"
                        rows={4}
                    />
                </Form.Item>

                <Form.Item className="pt-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="mr-4"
                    >
                        提交
                    </Button>
                    <Button
                        onClick={() => navigate(-1)}
                        className="bg-gray-100 text-gray-700"
                    >
                        返回
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}