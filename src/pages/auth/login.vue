<template>
  <view class="container">
    <view class="login-wrapper fade-in">
      <view class="logo-section">
        <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
        <text class="app-name">红娘管理系统</text>
        <text class="welcome-text">欢迎回来，请登录</text>
      </view>

      <!-- H5 登录视图 -->
      <view v-if="platform === 'H5'" class="form-section">
        <u-form :model="h5Form" ref="uForm" labelWidth="0">
          <u-form-item borderBottom>
            <u-input v-model="h5Form.phone" placeholder="请输入手机号" border="none" type="number">
              <template #prefix>
                <u-icon name="phone" size="20" color="#C0C4CC" style="margin-right: 10px"></u-icon>
              </template>
            </u-input>
          </u-form-item>
          <u-form-item borderBottom>
            <u-input 
              v-model="h5Form.password" 
              placeholder="请输入密码" 
              border="none" 
              :type="showPassword ? 'text' : 'password'"
            >
              <template #prefix>
                <u-icon name="lock" size="20" color="#C0C4CC" style="margin-right: 10px"></u-icon>
              </template>
              <template #suffix>
                <u-icon 
                  :name="showPassword ? 'eye' : 'eye-off'" 
                  size="20" 
                  color="#C0C4CC"
                  @click="showPassword = !showPassword"
                ></u-icon>
              </template>
            </u-input>
          </u-form-item>
        </u-form>
        <view class="password-tips">
          <text class="tips-text">初始密码：123456</text>
        </view>
        <view class="submit-btn-box">
          <u-button 
            @click="handleH5Login" 
            class="omiai-btn-primary" 
            :loading="loading"
            customStyle="height: 50px; font-size: 16px; border: none; width: 100%;"
          >立即登录</u-button>
        </view>
      </view>

      <!-- 小程序登录视图 -->
      <view v-else class="mp-section">
        <view class="mp-btn-box">
          <u-button 
            @click="handleWxLogin" 
            class="omiai-btn-primary" 
            :loading="loading"
            icon="weixin-fill"
            customStyle="height: 50px; font-size: 16px; border: none; width: 100%;"
          >微信一键登录</u-button>
        </view>
        <view class="agreement-text omiai-text-sm">
          登录即代表同意 <text class="link">《用户协议》</text> 和 <text class="link">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getPlatform } from '@/utils/env';
import { h5Login, wxLogin } from '@/api/auth';
import { setToken, setUserInfo } from '@/utils/auth';

const platform = ref(getPlatform());
const loading = ref(false);
const showPassword = ref(false);
const redirectUrl = ref('');

const h5Form = reactive({
  phone: '',
  password: ''
});

// 页面加载时获取 redirect 参数
onLoad((options: any) => {
  if (options?.redirect) {
    redirectUrl.value = decodeURIComponent(options.redirect);
  } else {
    // 尝试从存储中获取
    const savedUrl = uni.getStorageSync('redirectUrl');
    if (savedUrl) {
      redirectUrl.value = savedUrl;
      uni.removeStorageSync('redirectUrl');
    }
  }
});

const handleH5Login = async () => {
  if (!h5Form.phone || !h5Form.password) {
    uni.showToast({ title: '请输入手机号和密码', icon: 'none' });
    return;
  }

  if (!/^1[3-9]\d{9}$/.test(h5Form.phone)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    const res: any = await h5Login(h5Form.phone, h5Form.password);
    loginSuccess(res);
  } catch (e) {
    // handled by interceptor
  } finally {
    loading.value = false;
  }
};

const handleWxLogin = () => {
  uni.login({
    provider: 'weixin',
    success: async (loginRes) => {
      loading.value = true;
      try {
        const res: any = await wxLogin(loginRes.code);
        loginSuccess(res);
      } catch (e) {
        // handled
      } finally {
        loading.value = false;
      }
    },
    fail: () => {
      uni.showToast({ title: '微信登录失败', icon: 'none' });
    }
  });
};

const loginSuccess = (data: any) => {
  // 使用封装的 auth 工具保存登录信息
  setToken(data.token);
  setUserInfo(data.user);
  uni.setStorageSync('loginTime', Date.now().toString());
  
  uni.showToast({ title: '登录成功', icon: 'success' });
  
  // 延迟跳转，确保存储完成
  setTimeout(() => {
    // 使用全局方法标记登录后跳转，避免被路由守卫拦截
    const navigateAfterLogin = (uni as any).$navigateAfterLogin;
    if (navigateAfterLogin) {
      navigateAfterLogin(() => {
        doRedirect();
      });
    } else {
      doRedirect();
    }
  }, 800);
};

