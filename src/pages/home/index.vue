<template>
  <view class="container">
    <!-- 顶部数据概览 -->
    <view class="header-section">
      <view class="greeting">
        <text class="title">早安，红娘姐姐</text>
        <text class="date">{{ currentDate }}</text>
      </view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="num">8,421</text>
          <text class="label">客户总数</text>
        </view>
        <view class="stat-item">
          <text class="num">+12</text>
          <text class="label">今日新增</text>
        </view>
        <view class="stat-item">
          <text class="num">5</text>
          <text class="label">待匹配</text>
        </view>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="action-section">
      <u-grid :col="3" :border="false">
        <u-grid-item @click="navigateTo('/pages/form/index')">
          <u-icon name="edit-pen" :size="32" color="#FF4D6A"></u-icon>
          <text class="grid-text">录入档案</text>
        </u-grid-item>
        <u-grid-item @click="shareInvite">
          <u-icon name="share" :size="32" color="#FFB800"></u-icon>
          <text class="grid-text">邀请填写</text>
        </u-grid-item>
        <u-grid-item @click="navigateTo('/pages/client/list')">
          <u-icon name="search" :size="32" color="#2979ff"></u-icon>
          <text class="grid-text">查找客户</text>
        </u-grid-item>
      </u-grid>
    </view>

    <!-- 待办事项 -->
    <view class="todo-section">
      <view class="section-title">今日待办</view>
      <u-cell-group>
        <u-cell title="王先生(ID:1024) 申请匹配" label="10分钟前" isLink></u-cell>
        <u-cell title="李女士 资料待审核" label="30分钟前" isLink></u-cell>
      </u-cell-group>
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
  padding-bottom: 20px;
}

.header-section {
  background: linear-gradient(135deg, #FF4D6A 0%, #FF8095 100%);
  padding: 40px 20px 60px;
  color: #fff;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  .greeting {
    margin-bottom: 20px;
    .title {
      font-size: 24px;
      font-weight: bold;
      display: block;
    }
    .date {
      font-size: 14px;
      opacity: 0.9;
    }
  }

  .stats-grid {
    display: flex;
    justify-content: space-between;
    .stat-item {
      text-align: center;
      .num {
        font-size: 28px;
        font-weight: bold;
        display: block;
      }
      .label {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }
}

.action-section {
  margin: -40px 15px 20px;
  background: #fff;
  border-radius: 12px;
  padding: 20px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  
  .grid-text {
    font-size: 12px;
    color: #666;
    margin-top: 8px;
  }
}

.todo-section {
  margin: 0 15px;
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  
  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    padding-left: 10px;
    border-left: 4px solid #FF4D6A;
  }
}
</style>
