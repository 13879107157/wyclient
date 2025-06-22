import { Form, Input, Select, Button, message, Row, Col, Radio, Modal, Checkbox } from 'antd';
import { useState, useEffect } from 'react';

// 模板类型定义
type Template = {
    id: string;
    source: string;
    infoSource: string;
    keyUrl: string;
    templateName: string;
};

const InfoEntryPage = () => {
    const [form] = Form.useForm();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedDeleteTemplates, setSelectedDeleteTemplates] = useState<string[]>([]);

    // 从localStorage加载模板
    useEffect(() => {
        const savedTemplates = localStorage.getItem('infoEntryTemplates');
        if (savedTemplates) {
            setTemplates(JSON.parse(savedTemplates));
        }
    }, []);

    // 保存模板到localStorage
    const saveTemplatesToLocalStorage = (templates: Template[]) => {
        localStorage.setItem('infoEntryTemplates', JSON.stringify(templates));
    };

    // 生成模板名称
    const generateTemplateName = (values: any) => {
        const { source, infoSource, keyUrl } = values;
        return `${source}-${infoSource}-${keyUrl}`;
    };

    // 保存当前表单为模板
    const handleSaveTemplate = async () => {
        try {
            // 验证并获取保存模板所需的字段
            const values = await form.validateFields([
                'source',
                'infoSource',
                'keyUrl'
            ]);

            const templateName = generateTemplateName(values);

            const newTemplate: Template = {
                id: Date.now().toString(),
                templateName,
                ...values
            };

            setTemplates(prev => {
                const updatedTemplates = [...prev, newTemplate];
                saveTemplatesToLocalStorage(updatedTemplates);
                return updatedTemplates;
            });

            message.success('模板保存成功');
        } catch (errorInfo) {
            // 显示验证错误信息
            message.error('请填写所有必填字段');
        }
    };

    // 应用选中的模板
    const handleTemplateChange = (templateId: string) => {
        const selectedTemplate = templates.find(t => t.id === templateId);
        if (selectedTemplate) {
            form.setFieldsValue({
                source: selectedTemplate.source,
                infoSource: selectedTemplate.infoSource,
                keyUrl: selectedTemplate.keyUrl
            });
        }
    };

    // 打开删除模板模态框
    const handleDeleteTemplate = () => {
        if (templates.length === 0) {
            message.info('没有可删除的模板');
            return;
        }
        setDeleteModalVisible(true);
    };

    // 处理模板选择变更
    const handleTemplateSelectChange = (checkedValues: string[]) => {
        setSelectedDeleteTemplates(checkedValues);
    };

    // 确认删除模板
    const handleConfirmDelete = () => {
        if (selectedDeleteTemplates.length === 0) {
            message.info('请选择要删除的模板');
            return;
        }

        setTemplates(prev => {
            const updatedTemplates = prev.filter(t => !selectedDeleteTemplates.includes(t.id));
            saveTemplatesToLocalStorage(updatedTemplates);
            return updatedTemplates;
        });

        form.setFieldsValue({ template: undefined });
        setSelectedDeleteTemplates([]);
        setDeleteModalVisible(false);
        message.success('模板删除成功');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="page-title">
                <h1>信息录入</h1>
            </div>

            <Row gutter={24}>
                <Col span={16}>
                    <Form size='large' layout='vertical' form={form}>
                        <Row>
                            <Col span={24}>
                                <Form.Item label="选择模板" name="template">
                                    <Select onChange={handleTemplateChange} placeholder="请选择模板">
                                        {templates.map(template => (
                                            <Select.Option key={template.id} value={template.id}>
                                                {template.templateName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={5}>
                                <Form.Item
                                    label="信息来源"
                                    name="source"
                                    rules={[{ required: true, message: '信息来源为必填项' }]}
                                >
                                    <Select placeholder="请选择信息来源">
                                        <Select.Option value="1">来源1</Select.Option>
                                        <Select.Option value="2">来源2</Select.Option>
                                        <Select.Option value="3">来源3</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item
                                    label="信息分类"
                                    name="infoSource"
                                    rules={[{ required: true, message: '信息分类为必填项' }]}
                                >
                                    <Select placeholder="请选择信息分类">
                                        <Select.Option value="A">分类A</Select.Option>
                                        <Select.Option value="B">分类B</Select.Option>
                                        <Select.Option value="C">分类C</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={14}>
                                <Form.Item
                                    label="URL或者关键字"
                                    name="keyUrl"
                                    rules={[{ required: true, message: 'URL或者关键字为必填项' }]}
                                >
                                    <Input placeholder="请输入关键字URL" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Form.Item
                                    label="姓名"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入电话',
                                        },
                                    ]}>
                                    <Input placeholder="请输入电话" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="电话"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入电话',
                                        },
                                    ]}>
                                    <Input placeholder="请输入电话" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="微信"
                                    name="wechat"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入微信',
                                        },
                                    ]}>
                                    <Input placeholder="请输入微信" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="QQ"
                                    name="qq"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入QQ',
                                        },
                                    ]}>
                                    <Input placeholder="请输入QQ" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={3}>
                                <Form.Item
                                    label="性别"
                                    name="sex"
                                >
                                    <Radio.Group value={"男"} style={{ width: '100%' }}>
                                        <Radio value="男">男</Radio>
                                        <Radio value="女">女</Radio>
                                    </Radio.Group>
                                </Form.Item>

                            </Col>
                            <Col span={7}>
                                <Form.Item label="学历" name="education" >
                                    <Select placeholder="请选择学历">
                                        <Select.Option value="高中">高中</Select.Option>
                                        <Select.Option value="本科">本科</Select.Option>
                                        <Select.Option value="硕士">硕士</Select.Option>
                                        <Select.Option value="博士">博士</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label="专业" name="major">
                                    <Select placeholder="请选择专业">
                                        <Select.Option value="计算机">计算机</Select.Option>
                                        <Select.Option value="电子工程">电子工程</Select.Option>
                                        <Select.Option value="机械工程">机械工程</Select.Option>
                                        <Select.Option value="金融">金融</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item
                                    label="家庭住址"
                                    name="familyaddress"
                                >
                                    <Input placeholder="请输入家庭住址" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>

                            <Col span={24}>
                                <Form.Item
                                    label="备注"
                                    name="remark"
                                >
                                    <Input.TextArea placeholder='请输入备注' autoSize />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={6}><Button block onClick={() => form.resetFields()}>重置</Button></Col>
                            <Col span={6}><Button block type='primary'>提交</Button></Col>
                            <Col span={6}><Button block type='primary' onClick={handleSaveTemplate}>保存模板</Button></Col>
                            <Col span={6}><Button block type='danger' onClick={handleDeleteTemplate}>删除模板</Button></Col>
                        </Row>
                    </Form>
                </Col>
                <Col span={8} style={{ background: '#f5f5f5' }}>
                    <div style={{ width: '100%', padding: '16px' }}>
                        <h3>模板管理</h3>
                        <p>当前模板数量: {templates.length}</p>
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">提示: 模板会保存信息来源、信息分类和URL/关键字</p>
                            <p className="text-sm text-gray-500 mt-2">保存模板时，信息来源、信息分类和URL/关键字为必填项</p>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* 删除模板模态框 */}
            <Modal
                title="删除模板"
                visible={deleteModalVisible}
                onCancel={() => setDeleteModalVisible(false)}
                onOk={handleConfirmDelete}
                okText="确认删除"
                cancelText="取消"
                okType="danger"
            >
                {templates.length > 0 ? (
                    <div>
                        <p>请选择要删除的模板:</p>
                        <div className="mt-3 max-h-60 overflow-y-auto border rounded p-2">
                            <Checkbox.Group onChange={handleTemplateSelectChange}>
                                {templates.map(template => (
                                    <div key={template.id} className="mb-2 p-2 hover:bg-gray-100 rounded">
                                        <Checkbox value={template.id}>{template.templateName}</Checkbox>
                                    </div>
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>
                ) : (
                    <p>没有可删除的模板</p>
                )}
            </Modal>
        </div>
    );
};

export default InfoEntryPage;