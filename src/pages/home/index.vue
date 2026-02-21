<template>
  <view class="container">
    <!-- 顶部欢迎区 -->
    <view class="header-section" :style="{ animationDelay: '0ms' }">
      <view class="header-bg">
        <view class="bg-pattern"></view>
      </view>
      <view class="header-content">
        <view class="greeting">
          <view class="welcome-badge">
            <u-icon name="sun" size="14" color="#FF9F00"></u-icon>
            <text>早安</text>
          </view>
          <text class="welcome-title">红娘姐姐</text>
          <text class="welcome-date">{{ currentDate }} · 又是充满希望的一天</text>
        </view>
        <view class="avatar-area" @click="navigateTo('/pages/profile/index')">
          <view class="avatar-ring">
            <u-avatar text="M" size="52" fontSize="20" bgColor="#FF5E78"></u-avatar>
          </view>
          <view class="status-dot"></view>
        </view>
      </view>
    </view>

    <!-- 数据概览卡片 -->
    <view class="stats-section" :style="{ animationDelay: '100ms' }">
      <view class="stats-header">
        <text class="section-title">数据概览</text>
      </view>
      
      <view class="stats-grid">
        <view class="stat-card" @click="navigateTo('/pages/client/list')">
          <view class="stat-icon bg-blue">
            <u-icon name="account" size="24" color="#4A90E2"></u-icon>
          </view>
          <view class="stat-info">
            <text class="stat-num">{{ stats.total || 0 }}</text>
            <text class="stat-label">客户总数</text>
          </view>
          <view class="stat-trend" v-if="stats.total > 0">
            <u-icon name="arrow-up" size="12" color="#52C41A"></u-icon>
          </view>
        </view>
        
        <view class="stat-card highlight">
          <view class="stat-icon bg-pink">
            <u-icon name="plus" size="24" color="#FF5E78"></u-icon>
          </view>
          <view class="stat-info">
            <text class="stat-num highlight">{{ stats.today || 0 }}</text>
            <text class="stat-label">今日新增</text>
          </view>
        </view>
        
        <view class="stat-card" @click="navigateTo('/pages/match/list')">
          <view class="stat-icon bg-orange">
            <u-icon name="heart" size="24" color="#FF9F00"></u-icon>
          </view>
          <view class="stat-info">
            <text class="stat-num">{{ stats.pending || 0 }}</text>
            <text class="stat-label">待匹配</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷功能网格 -->
    <view class="quick-actions" :style="{ animationDelay: '200ms' }">
      <view class="section-header">
        <view class="section-icon">
          <u-icon name="grid" size="18" color="#4A90E2"></u-icon>
        </view>
        <text class="section-title">快捷功能</text>
      </view>
      
      <view class="action-grid">
        <view class="action-card" @click="navigateTo('/pages/form/index')" :style="{ animationDelay: '0ms' }">
          <view class="card-bg bg-pink"></view>
          <view class="card-content">
            <view class="action-icon">
              <u-icon name="edit-pen" size="28" color="#FF5E78"></u-icon>
            </view>
            <view class="action-info">
              <text class="action-title">录入档案</text>
              <text class="action-desc">快速新建客户资料</text>
            </view>
          </view>
          <view class="card-arrow">
            <u-icon name="arrow-right" size="16" color="#FF5E78"></u-icon>
          </view>
        </view>
        
        <view class="action-card" @click="navigateTo('/pages/client/list')" :style="{ animationDelay: '50ms' }">
          <view class="card-bg bg-blue"></view>
          <view class="card-content">
            <view class="action-icon">
              <u-icon name="search" size="28" color="#4A90E2"></u-icon>
            </view>
            <view class="action-info">
              <text class="action-title">查找客户</text>
              <text class="action-desc">精准筛选匹配对象</text>
            </view>
          </view>
          <view class="card-arrow">
            <u-icon name="arrow-right" size="16" color="#4A90E2"></u-icon>
          </view>
        </view>
        
        <view class="action-card" @click="shareInvite" :style="{ animationDelay: '100ms' }">
          <view class="card-bg bg-orange"></view>
          <view class="card-content">
            <view class="action-icon">
              <u-icon name="share" size="28" color="#FF9F00"></u-icon>
            </view>
            <view class="action-info">
              <text class="action-title">邀请填写</text>
              <text class="action-desc">分享链接自助录入</text>
            </view>
          </view>
          <view class="card-arrow">
            <u-icon name="arrow-right" size="16" color="#FF9F00"></u-icon>
          </view>
        </view>
        
        <view class="action-card" @click="navigateTo('/pages/match/list')" :style="{ animationDelay: '150ms' }">
          <view class="card-bg bg-green"></view>
          <view class="card-content">
            <view class="action-icon">
              <u-icon name="heart-fill" size="28" color="#52C41A"></u-icon>
            </view>
            <view class="action-info">
              <text class="action-title">情侣管理</text>
              <text class="action-desc">跟进牵手成功进度</text>
            </view>
          </view>
          <view class="card-arrow">
            <u-icon name="arrow-right" size="16" color="#52C41A"></u-icon>
          </view>
        </view>
      </view>
    </view>

    <!-- 待办事项 -->
    <view class="todo-section" :style="{ animationDelay: '300ms' }">
      <view class="section-header">
        <view class="section-icon">
          <u-icon name="clock" size="18" color="#FF9F00"></u-icon>
        </view>
        <text class="section-title">今日待办</text>
        <view class="section-more" @click="navigateTo('/pages/reminder/list')">
          <text>查看全部</text>
          <u-icon name="arrow-right" size="14" color="#86909C"></u-icon>
        </view>
      </view>
      
      <view class="todo-list">
        <view class="todo-item" v-for="(item, index) in todoList" :key="index" :style="{ animationDelay: `${index * 100}ms` }">
          <view class="todo-priority" :class="item.priority">
            <view class="priority-dot"></view>
          </view>
          <view class="todo-content">
            <view class="todo-header">
              <text class="todo-title">{{ item.title }}</text>
              <view class="todo-tag" :class="item.priority">{{ item.tag }}</view>
            </view>
            <view class="todo-desc">
              <u-icon name="account" size="12" color="#86909C"></u-icon>
              <text>{{ item.client }}</text>
              <text class="todo-time">{{ item.time }}</text>
            </view>
          </view>
          <view class="todo-action">
            <u-icon name="arrow-right" size="16" color="#C0C4CC"></u-icon>
          </view>
        </view>
        
        <view v-if="todoList.length === 0" class="empty-todo">
          <u-icon name="checkmark-circle" size="48" color="#52C41A"></u-icon>
          <text>今日暂无待办事项</text>
        </view>
      </view>
    </view>

    <!-- 轮播 Banner -->
    <view class="banner-section" v-if="banners.length > 0" :style="{ animationDelay: '400ms' }">
      <u-swiper
        :list="banners"
        keyName="image_url"
        showTitle
        :autoplay="true"
        circular
        radius="16"
        height="150"
        bgColor="transparent"
        @click="onBannerClick"
        indicatorStyle="bottom: 10px"
      ></u-swiper>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getClientStats } from '@/api/client';
