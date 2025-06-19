import axiosInstance from './axiosInstance';

// 定义登录请求的数据结构
interface LoginRequest {
    username: string;
    password: string;
}

// 定义注册请求的数据结构
interface RegisterRequest {
    username: string;
    password: string;
}

// 定义登录响应的数据结构
interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
    };
}

// 登录 API
const login = async (data: LoginRequest): Promise<LoginResponse> => {
    return await axiosInstance.post('/api/users/login', data);
};

// 注册 API
const register = async (data: RegisterRequest): Promise<void> => {
    await axiosInstance.post('/api/users/register', data);
};

const getUserInfo = async (userId: number): Promise<void> => {
    return await axiosInstance.get(`/api/users?id=${userId}`);
};


export { login, register, getUserInfo, type LoginRequest, type RegisterRequest, type LoginResponse };