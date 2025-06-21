import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { login, register, getUserInfo, type LoginRequest, type RegisterRequest } from '../../api/authApi';
import './AuthPage.css'
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            if (isLogin) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                const loginData: LoginRequest = {
                    username: values.username,
                    password: values.password,
                };
                const response = await login(loginData);
                localStorage.setItem('token', response.token);
                console.log("login response",response)
                const UserInfoResponse = await getUserInfo(response.user.id)
                console.log(UserInfoResponse)
                localStorage.setItem('userInfo', JSON.stringify(UserInfoResponse))
                window.location.href = '/DataAnalysis/3++';
            } else {
                const registerData: RegisterRequest = {
                    username: values.username,
                    password: values.password,
                };
                await register(registerData);
                // message.success('注册成功，请登录');
                setIsLogin(true);
            }
        } catch (error: any) {
            // message.error(error.message);
        }
    };

    return (
        <div className='auth-page'>
            <Form onFinish={onFinish} className='auth-form'>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder='请输入用户名' />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder='请输入密码' />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        {isLogin ? '登录' : '注册'}
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="link" onClick={() => setIsLogin(!isLogin)} block>
                        {isLogin ? '没有账号？注册' : '已有账号？登录'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AuthPage;