import { getBannerList, type Banner } from '@/api/banner';
import { config as appConfig } from '@/config';

const banners = ref<Banner[]>([]);
const stats = ref({
  total: 0,
  today: 0,
  pending: 0
});

const todoList = ref([
  { title: '王先生申请匹配审核', client: '王先生(ID:1024)', time: '10分钟前', priority: 'high', tag: '急' },
  { title: '李女士资料待完善', client: '李女士(ID:1025)', time: '30分钟前', priority: 'normal', tag: '待处理' },
  { title: '张先生匹配结果反馈', client: '张先生(ID:1026)', time: '1小时前', priority: 'low', tag: '跟进' }
]);

const currentDate = computed(() => {
  const date = new Date();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`;
});

const fetchData = async () => {
  try {
    const [statsRes, bannerRes]: any = await Promise.all([
      getClientStats(),
      getBannerList()
    ]);
    
    stats.value = statsRes || { total: 0, today: 0, pending: 0 };
    banners.value = bannerRes?.list || (Array.isArray(bannerRes) ? bannerRes : []);
  } catch (e) {
    console.error('Fetch home data failed:', e);
  }
};

onMounted(() => {
  fetchData();
});

const onBannerClick = (index: number) => {
  const banner = banners.value[index];
  if (banner && banner.link_url) {
    uni.navigateTo({ url: banner.link_url });
  }
};

const navigateTo = (url: string) => {
  const tabbarPages = [
    '/pages/home/index',
    '/pages/client/list',
    '/pages/form/index',
    '/pages/profile/index'
  ];
  if (tabbarPages.includes(url)) {
    uni.switchTab({ url });
  } else {
    uni.navigateTo({ url });
  }
};

const shareInvite = () => {
  const inviteUrl = `${appConfig.h5Domain}/pages/invite/index?referrer=admin`;
  uni.setClipboardData({
    data: inviteUrl,
    success: () => {
      uni.showToast({ title: '邀请链接已复制', icon: 'none' });
    }
  });
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

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F7FA 0%, #ffffff 10%, #F5F7FA 100%);
  padding-bottom: 40px;
}

// Header Section
.header-section {
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out both;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 50%, #FFB5C0 100%);
  border-radius: 0 0 30px 30px;
  
  .bg-pattern {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
}

.header-content {
  position: relative;
  padding: 60px 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.greeting {
  flex: 1;
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
  backdrop-filter: blur(10px);
  
  text {
    font-size: 13px;
    color: #fff;
    font-weight: 500;
  }
}

.welcome-title {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.welcome-date {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.avatar-area {
  position: relative;
  padding-top: 8px;
}

.avatar-ring {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
}

.status-dot {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 14px;
  height: 14px;
  background: #52C41A;
  border-radius: 50%;
  border: 3px solid #FF5E78;
}

// Section Header
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.section-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #FFF0F2 0%, rgba(255, 94, 120, 0.1) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: #1D2129;
}

.section-more {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #F5F7FA;
  border-radius: 20px;
  
  text {
    font-size: 13px;
    color: #86909C;
  }
  
  &:active {
    background: #E5E6EB;
  }
}

// Stats Section
.stats-section {
  margin: 0 16px 24px;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.5s ease-out both;
}

.stats-grid {
  display: flex;
  gap: 12px;
}

.stat-card {
  flex: 1;
  background: linear-gradient(135deg, #F5F7FA 0%, #F2F3F5 100%);
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
  
  &.highlight {
    background: linear-gradient(135deg, #FFF0F2 0%, rgba(255, 94, 120, 0.08) 100%);
  }
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.bg-blue {
    background: linear-gradient(135deg, #E8F3FF 0%, rgba(74, 144, 226, 0.15) 100%);
  }
  
  &.bg-pink {
    background: linear-gradient(135deg, #FFF0F2 0%, rgba(255, 94, 120, 0.15) 100%);
  }
  
  &.bg-orange {
    background: linear-gradient(135deg, #FFF7E8 0%, rgba(255, 159, 0, 0.15) 100%);
  }
}

.stat-info {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 26px;
  font-weight: 700;
  color: #1D2129;
  margin-bottom: 2px;
  
  &.highlight {
    color: #FF5E78;
  }
}

.stat-label {
  font-size: 12px;
  color: #86909C;
}

.stat-trend {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  background: #F6FFED;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Quick Actions
.quick-actions {
  margin: 0 16px 24px;
  animation: fadeInUp 0.5s ease-out both;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 20px 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.98);
  }
  
  .card-bg {
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    border-radius: 0 0 0 80px;
    opacity: 0.1;
    
    &.bg-pink { background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%); }
    &.bg-blue { background: linear-gradient(135deg, #4A90E2 0%, #6BB3FF 100%); }
    &.bg-orange { background: linear-gradient(135deg, #FF9F00 0%, #FFC53D 100%); }
    &.bg-green { background: linear-gradient(135deg, #52C41A 0%, #73D13D 100%); }
  }
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F5F7FA 0%, #F2F3F5 100%);
}

.action-info {
  flex: 1;
}

.action-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #1D2129;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 12px;
  color: #86909C;
}

.card-arrow {
  width: 28px;
  height: 28px;
  background: #F5F7FA;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Todo Section
.todo-section {
  margin: 0 16px 24px;
  animation: fadeInUp 0.5s ease-out both;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s ease;
  
  &:active {
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
}

.todo-priority {
  width: 4px;
  height: 40px;
  border-radius: 2px;
  margin-right: 14px;
  display: flex;
  align-items: center;
  
  .priority-dot {
    width: 100%;
    height: 8px;
    border-radius: 2px;
  }
  
  &.high {
    background: linear-gradient(180deg, #FF4D4F 0%, #FF7875 100%);
  }
  
  &.normal {
    background: linear-gradient(180deg, #FF9F00 0%, #FFC53D 100%);
  }
  
  &.low {
    background: linear-gradient(180deg, #86909C 0%, #C9CDD4 100%);
  }
}

.todo-content {
  flex: 1;
}

.todo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.todo-title {
  font-size: 15px;
  font-weight: 600;
  color: #1D2129;
}

.todo-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 10px;
  
  &.high {
    background: linear-gradient(135deg, #FFF2F0 0%, #FFCCC7 100%);
    color: #FF4D4F;
  }
  
  &.normal {
    background: linear-gradient(135deg, #FFF7E8 0%, #FFE7BA 100%);
    color: #FF9F00;
  }
  
  &.low {
    background: linear-gradient(135deg, #F5F7FA 0%, #E5E6EB 100%);
    color: #86909C;
  }
}

.todo-desc {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #86909C;
  
  .todo-time {
    margin-left: auto;
    font-size: 12px;
  }
}

.todo-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  border-radius: 50%;
  margin-left: 12px;
}

.empty-todo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  text {
    margin-top: 12px;
    font-size: 14px;
    color: #86909C;
  }
}

// Banner Section
.banner-section {
  margin: 0 16px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.5s ease-out both;
}
</style>
