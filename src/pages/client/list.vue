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
          :customStyle="{ flex: 1 }"
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

    <!-- 3) 客户列表 (Grid / Masonry Style) -->
    <view class="client-grid fade-in">
      <view class="grid-item" v-for="(item, index) in clientList" :key="index" @click="goDetail(item.id)">
        <view class="item-cover">
          <!-- Prefer first photo, then avatar, then placeholder -->
          <u-image 
            :src="getCoverImage(item)" 
            width="100%" 
            height="180px" 
            mode="aspectFill"
            radius="16px 16px 0 0"
          >
             <template #loading>
                <u-loading-icon color="#FF5E78"></u-loading-icon>
             </template>
          </u-image>
          
          <!-- Status Badge -->
          <view class="status-badge" v-if="item.status === 2">
            <text>匹配中</text>
          </view>
          
          <!-- Select Checkbox (Future use) -->
          <view class="select-check">
             <view class="circle"></view>
          </view>
        </view>
        
        <view class="item-info">
           <view class="info-header">
              <text class="name">{{ item.name }}</text>
              <view class="gender-dot" :class="item.gender === 1 ? 'male' : 'female'"></view>
           </view>
           
           <view class="info-tags">
              <text class="mini-tag">{{ item.age }}岁</text>
              <text class="mini-tag">{{ item.height }}cm</text>
              <text class="mini-tag">{{ getEducationText(item.education) }}</text>
           </view>
           
           <view class="info-footer">
              <text class="profession">{{ item.profession || '未填写职业' }}</text>
           </view>
        </view>
      </view>
    </view>
    <u-loadmore :status="loadStatus" @loadmore="loadMore" color="#C9CDD4" font-size="12" />

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

const defaultAvatar = 'https://cdn.uviewui.com/uview/album/1.jpg';

const getCoverImage = (item: Client) => {
    // Phase 2: Use uploaded photos if available
    // For now, use avatar or mock
    if (item.avatar) return item.avatar;
    if (item.id) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`; 
    return defaultAvatar;
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 96px; /* Adjusted for fixed header height */
  background-color: $omiai-bg-page;
  min-height: 100vh;
}

.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: $omiai-white;
  /* Removed border-bottom, use shadow */
  box-shadow: $omiai-shadow-sm; 
  padding-bottom: 8px;
  
  .search-section {
    padding: 12px 16px 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 50px; /* 增加顶部内边距，避开状态栏和胶囊按钮 */
    
    .filter-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        .filter-label {
            font-size: 10px;
            color: $omiai-text-second;
            margin-top: 2px;
        }
    }
  }
  
  .filter-section {
    padding: 0 12px;
  }
}

.client-grid {
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    .grid-item {
        width: 48%; /* 2 columns */
        background: $omiai-white;
        border-radius: $omiai-radius-lg;
        margin-bottom: 12px;
        overflow: hidden;
        box-shadow: $omiai-shadow-sm;
        transition: all 0.2s ease;
        
        &:active {
            transform: scale(0.98);
        }
        
        .item-cover {
            position: relative;
            background: #f5f5f5;
            
            .status-badge {
                position: absolute;
                top: 8px;
                left: 8px;
                background: rgba(0,0,0,0.6);
                padding: 4px 8px;
                border-radius: 4px;
                text {
                    color: #fff;
                    font-size: 10px;
                }
            }
            
            .select-check {
                position: absolute;
                top: 8px;
                right: 8px;
                .circle {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.8);
                    border: 1px solid rgba(0,0,0,0.1);
                }
            }
        }
        
        .item-info {
            padding: 12px;
            
            .info-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 6px;
                
                .name {
                    font-size: 15px;
                    font-weight: 600;
                    color: $omiai-text-main;
                    @include text-ellipsis;
                }
                
                .gender-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    &.male { background: $omiai-male; }
                    &.female { background: $omiai-female; }
                }
            }
            
            .info-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-bottom: 8px;
                
                .mini-tag {
                    font-size: 10px;
                    color: $omiai-text-second;
                    background: $omiai-bg-page;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
            }
            
            .info-footer {
                .profession {
                    font-size: 11px;
                    color: $omiai-text-tip;
                    @include text-ellipsis;
                }
            }
        }
    }
}

/* Mixin for ellipsis (Simple version if not in global) */
// @mixin text-ellipsis {
//     overflow: hidden;
//     white-space: nowrap;
//     text-overflow: ellipsis;
// }

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
