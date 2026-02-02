<template>
  <view class="container">
    <!-- 1) 顶部欢迎区 (中式亲和力：暖色渐变背景) -->
    <view class="header-section fade-in">
      <view class="greeting">
        <view class="welcome-row">
          <text class="omiai-title-xl">早安，红娘姐姐</text>
          <view class="badge-role">专业顾问</view>
        </view>
        <text class="omiai-text-md date">今天是 {{ currentDate }}</text>
      </view>
    </view>

    <!-- 1.1) 轮播图区域 (Banner Section) -->
    <view class="banner-section fade-in" v-if="banners.length > 0">
      <u-swiper
        :list="banners"
        keyName="image_url"
        showTitle
        :autoplay="true"
        circular
        radius="16"
        height="160"
        @click="onBannerClick"
      ></u-swiper>
    </view>

    <!-- 2) 数据概览 (中式专业感：阴影卡片 + 强调色) -->
    <view class="stats-card omiai-card fade-in">
      <view class="stat-item">
        <text class="num">{{ stats.total || 0 }}</text>
        <text class="label">客户总数</text>
      </view>
      <view class="stat-item">
        <text class="num highlight">{{ stats.today || 0 }}</text>
        <text class="label">今日新增</text>
      </view>
      <view class="stat-item">
        <text class="num">{{ stats.pending || 0 }}</text>
        <text class="label">待匹配</text>
      </view>
    </view>

    <!-- 3) 快捷功能 (中式实用主义：彩色图标 + 圆润背景) -->
    <view class="action-grid fade-in">
      <view class="action-item" @click="navigateTo('/pages/form/index')">
        <view class="icon-wrapper bg-pink">
          <u-icon name="edit-pen" :size="24" color="#FF5E78"></u-icon>
        </view>
        <text class="grid-text">录入档案</text>
      </view>
      <view class="action-item" @click="shareInvite">
        <view class="icon-wrapper bg-orange">
          <u-icon name="share" :size="24" color="#FF9F00"></u-icon>
        </view>
        <text class="grid-text">邀请填写</text>
      </view>
      <view class="action-item" @click="navigateTo('/pages/client/list')">
        <view class="icon-wrapper bg-blue">
          <u-icon name="search" :size="24" color="#4A90E2"></u-icon>
        </view>
        <text class="grid-text">查找客户</text>
      </view>
      <view class="action-item" @click="navigateTo('/pages/match/list')">
        <view class="icon-wrapper bg-green">
          <u-icon name="heart" :size="24" color="#4CD964"></u-icon>
        </view>
        <text class="grid-text">情侣管理</text>
      </view>
    </view>

    <!-- 4) 待办事项 (中式清晰层次：左侧装饰条 + 列表) -->
    <view class="todo-section fade-in">
      <view class="section-header">
        <view class="title-row">
          <view class="title-line"></view>
          <text class="omiai-title-lg">今日待办</text>
        </view>
        <text class="more">查看全部</text>
      </view>
      <view class="todo-list">
        <view class="todo-item omiai-card">
           <view class="todo-content">
             <view class="todo-main">
               <text class="content omiai-text-md">王先生(ID:1024) 申请匹配</text>
               <view class="status-tag">急</view>
             </view>
             <text class="time omiai-text-sm">10分钟前更新</text>
           </view>
           <u-icon name="arrow-right" size="14" color="#C0C4CC"></u-icon>
        </view>
        <view class="todo-item omiai-card">
           <view class="todo-content">
             <view class="todo-main">
               <text class="content omiai-text-md">李女士 资料待审核</text>
             </view>
             <text class="time omiai-text-sm">30分钟前更新</text>
           </view>
           <u-icon name="arrow-right" size="14" color="#C0C4CC"></u-icon>
        </view>
      </view>
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

const currentDate = computed(() => {
  const date = new Date();
  return `${date.getMonth() + 1}月${date.getDate()}日`;
});

const fetchData = async () => {
  try {
    console.log('Fetching home data...');
    const [statsRes, bannerRes]: any = await Promise.all([
      getClientStats(),
      getBannerList()
    ]);
    console.log('Stats received:', statsRes);
    console.log('Banners received:', bannerRes);
    
    stats.value = statsRes || { total: 0, today: 0, pending: 0 };
    // Handle both { list: [] } and directly [] just in case
    banners.value = bannerRes?.list || (Array.isArray(bannerRes) ? bannerRes : []);
    
    console.log('Final banners count:', banners.value.length);
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
    '/pages/form/index'
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
.container {
  padding: 20px 16px;
  background-color: $omiai-bg-page;
}

.header-section {
  padding: 40px 20px 60px;
  background: linear-gradient(135deg, $omiai-primary, $omiai-primary-light);
  color: #fff;
  border-radius: 0 0 30px 30px;
  margin-bottom: 24px;
  
  .welcome-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    
    .badge-role {
      font-size: 10px;
      color: $omiai-primary;
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 100px;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  }
  
  .date {
    color: rgba(255, 255, 255, 0.8);
  }
}

.banner-section {
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: $omiai-shadow-sm;
}

.stats-card {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  border: none;
  background: $omiai-white;
  box-shadow: $omiai-shadow-md;
  
  .stat-item {
    flex: 1;
    text-align: center;
    position: relative;
    
    &:not(:last-child)::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background: $omiai-border;
    }
    
    .num {
      font-size: 24px;
      font-weight: 600;
      color: $omiai-text-main;
      line-height: 1.2;
      
      &.highlight {
        color: $omiai-primary;
      }
    }
    
    .label {
      font-size: 12px;
      color: $omiai-text-tip;
      margin-top: 6px;
      display: block;
    }
  }
}

.action-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 10px;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .icon-wrapper {
      width: 52px;
      height: 52px;
      border-radius: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
      box-shadow: $omiai-shadow-sm;
      
      &.bg-pink { background: #FFF0F2; }
      &.bg-orange { background: #FFF7E8; }
      &.bg-blue { background: #E8F3FF; }
      &.bg-green { background: #E8FFEA; }
    }
    
    .grid-text {
      font-size: 13px;
      font-weight: 500;
      color: $omiai-text-main;
    }
  }
}

.todo-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .title-line {
        width: 4px;
        height: 16px;
        background: $omiai-primary;
        border-radius: 2px;
      }
    }
    
    .more {
      font-size: 13px;
      color: $omiai-text-tip;
    }
  }
  
  .todo-list {
    .todo-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding: 16px;
      border: none;
      
      .todo-content {
        flex: 1;
        
        .todo-main {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          
          .content {
            font-weight: 500;
            color: $omiai-text-main;
          }
          
          .status-tag {
            font-size: 10px;
            color: $omiai-white;
            background: $omiai-error;
            padding: 1px 4px;
            border-radius: 2px;
          }
        }
        
        .time {
          color: $omiai-text-tip;
        }
      }
    }
  }
}
</style>
