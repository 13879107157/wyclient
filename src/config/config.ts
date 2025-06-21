// 接口地址配置
const API_BASE_URL = {
  development: 'http://192.168.32.7:8181',
  test: 'http://192.168.32.7:8181',
  production: 'http://192.168.32.7:8181'
};

// 根据当前环境选择合适的接口地址
const getApiBaseUrl = () => {
  switch (import.meta.env.MODE) {
    case 'development':
      return API_BASE_URL.development;
    case 'test':
      return API_BASE_URL.test;
    case 'production':
      return API_BASE_URL.production;
    default:
      return API_BASE_URL.development;
  }
};

// antd 全局配置
const ANTD_CONFIG = {
  locale: 'zh_CN', // 语言设置为中文
  theme: {
    primaryColor: '#1890ff' // 主题色
  }
};

// 导出配置
export const API_URL = getApiBaseUrl();
export const ANTD_SETTINGS = ANTD_CONFIG;