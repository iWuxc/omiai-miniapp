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
          height="36" 
          :border="false"
          @search="onSearch"
          customStyle="flex: 1;"
        ></u-search>
        <!-- Filter Icon -->
        <view class="filter-btn" @click="showFilter = true">
            <u-icon name="list" color="#FF5E78" size="24"></u-icon>
            <text class="filter-label">筛选</text>
        </view>
      </view>

      <!-- 2) 筛选栏 (简化版：状态切换) -->
      <view class="filter-section">
        <u-subsection 
          :list="statusList" 
          :current="currentStatusIndex" 
          @change="onStatusChange"
          activeColor="#FF5E78"
          bgColor="#fff"
          mode="subsection"
        ></u-subsection>
      </view>
    </view>

    <!-- 3) 客户列表 -->
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
              <view class="status-tag" v-if="item.status === 2">匹配中</view>
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

    <!-- Filter Modal -->
    <u-popup :show="showFilter" mode="right" @close="showFilter = false" :customStyle="{width: '80%'}">
        <view class="filter-container">
            <view class="filter-header">
                <text class="title">高级筛选</text>
                <u-icon name="close" size="20" @click="showFilter = false"></u-icon>
            </view>
            <scroll-view scroll-y class="filter-body">
                <!-- Gender -->
                <view class="filter-group">
                    <text class="group-title">性别</text>
                    <view class="tag-group">
                        <view class="tag" :class="{active: filterForm.gender === 0}" @click="filterForm.gender = 0">全部</view>
                        <view class="tag" :class="{active: filterForm.gender === 1}" @click="filterForm.gender = 1">男</view>
                        <view class="tag" :class="{active: filterForm.gender === 2}" @click="filterForm.gender = 2">女</view>
                    </view>
                </view>

                <!-- Age -->
                <view class="filter-group">
                    <text class="group-title">年龄 (岁)</text>
                    <view class="range-box">
                        <u-input v-model="filterForm.min_age" type="number" placeholder="最小" border="surround" fontSize="12" inputAlign="center"></u-input>
                        <text class="dash">-</text>
                        <u-input v-model="filterForm.max_age" type="number" placeholder="最大" border="surround" fontSize="12" inputAlign="center"></u-input>
                    </view>
                </view>

                <!-- Height -->
                <view class="filter-group">
                    <text class="group-title">身高 (cm)</text>
                    <view class="range-box">
                        <u-input v-model="filterForm.min_height" type="number" placeholder="最小" border="surround" fontSize="12" inputAlign="center"></u-input>
                        <text class="dash">-</text>
                        <u-input v-model="filterForm.max_height" type="number" placeholder="最大" border="surround" fontSize="12" inputAlign="center"></u-input>
                    </view>
                </view>

                <!-- Education -->
                <view class="filter-group">
                    <text class="group-title">最低学历</text>
                    <view class="tag-group">
                        <view class="tag" :class="{active: filterForm.education === 0}" @click="filterForm.education = 0">不限</view>
                        <view class="tag" :class="{active: filterForm.education === 2}" @click="filterForm.education = 2">大专</view>
                        <view class="tag" :class="{active: filterForm.education === 3}" @click="filterForm.education = 3">本科</view>
                        <view class="tag" :class="{active: filterForm.education === 4}" @click="filterForm.education = 4">硕士</view>
                    </view>
                </view>

                 <!-- Marital Status -->
                 <view class="filter-group">
                    <text class="group-title">婚姻状况</text>
                    <view class="tag-group">
                        <view class="tag" :class="{active: filterForm.marital_status === 0}" @click="filterForm.marital_status = 0">不限</view>
                        <view class="tag" :class="{active: filterForm.marital_status === 1}" @click="filterForm.marital_status = 1">未婚</view>
                        <view class="tag" :class="{active: filterForm.marital_status === 2}" @click="filterForm.marital_status = 2">已婚</view>
                        <view class="tag" :class="{active: filterForm.marital_status === 3}" @click="filterForm.marital_status = 3">离异</view>
                    </view>
                </view>
                
                 <!-- Income -->
                 <view class="filter-group">
                    <text class="group-title">最低月收入 (元)</text>
                    <u-input v-model="filterForm.min_income" type="number" placeholder="请输入金额" border="surround" fontSize="12"></u-input>
                </view>

            </scroll-view>
            <view class="filter-footer">
                <u-button plain text="重置" @click="resetFilter" customStyle="flex: 1; margin-right: 12px;"></u-button>
                <u-button type="primary" text="确定" @click="applyFilter" customStyle="flex: 1; background: #FF5E78; border-color: #FF5E78;"></u-button>
            </view>
        </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getClientList, type Client } from '@/api/client';
