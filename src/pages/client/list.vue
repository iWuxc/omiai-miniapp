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

                 <!-- Work City -->
                 <view class="filter-group">
                    <text class="group-title">工作城市</text>
                    <u-input v-model="filterForm.work_city" placeholder="请输入城市名称" border="surround" fontSize="12"></u-input>
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
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';

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
    car_status: 0,
    work_city: ''
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
    filterForm.work_city = '';
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
  { name: '已拉手' }
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
      car_status: filterForm.car_status || undefined,
      work_city: filterForm.work_city || undefined
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

// #ifdef H5
import { onMounted } from 'vue';
onMounted(() => {
  fetchData(true);
});
// #endif

// #ifndef H5
import { onShow } from '@dcloudio/uni-app';
onShow(() => {
  fetchData(true);
});
// #endif

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
/* 页面进入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.container {
  padding-top: 100px;
  background-color: $omiai-bg-page;
  min-height: 100vh;
}

.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, $omiai-white 0%, rgba(255,255,255,0.98) 100%);
  box-shadow: $omiai-shadow-sm;
  padding-bottom: 12px;
  backdrop-filter: blur(10px);
  
  .search-section {
    padding: 12px 16px 10px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 52px;
    
    .filter-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      background: $omiai-primary-light;
      border-radius: $omiai-radius-md;
      transition: all 0.2s ease;
      
      &:active {
        transform: scale(0.95);
        background: linear-gradient(135deg, $omiai-primary-light 0%, rgba(255,94,120,0.15) 100%);
      }
      
      .filter-label {
        font-size: 10px;
        color: $omiai-primary;
        margin-top: 2px;
        font-weight: 500;
      }
    }
  }
  
  .filter-section {
    padding: 0 16px;
  }
}

.client-grid {
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  .grid-item {
    width: calc(50% - 6px);
    background: $omiai-white;
    border-radius: $omiai-radius-lg;
    margin-bottom: 16px;
    overflow: hidden;
    box-shadow: $omiai-shadow-sm;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.5s ease-out forwards;
    animation-delay: calc(var(--index, 0) * 0.05s);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: $omiai-shadow-md;
    }
    
    &:active {
      transform: scale(0.98) translateY(0);
      box-shadow: $omiai-shadow-xs;
    }
    
    .item-cover {
      position: relative;
      background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
      
      .status-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%);
        padding: 4px 10px;
        border-radius: 20px;
        backdrop-filter: blur(4px);
        
        text {
          color: #fff;
          font-size: 10px;
          font-weight: 500;
        }
      }
      
      .select-check {
        position: absolute;
        top: 10px;
        right: 10px;
        
        .circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          border: 2px solid rgba(255,94,120,0.3);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
      }
    }
    
    .item-info {
      padding: 14px;
      
      .info-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .name {
          font-size: 16px;
          font-weight: 600;
          color: $omiai-text-main;
          @include text-ellipsis;
        }
        
        .gender-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 4px currentColor;
          
          &.male { 
            background: linear-gradient(135deg, $omiai-male 0%, #6BB3FF 100%);
          }
          &.female { 
            background: linear-gradient(135deg, $omiai-female 0%, #FF8FB0 100%);
          }
        }
      }
      
      .info-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 10px;
        
        .mini-tag {
          font-size: 11px;
          color: $omiai-text-second;
          background: linear-gradient(135deg, $omiai-bg-page 0%, #f0f1f3 100%);
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 500;
        }
      }
      
      .info-footer {
        .profession {
          font-size: 12px;
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
