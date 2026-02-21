<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="profile-card" :style="{ animationDelay: '0ms' }">
      <view class="card-bg">
        <view class="bg-circle circle-1"></view>
        <view class="bg-circle circle-2"></view>
        <view class="bg-circle circle-3"></view>
      </view>
      
      <view class="profile-header">
        <view class="avatar-section">
          <view class="avatar-wrapper">
            <u-avatar 
              :src="userInfo?.avatar || defaultAvatar" 
              size="90" 
              shape="circle"
              bgColor="#fff"
            />
            <view class="avatar-ring"></view>
            <view class="edit-avatar" @click="editProfile">
              <u-icon name="camera" size="14" color="#fff"></u-icon>
            </view>
          </view>
        </view>
        
        <view class="user-info">
          <text class="nickname">{{ userInfo?.nickname || '未设置昵称' }}</text>
          <text class="phone" v-if="userInfo?.phone">
            <u-icon name="phone" size="12" color="rgba(255,255,255,0.8)"></u-icon>
            {{ maskPhone(userInfo.phone) }}
          </text>
          <view class="user-tags">
            <view class="tag" v-if="stats.clientCount > 0">
              <u-icon name="account" size="10" color="#FF5E78"></u-icon>
              <text>{{ stats.clientCount }}客户</text>
            </view>
            <view class="tag" v-if="stats.matchCount > 0">
              <u-icon name="heart" size="10" color="#FF5E78"></u-icon>
              <text>{{ stats.matchCount }}成功</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 统计信息 -->
      <view class="stats-bar">
        <view class="stat-item" @click="navigateTo('/pages/client/list')">
          <view class="stat-icon bg-blue">
            <u-icon name="account" size="20" color="#4A90E2"></u-icon>
          </view>
          <text class="stat-num">{{ stats.clientCount || 0 }}</text>
          <text class="stat-label">我的客户</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @click="navigateTo('/pages/match/list')">
          <view class="stat-icon bg-green">
            <u-icon name="heart-fill" size="20" color="#52C41A"></u-icon>
          </view>
          <text class="stat-num">{{ stats.matchCount || 0 }}</text>
          <text class="stat-label">成功匹配</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <view class="stat-icon bg-orange">
            <u-icon name="plus" size="20" color="#FF9F00"></u-icon>
          </view>
          <text class="stat-num">{{ stats.todayCount || 0 }}</text>
          <text class="stat-label">今日新增</text>
        </view>
      </view>
    </view>

    <!-- 账号管理 -->
    <view class="menu-section" :style="{ animationDelay: '100ms' }">
      <view class="section-header">
        <view class="header-icon bg-blue">
          <u-icon name="setting" size="18" color="#4A90E2"></u-icon>
        </view>
        <text class="section-title">账号管理</text>
      </view>
      
      <view class="menu-list">
        <view class="menu-item" @click="editProfile" :style="{ animationDelay: '0ms' }">
          <view class="item-left">
            <view class="icon-box bg-blue-soft">
              <u-icon name="edit-pen" size="20" color="#4A90E2"></u-icon>
            </view>
            <view class="item-info">
              <text class="item-title">编辑资料</text>
              <text class="item-desc">修改个人信息</text>
            </view>
          </view>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#C0C4CC"></u-icon>
          </view>
        </view>
        
        <view class="menu-item" @click="changePassword" :style="{ animationDelay: '50ms' }">
          <view class="item-left">
            <view class="icon-box bg-orange-soft">
              <u-icon name="lock" size="20" color="#FF9F00"></u-icon>
            </view>
            <view class="item-info">
              <text class="item-title">修改密码</text>
              <text class="item-desc">定期更换更安全</text>
            </view>
          </view>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#C0C4CC"></u-icon>
          </view>
        </view>
        
        <view class="menu-item" @click="clearCache" :style="{ animationDelay: '100ms' }">
          <view class="item-left">
            <view class="icon-box bg-green-soft">
              <u-icon name="trash" size="20" color="#52C41A"></u-icon>
            </view>
            <view class="item-info">
              <text class="item-title">清理缓存</text>
              <text class="item-desc">释放存储空间</text>
            </view>
          </view>
          <view class="item-right">
            <text class="cache-size">{{ cacheSize }}</text>
            <u-icon name="arrow-right" size="16" color="#C0C4CC"></u-icon>
          </view>
        </view>
      </view>
    </view>

    <!-- 关于 -->
    <view class="menu-section" :style="{ animationDelay: '200ms' }">
      <view class="section-header">
        <view class="header-icon bg-gray">
          <u-icon name="info-circle" size="18" color="#86909C"></u-icon>
        </view>
        <text class="section-title">关于</text>
      </view>
      
      <view class="menu-list">
        <view class="menu-item" :style="{ animationDelay: '0ms' }">
          <view class="item-left">
            <view class="icon-box bg-gray-soft">
              <u-icon name="info-circle" size="20" color="#86909C"></u-icon>
            </view>
            <view class="item-info">
              <text class="item-title">版本信息</text>
            </view>
          </view>
          <view class="item-right">
            <text class="version-text">v{{ version }}</text>
          </view>
        </view>
        
        <view class="menu-item" @click="contactSupport" :style="{ animationDelay: '50ms' }">
          <view class="item-left">
            <view class="icon-box bg-blue-soft">
              <u-icon name="server-man" size="20" color="#4A90E2"></u-icon>
            </view>
            <view class="item-info">
              <text class="item-title">联系客服</text>
              <text class="item-desc">遇到问题请联系我们</text>
            </view>
          </view>
          <view class="item-right">
            <u-icon name="arrow-right" size="16" color="#C0C4CC"></u-icon>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section" :style="{ animationDelay: '300ms' }">
      <view class="logout-btn" @click="showLogoutConfirm">
        <u-icon name="close-circle" size="18" color="#FF5E78"></u-icon>
        <text>退出登录</text>
      </view>
      <text class="logout-tip">退出后需要重新登录</text>
    </view>

    <!-- 退出确认弹窗 -->
    <u-modal
      :show="logoutModalVisible"
      title="确认退出"
      content="退出后需要重新登录，是否继续？"
      showCancelButton
      confirmColor="#FF5E78"
      @confirm="handleLogout"
      @cancel="logoutModalVisible = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getUserInfo, clearAuth } from '@/utils/auth';
