<template>
  <view class="container">
    <view class="nav-bar">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
      </view>
      <text class="nav-title">匹配对比</text>
    </view>

    <!-- Skeleton -->
    <view v-if="loading" class="skeleton-box">
       <u-skeleton rows="10" title loading></u-skeleton>
    </view>

    <scroll-view v-else scroll-y class="content">
      <!-- 1. Basic Info -->
      <view class="card">
        <view class="card-title">基础信息对比</view>
        <view class="compare-table">
           <view class="table-row header">
             <view class="col">指标</view>
             <view class="col">客户</view>
             <view class="col">候选人</view>
           </view>
           <view class="table-row" v-for="(val, key) in compareData.basic_info || {}" :key="key">
             <view class="col label">{{ getLabel(key) }}</view>
             <view class="col">{{ val.client }}</view>
             <view class="col">{{ val.candidate }}</view>
           </view>
        </view>
        <view class="diff-tags">
           <template v-for="(val, key) in compareData.basic_info || {}" :key="key">
              <view class="tag" v-if="val.diff">
                  {{ val.diff }}
              </view>
           </template>
        </view>
      </view>

      <!-- 2. Personality Radar -->
      <view class="card">
        <view class="card-title">性格模型 (Big Five)</view>
        <view class="radar-box">
           <!-- Simple SVG Radar -->
           <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              <!-- Background Polygons -->
              <polygon points="150,50 245,120 209,230 91,230 55,120" fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>
              <polygon points="150,100 197,135 179,190 121,190 103,135" fill="#fff" stroke="#eee" stroke-width="1"/>
              
              <!-- Data Polygons (Approximate for now, should calculate points) -->
              <polygon :points="clientPolygon" fill="rgba(64, 158, 255, 0.3)" stroke="#409EFF" stroke-width="2"/>
              <polygon :points="candidatePolygon" fill="rgba(255, 94, 120, 0.3)" stroke="#FF5E78" stroke-width="2"/>
           </svg>
           <view class="legend">
              <view class="item"><view class="dot blue"></view>客户</view>
              <view class="item"><view class="dot pink"></view>候选人</view>
           </view>
        </view>
      </view>

      <!-- 3. Interests -->
      <view class="card">
          <view class="card-title">兴趣重合度</view>
          <view class="text-center" style="padding: 20px; color: #666;">
              <view v-if="compareData.interests && compareData.interests.common_list && compareData.interests.common_list.length" class="tag-cloud">
                   <view class="tag highlight" v-for="tag in compareData.interests.common_list" :key="tag">{{ tag }}</view>
              </view>
              <view v-else>暂无共同兴趣</view>
          </view>
      </view>

      <!-- 4. Values -->
      <view class="card">
          <view class="card-title">价值观契合度</view>
           <view class="text-center" style="padding: 20px; color: #666;">
              <view v-if="compareData.values && compareData.values.details && compareData.values.details.length" class="value-list">
                   <view class="value-item" v-for="item in compareData.values.details" :key="item">
                      <u-icon name="checkmark-circle-fill" color="#19be6b" size="18"></u-icon>
                      <text style="margin-left: 8px;">{{ item }}</text>
                   </view>
              </view>
              <view v-else>暂无匹配详情</view>
          </view>
      </view>

      <!-- 5. Relationship Expectations -->
      <view class="card">
          <view class="card-title">关系预期</view>
          <view class="compare-table">
             <view class="table-row header">
               <view class="col">预期</view>
               <view class="col">客户</view>
               <view class="col">候选人</view>
             </view>
             <view class="table-row" v-for="(val, key) in compareData.relationship_expectations || {}" :key="key">
               <view class="col label">{{ getLabel(key) }}</view>
               <view class="col">{{ val.client }}</view>
               <view class="col">{{ val.candidate }}</view>
             </view>
          </view>
      </view>
      
      <!-- Bottom spacing for fixed footer -->
      <view style="height: 100px;"></view>
    </scroll-view>

    <view class="footer-actions">
        <u-button plain customStyle="flex: 1; margin-right: 12px;" @click="goBack">返回重选</u-button>
        <u-button type="primary" customStyle="flex: 1;" @click="confirm">确认匹配</u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getCompareResult, confirmCouple } from '@/api/match';

