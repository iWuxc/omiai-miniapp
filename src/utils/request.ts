import Request from 'luch-request';
import { config as appConfig } from '@/config';
import { getToken, clearAuth, isTokenExpired } from '@/utils/auth';

const http = new Request();

// 是否正在刷新 Token（防止重复跳转）
let isRefreshing = false;

// 配置全局基础参数
http.setConfig((config) => {
  config.baseURL = appConfig.baseUrl; 
  config.timeout = 15000;
  config.header = {
    ...config.header,
    'Content-Type': 'application/json'
  };
  return config;
});

// 不需要 Token 的接口白名单
const whiteListApis = [
  '/auth/send_sms',
  '/auth/login/h5',
  '/auth/login/wx',
  '/auth/register'
];

// 检查是否是白名单接口
const isWhiteListApi = (url: string): boolean => {
  return whiteListApis.some(api => url.includes(api));
};

// 请求拦截器
http.interceptors.request.use((config) => {
  const url = config.url || '';
  
  // 白名单接口跳过 Token 检查
  if (!isWhiteListApi(url)) {
    // 检查 Token 是否过期
    if (isTokenExpired()) {
      clearAuth();
      handleAuthError('登录已过期，请重新登录');
      return Promise.reject(new Error('Token expired'));
    }
    
    const token = getToken();
    if (token) {
      if (!config.header) {
        config.header = {};
      }
      config.header.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
}, (config) => {
  return Promise.reject(config);
});

// 处理认证错误（统一跳转）
const handleAuthError = (message: string = '登录已过期') => {
  if (isRefreshing) return;
  isRefreshing = true;
  
  clearAuth();
  uni.showToast({ title: message, icon: 'none' });
  
  setTimeout(() => {
    uni.reLaunch({ 
      url: '/pages/auth/login',
      complete: () => {
        isRefreshing = false;
      }
    });
  }, 1500);
};

// 响应拦截器
http.interceptors.response.use((response) => {
  const { data, config } = response;
  
  // 检查是否是登录接口（白名单接口可能需要特殊处理）
  const isLoginApi = config.url?.includes('/auth/login');
  
  if (data.code === 0) {
    // 登录接口返回完整数据结构，其他接口返回 data.data
    if (isLoginApi) {
      console.log('登录接口响应:', data);
      // 返回完整的 data 对象，包含 accessToken 和 user
      return data.data || data;
    }
    return data.data; 
  } else {
    // 处理 Token 失效（根据后端实际错误码调整）
    const authErrorCodes = [10001, 401, 1001, 1002]; // 认证相关错误码
    
    if (authErrorCodes.includes(data.code)) {
      handleAuthError(data.msg || '登录已过期，请重新登录');
    } else {
      uni.showToast({
        title: data.msg || data.message || '请求失败',
        icon: 'none'
      });
    }
    
    return Promise.reject(data);
  }
}, (response) => {
  // HTTP 状态码处理
  if (response.statusCode === 401) {
    handleAuthError('登录已过期，请重新登录');
  } else if (response.statusCode === 403) {
    uni.showToast({ title: '没有权限访问', icon: 'none' });
  } else if (response.statusCode == 500) {
    uni.showToast({ title: '服务器繁忙，请稍后重试', icon: 'none' });
  } else if (response.errMsg && response.errMsg.includes('timeout')) {
    uni.showToast({ title: '请求超时，请检查网络', icon: 'none' });
  } else {
    uni.showToast({
      title: '网络请求错误',
      icon: 'none'
    });
  }
  
  return Promise.reject(response);
});

export default http;
