<template>
  <view class="container">
    <view class="nav-bar">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#333"></u-icon>
      </view>
      <text class="nav-title">匹配候选人</text>
    </view>

    <view class="filter-bar">
      <view 
        class="filter-item" 
        :class="{ active: sortBy === 'score' }"
        @click="changeSort('score')"
      >
        综合匹配度
        <u-icon name="arrow-down-fill" size="10" v-if="sortBy === 'score'"></u-icon>
      </view>
      <view 
        class="filter-item" 
        :class="{ active: sortBy === 'age' }"
        @click="changeSort('age')"
      >
        年龄
        <u-icon name="arrow-up-fill" size="10" v-if="sortBy === 'age'"></u-icon>
      </view>
      <view 
        class="filter-item" 
        :class="{ active: sortBy === 'height' }"
        @click="changeSort('height')"
      >
        身高
        <u-icon name="arrow-down-fill" size="10" v-if="sortBy === 'height'"></u-icon>
      </view>
    </view>

    <view class="list-content">
      <view v-if="loading" class="loading-box">
        <u-loading-icon mode="circle"></u-loading-icon>
      </view>
      
      <view v-else-if="list.length === 0" class="empty-box">
        <u-empty mode="list" text="暂无推荐人选"></u-empty>
      </view>

      <view v-else class="candidate-list">
         <view 
           class="candidate-card" 
           v-for="(item, index) in list" 
           :key="index"
         >
           <view class="card-left" @click="goCompare(item.candidate_id)">
              <u-avatar :src="item.avatar" size="60"></u-avatar>
           </view>
            <view class="card-right" @click="goCompare(item.candidate_id)">
               <view class="name-row">
                 <text class="name">{{ item.name }}</text>
                 <view class="score-box" :class="getScoreLevel(item.match_score)">
                   <text class="score">{{ item.match_score }}分</text>
                   <text class="level-text">{{ getLevelText(item.match_score) }}</text>
                 </view>
               </view>
               <view class="info-row">
                  <text>{{ item.age }}岁</text>
                  <text class="sep">|</text>
                  <text>{{ item.height }}cm</text>
                  <text class="sep">|</text>
                  <text>{{ getEducationText(item.education) }}</text>
               </view>
               <view class="tags-row">
                 <view class="tag" v-for="(tag, tIdx) in item.tags" :key="tIdx">{{ tag }}</view>
               </view>
            </view>
            <view class="ai-btn" @click="showAIAnalysis(item)">
              <text class="ai-icon">🤖</text>
              <text class="ai-text">AI分析</text>
            </view>
         </view>
      </view>
     </view>
   </view>
   
   <!-- AI分析弹窗 -->
   <AIAnalysisPopup 
     :visible="aiPopupVisible" 
     :loading="aiLoading"
     :error="aiError"
     :result="aiResult"
     @close="aiPopupVisible = false"
     @retry="handleRetry"
   />
 </template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getCandidates } from '@/api/match';
import { aiAnalyzeMatch } from '@/api/ai';
import AIAnalysisPopup from '@/components/AIAnalysisPopup.vue';

const clientId = ref<number>(0);
const list = ref<any[]>([]);
const loading = ref(false);
const sortBy = ref('score');

// AI分析相关
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

// 获取匹配等级样式
const getScoreLevel = (score: number): string => {
  if (score >= 85) return 'level-perfect';
  if (score >= 70) return 'level-good';
  if (score >= 55) return 'level-average';
  return 'level-poor';
};

// 获取匹配等级文本
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

const loadData = async () => {
  loading.value = true;
  try {
    const res: any = await getCandidates(clientId.value);
    list.value = res || [];
    doSort();
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    loading.value = false;
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

// 显示AI分析
const showAIAnalysis = async (item: any) => {
  aiPopupVisible.value = true;
  aiLoading.value = true;
  aiError.value = false;
  aiResult.value = {};
  currentCandidate.value = item;
  
  await doAnalyze(item);
};

// 执行AI分析
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

// 重试AI分析
const handleRetry = () => {
  if (currentCandidate.value) {
    doAnalyze(currentCandidate.value);
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 44px;
  background-color: #f5f6fa;
  min-height: 100vh;
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
.filter-bar {
  display: flex;
  background: #fff;
  padding: 12px 0;
  margin-bottom: 12px;
  .filter-item {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    &.active {
      color: #FF5E78;
      font-weight: 500;
    }
  }
}
.list-content {
    padding-bottom: 40px;
}
.loading-box {
    display: flex;
    justify-content: center;
    padding-top: 40px;
}
.empty-box {
    padding-top: 60px;
}
.candidate-card {
  background: #fff;
  margin: 12px;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  &:active {
      background-color: #fafafa;
  }
  .card-left {
    margin-right: 16px;
  }
  .card-right {
    flex: 1;
    .name-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      .name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
      .score-box {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .score {
          font-size: 20px;
          font-weight: bold;
        }
        .level-text {
          font-size: 10px;
          margin-top: 2px;
        }
        // 完美匹配 - 绿色
        &.level-perfect {
          .score { color: #52c41a; }
          .level-text { color: #52c41a; }
        }
        // 非常合适 - 蓝色
        &.level-good {
          .score { color: #1890ff; }
          .level-text { color: #1890ff; }
        }
        // 可以尝试 - 橙色
        &.level-average {
          .score { color: #faad14; }
          .level-text { color: #faad14; }
        }
        // 不太合适 - 红色
        &.level-poor {
          .score { color: #ff4d4f; }
          .level-text { color: #ff4d4f; }
        }
      }
    }
    .info-row {
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
        .sep {
            margin: 0 6px;
            color: #ddd;
        }
    }
    .tags-row {
      display: flex;
      flex-wrap: wrap;
      .tag {
        background: #FFF0F2;
        color: #FF5E78;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 4px;
        margin-right: 6px;
        margin-bottom: 4px;
      }
    }
  }
  .ai-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
    .ai-icon {
      font-size: 20px;
      margin-bottom: 2px;
    }
    .ai-text {
      font-size: 10px;
      color: #fff;
      font-weight: 500;
    }
  }
}
</style>
