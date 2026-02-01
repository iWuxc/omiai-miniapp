<template>
  <view class="container">
    <!-- 1) 顶部固定栏 (中式清晰感：白色背景 + 细微分割线) -->
    <view class="header-fixed fade-in">
      <view class="search-section">
        <u-search 
          placeholder="搜索姓名或手机号" 
          v-model="keyword" 
          :showAction="false" 
          bg-color="#F7F8FA" 
          height="40" 
          :border="false"
          @search="onSearch"
        ></u-search>
      </view>

      <!-- 2) 筛选栏 (品牌强调：珊瑚粉下划线) -->
      <view class="filter-section">
        <u-tabs 
          :list="tabs" 
          :current="currentTab" 
          @change="onTabChange" 
          :lineColor="primaryColor" 
          :activeColor="primaryColor" 
          inactiveColor="#86909C"
          :itemStyle="{ height: '44px', fontWeight: '500', fontSize: '15px' }"
        ></u-tabs>
      </view>
    </view>

    <!-- 3) 客户列表 (中式温润感：大圆角卡片 + 细致标签) -->
    <view class="client-list fade-in">
      <view class="client-card omiai-card" v-for="(item, index) in clientList" :key="index" @click="goDetail(item.id)">
        <view class="card-body">
          <view class="avatar-box">
            <u-avatar :src="item.avatar" size="64" shape="circle"></u-avatar>
            <view class="gender-icon" :class="item.gender === 1 ? 'male' : 'female'">
              <u-icon :name="item.gender === 1 ? 'man' : 'woman'" size="10" color="#fff"></u-icon>
            </view>
          </view>
          
          <view class="info-box">
            <view class="name-row">
              <text class="omiai-title-lg">{{ item.name }}</text>
              <view class="age-tag">{{ item.age }}岁</view>
            </view>
            
            <view class="detail-row">
              <text class="omiai-text-sm">{{ getEducationText(item.education) }}</text>
              <text class="separator">·</text>
              <text class="omiai-text-sm">{{ item.height }}cm</text>
              <text class="separator">·</text>
              <text class="omiai-text-sm">{{ item.income }}元</text>
            </view>
            
            <view class="tags-row">
              <text class="tag-item" v-if="item.profession">{{ item.profession }}</text>
              <text class="tag-item highlight" v-if="item.house_status === 1">有房</text>
            </view>
          </view>
          
          <view class="action-box">
             <u-icon name="arrow-right" color="#C0C4CC" size="16"></u-icon>
          </view>
        </view>
      </view>
      <u-loadmore :status="loadStatus" @loadmore="loadMore" color="#86909C" font-size="12" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getClientList, type Client } from '@/api/client';
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';

const primaryColor = '#FF5E78';
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
    uni.showToast({ title: '缺少客户ID', icon: 'none' });
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

const getEducationText = (level?: number) => {
  const map: any = { 1: '高中', 2: '大专', 3: '本科', 4: '硕士', 5: '博士' };
  return map[level ?? 0] || '未知';
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 100px;
  background-color: $omiai-bg-page;
}

.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: $omiai-white;
  box-shadow: 0 1px 0 $omiai-border;
  
  .search-section {
    padding: 12px 16px;
  }
  
  .filter-section {
    padding: 0 4px;
  }
}

.client-list {
  padding: 12px 16px;

  .client-card {
    margin-bottom: 12px;
    border: none;
    padding: 16px;
    background: $omiai-white;
    
    .card-body {
      display: flex;
      align-items: center;
    }

    .avatar-box {
      margin-right: 16px;
      position: relative;
      
      .gender-icon {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid #fff;
        
        &.male { background-color: $omiai-male; }
        &.female { background-color: $omiai-female; }
      }
    }

    .info-box {
      flex: 1;
      
      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        gap: 8px;
        
        .age-tag {
          font-size: 11px;
          color: $omiai-text-tip;
          background: $omiai-bg-page;
          padding: 1px 6px;
          border-radius: 4px;
        }
      }
      
      .detail-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        .separator {
          margin: 0 6px;
          color: $omiai-border;
          font-size: 12px;
        }
        
        text {
          color: $omiai-text-second;
        }
      }

      .tags-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        
        .tag-item {
          font-size: 11px;
          color: $omiai-text-second;
          background: $omiai-bg-page;
          padding: 2px 8px;
          border-radius: 4px;
          
          &.highlight {
            color: $omiai-primary;
            background: $omiai-primary-light;
          }
        }
      }
    }
    
    .action-box {
      margin-left: 8px;
    }
  }
}
</style>
