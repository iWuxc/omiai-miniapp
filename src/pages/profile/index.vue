<template>
  <view class="container">
    <!-- 顶部用户信息卡片 -->
    <view class="user-card fade-in">
      <view class="user-header">
        <view class="avatar-wrapper">
          <u-avatar 
            :src="userInfo?.avatar || defaultAvatar" 
            size="80" 
            shape="circle"
            bgColor="#FFE4E8"
          />
          <view class="role-badge" v-if="userInfo?.role">
            {{ userInfo.role === 'admin' ? '管理员' : '红娘' }}
          </view>
        </view>
        <view class="user-info">
          <text class="nickname">{{ userInfo?.nickname || '未设置昵称' }}</text>
          <text class="phone" v-if="userInfo?.phone">{{ maskPhone(userInfo.phone) }}</text>
        </view>
      </view>
      
      <!-- 统计信息 -->
      <view class="stats-row">
        <view class="stat-item" @click="navigateTo('/pages/client/list')">
          <text class="stat-num">{{ stats.clientCount || 0 }}</text>
          <text class="stat-label">我的客户</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @click="navigateTo('/pages/match/list')">
          <text class="stat-num">{{ stats.matchCount || 0 }}</text>
          <text class="stat-label">成功匹配</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.todayCount || 0 }}</text>
          <text class="stat-label">今日新增</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section fade-in">
      <view class="menu-title">账号管理</view>
      
      <view class="menu-list">
        <view class="menu-item" @click="editProfile">
          <view class="item-left">
            <view class="icon-wrapper" style="background: #E8F5FF;">
              <u-icon name="edit-pen" size="22" color="#409EFF"></u-icon>
            </view>
            <text class="item-text">编辑资料</text>
          </view>
          <u-icon name="arrow-right" size="16" color="#C0C4CC"></u-icon>
        </view>
        
        <view class="menu-item" @click="changePassword">
          <view class="item-left">
            <view class="icon-wrapper" style="background: #FFF4E8;">
              <u-icon name="lock" size="22" color="#FF9500"></u-icon>
            </view>
            <text class="item-text">修改密码</text>
          </view>
          <u-icon name="arrow-right" size="16" color="#C0C4CC"></u-icon>
        </view>
        
        <view class="menu-item" @click="clearCache">
          <view class="item-left">
            <view class="icon-wrapper" style="background: #F0F9E8;">
              <u-icon name="trash" size="22" color="#67C23A"></u-icon>
            </view>
            <text class="item-text">清理缓存</text>
          </view>
          <view class="item-right">
            <text class="cache-size">{{ cacheSize }}</text>
            <u-icon name="arrow-right" size="16" color="#C0C4CC"></u-icon>
          </view>
        </view>
      </view>
    </view>

    <!-- 系统信息 -->
    <view class="menu-section fade-in">
      <view class="menu-title">关于</view>
      
      <view class="menu-list">
        <view class="menu-item">
          <view class="item-left">
            <view class="icon-wrapper" style="background: #F2F3F5;">
              <u-icon name="info-circle" size="22" color="#909399"></u-icon>
            </view>
            <text class="item-text">版本信息</text>
          </view>
          <view class="item-right">
            <text class="version-text">v{{ version }}</text>
          </view>
        </view>
        
        <view class="menu-item" @click="contactSupport">
          <view class="item-left">
            <view class="icon-wrapper" style="background: #E8F5FF;">
              <u-icon name="server-man" size="22" color="#409EFF"></u-icon>
            </view>
            <text class="item-text">联系客服</text>
          </view>
          <u-icon name="arrow-right" size="16" color="#C0C4CC"></u-icon>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-section fade-in">
      <u-button 
        @click="showLogoutConfirm" 
        class="logout-btn"
        :loading="logoutLoading"
        customStyle="height: 48px; font-size: 16px; border-radius: 12px;"
      >
        退出登录
      </u-button>
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
import { onShow } from '@dcloudio/uni-app';
import { getUserInfo, clearAuth, getToken } from '@/utils/auth';
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

// 页面显示时刷新数据
onShow(() => {
  loadUserInfo();
  loadStats();
  calcCacheSize();
  getAppVersion();
});

const loadUserInfo = async () => {
  // 先读取本地缓存
  const localUser = getUserInfo();
  if (localUser) {
    userInfo.value = localUser;
  }
  
  // 然后请求最新数据
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
  // 模拟计算缓存大小
  const size = Math.floor(Math.random() * 50) + 1;
  cacheSize.value = size + 'MB';
};

const clearCache = () => {
  uni.showModal({
    title: '清理缓存',
    content: '确定要清理缓存数据吗？清理后需要重新登录。',
    success: (res) => {
      if (res.confirm) {
        // 保存关键登录信息
        const token = uni.getStorageSync('token');
        const userInfo = uni.getStorageSync('userInfo');
        const loginTime = uni.getStorageSync('loginTime');

        // 清除所有缓存
        uni.clearStorageSync();

        // 恢复登录信息
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
    // 清除登录状态
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
.container {
  min-height: 100vh;
  background-color: $omiai-bg-page;
  padding-bottom: 40px;
}

// 用户卡片
.user-card {
  background: linear-gradient(135deg, $omiai-primary 0%, #FF8A9B 100%);
  padding: 40px 24px 30px;
  border-radius: 0 0 24px 24px;
  margin-bottom: 16px;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-wrapper {
  position: relative;
  margin-right: 16px;
  
  .role-badge {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.95);
    color: $omiai-primary;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.user-info {
  flex: 1;
  
  .nickname {
    display: block;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 6px;
  }
  
  .phone {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
  }
}

// 统计行
.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 16px 0;
  backdrop-filter: blur(10px);
}

.stat-item {
  flex: 1;
  text-align: center;
  
  .stat-num {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
  }
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
}

// 菜单区域
.menu-section {
  margin: 0 16px 16px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: $omiai-shadow-sm;
}

.menu-title {
  font-size: 15px;
  font-weight: 600;
  color: $omiai-text-main;
  margin-bottom: 12px;
  padding-left: 4px;
}

.menu-list {
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 4px;
    border-bottom: 1px solid $omiai-border-light;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:active {
      opacity: 0.7;
    }
  }
}

.item-left {
  display: flex;
  align-items: center;
  
  .icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }
  
  .item-text {
    font-size: 15px;
    color: $omiai-text-main;
  }
}

.item-right {
  display: flex;
  align-items: center;
  
  .cache-size,
  .version-text {
    font-size: 13px;
    color: $omiai-text-tip;
    margin-right: 4px;
  }
}

// 退出按钮
.logout-section {
  margin: 24px 16px;
}

.logout-btn {
  background: #fff;
  color: $omiai-primary;
  border: 1px solid $omiai-primary;
  
  &:active {
    background: rgba(255, 94, 120, 0.05);
  }
}
</style>
