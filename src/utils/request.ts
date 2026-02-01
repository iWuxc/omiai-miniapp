import Request from 'luch-request';
import { config as appConfig } from '@/config';

const http = new Request();

// 配置全局基础参数
http.setConfig((config) => {
  config.baseURL = appConfig.baseUrl; 
  config.timeout = 10000;
  config.header = {
    ...config.header,
    'Content-Type': 'application/json'
  };
  return config;
});

// 请求拦截器
http.interceptors.request.use((config) => {
  const token = uni.getStorageSync('token');
  if (token) {
    if (!config.header) {
      config.header = {};
    }
    config.header.Authorization = `Bearer ${token}`;
  }
  return config;
}, (config) => {
  return Promise.reject(config);
});

// 响应拦截器
http.interceptors.response.use((response) => {
  const { data } = response;
  if (data.code === 0) {
    return data.data; 
  } else {
    // 处理 Token 失效
    if (data.code === 10001) { // 假设 10001 是 Token 失效的错误码
      uni.removeStorageSync('token');
      uni.reLaunch({ url: '/pages/auth/login' });
    }
    
    uni.showToast({
      title: data.message || '请求失败',
      icon: 'none'
    });
    return Promise.reject(data);
  }
}, (response) => {
  if (response.statusCode === 401) {
    uni.removeStorageSync('token');
    uni.reLaunch({ url: '/pages/auth/login' });
  }
  
  uni.showToast({
    title: '网络请求错误',
    icon: 'none'
  });
  return Promise.reject(response);
});

export default http;