import { onReachBottom, onPullDownRefresh, onShow } from '@dcloudio/uni-app';

const primaryColor = '#FF5E78';
const keyword = ref('');
const showFilter = ref(false);

const filterForm = reactive({
    gender: 0,
    min_age: '',
    max_age: '',
    min_height: '',
    max_height: '',
    education: 0,
    min_income: '',
    marital_status: 0,
    house_status: 0,
    car_status: 0
});

const resetFilter = () => {
    filterForm.gender = 0;
    filterForm.min_age = '';
    filterForm.max_age = '';
    filterForm.min_height = '';
    filterForm.max_height = '';
    filterForm.education = 0;
    filterForm.min_income = '';
    filterForm.marital_status = 0;
    filterForm.house_status = 0;
    filterForm.car_status = 0;
};

const applyFilter = () => {
    showFilter.value = false;
    fetchData(true);
};

// 单人模式：移除公海池Tab，改为状态筛选
const statusList = [
  { name: '全部' }, 
  { name: '单身' }, 
  { name: '匹配中' },
  { name: '已成单' }
];
const currentStatusIndex = ref(0);

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
      name: keyword.value,
      // 映射索引到状态值: 0->全部, 1->1(单身), 2->2(匹配中), 3->3(已匹配)
      status: currentStatusIndex.value === 0 ? undefined : currentStatusIndex.value,
      gender: filterForm.gender || undefined,
      min_age: filterForm.min_age || undefined,
      max_age: filterForm.max_age || undefined,
      min_height: filterForm.min_height || undefined,
      max_height: filterForm.max_height || undefined,
      education: filterForm.education || undefined,
      min_income: filterForm.min_income || undefined,
      marital_status: filterForm.marital_status || undefined,
      house_status: filterForm.house_status || undefined,
      car_status: filterForm.car_status || undefined
    };
    
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

onShow(() => {
  fetchData(true);
});

const onSearch = () => {
  fetchData(true);
};

const onStatusChange = (index: number) => {
  currentStatusIndex.value = index;
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

.filter-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    
    .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid $omiai-border;
        .title { font-size: 16px; font-weight: 600; }
    }
    
    .filter-body {
        flex: 1;
        padding: 16px;
        
        .filter-group {
            margin-bottom: 24px;
            
            .group-title {
                font-size: 14px;
                color: $omiai-text-main;
                font-weight: 500;
                margin-bottom: 12px;
                display: block;
            }
            
            .tag-group {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                
                .tag {
                    padding: 6px 16px;
                    background: $omiai-bg-page;
                    border-radius: 4px;
                    font-size: 13px;
                    color: $omiai-text-second;
                    
                    &.active {
                        background: #FFF0F2;
                        color: $omiai-primary;
                        font-weight: 500;
                    }
                }
            }
            
            .range-box {
                display: flex;
                align-items: center;
                gap: 10px;
                .dash { color: $omiai-text-tip; }
            }
        }
    }
    
    .filter-footer {
        padding: 16px;
        border-top: 1px solid $omiai-border;
        display: flex;
    }
}
</style>
