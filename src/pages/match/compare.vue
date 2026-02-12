<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#1D2129"></u-icon>
        </view>
        <text class="nav-title">匹配对比</text>
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 骨架屏 -->
    <view v-if="loading" class="skeleton-container">
      <view v-for="i in 3" :key="i" class="skeleton-card">
        <view class="skeleton-header"></view>
        <view class="skeleton-body">
          <view class="skeleton-line"></view>
          <view class="skeleton-line short"></view>
        </view>
      </view>
    </view>

    <scroll-view v-else scroll-y class="content" enhanced show-scrollbar>
      <!-- 对比头部 -->
      <view class="compare-header">
        <view class="client-box">
          <view class="avatar-wrapper">
            <u-avatar :src="compareData.client?.avatar" size="70" shape="circle"></u-avatar>
            <view class="avatar-badge client-badge">客户</view>
          </view>
          <text class="client-name">{{ compareData.client?.name || '客户' }}</text>
        </view>
        
        <view class="vs-section">
          <view class="vs-badge">VS</view>
          <view class="match-score" v-if="compareData.match_score">
            <text class="score-value">{{ compareData.match_score }}%</text>
            <text class="score-label">匹配度</text>
          </view>
        </view>
        
        <view class="client-box">
          <view class="avatar-wrapper">
            <u-avatar :src="compareData.candidate?.avatar" size="70" shape="circle"></u-avatar>
            <view class="avatar-badge candidate-badge">候选</view>
          </view>
          <text class="client-name">{{ compareData.candidate?.name || '候选人' }}</text>
        </view>
      </view>

      <!-- 1. Basic Info -->
      <view class="card" :style="{ animationDelay: '0ms' }">
        <view class="card-header">
          <view class="header-icon bg-blue">
            <u-icon name="file-text-fill" size="18" color="#4A90E2"></u-icon>
          </view>
          <text class="card-title">基础信息对比</text>
        </view>
        
        <view class="compare-table">
           <view class="table-row header">
             <view class="col indicator">
               <u-icon name="list" size="14" color="#86909C"></u-icon>
               <text>指标</text>
             </view>
             <view class="col client-col">
               <u-icon name="man-add" size="14" color="#4A90E2"></u-icon>
               <text>客户</text>
             </view>
             <view class="col candidate-col">
               <u-icon name="woman" size="14" color="#FF5E78"></u-icon>
               <text>候选人</text>
             </view>
           </view>
           <view 
             class="table-row" 
             v-for="(val, key) in compareData.basic_info || {}" 
             :key="key"
             :class="{ 'has-diff': val.diff }"
           >
             <view class="col indicator">{{ getLabel(key) }}</view>
             <view class="col client-col">{{ val.client }}</view>
             <view class="col candidate-col" :class="{ highlight: val.diff }">{{ val.candidate }}</view>
           </view>
        </view>
        
        <view class="diff-section" v-if="hasDifferences">
          <view class="diff-title">
            <u-icon name="info-circle" size="14" color="#FF9F00"></u-icon>
            <text>差异说明</text>
          </view>
          <view class="diff-tags">
             <template v-for="(val, key) in compareData.basic_info || {}" :key="key">
                <view class="diff-tag" v-if="val.diff">
                  <text class="diff-label">{{ getLabel(key) }}:</text>
                  <text class="diff-content">{{ val.diff }}</text>
                </view>
             </template>
          </view>
        </view>
      </view>

      <!-- 2. Personality Radar -->
      <view class="card radar-card" :style="{ animationDelay: '100ms' }">
        <view class="card-header">
          <view class="header-icon bg-purple">
            <u-icon name="grid-fill" size="18" color="#722ED1"></u-icon>
          </view>
          <text class="card-title">性格模型 (Big Five)</text>
        </view>
        
        <view class="radar-container">
           <view class="radar-wrapper">
             <svg width="280" height="280" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
                <!-- Background Grid -->
                <g class="grid-lines">
                  <polygon points="140,30 235,100 199,210 81,210 45,100" fill="none" stroke="#F0F0F0" stroke-width="1"/>
                  <polygon points="140,60 205,110 179,180 101,180 75,110" fill="none" stroke="#F0F0F0" stroke-width="1"/>
                  <polygon points="140,90 175,120 159,150 121,150 105,120" fill="none" stroke="#F0F0F0" stroke-width="1"/>
                </g>
                
                <!-- Axis Lines -->
                <g class="axis-lines">
                  <line x1="140" y1="140" x2="140" y2="30" stroke="#E5E6EB" stroke-width="1"/>
                  <line x1="140" y1="140" x2="235" y2="100" stroke="#E5E6EB" stroke-width="1"/>
                  <line x1="140" y1="140" x2="199" y2="210" stroke="#E5E6EB" stroke-width="1"/>
                  <line x1="140" y1="140" x2="81" y2="210" stroke="#E5E6EB" stroke-width="1"/>
                  <line x1="140" y1="140" x2="45" y2="100" stroke="#E5E6EB" stroke-width="1"/>
                </g>
                
                <!-- Labels -->
                <g class="labels">
                  <text x="140" y="22" text-anchor="middle" font-size="12" fill="#86909C">开放性</text>
                  <text x="245" y="105" text-anchor="start" font-size="12" fill="#86909C">责任心</text>
                  <text x="205" y="225" text-anchor="start" font-size="12" fill="#86909C">外向性</text>
                  <text x="75" y="225" text-anchor="end" font-size="12" fill="#86909C">宜人性</text>
                  <text x="35" y="105" text-anchor="end" font-size="12" fill="#86909C">神经质</text>
                </g>
                
                <!-- Data Polygons -->
                <polygon :points="clientPolygon" fill="rgba(74, 144, 226, 0.25)" stroke="#4A90E2" stroke-width="2.5"/>
                <polygon :points="candidatePolygon" fill="rgba(255, 94, 120, 0.25)" stroke="#FF5E78" stroke-width="2.5"/>
             </svg>
           </view>
           
           <view class="radar-legend">
              <view class="legend-item">
                <view class="legend-dot blue"></view>
                <text class="legend-text">客户</text>
              </view>
              <view class="legend-item">
                <view class="legend-dot pink"></view>
                <text class="legend-text">候选人</text>
              </view>
           </view>
        </view>
      </view>

      <!-- 3. Interests -->
      <view class="card" :style="{ animationDelay: '200ms' }">
        <view class="card-header">
          <view class="header-icon bg-orange">
            <u-icon name="heart-fill" size="18" color="#FF9F00"></u-icon>
          </view>
          <text class="card-title">兴趣重合度</text>
        </view>
        
        <view class="interests-content">
          <view v-if="compareData.interests?.common_list?.length" class="interests-match">
            <view class="match-header">
              <text class="match-title">共同兴趣</text>
              <view class="match-badge">
                <text>{{ compareData.interests.common_list.length }}个</text>
              </view>
            </view>
            <view class="tag-cloud">
               <view class="tag-item" v-for="(tag, idx) in compareData.interests.common_list" :key="idx">
                 <u-icon name="checkmark-circle" size="14" color="#52C41A"></u-icon>
                 <text>{{ tag }}</text>
               </view>
            </view>
          </view>
          <view v-else class="empty-interests">
            <u-icon name="info-circle" size="40" color="#C0C4CC"></u-icon>
            <text>暂无共同兴趣标签</text>
          </view>
        </view>
      </view>

      <!-- 4. Values -->
      <view class="card" :style="{ animationDelay: '300ms' }">
        <view class="card-header">
          <view class="header-icon bg-green">
            <u-icon name="star-fill" size="18" color="#52C41A"></u-icon>
          </view>
          <text class="card-title">价值观契合度</text>
        </view>
        
        <view class="values-content">
          <view v-if="compareData.values?.details?.length" class="values-list">
             <view class="value-item" v-for="(item, idx) in compareData.values.details" :key="idx" :style="{ animationDelay: `${idx * 50}ms` }">
                <view class="value-icon">
                  <u-icon name="checkmark-circle-fill" color="#52C41A" size="22"></u-icon>
                </view>
                <text class="value-text">{{ item }}</text>
             </view>
          </view>
          <view v-else class="empty-values">
            <u-icon name="info-circle" size="40" color="#C0C4CC"></u-icon>
            <text>暂无匹配详情</text>
          </view>
        </view>
      </view>

      <!-- 5. Relationship Expectations -->
      <view class="card" :style="{ animationDelay: '400ms' }">
        <view class="card-header">
          <view class="header-icon bg-pink">
            <u-icon name="eye-fill" size="18" color="#FF5E78"></u-icon>
          </view>
          <text class="card-title">关系预期</text>
        </view>
        
        <view class="expectation-content">
          <view class="exp-list">
             <view class="exp-item" v-for="(val, key) in compareData.relationship_expectations || {}" :key="key">
                <view class="exp-label">{{ getLabel(key) }}</view>
                <view class="exp-values">
                  <view class="exp-box client">
                    <u-icon name="man-add" size="12" color="#4A90E2"></u-icon>
                    <text>{{ val.client }}</text>
                  </view>
                  <view class="exp-divider">
                    <u-icon name="swap" size="12" color="#C0C4CC"></u-icon>
                  </view>
                  <view class="exp-box candidate">
                    <u-icon name="woman" size="12" color="#FF5E78"></u-icon>
                    <text>{{ val.candidate }}</text>
                  </view>
                </view>
             </view>
          </view>
        </view>
      </view>
      
      <!-- 底部间距 -->
      <view style="height: 120px;"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="footer-actions">
      <view class="action-btn secondary" @click="goBack">
        <u-icon name="arrow-left" size="16" color="#4E5969"></u-icon>
        <text>返回重选</text>
      </view>
      <view class="action-btn primary" @click="confirm">
        <u-icon name="checkmark" size="16" color="#fff"></u-icon>
        <text>确认匹配</text>
      </view>
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

