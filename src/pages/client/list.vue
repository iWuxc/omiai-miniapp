<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <u-search placeholder="输入姓名或手机号查找" v-model="keyword" :showAction="false" @search="onSearch"></u-search>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <u-tabs :list="tabs" :current="currentTab" @change="onTabChange" lineColor="#FF4D6A" activeColor="#FF4D6A"></u-tabs>
    </view>

    <!-- 客户列表 -->
    <view class="client-list">
      <view class="client-card" v-for="(item, index) in clientList" :key="index" @click="goDetail(item.id)">
        <view class="card-left">
          <u-avatar :src="item.avatar" size="50"></u-avatar>
        </view>
        <view class="card-center">
          <view class="name-row">
            <text class="name">{{ item.name }}</text>
            <u-icon :name="item.gender === 1 ? 'man' : 'woman'" :color="item.gender === 1 ? '#2979ff' : '#FF4D6A'" size="16"></u-icon>
            <text class="age" v-if="item.birthday">{{ calculateAge(item.birthday) }}岁</text>
          </view>
          <view class="tags-row">
            <u-tag :text="getEducationText(item.education)" size="mini" type="info" plain v-if="item.education"></u-tag>
            <u-tag :text="item.height + 'cm'" size="mini" type="info" plain v-if="item.height"></u-tag>
            <u-tag :text="item.income + '元'" size="mini" type="warning" plain v-if="item.income"></u-tag>
          </view>
        </view>
        <view class="card-right">
          <!-- 状态暂时写死 -->
          <u-tag text="待匹配" size="mini" type="primary"></u-tag>
        </view>
      </view>
      <u-loadmore :status="loadStatus" @loadmore="loadMore" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getClientList, type Client } from '@/api/client';
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';

const keyword = ref('');
const currentTab = ref(0);
const tabs = [{ name: '全部' }, { name: '男宾' }, { name: '女宾' }]; // VIP 暂未实现

const clientList = ref<Client[]>([]);
const page = ref(1);
const pageSize = 10;
const loadStatus = ref('loadmore'); // loadmore, loading, nomore

const fetchData = async (refresh = false) => {
  if (refresh) {
    page.value = 1;
    clientList.value = [];
    loadStatus.value = 'loadmore';
  }
  
  if (loadStatus.value === 'nomore') return;
  loadStatus.value = 'loading';

  try {
    const params: any = {
      page: page.value,
      page_size: pageSize,
      name: keyword.value
    };
    
    // Gender Filter
    if (currentTab.value === 1) params.gender = 1;
    if (currentTab.value === 2) params.gender = 2;

    const res: any = await getClientList(params);
    const list = res.list || [];
    
    if (list.length < pageSize) {
      loadStatus.value = 'nomore';
    } else {
      loadStatus.value = 'loadmore';
    }

    clientList.value = [...clientList.value, ...list];
    page.value++;
  } catch (e) {
    loadStatus.value = 'loadmore';
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    uni.stopPullDownRefresh();
  }
};

onMounted(() => {
  fetchData(true);
});

const onSearch = () => {
  fetchData(true);
};

const onTabChange = (item: any) => {
  currentTab.value = item.index;
  fetchData(true);
};

const goDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/client/detail?id=${id}` });
};

const loadMore = () => {
  fetchData();
};

onReachBottom(() => {
  fetchData();
});

onPullDownRefresh(() => {
  fetchData(true);
});

// Helper functions
const calculateAge = (birthday: string) => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const getEducationText = (level: number) => {
  const map: any = { 1: '高中', 2: '大专', 3: '本科', 4: '硕士', 5: '博士' };
  return map[level] || '未知';
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: $uni-bg-color;
}

.search-bar {
  background: #fff;
  padding: 10px 15px;
}

.filter-bar {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.client-list {
  padding: 10px 15px;

  .client-card {
    background: #fff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    .card-left {
      margin-right: 15px;
    }

    .card-center {
      flex: 1;
      
      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        
        .name {
          font-size: 16px;
          font-weight: bold;
          margin-right: 8px;
        }
        .age {
          font-size: 12px;
          color: #999;
          margin-left: 5px;
        }
      }

      .tags-row {
        display: flex;
        gap: 5px;
      }
    }
  }
}
</style>
