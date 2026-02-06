<template>
  <view class="container">
    <!-- 1) 顶部欢迎区 (高端简约：纯白背景 + 大标题) -->
    <view class="header-section fade-in">
      <view class="greeting">
        <view class="welcome-row">
          <text class="omiai-title-xl">早安，红娘姐姐</text>
          <!-- <view class="badge-role">专业顾问</view> -->
        </view>
        <text class="omiai-text-md date">今天是 {{ currentDate }}，又是充满希望的一天</text>
      </view>
      <view class="avatar-area" @click="navigateTo('/pages/profile/index')">
          <u-avatar text="M" size="48" fontSize="20" bg-color="#FF5E78"></u-avatar>
      </view>
    </view>

    <!-- 1.0) 待办提醒卡片 (新增) -->
    <TodoCard />

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
        bgColor="#F7F8FA"
        @click="onBannerClick"
      ></u-swiper>
    </view>

    <!-- 2) 数据概览 (轻量化卡片) -->
    <view class="stats-card fade-in">
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

    <!-- 3) 快捷功能 (网格卡片布局) -->
    <view class="section-title">快捷功能</view>
    <view class="action-grid fade-in">
      <view class="action-card" @click="navigateTo('/pages/form/index')">
        <view class="icon-box bg-pink">
          <u-icon name="edit-pen" :size="28" color="#FF5E78"></u-icon>
        </view>
        <text class="card-title">录入档案</text>
        <text class="card-desc">快速新建客户资料</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/client/list')">
        <view class="icon-box bg-blue">
          <u-icon name="search" :size="28" color="#4A90E2"></u-icon>
        </view>
        <text class="card-title">查找客户</text>
        <text class="card-desc">精准筛选匹配对象</text>
      </view>
      <view class="action-card" @click="shareInvite">
        <view class="icon-box bg-orange">
          <u-icon name="share" :size="28" color="#FF9F00"></u-icon>
        </view>
        <text class="card-title">邀请填写</text>
        <text class="card-desc">分享链接自助录入</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/match/list')">
        <view class="icon-box bg-green">
          <u-icon name="heart" :size="28" color="#52C41A"></u-icon>
        </view>
        <text class="card-title">情侣管理</text>
        <text class="card-desc">跟进牵手成功进度</text>
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
import TodoCard from '@/components/TodoCard.vue';

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
.container {
  padding: 20px 16px;
  background-color: $omiai-bg-page;
}

.header-section {
  padding: 44px 20px 24px;
  background: $omiai-white; /* Clean white */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  .greeting {
    .welcome-row {
      margin-bottom: 8px;
      .omiai-title-xl { 
          font-size: 24px; 
          font-weight: 700; 
          color: $omiai-text-main;
      }
    }
    .date {
      color: $omiai-text-tip;
      font-size: 13px;
    }
  }
}

.banner-section {
  margin: 0 20px 24px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: $omiai-shadow-sm;
}

.stats-card {
  margin: 0 20px 32px;
  display: flex;
  justify-content: space-between;
  background: transparent; /* Remove card bg for cleaner look or keep it? Reference 1 has clean stats */
  
  .stat-item {
    flex: 1;
    text-align: center;
    
    .num {
      font-size: 28px;
      font-weight: 700;
      color: $omiai-text-main;
      line-height: 1.2;
      font-family: 'DIN Alternate', sans-serif; /* Stylish font for numbers */
      
      &.highlight { color: $omiai-primary; }
    }
    
    .label {
      font-size: 12px;
      color: $omiai-text-second;
      margin-top: 4px;
    }
  }
}

.section-title {
    margin: 0 20px 16px;
    font-size: 18px;
    font-weight: 600;
    color: $omiai-text-main;
}

.action-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* 确保两列分布 */
  padding: 0 20px;
  gap: 12px; /* 纵向间距 */
  
  .action-card {
    width: 48%; /* 稍微小于 50% 以留出间隙 */
    /* width: calc(50% - 6px); 或者使用 calc 更精确 */
    background: $omiai-white;
    padding: 20px;
    border-radius: $omiai-radius-lg;
    box-shadow: $omiai-shadow-sm;
    margin-bottom: 0; /* 使用 gap 控制间距 */
    transition: all 0.2s ease;
    box-sizing: border-box; /* 确保 padding 不撑大宽度 */
    
    &:active { transform: scale(0.98); }
    
    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16px;
      
      &.bg-pink { background: #FFF0F2; }
      &.bg-orange { background: #FFF7E8; }
      &.bg-blue { background: #E8F3FF; }
      &.bg-green { background: #E8FFEA; }
    }
    
    .card-title {
        font-size: 16px;
        font-weight: 600;
        color: $omiai-text-main;
        display: block;
        margin-bottom: 4px;
    }
    
    .card-desc {
        font-size: 11px;
        color: $omiai-text-tip;
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
