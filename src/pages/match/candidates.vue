<template>
  <view class="container">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <u-icon name="arrow-left" size="20" color="#1D2129"></u-icon>
        </view>
        <text class="nav-title">匹配候选人</text>
        <view class="nav-right">
          <view class="filter-trigger" @click="showFilter = true">
            <u-icon name="list" size="20" color="#1D2129"></u-icon>
          </view>
        </view>
      </view>
    </view>

    <!-- 匹配分数分布卡片 -->
    <view class="score-distribution">
      <view class="dist-item">
        <view class="dist-icon perfect">
          <text class="icon-text">完美</text>
        </view>
        <text class="dist-label">≥85分</text>
      </view>
      <view class="dist-item">
        <view class="dist-icon good">
          <text class="icon-text">合适</text>
        </view>
        <text class="dist-label">70-84分</text>
      </view>
      <view class="dist-item">
        <view class="dist-icon average">
          <text class="icon-text">尝试</text>
        </view>
        <text class="dist-label">55-69分</text>
      </view>
      <view class="dist-item">
        <view class="dist-icon poor">
          <text class="icon-text">一般</text>
        </view>
        <text class="dist-label">＜55分</text>
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <scroll-view scroll-x class="filter-scroll" show-scrollbar="false">
        <view class="filter-options">
          <view 
            class="filter-chip" 
            :class="{ active: sortBy === 'score' }"
            @click="changeSort('score')"
          >
            <u-icon name="fingerprint" size="14" :color="sortBy === 'score' ? '#fff' : '#86909C'"></u-icon>
            <text>匹配度</text>
            <u-icon name="arrow-down-fill" size="10" v-if="sortBy === 'score'" color="#fff"></u-icon>
          </view>
          <view 
            class="filter-chip" 
            :class="{ active: sortBy === 'age' }"
            @click="changeSort('age')"
          >
            <u-icon name="calendar" size="14" :color="sortBy === 'age' ? '#fff' : '#86909C'"></u-icon>
            <text>年龄</text>
            <u-icon name="arrow-up-fill" size="10" v-if="sortBy === 'age'" color="#fff"></u-icon>
          </view>
          <view 
            class="filter-chip" 
            :class="{ active: sortBy === 'height' }"
            @click="changeSort('height')"
          >
            <u-icon name="man-add" size="14" :color="sortBy === 'height' ? '#fff' : '#86909C'"></u-icon>
            <text>身高</text>
            <u-icon name="arrow-down-fill" size="10" v-if="sortBy === 'height'" color="#fff"></u-icon>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 列表内容 -->
    <scroll-view scroll-y class="list-content" @scrolltolower="loadMore">
      <view v-if="loading && page === 1" class="loading-box">
        <view class="skeleton-list">
          <view v-for="i in 4" :key="i" class="skeleton-card">
            <view class="skeleton-avatar"></view>
            <view class="skeleton-content">
              <view class="skeleton-line short"></view>
              <view class="skeleton-line"></view>
              <view class="skeleton-tags">
                <view class="skeleton-tag"></view>
                <view class="skeleton-tag"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view v-else-if="list.length === 0" class="empty-box">
        <view class="empty-illustration">
          <u-icon name="search" size="60" color="#C0C4CC"></u-icon>
        </view>
        <text class="empty-title">暂无推荐人选</text>
        <text class="empty-desc">请尝试调整筛选条件</text>
      </view>

      <view v-else class="candidate-list">
         <view 
           class="candidate-card" 
           v-for="(item, index) in list" 
           :key="index"
           :style="{ animationDelay: `${index * 80}ms` }"
           @click="goCompare(item.candidate_id)"
         >
           <!-- 左侧头像 -->
           <view class="card-avatar">
              <u-avatar :src="item.avatar" size="70" shape="circle"></u-avatar>
              <view class="avatar-ring" :class="getScoreLevel(item.match_score)"></view>
           </view>
           
           <!-- 中间内容 -->
           <view class="card-content">
              <view class="content-header">
                <view class="name-section">
                  <text class="name">{{ item.name }}</text>
                  <u-tag :text="item.gender === 1 ? '男' : '女'" :type="item.gender === 1 ? 'primary' : 'error'" size="mini" plain></u-tag>
                </view>
                <view class="score-badge" :class="getScoreLevel(item.match_score)">
                  <text class="score-value">{{ item.match_score }}%</text>
                  <text class="score-label">{{ getLevelText(item.match_score) }}</text>
                </view>
              </view>
              
              <view class="info-row">
                 <view class="info-item">
                   <u-icon name="calendar" size="12" color="#86909C"></u-icon>
                   <text>{{ item.age }}岁</text>
                 </view>
                 <view class="info-divider"></view>
                 <view class="info-item">
                   <u-icon name="man-add" size="12" color="#86909C"></u-icon>
                   <text>{{ item.height }}cm</text>
                 </view>
                 <view class="info-divider"></view>
                 <view class="info-item">
                   <u-icon name="bookmark" size="12" color="#86909C"></u-icon>
                   <text>{{ getEducationText(item.education) }}</text>
                 </view>
              </view>
              
              <view class="tags-row" v-if="item.tags && item.tags.length">
                <view class="tag" v-for="(tag, tIdx) in item.tags.slice(0, 3)" :key="tIdx">{{ tag }}</view>
              </view>
           </view>
           
           <!-- 右侧AI按钮 -->
           <view class="ai-btn-wrapper">
             <view class="ai-btn" @click.stop="showAIAnalysis(item)">
               <view class="ai-icon">
                 <u-icon name="edit-pen" size="16" color="#fff"></u-icon>
               </view>
               <text class="ai-text">AI</text>
             </view>
           </view>
         </view>
         
         <!-- 加载更多 -->
         <view v-if="hasMore" class="load-more">
           <u-loading-icon size="20" mode="circle"></u-loading-icon>
           <text>加载中...</text>
         </view>
         <view v-else-if="list.length > 0" class="no-more">
           <text>没有更多候选人了</text>
         </view>
      </view>
     </scroll-view>
     
     <!-- AI分析弹窗 -->
     <AIAnalysisPopup 
       :visible="aiPopupVisible" 
       :loading="aiLoading"
       :error="aiError"
       :result="aiResult"
       @close="aiPopupVisible = false"
       @retry="handleRetry"
     />
   </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getCandidates } from '@/api/match';
