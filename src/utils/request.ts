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
  // 可在此注入 Token
  // const token = uni.getStorageSync('token');
  // if (token) {
  //   config.header.Authorization = `Bearer ${token}`;
  // }
  return config;
}, (config) => {
  return Promise.reject(config);
});

// 响应拦截器
http.interceptors.response.use((response) => {
  const { data } = response;
  // 假设后端返回格式: { code: 0, message: "ok", data: {} }
  if (data.code === 0) {
    return data.data; // 直接返回 data 字段
  } else {
    uni.showToast({
      title: data.message || '请求失败',
      icon: 'none'
    });
    return Promise.reject(data);
  }
}, (response) => {
  uni.showToast({
    title: '网络请求错误',
    icon: 'none'
  });
  return Promise.reject(response);
});

export default http;
