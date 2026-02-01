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
            <u-input v-model="h5Form.code" placeholder="请输入验证码" border="none" type="number">
              <template #prefix>
                <u-icon name="lock" size="20" color="#C0C4CC" style="margin-right: 10px"></u-icon>
              </template>
              <template #suffix>
                <u-code
                  ref="uCode"
                  @change="codeChange"
                  seconds="60"
                  changeText="X秒后重发"
                ></u-code>
                <text @tap="getCode" class="code-btn" :class="{ disabled: !!tips }">{{ tips }}</text>
              </template>
            </u-input>
          </u-form-item>
        </u-form>
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
import { getPlatform } from '@/utils/env';
import { sendSms, h5Login, wxLogin } from '@/api/auth';

const platform = ref(getPlatform());
const loading = ref(false);
const tips = ref('获取验证码');
const uCode = ref();

const h5Form = reactive({
  phone: '',
  code: ''
});

const codeChange = (text: string) => {
  tips.value = text;
};

const getCode = async () => {
  if (uCode.value.canGetCode) {
    if (!/^1[3-9]\d{9}$/.test(h5Form.phone)) {
      uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    
    uni.showLoading({ title: '正在获取验证码' });
    try {
      await sendSms(h5Form.phone);
      uni.hideLoading();
      uni.showToast({ title: '验证码已发送' });
      uCode.value.start();
    } catch (e) {
      uni.hideLoading();
    }
  }
};

const handleH5Login = async () => {
  if (!h5Form.phone || !h5Form.code) {
    uni.showToast({ title: '请完善登录信息', icon: 'none' });
    return;
  }
  
  loading.value = true;
  try {
    const res: any = await h5Login(h5Form.phone, h5Form.code);
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
  uni.setStorageSync('token', data.token);
  uni.setStorageSync('userInfo', data.user);
  uni.showToast({ title: '登录成功', icon: 'success' });
  
  setTimeout(() => {
    uni.switchTab({ url: '/pages/home/index' });
  }, 1500);
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
  .code-btn {
    font-size: 14px;
    color: $omiai-primary;
    padding: 4px 0;
    
    &.disabled {
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