import { getUserInfo as fetchUserInfo } from '@/api/auth';
import { getClientStats } from '@/api/client';

const userInfo = ref<any>(null);
const stats = ref({
  clientCount: 0,
  matchCount: 0,
  todayCount: 0
});
const cacheSize = ref('0KB');
const version = ref('1.0.0');
const logoutLoading = ref(false);
const logoutModalVisible = ref(false);
const defaultAvatar = 'https://cdn.uviewui.com/uview/album/1.jpg';

// #ifdef H5
import { onMounted } from 'vue';
onMounted(() => {
  loadUserInfo();
  loadStats();
  calcCacheSize();
  getAppVersion();
});
// #endif

// #ifndef H5
import { onShow } from '@dcloudio/uni-app';
onShow(() => {
  loadUserInfo();
  loadStats();
  calcCacheSize();
  getAppVersion();
});
// #endif

const loadUserInfo = async () => {
  const localUser = getUserInfo();
  if (localUser) {
    userInfo.value = localUser;
  }
  
  try {
    const res: any = await fetchUserInfo();
    if (res) {
      userInfo.value = res;
    }
  } catch (e) {
    // 使用本地数据
  }
};

const loadStats = async () => {
  try {
    const res: any = await getClientStats();
    if (res) {
      stats.value = {
        clientCount: res.total || 0,
        matchCount: res.matched || 0,
        todayCount: res.today || 0
      };
    }
  } catch (e) {
    console.log('获取统计失败', e);
  }
};

const maskPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

const navigateTo = (url: string) => {
  const tabBarPages = ['pages/home/index', 'pages/client/list', 'pages/form/index'];
  const path = url.replace(/^\//, '').replace('pages/', '');
  
  if (tabBarPages.some(tab => url.includes(tab))) {
    uni.switchTab({ url });
  } else {
    uni.navigateTo({ url });
  }
};

const editProfile = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' });
};

const changePassword = () => {
  uni.showToast({ title: '功能开发中', icon: 'none' });
};

const calcCacheSize = () => {
  const size = Math.floor(Math.random() * 50) + 1;
  cacheSize.value = size + 'MB';
};

const clearCache = () => {
  uni.showModal({
    title: '清理缓存',
    content: '确定要清理缓存数据吗？清理后需要重新登录。',
    success: (res) => {
      if (res.confirm) {
        const token = uni.getStorageSync('token');
        const userInfo = uni.getStorageSync('userInfo');
        const loginTime = uni.getStorageSync('loginTime');

        uni.clearStorageSync();

        if (token) uni.setStorageSync('token', token);
        if (userInfo) uni.setStorageSync('userInfo', userInfo);
        if (loginTime) uni.setStorageSync('loginTime', loginTime);

        cacheSize.value = '0KB';
        uni.showToast({ title: '清理完成', icon: 'success' });
      }
    }
  });
};

const getAppVersion = () => {
  const accountInfo = uni.getAccountInfoSync?.();
  if (accountInfo?.miniProgram?.version) {
    version.value = accountInfo.miniProgram.version;
  }
};

const contactSupport = () => {
  uni.showModal({
    title: '联系客服',
    content: '客服电话：400-888-8888\n工作时间：9:00-18:00',
    showCancel: false
  });
};

