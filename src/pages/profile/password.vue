<template>
  <view class="container">
    <view class="nav-header" @click="goBack">
      <u-icon name="arrow-left" size="22" color="#1D2129"></u-icon>
    </view>

    <view class="page-header" :style="{ animationDelay: '0ms' }">
      <view class="header-icon">
        <u-icon name="lock" size="28" color="#FF5E78"></u-icon>
      </view>
      <text class="page-title">修改密码</text>
      <text class="page-desc">定期更换密码，保护账号安全</text>
    </view>

    <view class="form-card" :style="{ animationDelay: '100ms' }">
      <view class="form-item">
        <view class="form-label">原密码</view>
        <view class="form-input">
          <u-input
            v-model="form.oldPassword"
            type="password"
            placeholder="请输入原密码"
            border="none"
            :customStyle="{ background: '#F7F8FA', borderRadius: '12px', padding: '14px 16px' }"
          />
        </view>
      </view>

      <view class="form-item">
        <view class="form-label">新密码</view>
        <view class="form-input">
          <u-input
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码（6位以上）"
            border="none"
            :customStyle="{ background: '#F7F8FA', borderRadius: '12px', padding: '14px 16px' }"
          />
        </view>
      </view>

      <view class="form-item">
        <view class="form-label">确认密码</view>
        <view class="form-input">
          <u-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            border="none"
            :customStyle="{ background: '#F7F8FA', borderRadius: '12px', padding: '14px 16px' }"
          />
        </view>
      </view>
    </view>

    <view class="submit-section" :style="{ animationDelay: '200ms' }">
      <view class="submit-btn" :class="{ disabled: submitting }" @click="handleSubmit">
        <text v-if="!submitting">确认修改</text>
        <u-loading-icon v-else></u-loading-icon>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { changePassword } from '@/api/auth';

const submitting = ref(false);

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const goBack = () => {
  uni.navigateBack();
};

const validate = (): boolean => {
  if (!form.oldPassword) {
    uni.showToast({ title: '请输入原密码', icon: 'none' });
    return false;
  }
  if (!form.newPassword) {
    uni.showToast({ title: '请输入新密码', icon: 'none' });
    return false;
  }
  if (form.newPassword.length < 6) {
    uni.showToast({ title: '新密码至少6位', icon: 'none' });
    return false;
  }
  if (form.newPassword !== form.confirmPassword) {
    uni.showToast({ title: '两次密码输入不一致', icon: 'none' });
    return false;
  }
  if (form.oldPassword === form.newPassword) {
    uni.showToast({ title: '新密码不能与原密码相同', icon: 'none' });
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (submitting.value) return;

  if (!validate()) return;

  submitting.value = true;

  try {
    await changePassword(form.oldPassword, form.newPassword);
    uni.showToast({ title: '密码修改成功', icon: 'success' });

    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (e: any) {
    const message = e?.message || e?.msg || '修改失败';
    uni.showToast({ title: message, icon: 'none' });
  } finally {
    submitting.value = false;
  }
};
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