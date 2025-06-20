import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_URL } from '../config/config';
import { message } from 'antd'; // 引入 antd 的 message 组件
import { useNavigate } from 'react-router-dom'; // 用于路由跳转

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// 导入 InternalAxiosRequestConfig 类型
import { type InternalAxiosRequestConfig } from 'axios';

// 存储当前正在显示的message实例
let currentMessage: any = null;

// 显示消息并确保只显示一次
const showMessage = (content: string, type: 'success' | 'error' = 'error') => {
    // 如果已有消息实例，先销毁
    if (currentMessage) {
        currentMessage();
    }
    // 根据类型显示对应的消息
    if (type === 'success') {
        currentMessage = message.success(content);
    } else {
        currentMessage = message.error(content);
    }
};

// 请求拦截器 - 使用正确的类型
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            // 使用 axios 提供的 headers API
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        showMessage('请求配置错误，请稍后重试');
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        const { success, message: msg, data } = response.data;
        console.log(response)
        // 只处理业务成功且配置了显示消息的情况
        if (success && msg && response.config.url !== "/api/platform-types/1") {
            showMessage(msg, 'success');
        }
        
        return data;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || '未知错误';
            
            switch (status) {
                case 401:
                    // 业务查询失败状态
                    showMessage(errorMessage);
                    return Promise.reject(new Error(errorMessage));
                case 403:
                    // 令牌无效状态
                    showMessage('登录状态已过期，请重新登录');
                    // 清除本地token
                    localStorage.removeItem('token');
                    // 跳转到登录页
                    window.location.href = '/login';
                    return Promise.reject(new Error('未授权'));
                default:
                    showMessage(errorMessage);
                    return Promise.reject(new Error(errorMessage));
            }
        } else if (error.message === 'Network Error') {
            showMessage('网络连接错误，请检查网络设置');
            return Promise.reject(new Error('网络错误'));
        } else if (error.message.includes('timeout')) {
            showMessage('请求超时，请稍后重试');
            return Promise.reject(new Error('请求超时'));
        } else {
            showMessage('发生未知错误，请稍后重试');
            return Promise.reject(new Error('未知错误'));
        }
    }
);

export default axiosInstance;