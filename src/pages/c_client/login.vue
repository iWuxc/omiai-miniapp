<template>
  <view class="container">
    <view class="header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="title">Omiai 寻爱</text>
      <text class="subtitle">AI为你寻找最懂你的人</text>
    </view>

    <view class="login-box">
      <button 
        class="login-btn" 
        open-type="getPhoneNumber" 
        @click="handleWxLogin"
        :loading="loading"
      >
        <u-icon name="weixin-fill" color="#fff" size="24" class="icon"></u-icon>
        微信一键登录
      </button>
      <text class="tips">登录即代表同意《用户协议》与《隐私政策》</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { cAuth } from '@/api/c_api'
import { setToken } from '@/utils/auth'

const loading = ref(false)

const handleWxLogin = () => {
  loading.value = true
  // 小程序登录获取 code
  uni.login({
    provider: 'weixin',
    success: async (loginRes) => {
      try {
        const res: any = await cAuth.wxLogin({ code: loginRes.code })
        if (res.code === 200) {
          // 保存 C 端 Token
          setToken(res.data.token)
          uni.setStorageSync('c_client_info', res.data.client)
          uni.showToast({ title: '登录成功', icon: 'success' })
          
          setTimeout(() => {
            if (res.data.is_new || !res.data.client.name) {
              // 新用户，去完善资料
              uni.redirectTo({ url: '/pages/c_profile/edit' })
            } else {
              // 老用户，去推荐首页
              uni.switchTab({ url: '/pages/c_recommend/index' })
            }
          }, 1000)
        } else {
          uni.showToast({ title: res.msg || '登录失败', icon: 'none' })
        }
      } catch (e) {
        uni.showToast({ title: '网络错误', icon: 'none' })
      } finally {
        loading.value = false
      }
    },
    fail: () => {
      loading.value = false
      uni.showToast({ title: '获取微信授权失败', icon: 'none' })
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.header {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100rpx;

  .logo {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 40rpx;
  }

  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }

  .subtitle {
    font-size: 28rpx;
    color: #999;
  }
}

.login-box {
  padding: 80rpx 60rpx 120rpx;
  
  .login-btn {
    background: #FF4D6A;
    color: #fff;
    border-radius: 50rpx;
    font-size: 32rpx;
    height: 96rpx;
    line-height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30rpx;
    
    &::after {
      border: none;
    }
    
    .icon {
      margin-right: 10rpx;
    }
  }

  .tips {
    display: block;
    text-align: center;
    font-size: 24rpx;
    color: #999;
  }
}
</style>
