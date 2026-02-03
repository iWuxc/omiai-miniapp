import { createSSRApp } from "vue";
import App from "./App.vue";
import uviewPlus from 'uview-plus';
import { createPinia } from 'pinia';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  app.use(uviewPlus);
  app.use(pinia);

  // 全局路由守卫
  const whiteList = [
    '/pages/auth/login',
    '/pages/index/index', // 允许首页未登录访问(如有需要)
    'pages/auth/login', // 兼容不同平台的路径格式
    'pages/index/index'
  ];

  function checkLogin(url: string) {
    // 简单判断：如果 url 包含白名单路径，则放行
    // 注意：url 可能包含参数，也可能以 / 开头或不以 / 开头
    const path = url.split('?')[0];
    const isWhite = whiteList.some(w => path.endsWith(w) || path === w);
    
    if (isWhite) return true;

    const token = uni.getStorageSync('token');
    if (token) return true;

    // 拦截并跳转登录
    // 使用 setTimeout 避免在路由解析过程中立即跳转导致的错误
    setTimeout(() => {
        uni.reLaunch({ url: '/pages/auth/login' });
    }, 10);
    return false;
  }

  const interceptor = {
    invoke(args: any) {
      return checkLogin(args.url);
    }
  };

  uni.addInterceptor('navigateTo', interceptor);
  uni.addInterceptor('redirectTo', interceptor);
  uni.addInterceptor('reLaunch', interceptor);
  uni.addInterceptor('switchTab', interceptor);

  return {
    app,
    pinia // 必须返回 pinia 实例
  };
}