const doRedirect = () => {
  // 优先使用 redirectUrl
  if (redirectUrl.value && !redirectUrl.value.includes('/auth/login')) {
    const url = redirectUrl.value;
    redirectUrl.value = ''; // 清空
    
    // 根据目标 URL 类型选择跳转方式
    if (url.includes('/pages/') || url.startsWith('pages/')) {
      // 判断是否是 tabBar 页面
      const tabBarPages = ['pages/home/index', 'pages/client/list', 'pages/form/index'];
      const path = url.split('?')[0].replace(/^\//, '');
      
      if (tabBarPages.some(tab => path.includes(tab))) {
        uniSwitchTab(url.startsWith('/') ? url : '/' + url);
      } else {
        uniReLaunch(url.startsWith('/') ? url : '/' + url);
      }
    } else {
      fallbackRedirect();
    }
  } else {
    fallbackRedirect();
  }
};

const fallbackRedirect = () => {
  // 默认跳转到首页
  uniSwitchTab('/pages/home/index');
};

// 判断是否在微信浏览器中
const isWeixinBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
};

// 将 uni 路径转换为 H5 hash 路径
const toH5Url = (url: string): string => {
  if (typeof window === 'undefined') return url;
  // 移除开头的 /，添加 #/
  const hashPath = url.replace(/^\//, '');
  return window.location.origin + '/#' + url;
};

// 微信浏览器兼容的 switchTab
const uniSwitchTab = (url: string) => {
  // 微信浏览器中直接使用 location 跳转更可靠
  if (isWeixinBrowser()) {
    console.log('微信浏览器环境，使用 location 跳转');
    window.location.replace(toH5Url(url));
    return;
  }
  
  // 微信浏览器中 uni.switchTab 可能失效，使用多重回退策略
  let hasNavigated = false;
  
  const doSwitch = () => {
    if (hasNavigated) return;
    
    uni.switchTab({ 
      url: url,
      success: () => {
        hasNavigated = true;
      },
      fail: (err) => {
        console.error('switchTab failed:', err);
        // 尝试 reLaunch
        uniReLaunch(url);
      }
    });
  };
  
  // 延迟执行，确保微信浏览器环境准备就绪
  setTimeout(() => {
    doSwitch();
    
    // 保险机制：500ms后如果还没跳转成功，强制使用 location 跳转
    setTimeout(() => {
      if (!hasNavigated && typeof window !== 'undefined') {
        console.warn('Forcing navigation with window.location');
        window.location.replace(toH5Url(url));
      }
    }, 500);
  }, 100);
};

// 微信浏览器兼容的 reLaunch
const uniReLaunch = (url: string) => {
  if (isWeixinBrowser()) {
    console.log('微信浏览器环境，使用 location 跳转');
    window.location.replace(toH5Url(url));
    return;
  }
  
  let hasNavigated = false;
  
  uni.reLaunch({ 
    url: url,
    success: () => {
      hasNavigated = true;
    },
    fail: (err) => {
      console.error('reLaunch failed:', err);
      // 尝试 redirectTo
      uni.redirectTo({ 
        url: url,
        fail: () => {
          // 最后手段：使用原生跳转
          if (typeof window !== 'undefined') {
            window.location.replace(toH5Url(url));
          }
        }
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #fff;
  padding: 60px 32px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
  
  .logo {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
  }
  
  .app-name {
    font-size: 24px;
    font-weight: 600;
    color: $omiai-text-main;
    margin-bottom: 8px;
  }
  
  .welcome-text {
    font-size: 14px;
    color: $omiai-text-tip;
  }
}

.form-section {
  .password-tips {
    margin-top: 12px;
    text-align: right;
    
    .tips-text {
      font-size: 12px;
      color: $omiai-text-tip;
    }
  }
}

.submit-btn-box, .mp-btn-box {
  margin-top: 40px;
}

.mp-section {
  text-align: center;
  
  .agreement-text {
    margin-top: 24px;
    color: $omiai-text-tip;
    
    .link {
      color: $omiai-male;
    }
  }
}
</style>
