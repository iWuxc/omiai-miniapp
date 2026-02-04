import { createSSRApp } from "vue";
import App from "./App.vue";
import uviewPlus from 'uview-plus';
import { createPinia } from 'pinia';
import { isLoggedIn, isTokenExpired, clearAuth } from '@/utils/auth';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  app.use(uviewPlus);
  app.use(pinia);

  // 全局路由守卫配置
  const whiteList = [
    '/pages/auth/login',
    '/pages/index/index',
    'pages/auth/login',
    'pages/index/index',
    '/pages/invite/index', // 邀请页面允许未登录访问
    'pages/invite/index'
  ];

  // 标记是否正在登录跳转中（避免登录后的跳转被拦截）
  let isNavigatingAfterLogin = false;

  /**
   * 检查登录状态
   */
  function checkLogin(url: string): boolean {
    const path = url.split('?')[0];
    
    // 白名单直接放行
    const isWhite = whiteList.some(w => 
      path === w || path.endsWith(w) || w.endsWith(path)
    );
    
    if (isWhite) return true;

    // 登录后跳转中，直接放行
    if (isNavigatingAfterLogin) {
      console.log('路由放行：登录后跳转', url);
      isNavigatingAfterLogin = false;
      return true;
    }

    // 检查登录状态（包含过期检查）
    if (isLoggedIn()) return true;

    // 未登录或已过期，拦截并跳转
    console.log('路由拦截：需要登录', url);
    
    // 使用 nextTick 避免在路由解析过程中立即跳转
    setTimeout(() => {
      const redirectUrl = encodeURIComponent(url);
      uni.reLaunch({ 
        url: `/pages/auth/login?redirect=${redirectUrl}`
      });
    }, 0);
    
    return false;
  }

  // 路由拦截器
  const interceptor = {
    invoke(args: any) {
      // 保存目标 URL 用于登录后跳转
      if (args.url && !args.url.includes('/pages/auth/login')) {
        uni.setStorageSync('redirectUrl', args.url);
      }
      return checkLogin(args.url);
    }
  };

  // 注册拦截器
  uni.addInterceptor('navigateTo', interceptor);
  uni.addInterceptor('redirectTo', interceptor);
  uni.addInterceptor('reLaunch', interceptor);
  uni.addInterceptor('switchTab', interceptor);

  // 全局标记登录后跳转方法
  (uni as any).$navigateAfterLogin = (callback: () => void) => {
    isNavigatingAfterLogin = true;
    callback();
    // 300ms后清除标记（防止跳转失败导致永久放行）
    setTimeout(() => {
      isNavigatingAfterLogin = false;
    }, 300);
  };

  // 应用启动时检查登录状态
  const checkAppLaunch = () => {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route || '';
      
      // 不在白名单且未登录
      const isWhite = whiteList.some(w => route.includes('auth/login') || route.includes('invite/index'));
      
      if (!isWhite && !isLoggedIn()) {
        console.log('App启动检查：需要登录');
        uni.reLaunch({ url: '/pages/auth/login' });
      }
    }
  };

  // 延迟执行启动检查
  setTimeout(checkAppLaunch, 100);

  return {
    app,
    pinia
  };
}
