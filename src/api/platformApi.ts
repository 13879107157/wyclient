import axiosInstance from './axiosInstance';

// 定义平台的数据结构
export interface Platform {
  id: number;
  platform_group_id: number; // 平台组ID
  platform_type_id: number;  // 平台类型ID
  name: string;            // 平台名称
  description: string;     // 平台描述
  order: number;           // 排序值
  match_rule: string;       // 匹配规则
  exclusion_rule: string;   // 排除规则
  createdAt?: string;      // 创建时间
  updatedAt?: string;      // 更新时间
}

// 创建平台
export const createPlatform = async (data: Omit<Platform, 'id'>): Promise<Platform> => {
  return axiosInstance.post('/api/platforms', data);
};

// 获取所有平台
export const getAllPlatforms = async (): Promise<Platform[]> => {
  return axiosInstance.get('/api/platforms');
};

// 获取单个平台
export const getPlatformById = async (id: number): Promise<Platform> => {
  return axiosInstance.get(`/api/platforms/${id}`);
};

// 更新平台
export const updatePlatform = async (id: number, data: Partial<Platform>): Promise<Platform> => {
    console.log("updatePlatform",data)
  return axiosInstance.put(`/api/platforms/${id}`, data);
};

// 删除平台
export const deletePlatform = async (id: number): Promise<void> => {
  return axiosInstance.delete(`/api/platforms/${id}`);
};