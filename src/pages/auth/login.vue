<template>
  <view class="container">
    <view class="login-wrapper fade-in">
      <view class="logo-section">
        <image class="logo" src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=pony&backgroundColor=ffdfbf&radius=50" mode="aspectFit"></image>
        <text class="app-name">个人管理系统</text>
        <text class="welcome-text">欢迎回来，请登录</text>
      </view>

      <!-- H5 登录视图 -->
      <view v-if="platform === 'H5'" class="form-section">
        <!-- 表单卡片头部 -->
        <view class="form-header">
          <view class="header-line"></view>
          <text class="header-title">账号登录</text>
          <view class="header-line"></view>
        </view>

        <!-- 手机号输入 -->
        <view class="input-group">
          <view class="input-label">
            <u-icon name="phone" size="16" color="#FF5E78"></u-icon>
            <text>手机号</text>
          </view>
          <view class="input-wrapper">
            <input 
              v-model="h5Form.phone" 
              placeholder="请输入11位手机号" 
              type="number"
              maxlength="11"
              class="custom-input"
            />
            <view class="input-clear" v-if="h5Form.phone" @click="h5Form.phone = ''">
              <u-icon name="close-circle" size="18" color="#C0C4CC"></u-icon>
            </view>
          </view>
          <view class="input-focus-line" :class="{ active: phoneFocus }"></view>
        </view>

        <!-- 密码输入 -->
        <view class="input-group">
          <view class="input-label">
            <u-icon name="lock" size="16" color="#FF5E78"></u-icon>
            <text>密码</text>
          </view>
          <view class="input-wrapper">
            <input 
              v-model="h5Form.password" 
              placeholder="请输入登录密码" 
              :type="showPassword ? 'text' : 'password'"
              class="custom-input"
            />
            <view class="input-suffix">
              <view class="password-toggle" @click="showPassword = !showPassword">
                <u-icon 
                  :name="showPassword ? 'eye' : 'eye-off'" 
                  size="20" 
                  color="#909399"
                ></u-icon>
              </view>
            </view>
          </view>
          <view class="input-focus-line" :class="{ active: passwordFocus }"></view>
        </view>

        <!-- 提示信息 -->
        <view class="form-tips">
          <view class="tip-item">
            <!-- <u-icon name="info-circle" size="14" color="#909399"></u-icon> -->
            <!-- <text class="tip-text">初始密码：123456</text> -->
          </view>
          <view class="tip-item link" @click="showForgetPassword">
            <text class="tip-text highlight">忘记密码？</text>
          </view>
        </view>

        <!-- 登录按钮 -->
        <view class="submit-btn-box">
          <button 
            @click="handleH5Login" 
            class="login-btn" 
            :class="{ loading: loading, disabled: !canLogin }"
            :disabled="loading || !canLogin"
          >
            <view class="btn-content" v-if="!loading">
              <text class="btn-text">立即登录</text>
              <u-icon name="arrow-right" size="18" color="#fff" class="btn-icon"></u-icon>
            </view>
            <view class="btn-loading" v-else>
              <view class="loading-spinner"></view>
              <text class="loading-text">登录中...</text>
            </view>
          </button>
        </view>

        <!-- 其他登录方式 -->
        <view class="other-login">
          <view class="divider">
            <view class="line"></view>
            <text class="divider-text">其他方式</text>
            <view class="line"></view>
          </view>
          <view class="social-login">
            <view class="social-item" @click="handleWxLogin">
              <view class="social-icon wechat">
                <u-icon name="weixin-fill" size="28" color="#fff"></u-icon>
              </view>
              <text class="social-text">微信登录</text>
            </view>
          </view>
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
import { ref, reactive, computed } from 'vue';
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

// 输入框焦点状态
const phoneFocus = ref(false);
const passwordFocus = ref(false);

// 是否可以登录
const canLogin = computed(() => {
  return h5Form.phone.length === 11 && h5Form.password.length > 0;
});

// 显示忘记密码提示
const showForgetPassword = () => {
  uni.showToast({ 
    title: '请联系管理员重置密码', 
    icon: 'none',
    duration: 2000
  });
};

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
    console.log('H5登录响应:', res);
    if (res) {
      loginSuccess(res);
    } else {
      uni.showToast({ title: '登录失败：服务器返回数据为空', icon: 'none' });
    }
  } catch (e: any) {
    console.error('H5登录错误:', e);
    // 拦截器已处理错误提示，这里可以添加额外的错误处理
    if (e.msg || e.message) {
      uni.showToast({ title: e.msg || e.message, icon: 'none' });
    }
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
        console.log('微信登录响应:', res);
        if (res) {
          loginSuccess(res);
        } else {
          uni.showToast({ title: '登录失败：服务器返回数据为空', icon: 'none' });
        }
      } catch (e: any) {
        console.error('微信登录错误:', e);
        if (e.msg || e.message) {
          uni.showToast({ title: e.msg || e.message, icon: 'none' });
        }
      } finally {
        loading.value = false;
      }
    },
    fail: (err) => {
      console.error('微信登录调用失败:', err);
      uni.showToast({ title: '微信登录调用失败', icon: 'none' });
    }
  });
};

const loginSuccess = (data: any) => {
  // 使用封装的 auth 工具保存登录信息
  // 适配新的返回格式：服务端返回 accessToken 和 user
  const token = data.accessToken || data.token;
  const user = data.user;
  
  if (!token) {
    uni.showToast({ title: '登录失败：未获取到令牌', icon: 'none' });
    return;
  }
  
  setToken(token);
  setUserInfo(user);
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
/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(255,94,120,0.2); }
  50% { transform: scale(1.02); box-shadow: 0 6px 30px rgba(255,94,120,0.3); }
}

