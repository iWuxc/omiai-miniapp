/**
 * 认证工具函数
 */

const TOKEN_KEY = 'token';
const USER_INFO_KEY = 'userInfo';
const LOGIN_TIME_KEY = 'loginTime';

// Token 有效期 (24小时，与后端保持一致)
const TOKEN_EXPIRE_TIME = 24 * 60 * 60 * 1000;

/**
 * 获取 Token
 */
export const getToken = (): string => {
  return uni.getStorageSync(TOKEN_KEY) || '';
};

/**
 * 设置 Token
 */
export const setToken = (token: string): void => {
  uni.setStorageSync(TOKEN_KEY, token);
  uni.setStorageSync(LOGIN_TIME_KEY, Date.now().toString());
};

/**
 * 清除登录状态
 */
export const clearAuth = (): void => {
  uni.removeStorageSync(TOKEN_KEY);
  uni.removeStorageSync(USER_INFO_KEY);
  uni.removeStorageSync(LOGIN_TIME_KEY);
};

/**
 * 获取用户信息
 */
export const getUserInfo = (): any => {
  const info = uni.getStorageSync(USER_INFO_KEY);
  try {
    return info ? JSON.parse(info) : null;
  } catch {
    return null;
  }
};

/**
 * 设置用户信息
 */
export const setUserInfo = (userInfo: any): void => {
  uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo));
};

/**
 * 检查 Token 是否过期
 */
export const isTokenExpired = (): boolean => {
  const loginTime = uni.getStorageSync(LOGIN_TIME_KEY);
  if (!loginTime) return true;
  
  const elapsed = Date.now() - parseInt(loginTime);
  return elapsed > TOKEN_EXPIRE_TIME;
};

/**
 * 检查登录状态
 */
export const isLoggedIn = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  // 检查是否过期
  if (isTokenExpired()) {
    clearAuth();
    return false;
  }
  
  return true;
};

/**
 * 跳转到登录页
 */
export const redirectToLogin = (redirectUrl?: string): void => {
  // 清除过期凭证
  clearAuth();
  
  const url = redirectUrl 
    ? `/pages/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
    : '/pages/auth/login';
  
  uni.reLaunch({ url });
};

/**
 * 处理登录过期（全局调用）
 */
export const handleAuthExpired = (message: string = '登录已过期，请重新登录'): void => {
  clearAuth();
  uni.showToast({ title: message, icon: 'none' });
  
  setTimeout(() => {
    redirectToLogin();
  }, 1500);
};