const showLogoutConfirm = () => {
  logoutModalVisible.value = true;
};

const handleLogout = async () => {
  logoutModalVisible.value = false;
  logoutLoading.value = true;
  
  try {
    clearAuth();
    
    uni.showToast({ 
      title: '已退出登录', 
      icon: 'success',
      duration: 1500
    });
    
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/auth/login' });
    }, 1500);
  } finally {
    logoutLoading.value = false;
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

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}

.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F7FA 0%, #ffffff 30%, #F5F7FA 100%);
  padding: 20px 16px 60px;
}

// Profile Card
.profile-card {
  position: relative;
  background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 50%, #FFB5C0 100%);
  border-radius: 24px;
  padding: 28px 20px 24px;
  margin-bottom: 20px;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out both;
  box-shadow: 0 8px 32px rgba(255, 94, 120, 0.25);
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  
  .bg-circle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
    
    &.circle-1 {
      top: -40%;
      right: -10%;
      width: 200px;
      height: 200px;
    }
    
    &.circle-2 {
      bottom: -20%;
      left: -10%;
      width: 150px;
      height: 150px;
    }
    
    &.circle-3 {
      top: 30%;
      right: 20%;
      width: 80px;
      height: 80px;
      opacity: 0.5;
    }
  }
}

.profile-header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  z-index: 1;
}

.avatar-section {
  position: relative;
}

.avatar-wrapper {
  position: relative;
}

.avatar-ring {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.edit-avatar {
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

.user-status {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 12px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  text {
    font-size: 11px;
    font-weight: 600;
    color: #FF5E78;
  }
}

.user-info {
  flex: 1;
}

.nickname {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.phone {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 12px;
}

.user-tags {
  display: flex;
  gap: 8px;
  
  .tag {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 10px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    
    text {
      font-size: 11px;
      color: #fff;
      font-weight: 500;
    }
  }
}

// Stats Bar
.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 16px 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    opacity: 0.9;
  }
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  
  &.bg-blue { background: linear-gradient(135deg, #E8F3FF 0%, rgba(74, 144, 226, 0.3) 100%); }
  &.bg-green { background: linear-gradient(135deg, #E8FFEA 0%, rgba(82, 196, 26, 0.3) 100%); }
  &.bg-orange { background: linear-gradient(135deg, #FFF7E8 0%, rgba(255, 159, 0, 0.3) 100%); }
}

.stat-num {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
}

// Menu Section
.menu-section {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.5s ease-out both;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.header-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.bg-blue { background: linear-gradient(135deg, #E8F3FF 0%, rgba(74, 144, 226, 0.12) 100%); }
  &.bg-gray { background: linear-gradient(135deg, #F5F7FA 0%, rgba(134, 144, 156, 0.12) 100%); }
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1D2129;
}

// Menu List
.menu-list {
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid #F2F3F5;
    animation: fadeInUp 0.4s ease-out both;
    transition: all 0.2s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:active {
      background: linear-gradient(90deg, transparent 0%, rgba(255, 94, 120, 0.03) 50%, transparent 100%);
    }
  }
}

.item-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.bg-blue-soft { background: linear-gradient(135deg, #E8F3FF 0%, rgba(74, 144, 226, 0.15) 100%); }
  &.bg-orange-soft { background: linear-gradient(135deg, #FFF7E8 0%, rgba(255, 159, 0, 0.15) 100%); }
  &.bg-green-soft { background: linear-gradient(135deg, #E8FFEA 0%, rgba(82, 196, 26, 0.15) 100%); }
  &.bg-gray-soft { background: linear-gradient(135deg, #F5F7FA 0%, rgba(134, 144, 156, 0.15) 100%); }
}

.item-info {
  flex: 1;
}

.item-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #1D2129;
  margin-bottom: 4px;
}

.item-desc {
  font-size: 12px;
  color: #86909C;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cache-size {
  font-size: 13px;
  color: #86909C;
}

.version-text {
  font-size: 14px;
  color: #86909C;
  font-weight: 500;
}

// Logout Section
.logout-section {
  margin-top: 8px;
  animation: fadeInUp 0.5s ease-out both;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 52px;
  background: linear-gradient(135deg, #FFF0F2 0%, #FFFAFB 100%);
  border: 2px solid rgba(255, 94, 120, 0.3);
  border-radius: 16px;
  transition: all 0.3s ease;
  
  text {
    font-size: 16px;
    font-weight: 600;
    color: #FF5E78;
  }
  
  &:active {
    background: linear-gradient(135deg, rgba(255, 94, 120, 0.1) 0%, #FFF0F2 100%);
    transform: scale(0.98);
  }
}

.logout-tip {
  display: block;
  text-align: center;
  font-size: 12px;
  color: #86909C;
  margin-top: 12px;
}
</style>
