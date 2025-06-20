import axiosInstance from './axiosInstance';

// 定义平台类型的数据结构
interface PlatformType {
    id?: number;
    name: string;
    description: string;
}

// 创建平台类型
const createPlatformType = async (data: PlatformType): Promise<any> => {
    return await axiosInstance.post('/api/platform-types', data);
};

// 获取所有平台类型
const getAllPlatformTypes = async (): Promise<any> => {
    return await axiosInstance.get('/api/platform-types');
};

// 获取单个平台类型
const getPlatformTypeById = async (id: number): Promise<any> => {
    return await axiosInstance.get(`/api/platform-types/${id}`);
};

// 更新平台类型
const updatePlatformType = async (id: number, data: PlatformType): Promise<any> => {
    return await axiosInstance.put(`/api/platform-types/${id}`, data);
};

// 删除平台类型
const deletePlatformType = async (id: number): Promise<any> => {
    return await axiosInstance.delete(`/api/platform-types/${id}`);
};

export {
    createPlatformType,
    getAllPlatformTypes,
    getPlatformTypeById,
    updatePlatformType,
    deletePlatformType,
    type PlatformType
};