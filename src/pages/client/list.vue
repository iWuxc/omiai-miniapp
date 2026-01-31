<template>
  <view class="container">
    <!-- 搜索栏 (Floating Style) -->
    <view class="search-bar">
      <u-search placeholder="搜索姓名或手机号" v-model="keyword" :showAction="false" bg-color="#F5F7FA" height="36" @search="onSearch"></u-search>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <u-tabs :list="tabs" :current="currentTab" @change="onTabChange" 
        lineColor="#FF5E5E" 
        activeColor="#FF5E5E" 
        inactiveColor="#909399"
        :itemStyle="{ height: '44px' }"
      ></u-tabs>
    </view>

    <!-- 客户列表 -->
    <view class="client-list">
      <view class="client-card" v-for="(item, index) in clientList" :key="index" @click="goDetail(item.id)">
        <view class="card-left">
          <u-avatar :src="item.avatar" size="48" :sex-icon="item.gender === 1 ? 'man' : 'woman'"></u-avatar>
        </view>
        <view class="card-center">
          <view class="header-row">
            <text class="name">{{ item.name }}</text>
            <view class="status-badge" :class="item.gender === 1 ? 'male' : 'female'">
              <u-icon :name="item.gender === 1 ? 'man' : 'woman'" size="10" color="#fff"></u-icon>
              <text class="age">{{ calculateAge(item.birthday) }}岁</text>
            </view>
          </view>
          
          <view class="info-row">
            <text>{{ getEducationText(item.education) }}</text>
            <text class="divider">·</text>
            <text>{{ item.height }}cm</text>
            <text class="divider">·</text>
            <text>{{ item.income }}元</text>
          </view>
          
          <view class="tags-row">
            <view class="tag" v-if="item.profession">{{ item.profession }}</view>
            <view class="tag" v-if="item.house_status === 1">有房</view>
          </view>
        </view>
        
        <view class="card-right">
           <u-icon name="arrow-right" color="#DCDFE6" size="16"></u-icon>
        </view>
      </view>
      <u-loadmore :status="loadStatus" @loadmore="loadMore" color="#C0C4CC" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getClientList, type Client } from '@/api/client';
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';

const keyword = ref('');
const currentTab = ref(0);
const tabs = [{ name: '全部' }, { name: '男宾' }, { name: '女宾' }];

const clientList = ref<Client[]>([]);
const page = ref(1);
const pageSize = 10;
const loadStatus = ref('loadmore');

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

const goDetail = (id?: number) => {
  if (!id) {
    uni.showToast({ title: '缺少客户信息', icon: 'none' });
    return;
  }
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

const calculateAge = (birthday: string) => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const getEducationText = (level?: number) => {
  const map: any = { 1: '高中', 2: '大专', 3: '本科', 4: '硕士', 5: '博士' };
  return map[level ?? 0] || '未知';
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: $uni-bg-color;
}

.search-bar {
  background: #fff;
  padding: 8px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.filter-bar {
  background: #fff;
  border-bottom: 1px solid #F2F3F5;
  margin-bottom: 10px;
}

.client-list {
  padding: 0 16px 16px;

  .client-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: flex-start;
    box-shadow: $uni-shadow-base;
    transition: all 0.2s;
    
    &:active {
        transform: scale(0.98);
    }

    .card-left {
      margin-right: 12px;
    }

    .card-center {
      flex: 1;
      
      .header-row {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        
        .name {
          font-size: 16px;
          font-weight: 600;
          color: $uni-text-color;
          margin-right: 8px;
        }
        
        .status-badge {
            display: flex;
            align-items: center;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 10px;
            color: #fff;
            
            &.male { background: #3E7BFA; }
            &.female { background: #FF5E5E; }
            
            .age { margin-left: 2px; }
        }
      }
      
      .info-row {
          font-size: 13px;
          color: $uni-text-color-grey;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          
          .divider {
              margin: 0 6px;
              color: #E4E7ED;
              font-weight: bold;
          }
      }

      .tags-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        
        .tag {
            font-size: 11px;
            color: #606266;
            background: #F5F7FA;
            padding: 2px 8px;
            border-radius: 4px;
        }
      }
    }
    
    .card-right {
        display: flex;
        align-items: center;
        align-self: center;
        margin-left: 8px;
    }
  }
}
</style>
