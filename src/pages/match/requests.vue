<template>
  <view class="container">
    <u-tabs :list="tabs" @change="onTabChange" :current="currentTab" activeColor="#FF4D6A"></u-tabs>
    
    <scroll-view scroll-y class="list-content" @scrolltolower="loadMore">
      <view v-for="item in list" :key="item.id" class="request-item omiai-card">
        <view class="header">
          <text class="time">{{ formatDate(item.created_at) }}</text>
          <u-tag text="待确认" type="warning" size="mini" v-if="item.status === 0"></u-tag>
          <u-tag text="已同意" type="success" size="mini" v-else-if="item.status === 1"></u-tag>
          <u-tag text="已拒绝" type="error" size="mini" v-else-if="item.status === 2"></u-tag>
        </view>
        
        <view class="content">
          <view class="client-box">
            <u-avatar :src="item.initiator?.avatar" size="40"></u-avatar>
            <view class="name">{{ item.initiator?.name }}</view>
            <view class="role">发起方</view>
          </view>
          
          <view class="arrow-box">
            <text class="message" v-if="item.message">"{{ item.message }}"</text>
            <u-icon name="arrow-right" color="#999" size="24"></u-icon>
          </view>
          
          <view class="client-box">
            <u-avatar :src="item.target?.avatar" size="40"></u-avatar>
            <view class="name">{{ item.target?.name }}</view>
            <view class="role">目标方</view>
          </view>
        </view>
        
        <view class="actions" v-if="item.status === 0">
          <u-button size="small" type="error" plain text="拒绝" @click="handleConfirm(item.id, 'reject')"></u-button>
          <u-button size="small" type="primary" text="同意" @click="handleConfirm(item.id, 'accept')"></u-button>
        </view>
      </view>
      
      <u-loadmore :status="loadStatus"></u-loadmore>
      <u-empty mode="data" v-if="list.length === 0 && !loading"></u-empty>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getMatchRequests, confirmMatch } from '@/api/match';

const tabs = [
  { name: '待处理', status: 0 },
  { name: '已同意', status: 1 },
  { name: '已拒绝', status: 2 }
];
const currentTab = ref(0);
const list = ref<any[]>([]);
const loading = ref(false);
const page = ref(1);
const loadStatus = ref('loadmore');

const fetchData = async (reset = false) => {
  if (reset) {
    page.value = 1;
    list.value = [];
  }
  loading.value = true;
  loadStatus.value = 'loading';
  try {
    const res: any = await getMatchRequests({
      page: page.value,
      page_size: 10,
      status: tabs[currentTab.value].status
    });
    const newList = res || [];
    list.value = [...list.value, ...newList];
    loadStatus.value = newList.length < 10 ? 'nomore' : 'loadmore';
  } catch (e) {
    loadStatus.value = 'nomore';
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchData());

const onTabChange = (item: any) => {
  currentTab.value = item.index;
  fetchData(true);
};

const loadMore = () => {
  if (loadStatus.value === 'loadmore') {
    page.value++;
    fetchData();
  }
};

const handleConfirm = async (id: number, action: 'accept' | 'reject') => {
  try {
    await confirmMatch({ request_id: id, action });
    uni.showToast({ title: action === 'accept' ? '已同意匹配' : '已拒绝申请' });
    // Refresh list
    setTimeout(() => {
      fetchData(true);
    }, 1000);
  } catch (e) {
    // Error handled
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString();
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.list-content {
  flex: 1;
  background-color: #f8f8f8;
  padding: 20rpx;
}

.request-item {
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    
    .time {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;
    
    .client-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 120rpx;
      
      .name {
        font-size: 28rpx;
        font-weight: bold;
        margin-top: 10rpx;
      }
      
      .role {
        font-size: 20rpx;
        color: #999;
        margin-top: 4rpx;
      }
    }
    
    .arrow-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 20rpx;
      
      .message {
        font-size: 24rpx;
        color: #666;
        text-align: center;
        margin-bottom: 10rpx;
        background-color: #f0f0f0;
        padding: 8rpx 16rpx;
        border-radius: 8rpx;
      }
    }
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
    border-top: 1rpx solid #f5f5f5;
    padding-top: 20rpx;
    
    u-button {
      margin: 0;
      width: 140rpx;
    }
  }
}
</style>