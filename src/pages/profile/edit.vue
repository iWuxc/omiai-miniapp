<template>
  <view class="container">
    <view class="nav-header" @click="goBack">
      <u-icon name="arrow-left" size="22" color="#1D2129"></u-icon>
    </view>

    <view class="page-header" :style="{ animationDelay: '0ms' }">
      <view class="header-icon">
        <u-icon name="edit-pen" size="28" color="#FF5E78"></u-icon>
      </view>
      <text class="page-title">编辑资料</text>
      <text class="page-desc">完善个人信息，展示更好的自己</text>
    </view>

    <view class="form-card" :style="{ animationDelay: '100ms' }">
      <view class="avatar-section">
        <view class="avatar-wrapper" @click="changeAvatar">
          <u-avatar :src="form.avatar || defaultAvatar" size="90" shape="circle" bgColor="#fff" />
          <view class="avatar-edit">
            <u-icon name="camera" size="14" color="#fff"></u-icon>
          </view>
        </view>
        <text class="avatar-tip">点击更换头像</text>
      </view>

      <view class="form-item">
        <view class="form-label">昵称</view>
        <view class="form-input">
          <u-input
            v-model="form.nickname"
            placeholder="请输入昵称"
            border="none"
            :customStyle="{ background: '#F7F8FA', borderRadius: '12px', padding: '14px 16px' }"
          />
        </view>
      </view>

      <view class="form-item">
        <view class="form-label">手机号</view>
        <view class="form-input">
          <u-input
            :value="maskPhone(userInfo?.phone || '')"
            placeholder="请输入手机号"
            border="none"
            disabled
            :customStyle="{ background: '#F7F8FA', borderRadius: '12px', padding: '14px 16px' }"
          />
        </view>
      </view>
    </view>

    <view class="submit-section" :style="{ animationDelay: '200ms' }">
      <view class="submit-btn" :class="{ disabled: submitting }" @click="handleSubmit">
        <text v-if="!submitting">保存资料</text>
        <u-loading-icon v-else></u-loading-icon>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getUserInfo as fetchUserInfo, updateUserInfo } from '@/api/auth';
import { uploadFile } from '@/api/common';
import { getUserInfo as getLocalUserInfo } from '@/utils/auth';
import { config as appConfig } from '@/config';

interface UserInfo {
  id?: number;
  phone?: string;
  nickname?: string;
  avatar?: string;
  role?: string;
}

const submitting = ref(false);
const defaultAvatar = 'https://cdn.uviewui.com/uview/album/1.jpg';
const userInfo = ref<UserInfo | null>(null);

const form = reactive({
  nickname: '',
  avatar: ''
});

const goBack = () => {
  uni.navigateBack();
};

const maskPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

const loadUserInfo = async () => {
  try {
    const localUser = getLocalUserInfo();
    if (localUser) {
      userInfo.value = localUser;
      form.nickname = localUser.nickname || '';
      form.avatar = localUser.avatar || '';
    }

    const res: any = await fetchUserInfo();
    if (res) {
      userInfo.value = res;
      form.nickname = res.nickname || '';
      form.avatar = res.avatar || '';
    }
  } catch (e) {
    console.error('加载用户信息失败', e);
  }
};

const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];

      uni.showLoading({ title: '上传中...' });

      try {
        const uploadRes: any = await uploadFile(tempFilePath);
        const url = uploadRes.url.startsWith('http') ? uploadRes.url : appConfig.assetsUrl + uploadRes.url;
        form.avatar = url;
        uni.hideLoading();
        uni.showToast({ title: '头像已更新', icon: 'success' });
      } catch (e) {
        uni.hideLoading();
        uni.showToast({ title: '上传失败', icon: 'none' });
      }
    }
  });
};

const validate = (): boolean => {
  if (!form.nickname || form.nickname.trim() === '') {
    uni.showToast({ title: '请输入昵称', icon: 'none' });
    return false;
  }
  if (form.nickname.length > 32) {
    uni.showToast({ title: '昵称最多32个字符', icon: 'none' });
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (submitting.value) return;

  if (!validate()) return;

  submitting.value = true;

  try {
    await updateUserInfo({
      nickname: form.nickname,
      avatar: form.avatar
    });

    uni.showToast({ title: '资料已更新', icon: 'success' });

    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (e: any) {
    const message = e?.message || e?.msg || '更新失败';
    uni.showToast({ title: message, icon: 'none' });
  } finally {
    submitting.value = false;
  }
};

// #ifdef H5
import { onMounted } from 'vue';
onMounted(() => {
  loadUserInfo();
});
// #endif

// #ifndef H5
import { onShow } from '@dcloudio/uni-app';
onShow(() => {
  loadUserInfo();
});
// #endif
</script>

<style lang="scss" scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F7FA 0%, #ffffff 30%, #F5F7FA 100%);
  padding: 0 16px 60px;
}

.nav-header {
  position: relative;
  z-index: 100;
  padding-top: 30px;
  padding-left: 10px;
  display: inline-flex;
  margin-bottom: 20px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50%;
}

.page-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 32px;
  animation: fadeInUp 0.5s ease-out both;

  .header-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FFF0F2 0%, rgba(255, 94, 120, 0.15) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 8px 24px rgba(255, 94, 120, 0.2);
  }

  .page-title {
    font-size: 26px;
    font-weight: 700;
    color: #1D2129;
    margin-bottom: 8px;
  }

  .page-desc {
    font-size: 14px;
    color: #86909C;
  }
}

.form-card {
  background: #fff;
  border-radius: 24px;
  padding: 24px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.5s ease-out both;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F2F3F5;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 12px;

  .avatar-edit {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 28px;
    height: 28px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  }
}

.avatar-tip {
  font-size: 13px;
  color: #86909C;
}

.form-item {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  font-size: 15px;
  font-weight: 600;
  color: #1D2129;
  margin-bottom: 10px;
}

.form-input {
  :deep(.u-input) {
    font-size: 15px;
  }
}

.submit-section {
  margin-top: 40px;
  padding: 0 4px;
  animation: fadeInUp 0.5s ease-out both;
}

.submit-btn {
  background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(255, 94, 120, 0.35);
  transition: all 0.3s ease;

  &:active {
    transform: translateY(2px) scale(0.98);
    box-shadow: 0 4px 12px rgba(255, 94, 120, 0.25);
  }

  &.disabled {
    opacity: 0.6;
    transform: none;
  }

  text {
    color: #fff;
    font-size: 17px;
    font-weight: 600;
  }
}
</style>