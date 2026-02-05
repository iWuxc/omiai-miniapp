<template>
  <view class="container">
    <view class="form-card omiai-card">
      <view class="section-title">
        <text>发起匹配申请</text>
      </view>
      
      <u-form :model="form" ref="uForm" labelPosition="top">
        <u-form-item label="发起方 (Initiator)" prop="initiator_name" borderBottom @click="openClientSelector('initiator')">
          <u-input v-model="form.initiator_name" placeholder="请选择发起方客户" readonly suffixIcon="arrow-right"></u-input>
        </u-form-item>
        
        <u-form-item label="目标方 (Target)" prop="target_name" borderBottom @click="openClientSelector('target')">
          <u-input v-model="form.target_name" placeholder="请选择目标方客户" readonly suffixIcon="arrow-right"></u-input>
        </u-form-item>
        
        <u-form-item label="申请留言" prop="message">
          <u-textarea v-model="form.message" placeholder="请输入申请留言（可选）" count></u-textarea>
        </u-form-item>
      </u-form>
      
      <view class="btn-group">
        <u-button type="primary" text="提交申请" shape="circle" @click="submit" :loading="loading"></u-button>
      </view>
    </view>

    <!-- Client Selector Modal -->
    <u-popup :show="showSelector" mode="bottom" @close="showSelector = false" round="16">
      <view class="selector-box">
        <view class="selector-header">
          <text class="title">选择客户</text>
          <u-icon name="close" @click="showSelector = false"></u-icon>
        </view>
        <view class="search-bar">
          <u-search placeholder="搜索客户姓名" v-model="searchKeyword" @search="onSearch" @custom="onSearch" :showAction="false"></u-search>
        </view>
        <scroll-view scroll-y class="client-list" @scrolltolower="loadMoreClients">
          <view v-for="item in clientList" :key="item.id" class="client-item" @click="selectClient(item)">
            <u-avatar :src="item.avatar" size="40"></u-avatar>
            <view class="info">
              <view class="name-row">
                <text class="name">{{ item.name }}</text>
                <u-tag :text="item.gender === 1 ? '男' : '女'" :type="item.gender === 1 ? 'primary' : 'error'" size="mini" plain></u-tag>
              </view>
              <text class="desc">{{ item.age }}岁 | {{ item.height }}cm | {{ item.profession || '未知职业' }}</text>
            </view>
            <u-icon name="checkbox-mark" color="#FF4D6A" v-if="isSelected(item)"></u-icon>
          </view>
          <u-loadmore :status="loadStatus"></u-loadmore>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getClientList } from '@/api/client';
import { confirmCouple } from '@/api/match';

const form = reactive({
  initiator_id: 0,
  initiator_name: '',
  target_id: 0,
  target_name: '',
  message: ''
});

const loading = ref(false);
const showSelector = ref(false);
const selectorType = ref<'initiator' | 'target'>('initiator');
const searchKeyword = ref('');
const clientList = ref<any[]>([]);
const page = ref(1);
const loadStatus = ref('loadmore');

const openClientSelector = (type: 'initiator' | 'target') => {
  selectorType.value = type;
  showSelector.value = true;
  searchKeyword.value = '';
  page.value = 1;
  clientList.value = [];
  fetchClients();
};

const fetchClients = async () => {
  loadStatus.value = 'loading';
  try {
    const res: any = await getClientList({
      page: page.value,
      page_size: 20,
      name: searchKeyword.value
    });
    const list = res.list || []; // Assuming res.list structure
    clientList.value = [...clientList.value, ...list];
    loadStatus.value = list.length < 20 ? 'nomore' : 'loadmore';
  } catch (e) {
    loadStatus.value = 'nomore';
  }
};

const onSearch = () => {
  page.value = 1;
  clientList.value = [];
  fetchClients();
};

const loadMoreClients = () => {
  if (loadStatus.value === 'loadmore') {
    page.value++;
    fetchClients();
  }
};

const selectClient = (client: any) => {
  if (selectorType.value === 'initiator') {
    if (client.id === form.target_id) {
      uni.showToast({ title: '发起方和目标方不能相同', icon: 'none' });
      return;
    }
    form.initiator_id = client.id;
    form.initiator_name = client.name;
  } else {
    if (client.id === form.initiator_id) {
      uni.showToast({ title: '发起方和目标方不能相同', icon: 'none' });
      return;
    }
    form.target_id = client.id;
    form.target_name = client.name;
  }
  showSelector.value = false;
};

const isSelected = (client: any) => {
  if (selectorType.value === 'initiator') return client.id === form.initiator_id;
  return client.id === form.target_id;
};

const submit = async () => {
  if (!form.initiator_id || !form.target_id) {
    uni.showToast({ title: '请选择双方客户', icon: 'none' });
    return;
  }
  
  loading.value = true;
  try {
    await confirmCouple({
      client_id: form.initiator_id,
      candidate_id: form.target_id,
      remark: form.message
    });
    uni.showToast({ title: '匹配确认成功' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (e) {
    // Error handled by request interceptor usually
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.form-card {
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
    border-left: 8rpx solid #FF4D6A;
    padding-left: 20rpx;
  }
  
  .btn-group {
    margin-top: 40rpx;
  }
}

.selector-box {
  height: 60vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  
  .selector-header {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
    }
  }
  
  .search-bar {
    padding: 20rpx;
    background-color: #f8f8f8;
  }
  
  .client-list {
    flex: 1;
    overflow-y: auto;
    
    .client-item {
      padding: 20rpx 30rpx;
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid #f5f5f5;
      
      .info {
        flex: 1;
        margin-left: 20rpx;
        
        .name-row {
          margin-bottom: 8rpx;
          .name {
            font-size: 30rpx;
            font-weight: bold;
            margin-right: 10rpx;
          }
        }
        
        .desc {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }
}
</style>