import { aiAnalyzeMatch } from '@/api/ai';
import AIAnalysisPopup from '@/components/AIAnalysisPopup.vue';

const clientId = ref<number>(0);
const list = ref<any[]>([]);
const loading = ref(false);
const sortBy = ref('score');
const page = ref(1);
const hasMore = ref(true);
const showFilter = ref(false);

const aiPopupVisible = ref(false);
const aiLoading = ref(false);
const aiError = ref(false);
const aiResult = ref<any>({});
const currentCandidate = ref<any>(null);

const educationMap: Record<number, string> = {
  1: '高中及以下',
  2: '大专',
  3: '本科',
  4: '硕士',
  5: '博士'
};

const getEducationText = (edu: number) => educationMap[edu] || '未知';

const getScoreLevel = (score: number): string => {
  if (score >= 85) return 'level-perfect';
  if (score >= 70) return 'level-good';
  if (score >= 55) return 'level-average';
  return 'level-poor';
};

const getLevelText = (score: number): string => {
  if (score >= 85) return '完美匹配';
  if (score >= 70) return '非常合适';
  if (score >= 55) return '可以尝试';
  return '不太合适';
};

onLoad((options: any) => {
  if (options.clientId) {
    clientId.value = Number(options.clientId);
    loadData();
  }
});

const loadData = async (reset = false) => {
  if (reset) {
    page.value = 1;
    hasMore.value = true;
    list.value = [];
  }
  
  if (!hasMore.value && !reset) return;
  
  loading.value = true;
  try {
    const res: any = await getCandidates(clientId.value, { page: page.value, pageSize: 20 });
    const newList = res || [];
    list.value = [...list.value, ...newList];
    hasMore.value = newList.length === 20;
    doSort();
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    page.value++;
    loadData();
  }
};

const changeSort = (type: string) => {
  if (sortBy.value === type) return;
  sortBy.value = type;
  doSort();
};

const doSort = () => {
  if (sortBy.value === 'score') {
    list.value.sort((a, b) => b.match_score - a.match_score);
  } else if (sortBy.value === 'age') {
    list.value.sort((a, b) => a.age - b.age);
  } else if (sortBy.value === 'height') {
    list.value.sort((a, b) => b.height - a.height);
  }
};

const goBack = () => uni.navigateBack();

const goCompare = (candidateId: number) => {
  uni.navigateTo({
    url: `/pages/match/compare?clientId=${clientId.value}&candidateId=${candidateId}`
  });
};

const showAIAnalysis = async (item: any) => {
  aiPopupVisible.value = true;
  aiLoading.value = true;
  aiError.value = false;
  aiResult.value = {};
  currentCandidate.value = item;
  
  await doAnalyze(item);
};

const doAnalyze = async (item: any) => {
  aiLoading.value = true;
  aiError.value = false;
  
  try {
    const data = await aiAnalyzeMatch(clientId.value, item.candidate_id);
    aiResult.value = data;
  } catch (e) {
    console.error('AI分析失败:', e);
    aiError.value = true;
  } finally {
    aiLoading.value = false;
  }
};

const handleRetry = () => {
  if (currentCandidate.value) {
    doAnalyze(currentCandidate.value);
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

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F7FA 0%, #ffffff 30%, #F5F7FA 100%);
  padding-bottom: 40px;
}

// Navigation Bar
.nav-bar {
  background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.98) 100%);
  padding: 48px 16px 12px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(10px);
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
  display: flex;
  justify-content: flex-end;
}

.filter-trigger {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #F5F7FA;
  
  &:active {
    background: #E5E6EB;
  }
}