const clientId = ref(0);
const candidateId = ref(0);
const loading = ref(true);
const compareData = ref<any>({});
// Removed currentTab and tabList as we switched to single page layout

const clientPolygon = computed(() => {
   if (!compareData.value.personality_radar) return "";
   return calculatePolygon(compareData.value.personality_radar, 'client');
});

const candidatePolygon = computed(() => {
   if (!compareData.value.personality_radar) return "";
   return calculatePolygon(compareData.value.personality_radar, 'candidate');
});

const calculatePolygon = (data: any, type: string) => {
    const keys = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const center = { x: 150, y: 150 };
    const radius = 100;
    
    const points = keys.map((key, index) => {
        const value = data[key] ? data[key][type] : 0;
        const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2; // Start from top
        const r = (value / 100) * radius;
        const x = center.x + r * Math.cos(angle);
        const y = center.y + r * Math.sin(angle);
        return `${x},${y}`;
    });
    
    return points.join(' ');
};

onLoad((options: any) => {
  if (options.clientId && options.candidateId) {
    clientId.value = Number(options.clientId);
    candidateId.value = Number(options.candidateId);
    loadData();
  }
});

const loadData = async () => {
  loading.value = true;
  // Skeleton screen delay simulation if needed, but api might be fast
  try {
    const res = await getCompareResult(clientId.value, candidateId.value);
    compareData.value = res;
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const getLabel = (key: string | number) => {
  const map: any = {
    age: '年龄',
    height: '身高',
    education: '学历',
    income: '收入',
    short_term: '短期',
    long_term: '长期'
  };
  return map[key] || key;
};

const goBack = () => uni.navigateBack();

const confirm = async () => {
  try {
    await confirmCouple({
      client_id: clientId.value,
      candidate_id: candidateId.value
    });
    uni.showToast({ title: '匹配成功', icon: 'success' });
    setTimeout(() => {
       // Navigate to match list or detail
       // uni.switchTab({ url: '/pages/match/list' }); // Assuming there is a match list tab
       uni.navigateBack({ delta: 2 });
    }, 1500);
  } catch (e) {
    uni.showToast({ title: '确认失败', icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 44px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  overflow: hidden;
}
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-bottom: 1px solid #eee;
  .back-btn {
    position: absolute;
    left: 12px;
    padding: 10px;
  }
  .nav-title {
    font-size: 17px;
    font-weight: 500;
  }
}
.skeleton-box {
    padding: 60px 20px;
}
.content {
    flex: 1;
    height: 0; /* Important for scroll-view in flex container */
    width: 100%;
}
.card {
    margin: 20px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-radius: 12px;
    background: #fff;
    /* Add margin bottom to separate cards */
    margin-bottom: 20px;
}
/* Ensure the last card doesn't need extra margin if we have the spacer */
.card:last-child {
    margin-bottom: 20px; 
}

.card-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
}
.compare-table {
    .table-row {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #f5f5f5;
        &.header {
            font-weight: bold;
            background: #fafafa;
        }
        .col {
            flex: 1;
            text-align: center;
            font-size: 14px;
            &.label {
                color: #999;
            }
        }
    }
}
.diff-tags {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    .tag {
        background: #f0f9eb;
        color: #67c23a;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 4px;
    }
}
.tag-cloud {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    .tag {
        font-size: 14px;
        padding: 6px 16px;
        border-radius: 20px;
        background: #f4f4f5;
        color: #909399;
        &.highlight {
             background: #ecf5ff;
             color: #409eff;
        }
    }
}
.value-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .value-item {
        display: flex;
        align-items: center;
        font-size: 15px;
    }
}
.radar-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    .legend {
        display: flex;
        gap: 20px;
        margin-top: 20px;
        .item {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #666;
            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin-right: 4px;
                &.blue { background: #409EFF; }
                &.pink { background: #FF5E78; }
            }
        }
    }
}
.footer-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 20px;
    display: flex;
    border-top: 1px solid #eee;
    background: #fff;
    z-index: 99;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
</style>
