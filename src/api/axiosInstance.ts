import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_URL } from '../config/config';

// 创建 axios 实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// 导入 InternalAxiosRequestConfig 类型
import { type InternalAxiosRequestConfig } from 'axios';

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
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { success, message, data } = response.data;
    if (success) {
      return data;
    } else {
      return Promise.reject(new Error(message));
    }
  },
  (error) => {
    if (error.response) {
      const { message } = error.response.data;
      return Promise.reject(new Error(message));
    } else {
      return Promise.reject(new Error('网络错误，请稍后重试'));
    }
  }
);

export default axiosInstance;