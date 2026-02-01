<template>
  <view class="container">
    <view class="header-nav">
      <view class="search-box">
        <u-search placeholder="搜索姓名" v-model="keyword" @search="onSearch" @custom="onSearch"></u-search>
      </view>
      <u-tabs :list="tabs" @change="onTabChange" :current="currentTab" activeColor="#FF5E78" :scrollable="false"></u-tabs>
    </view>

    <scroll-view scroll-y class="list-content" @scrolltolower="loadMore">
      <view v-for="item in list" :key="item.id" class="match-item omiai-card fade-in" @click="goDetail(item.id)">
        <view class="couple-header">
          <view class="male">
            <u-avatar :src="item.male_client?.avatar" size="40"></u-avatar>
            <text class="name">{{ item.male_client?.name }}</text>
          </view>
          <view class="heart-icon">
            <u-icon name="heart-fill" color="#FF5E78" size="20"></u-icon>
            <view class="score">{{ item.match_score }}分</view>
          </view>
          <view class="female">
            <u-avatar :src="item.female_client?.avatar" size="40"></u-avatar>
            <text class="name">{{ item.female_client?.name }}</text>
          </view>
        </view>
        <view class="match-footer">
          <text class="date omiai-text-sm">{{ formatDate(item.match_date) }} 匹配</text>
          <u-tag :text="getStatusText(item.status)" :type="getStatusType(item.status)" size="mini"></u-tag>
        </view>
      </view>
      
      <u-loadmore :status="loadStatus" v-if="list.length > 0"></u-loadmore>
      <u-empty mode="data" v-if="list.length === 0 && !loading"></u-empty>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getMatchList } from '@/api/match';

const tabs = [
  { name: '全部', status: 0 },
  { name: '已匹配', status: 1 },
  { name: '已结婚', status: 3 },
  { name: '已分手', status: 2 }
];

const currentTab = ref(0);
const keyword = ref('');
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
  try {
    const res: any = await getMatchList({
      page: page.value,
      page_size: 10,
      status: tabs[currentTab.value].status,
      keyword: keyword.value
    });
    const newList = res || [];
    list.value = [...list.value, ...newList];
    loadStatus.value = newList.length < 10 ? 'nomore' : 'loadmore';
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchData());

const onTabChange = (item: any) => {
  currentTab.value = item.index;
  fetchData(true);
};

const onSearch = () => fetchData(true);

const loadMore = () => {
  if (loadStatus.value === 'loadmore') {
    page.value++;
    fetchData();
  }
};

const goDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/match/detail?id=${id}` });
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

const getStatusText = (status: number) => {
  const map: any = { 1: '已匹配', 2: '已分手', 3: '已结婚' };
  return map[status] || '未知';
};

const getStatusType = (status: number) => {
  const map: any = { 1: 'primary', 2: 'info', 3: 'success' };
  return map[status] || 'primary';
};
</script>

<style lang="scss" scoped>
.container {
  background-color: $omiai-bg-page;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-nav {
  background: #fff;
  padding: 10px 0 0;
  .search-box { padding: 0 16px 10px; }
}

.list-content {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
}

.match-item {
  margin-bottom: 16px;
  padding: 20px;
  
  .couple-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .male, .female {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      width: 80px;
      .name { font-weight: 600; font-size: 15px; }
    }
    
    .heart-icon {
      text-align: center;
      .score { font-size: 12px; color: $omiai-primary; margin-top: 4px; font-weight: 500; }
    }
  }
  
  .match-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #F2F3F5;
    padding-top: 12px;
    .date { color: $omiai-text-tip; }
  }
}
</style>
