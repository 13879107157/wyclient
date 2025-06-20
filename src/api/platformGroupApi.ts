import axiosInstance from './axiosInstance';

// 定义平台组的数据结构
export interface PlatformGroup {
  id: number;
  name: string;
  description: string;
  status: number;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

// 创建平台组
export const createPlatformGroup = async (data: Omit<PlatformGroup, 'id'>): Promise<PlatformGroup> => {
  return axiosInstance.post('/api/platform-groups', data);
};

// 获取所有平台组
export const getAllPlatformGroups = async (): Promise<PlatformGroup[]> => {
  return axiosInstance.get('/api/platform-groups');
};

// 获取单个平台组
export const getPlatformGroupById = async (id: number): Promise<PlatformGroup> => {
  return axiosInstance.get(`/api/platform-groups/${id}`);
};

// 更新平台组
export const updatePlatformGroup = async (id: number, data: Partial<PlatformGroup>): Promise<PlatformGroup> => {
  return axiosInstance.put(`/api/platform-groups/${id}`, data);
};

// 删除平台组
export const deletePlatformGroup = async (id: number): Promise<void> => {
  return axiosInstance.delete(`/api/platform-groups/${id}`);
};