// Score Distribution
.score-distribution {
  display: flex;
  justify-content: space-around;
  padding: 20px 16px;
  margin: 16px 16px 0;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.dist-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.dist-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icon-text {
    font-size: 11px;
    font-weight: 600;
    color: #fff;
  }
  
  &.perfect {
    background: linear-gradient(135deg, #52C41A 0%, #73D13D 100%);
    box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
  }
  
  &.good {
    background: linear-gradient(135deg, #4A90E2 0%, #6BB3FF 100%);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
  }
  
  &.average {
    background: linear-gradient(135deg, #FF9F00 0%, #FFC53D 100%);
    box-shadow: 0 4px 12px rgba(255, 159, 0, 0.3);
  }
  
  &.poor {
    background: linear-gradient(135deg, #86909C 0%, #C9CDD4 100%);
    box-shadow: 0 4px 12px rgba(134, 144, 156, 0.3);
  }
}

.dist-label {
  font-size: 12px;
  color: #86909C;
  font-weight: 500;
}

// Filter Bar
.filter-bar {
  margin: 16px;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-options {
  display: flex;
  gap: 12px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  text {
    font-size: 14px;
    color: #4E5969;
    font-weight: 500;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.active {
    background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
    box-shadow: 0 4px 16px rgba(255, 94, 120, 0.35);
    
    text {
      color: #fff;
      font-weight: 600;
    }
  }
}

// List Content
.list-content {
  padding: 0 16px;
  min-height: calc(100vh - 280px);
}

// Loading Skeleton
.loading-box {
  padding: 8px 0;
}

.skeleton-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .skeleton-avatar {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(90deg, #F2F3F5 25%, #E5E6EB 50%, #F2F3F5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    margin-right: 16px;
    flex-shrink: 0;
  }
  
  .skeleton-content {
    flex: 1;
  }
  
  .skeleton-line {
    height: 14px;
    background: linear-gradient(90deg, #F2F3F5 25%, #E5E6EB 50%, #F2F3F5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 10px;
    width: 80%;
    
    &.short {
      width: 50%;
    }
  }
  
  .skeleton-tags {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
  
  .skeleton-tag {
    width: 50px;
    height: 20px;
    background: linear-gradient(90deg, #F2F3F5 25%, #E5E6EB 50%, #F2F3F5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }
}

// Empty State
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 40px;
  
  .empty-illustration {
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #F5F7FA 0%, #E5E6EB 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }
  
  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #1D2129;
    margin-bottom: 8px;
  }
  
  .empty-desc {
    font-size: 14px;
    color: #86909C;
  }
}

// Candidate Card
.candidate-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
}

.card-avatar {
  position: relative;
  margin-right: 16px;
  flex-shrink: 0;
  
  .avatar-ring {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    border: 3px solid transparent;
    z-index: 1;
    
    &.level-perfect {
      border-color: #52C41A;
      box-shadow: 0 0 12px rgba(82, 196, 26, 0.3);
    }
    
    &.level-good {
      border-color: #4A90E2;
      box-shadow: 0 0 12px rgba(74, 144, 226, 0.3);
    }
    
    &.level-average {
      border-color: #FF9F00;
      box-shadow: 0 0 12px rgba(255, 159, 0, 0.3);
    }
    
    &.level-poor {
      border-color: #86909C;
    }
  }
}

.card-content {
  flex: 1;
  min-width: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name {
  font-size: 18px;
  font-weight: 600;
  color: #1D2129;
}

.score-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 6px 12px;
  border-radius: 12px;
  min-width: 70px;
  
  .score-value {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
  }
  
  .score-label {
    font-size: 11px;
    font-weight: 500;
    margin-top: 2px;
  }
  
  &.level-perfect {
    background: linear-gradient(135deg, #F6FFED 0%, #D9F7BE 100%);
    .score-value, .score-label { color: #52C41A; }
  }
  
  &.level-good {
    background: linear-gradient(135deg, #E8F3FF 0%, #BAE7FF 100%);
    .score-value, .score-label { color: #4A90E2; }
  }
  
  &.level-average {
    background: linear-gradient(135deg, #FFF7E8 0%, #FFE7BA 100%);
    .score-value, .score-label { color: #FF9F00; }
  }
  
  &.level-poor {
    background: linear-gradient(135deg, #F5F7FA 0%, #E5E6EB 100%);
    .score-value, .score-label { color: #86909C; }
  }
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #4E5969;
}

.info-divider {
  width: 1px;
  height: 12px;
  background: #E5E6EB;
}

.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .tag {
    background: linear-gradient(135deg, #FFF0F2 0%, rgba(255, 94, 120, 0.08) 100%);
    color: #FF5E78;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 8px;
    font-weight: 500;
  }
}

// AI Button
.ai-btn-wrapper {
  margin-left: 12px;
  padding-left: 12px;
  border-left: 1px dashed #E5E6EB;
}

.ai-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35);
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.92);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
  }
  
  .ai-icon {
    margin-bottom: 2px;
  }
  
  .ai-text {
    font-size: 10px;
    color: #fff;
    font-weight: 600;
  }
}

// Load More
.load-more, .no-more {
  text-align: center;
  padding: 24px;
  font-size: 14px;
  color: #86909C;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.no-more {
  color: #C0C4CC;
}
</style>