.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFFAFB 0%, $omiai-white 50%, $omiai-bg-page 100%);
  padding: 80px 32px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-wrapper {
  animation: fadeInUp 0.6s ease-out;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 56px;
  
  .logo {
    width: 100px;
    height: 100px;
    margin-bottom: 24px;
    border-radius: $omiai-radius-lg;
    box-shadow: $omiai-shadow-md;
    animation: float 3s ease-in-out infinite;
  }
  
  .app-name {
    font-size: 28px;
    font-weight: 700;
    color: $omiai-text-main;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
  }
  
  .welcome-text {
    font-size: 15px;
    color: $omiai-text-tip;
  }
}

.form-section {
  background: $omiai-white;
  padding: 32px 28px;
  border-radius: $omiai-radius-xl;
  box-shadow: 0 8px 32px rgba(255, 94, 120, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: fadeInUp 0.6s ease-out 0.1s both;
  border: 1px solid rgba(255, 94, 120, 0.06);
  
  .form-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    gap: 12px;
    
    .header-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 94, 120, 0.2), transparent);
    }
    
    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: $omiai-text-main;
      letter-spacing: 2px;
    }
  }
  
  .input-group {
    margin-bottom: 24px;
    position: relative;
    
    .input-label {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 500;
      color: $omiai-text-second;
    }
    
    .input-wrapper {
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #FAFBFC 0%, #F5F7FA 100%);
      border-radius: $omiai-radius-lg;
      padding: 0 16px;
      height: 52px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      position: relative;
      
      &:focus-within {
        background: #fff;
        border-color: rgba(255, 94, 120, 0.3);
        box-shadow: 0 0 0 4px rgba(255, 94, 120, 0.08);
      }
      
      .custom-input {
        flex: 1;
        height: 100%;
        font-size: 15px;
        color: $omiai-text-main;
        background: transparent;
        border: none;
        outline: none;
        
        &::placeholder {
          color: #C0C4CC;
        }
      }
      
      .input-clear {
        padding: 8px;
        margin-right: -8px;
        
        &:active {
          transform: scale(0.9);
        }
      }
      
      .input-suffix {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .password-toggle {
          padding: 8px;
          margin-right: -8px;
          
          &:active {
            transform: scale(0.9);
          }
        }
      }
    }
    
    .input-focus-line {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #FF8E9D, $omiai-primary);
      transition: width 0.3s ease;
      border-radius: 2px;
      
      &.active {
        width: 100%;
      }
    }
  }
  
  .form-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    margin-bottom: 32px;
    
    .tip-item {
      display: flex;
      align-items: center;
      gap: 6px;
      
      .tip-text {
        font-size: 13px;
        color: $omiai-text-tip;
        
        &.highlight {
          color: $omiai-primary;
          font-weight: 500;
        }
      }
      
      &.link:active {
        opacity: 0.7;
      }
    }
  }
}

.submit-btn-box {
  margin-bottom: 24px;
  
  .login-btn {
    width: 100%;
    height: 52px;
    background: linear-gradient(135deg, #FF8E9D 0%, $omiai-primary 100%);
    border: none;
    border-radius: $omiai-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 20px rgba(255, 94, 120, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 4px 12px rgba(255, 94, 120, 0.2);
    }
    
    &:active::before {
      left: 100%;
    }
    
    &.disabled {
      background: linear-gradient(135deg, #E8E8E8 0%, #D9D9D9 100%);
      box-shadow: none;
      cursor: not-allowed;
    }
    
    &.loading {
      background: linear-gradient(135deg, #FFB8C1 0%, #FF8E9D 100%);
    }
    
    .btn-content {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .btn-text {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        letter-spacing: 1px;
      }
      
      .btn-icon {
        transition: transform 0.3s ease;
      }
    }
    
    &:hover .btn-icon {
      transform: translateX(4px);
    }
    
    .btn-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      
      .loading-text {
        font-size: 15px;
        color: #fff;
      }
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.other-login {
  margin-top: 32px;
  
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
    .line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, $omiai-border, transparent);
    }
    
    .divider-text {
      font-size: 13px;
      color: $omiai-text-tip;
    }
  }
  
  .social-login {
    display: flex;
    justify-content: center;
    
    .social-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: $omiai-radius-lg;
      transition: all 0.3s ease;
      
      &:active {
        background: $omiai-bg-page;
        transform: scale(0.95);
      }
      
      .social-icon {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        
        &.wechat {
          background: linear-gradient(135deg, #07C160 0%, #0ABF5E 100%);
        }
      }
      
      .social-text {
        font-size: 13px;
        color: $omiai-text-second;
        font-weight: 500;
      }
    }
  }
}

.mp-btn-box {
  margin-top: 48px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
  
  :deep(.u-button) {
    background: linear-gradient(135deg, #07C160 0%, #0ABF5E 100%);
    border: none;
    border-radius: $omiai-radius-md;
    font-weight: 600;
    
    &:active {
      transform: scale(0.98);
    }
    
    &::after {
      border: none;
    }
  }
}

.mp-section {
  text-align: center;
  animation: fadeInUp 0.6s ease-out 0.1s both;
  
  :deep(.u-button) {
    background: linear-gradient(135deg, #07C160 0%, #0ABF5E 100%);
    border: none;
    border-radius: $omiai-radius-md;
    font-weight: 600;
    
    &:active {
      transform: scale(0.98);
    }
    
    &::after {
      border: none;
    }
  }
  
  .agreement-text {
    margin-top: 28px;
    color: $omiai-text-tip;
    font-size: 13px;
    
    .link {
      color: $omiai-primary;
      font-weight: 500;
      
      &:active {
        opacity: 0.7;
      }
    }
  }
}
</style>
