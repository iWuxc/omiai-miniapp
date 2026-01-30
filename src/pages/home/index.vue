<template>
  <view class="container">
    <!-- 顶部欢迎区 (Clean Style) -->
    <view class="header-section">
      <view class="greeting">
        <text class="title">早安，红娘姐姐</text>
        <text class="date">{{ currentDate }}</text>
      </view>
    </view>

    <!-- 数据概览 (Minimalist Card) -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="num">8,421</text>
        <text class="label">客户总数</text>
      </view>
      <view class="divider"></view>
      <view class="stat-item">
        <text class="num highlight">+12</text>
        <text class="label">今日新增</text>
      </view>
      <view class="divider"></view>
      <view class="stat-item">
        <text class="num">5</text>
        <text class="label">待匹配</text>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="action-section">
      <u-grid :col="3" :border="false">
        <u-grid-item @click="navigateTo('/pages/form/index')">
          <view class="icon-box bg-red">
             <u-icon name="edit-pen" :size="24" color="#FF5E5E"></u-icon>
          </view>
          <text class="grid-text">录入档案</text>
        </u-grid-item>
        <u-grid-item @click="shareInvite">
          <view class="icon-box bg-orange">
            <u-icon name="share" :size="24" color="#FF9900"></u-icon>
          </view>
          <text class="grid-text">邀请填写</text>
        </u-grid-item>
        <u-grid-item @click="navigateTo('/pages/client/list')">
          <view class="icon-box bg-blue">
            <u-icon name="search" :size="24" color="#3E7BFA"></u-icon>
          </view>
          <text class="grid-text">查找客户</text>
        </u-grid-item>
      </u-grid>
    </view>

    <!-- 待办事项 -->
    <view class="todo-section">
      <view class="section-header">
        <text class="title">今日待办</text>
        <text class="more">查看全部</text>
      </view>
      <view class="todo-list">
        <view class="todo-item">
           <view class="dot"></view>
           <text class="content">王先生(ID:1024) 申请匹配</text>
           <text class="time">10分钟前</text>
        </view>
        <view class="todo-item">
           <view class="dot"></view>
           <text class="content">李女士 资料待审核</text>
           <text class="time">30分钟前</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const currentDate = computed(() => {
  const date = new Date();
  return `${date.getMonth() + 1}月${date.getDate()}日`;
});

const navigateTo = (url: string) => {
  uni.navigateTo({ url });
};

const shareInvite = () => {
  uni.setClipboardData({
    data: 'https://omiai.app/invite/123',
    success: () => {
      uni.showToast({ title: '邀请链接已复制' });
    }
  });
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: $uni-bg-color;
  padding: 20px;
}

.header-section {
  padding: 10px 0 20px;
  .greeting {
    .title {
      font-size: 24px;
      font-weight: 600;
      color: $uni-text-color;
      display: block;
      margin-bottom: 4px;
    }
    .date {
      font-size: 14px;
      color: $uni-text-color-grey;
    }
  }
}

.stats-card {
  background: #fff;
  border-radius: $uni-border-radius-base;
  padding: 25px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: $uni-shadow-base;
  margin-bottom: 20px;

  .stat-item {
    text-align: center;
    .num {
      font-size: 24px;
      font-weight: bold;
      color: $uni-text-color;
      display: block;
      margin-bottom: 4px;
      font-family: 'DIN Alternate', sans-serif;
      
      &.highlight {
        color: $uni-color-primary;
      }
    }
    .label {
      font-size: 12px;
      color: $uni-text-color-grey;
    }
  }
  
  .divider {
      width: 1px;
      height: 30px;
      background-color: #F0F0F0;
  }
}

.action-section {
  background: #fff;
  border-radius: $uni-border-radius-base;
  padding: 20px 0;
  box-shadow: $uni-shadow-base;
  margin-bottom: 20px;
  
  .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
      
      &.bg-red { background: rgba(255, 94, 94, 0.1); }
      &.bg-orange { background: rgba(255, 153, 0, 0.1); }
      &.bg-blue { background: rgba(62, 123, 250, 0.1); }
  }
  
  .grid-text {
    font-size: 13px;
    color: $uni-text-color;
    font-weight: 500;
  }
}

.todo-section {
  background: #fff;
  border-radius: $uni-border-radius-base;
  padding: 20px;
  box-shadow: $uni-shadow-base;
  
  .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      .title {
          font-size: 16px;
          font-weight: 600;
          color: $uni-text-color;
      }
      .more {
          font-size: 12px;
          color: $uni-text-color-grey;
      }
  }
  
  .todo-list {
      .todo-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #F8F9FB;
          
          &:last-child { border-bottom: none; }
          
          .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: $uni-color-primary;
              margin-right: 12px;
          }
          
          .content {
              flex: 1;
              font-size: 14px;
              color: $uni-text-color;
          }
          
          .time {
              font-size: 12px;
              color: $uni-text-color-placeholder;
          }
      }
  }
}
</style>
