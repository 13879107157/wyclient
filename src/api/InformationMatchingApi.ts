import axiosInstance from './axiosInstance';

// Excel匹配请求参数
interface ExcelMatchingParams {
    urlColumn?: string; // URL列名，默认为'关键字URL'
    columnsToInclude?: string | string[]; // 需要包含的列，字符串或字符串数组
    file: File; // Excel文件
}

// 平台数据结构
interface Platform {
    id?: number;
    platformName: string;
    matchRule?: string | string[]; // 匹配规则
    exclusionRule?: string | string[]; // 排除规则
    order?: number; // 排序
    matchedData?: any[]; // 匹配的数据
    matchCount?: number; // 匹配数量
    statistics?: Record<string, Record<string, number>>; // 统计信息
}

// 平台组数据结构
interface PlatformGroup {
    id?: number;
    platformGroupName: string;
    order?: number;
    platformGroupChildren?: Platform[]; // 平台组下的平台
    statistics?: Record<string, Record<string, number>>; // 组级统计
}

// Excel匹配响应结果
interface ExcelMatchingResult {
    totalRows: number; // 总行数
    matchedRows: number; // 匹配行数
    unmatchedRows: number; // 未匹配行数
    platformStructure: PlatformGroup[]; // 平台结构（含匹配数据）
    statistics: Record<string, Record<string, number>>; // 全局统计
}

/**
 * 处理Excel匹配接口
 * @param params - 匹配参数
 * @returns 匹配结果
 */
const processExcelMatching = async (params: ExcelMatchingParams): Promise<ExcelMatchingResult> => {
    try {
        // 准备表单数据
        const formData = new FormData();
        formData.append('file', params.file);
        
        // 添加其他参数
        if (params.urlColumn) {
            formData.append('urlColumn', params.urlColumn);
        }
        
        if (params.columnsToInclude) {
            // 如果是数组，转换为逗号分隔的字符串
            const columns = Array.isArray(params.columnsToInclude) 
                ? params.columnsToInclude.join(',') 
                : params.columnsToInclude;
            formData.append('columnsToInclude', columns);
        }

        // 调用后端接口
        const response = await axiosInstance.post('/api/process-excel-matching', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.data;
    } catch (error: any) {
        console.error('处理Excel匹配错误:', error);
        throw new Error(error.response?.data?.message || '处理Excel匹配失败，请稍后再试');
    }
};

export {
    processExcelMatching,
    type ExcelMatchingParams,
    type ExcelMatchingResult,
    type Platform,
    type PlatformGroup
};