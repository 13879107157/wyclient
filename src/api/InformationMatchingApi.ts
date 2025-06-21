import axiosInstance from './axiosInstance';

// Excel匹配请求参数
interface ExcelMatchingParams {
    urlColumn?: string; // URL列名，默认为'关键字URL'
    columnsToInclude?: string | string[]; // 需要包含的列，字符串或字符串数组
    file: File; // Excel文件
}

// 平台数据结构
interface Platform {
    platformId?: number;
    platformName: string;
    order?: number;
    matchRule?: string | string[]; // 匹配规则
    exclusionRule?: string | string[]; // 排除规则
    platformTypeName?: string;
    platformTypeId?: number;
    matchedData?: any[]; // 匹配的数据
    matchCount?: number; // 匹配数量
    statistics?: Record<string, Record<string, number>>; // 统计信息
}

// 平台组数据结构
interface PlatformGroup {
    platformGroupId?: number;
    platformGroupName: string;
    order?: number;
    matchCount: number; // 平台组匹配总数
    platformGroupChildren?: Platform[]; // 平台组下的平台
    statistics?: Record<string, Record<string, number>>; // 组级统计
}

// Excel匹配响应结果
interface ExcelMatchingResult {
    totalRows: number; // 总行数
    platformStructure: PlatformGroup[]; // 平台结构（含匹配数据）
    globalStatistics: Record<string, Record<string, number>>; // 全局统计
    excelColumns: string[]; // Excel文件中的列名
}


/**
 * 处理Excel匹配接口
 * @param params - 匹配参数
 * @returns 匹配结果
 */
const processExcelMatching = async (params: ExcelMatchingParams) => {
    try {
        // 准备表单数据
        const formData = new FormData();
        formData.append('file', params.file);

        // 添加其他参数
        if (params.urlColumn) formData.append('urlColumn', params.urlColumn);
        if (params.columnsToInclude) {
            const columns = Array.isArray(params.columnsToInclude)
                ? params.columnsToInclude.join(',')
                : params.columnsToInclude;
            formData.append('columnsToInclude', columns);
        }

        // 调用后端接口（注意：axiosInstance已在响应拦截器中处理了错误和返回data）
        const result: ExcelMatchingResult = await axiosInstance.post('/api/excelMatching', formData);

        // 计算匹配和未匹配行数

        console.log(result)
        // 扩展返回数据，添加匹配和未匹配行数
        return result;
    } catch (error) {
        // 注意：axiosInstance的响应拦截器已经处理了错误消息显示
        // 这里只需简单抛出错误
        throw error;
    }
};

export {
    processExcelMatching,
    type ExcelMatchingParams,
    type Platform,
    type PlatformGroup
};