const hasDifferences = computed(() => {
  if (!compareData.value.basic_info) return false;
  return Object.values(compareData.value.basic_info).some((val: any) => val.diff);
});

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
    const center = { x: 140, y: 140 };
    const radius = 110;
    
    const points = keys.map((key, index) => {
        const value = data[key] ? data[key][type] : 0;
        const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
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
    short_term: '短期目标',
    long_term: '长期规划'
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
       uni.navigateBack({ delta: 2 });
    }, 1500);
  } catch (e) {
    uni.showToast({ title: '确认失败', icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
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

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F7FA 0%, #ffffff 20%, #F5F7FA 100%);
  display: flex;
  flex-direction: column;
}

// Navigation
.nav-bar {
  background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.98) 100%);
  padding: 48px 16px 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #F5F7FA;
  
  &:active {
    background: #E5E6EB;
    transform: scale(0.95);
  }
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #1D2129;
}

.nav-right {
  width: 36px;
}

// Skeleton
.skeleton-container {
  padding: 16px;
  flex: 1;
}

.skeleton-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .skeleton-header {
    height: 20px;
    width: 40%;
    background: linear-gradient(90deg, #F2F3F5 25%, #E5E6EB 50%, #F2F3F5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  
  .skeleton-line {
    height: 14px;
    background: linear-gradient(90deg, #F2F3F5 25%, #E5E6EB 50%, #F2F3F5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 10px;
    
    &.short {
      width: 60%;
    }
  }
}

// Content
.content {
  flex: 1;
  padding: 16px;
}

// Compare Header
.compare-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #fff 0%, #FFFAFB 100%);
  border-radius: 20px;
  padding: 24px 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.client-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.avatar-badge {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 10px;
  white-space: nowrap;
  
  &.client-badge {
    background: linear-gradient(135deg, #4A90E2 0%, #6BB3FF 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
  }
  
  &.candidate-badge {
    background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
    color: #fff;
    box-shadow: 0 2px 8px rgba(255, 94, 120, 0.3);
  }
}

.client-name {
  font-size: 15px;
  font-weight: 600;
  color: #1D2129;
}

.vs-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px;
}

.vs-badge {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(255, 94, 120, 0.35);
  margin-bottom: 8px;
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .score-value {
    font-size: 20px;
    font-weight: 700;
    color: #FF5E78;
  }
  
  .score-label {
    font-size: 11px;
    color: #86909C;
  }
}

// Cards
.card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.5s ease-out both;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.bg-blue {
    background: linear-gradient(135deg, #E8F3FF 0%, rgba(74, 144, 226, 0.12) 100%);
  }
  
  &.bg-purple {
    background: linear-gradient(135deg, #F3E8FF 0%, rgba(114, 46, 209, 0.12) 100%);
  }
  
  &.bg-orange {
    background: linear-gradient(135deg, #FFF7E8 0%, rgba(255, 159, 0, 0.12) 100%);
  }
  
  &.bg-green {
    background: linear-gradient(135deg, #E8FFEA 0%, rgba(82, 196, 26, 0.12) 100%);
  }
  
  &.bg-pink {
    background: linear-gradient(135deg, #FFF0F2 0%, rgba(255, 94, 120, 0.12) 100%);
  }
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: #1D2129;
}

// Compare Table
.compare-table {
  .table-row {
    display: flex;
    padding: 14px 0;
    border-bottom: 1px solid #F2F3F5;
    transition: background 0.2s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &.header {
      background: linear-gradient(135deg, #F5F7FA 0%, #F2F3F5 100%);
      border-radius: 12px;
      padding: 12px 0;
      margin-bottom: 8px;
      border-bottom: none;
      
      .col {
        font-weight: 600;
        color: #4E5969;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
    }
    
    &.has-diff {
      background: linear-gradient(90deg, rgba(255, 159, 0, 0.05) 0%, transparent 100%);
      border-radius: 8px;
    }
    
    .col {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #4E5969;
      
      &.indicator {
        color: #86909C;
        font-weight: 500;
      }
      
      &.client-col {
        color: #4A90E2;
        font-weight: 500;
      }
      
      &.candidate-col {
        color: #FF5E78;
        font-weight: 500;
      }
      
      &.highlight {
        background: linear-gradient(135deg, #FFF7E8 0%, #FFE7BA 100%);
        border-radius: 8px;
        padding: 4px 0;
      }
    }
  }
}

// Diff Section
.diff-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #E5E6EB;
}

.diff-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #FF9F00;
  margin-bottom: 12px;
}

.diff-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.diff-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #FFF7E8 0%, #FFE7BA 100%);
  padding: 8px 14px;
  border-radius: 10px;
  
  .diff-label {
    font-size: 12px;
    color: #86909C;
    font-weight: 500;
  }
  
  .diff-content {
    font-size: 13px;
    color: #FF9F00;
    font-weight: 600;
  }
}

// Radar Card
.radar-card {
  .radar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .radar-wrapper {
    padding: 10px;
  }
  
  .radar-legend {
    display: flex;
    gap: 24px;
    margin-top: 16px;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      
      &.blue {
        background: linear-gradient(135deg, #4A90E2 0%, #6BB3FF 100%);
        box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
      }
      
      &.pink {
        background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
        box-shadow: 0 2px 8px rgba(255, 94, 120, 0.3);
      }
    }
    
    .legend-text {
      font-size: 14px;
      color: #4E5969;
      font-weight: 500;
    }
  }
}

// Interests
.interests-content {
  .interests-match {
    .match-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .match-title {
      font-size: 15px;
      font-weight: 600;
      color: #1D2129;
    }
    
    .match-badge {
      background: linear-gradient(135deg, #F6FFED 0%, #D9F7BE 100%);
      padding: 4px 12px;
      border-radius: 20px;
      
      text {
        font-size: 12px;
        font-weight: 600;
        color: #52C41A;
      }
    }
    
    .tag-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      
      .tag-item {
        display: flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(135deg, #F6FFED 0%, #D9F7BE 100%);
        padding: 10px 16px;
        border-radius: 12px;
        
        text {
          font-size: 14px;
          color: #52C41A;
          font-weight: 500;
        }
      }
    }
  }
  
  .empty-interests {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    
    text {
      margin-top: 12px;
      font-size: 14px;
      color: #86909C;
    }
  }
}

// Values
.values-content {
  .values-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .value-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: linear-gradient(135deg, #F6FFED 0%, #E8FFEA 100%);
    border-radius: 12px;
    animation: fadeInUp 0.4s ease-out both;
    
    .value-text {
      font-size: 14px;
      color: #1D2129;
      font-weight: 500;
      line-height: 1.5;
    }
  }
  
  .empty-values {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    
    text {
      margin-top: 12px;
      font-size: 14px;
      color: #86909C;
    }
  }
}

// Expectations
.expectation-content {
  .exp-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .exp-item {
    background: linear-gradient(135deg, #F5F7FA 0%, #F2F3F5 100%);
    border-radius: 14px;
    padding: 16px;
  }
  
  .exp-label {
    font-size: 13px;
    color: #86909C;
    margin-bottom: 10px;
    font-weight: 500;
  }
  
  .exp-values {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .exp-box {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    
    &.client {
      background: linear-gradient(135deg, #E8F3FF 0%, #BAE7FF 100%);
      color: #4A90E2;
    }
    
    &.candidate {
      background: linear-gradient(135deg, #FFF0F2 0%, #FFD6DD 100%);
      color: #FF5E78;
    }
  }
  
  .exp-divider {
    width: 28px;
    height: 28px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

// Footer Actions
.footer-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, #fff 100%);
  z-index: 99;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  backdrop-filter: blur(10px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
}

.action-btn {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &.secondary {
    background: #F5F7FA;
    color: #4E5969;
    
    &:active {
      background: #E5E6EB;
      transform: scale(0.98);
    }
  }
  
  &.primary {
    background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
    color: #fff;
    box-shadow: 0 4px 16px rgba(255, 94, 120, 0.35);
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(255, 94, 120, 0.25);
    }
  }
}
</style>
