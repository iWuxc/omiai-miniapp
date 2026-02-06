<template>
  <view class="ai-analysis-popup" v-if="visible">
    <view class="ai-mask" @click="close"></view>
    <view class="ai-content">
      <!-- 头部 -->
      <view class="ai-header">
        <text class="ai-title">🤖 AI红娘分析助手</text>
        <text class="ai-close" @click="close">×</text>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="ai-loading">
        <u-loading-icon mode="circle" size="40"></u-loading-icon>
        <text class="loading-text">AI正在分析中，请稍候...</text>
      </view>

      <!-- 分析结果 -->
      <view v-else class="ai-result">
        <!-- 总体评分 -->
        <view class="score-section">
          <view class="score-circle" :style="{background: scoreColor}">
            <text class="score-num">{{ result.overall_score }}</text>
            <text class="score-label">匹配度</text>
          </view>
          <view class="score-info">
            <text class="level-text" :style="{color: scoreColor}">{{ result.level }}</text>
            <text class="probability">{{ result.success_probability }}</text>
          </view>
        </view>

        <!-- 详细分析 -->
        <view class="detail-section">
          <!-- 硬性条件 -->
          <view class="condition-card" v-if="result.hard_conditions">
            <view class="card-header">
              <text class="card-title">📋 硬性条件</text>
              <text class="card-score" :class="getScoreClass(result.hard_conditions.score)">
                {{ result.hard_conditions.score }}分
              </text>
            </view>
            <text class="card-desc">{{ result.hard_conditions.analysis }}</text>
            <view class="suggestions" v-if="result.hard_conditions.suggestions && result.hard_conditions.suggestions.length">
              <text class="suggestion-title">💡 建议：</text>
              <text v-for="(item, idx) in result.hard_conditions.suggestions" :key="idx" class="suggestion-item">
                {{ idx + 1 }}. {{ item }}
              </text>
            </view>
          </view>

          <!-- 软性条件 -->
          <view class="condition-card" v-if="result.soft_conditions">
            <view class="card-header">
              <text class="card-title">💕 软性条件</text>
              <text class="card-score" :class="getScoreClass(result.soft_conditions.score)">
                {{ result.soft_conditions.score }}分
              </text>
            </view>
            <text class="card-desc">{{ result.soft_conditions.analysis }}</text>
          </view>
        </view>

        <!-- 优势与风险 -->
        <view class="pros-cons-section">
          <!-- 优势 -->
          <view class="pros-card" v-if="result.advantages && result.advantages.length">
            <text class="section-title">✅ 匹配优势</text>
            <view class="tag-list">
              <text v-for="(item, idx) in result.advantages" :key="idx" class="pro-tag">{{ item }}</text>
            </view>
          </view>

          <!-- 风险 -->
          <view class="cons-card" v-if="result.risk_points && result.risk_points.length">
            <text class="section-title">⚠️ 风险提示</text>
            <view class="tag-list">
              <text v-for="(item, idx) in result.risk_points" :key="idx" class="risk-tag">{{ item }}</text>
            </view>
          </view>
        </view>

        <!-- 总体建议 -->
        <view class="suggestion-section" v-if="result.suggestions">
          <text class="section-title">💭 AI建议</text>
          <view class="suggestion-box">
            <text class="suggestion-text">{{ result.suggestions }}</text>
          </view>
        </view>

        <!-- 破冰话题 -->
        <view class="topics-section" v-if="result.ice_breaker_topics && result.ice_breaker_topics.length">
          <text class="section-title">🗣️ 破冰话题推荐</text>
          <view class="topic-list">
            <view v-for="(topic, idx) in result.ice_breaker_topics" :key="idx" class="topic-item">
              <text class="topic-num">{{ idx + 1 }}</text>
              <text class="topic-text">{{ topic }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部按钮 -->
      <view class="ai-footer">
        <button class="btn-confirm" @click="close">我知道了</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AIAnalysisPopup',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    result: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    scoreColor() {
      const score = this.result.overall_score || 0
      if (score >= 85) return '#52c41a'
      if (score >= 70) return '#1890ff'
      if (score >= 55) return '#faad14'
      return '#ff4d4f'
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    getScoreClass(score) {
      if (score >= 80) return 'score-high'
      if (score >= 60) return 'score-medium'
      return 'score-low'
    }
  }
}
</script>

<style scoped>
.ai-analysis-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.ai-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.ai-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  height: 85vh;
  display: flex;
  flex-direction: column;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  flex-shrink: 0;
}

.ai-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.ai-close {
  font-size: 48rpx;
  color: #999;
  padding: 10rpx;
}

.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 60rpx;
}

.loading-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.ai-result {
  flex: 1;
  padding: 30rpx;
  padding-bottom: 50rpx;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}

/* 评分区域 */
.score-section {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #fff 100%);
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  flex-shrink: 0;
}

.score-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.score-num {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
}

.score-label {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.9);
}

.score-info {
  flex: 1;
}

.level-text {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
}

.probability {
  font-size: 22rpx;
  color: #666;
  line-height: 1.5;
}

/* 详细分析卡片 */
.condition-card {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
}

.card-score {
  font-size: 32rpx;
  font-weight: bold;
}

.score-high { color: #52c41a; }
.score-medium { color: #faad14; }
.score-low { color: #ff4d4f; }

.card-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.suggestions {
  background: #fff;
  border-radius: 8rpx;
  padding: 16rpx;
}

.suggestion-title {
  font-size: 24rpx;
  color: #1890ff;
  font-weight: 500;
  display: block;
  margin-bottom: 8rpx;
}

.suggestion-item {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-top: 6rpx;
}

/* 优势与风险 */
.pros-cons-section {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
  align-items: flex-start;
}

.pros-card, .cons-card {
  flex: 1;
  padding: 16rpx;
  border-radius: 12rpx;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.pros-card {
  background: #f6ffed;
  border: 1rpx solid #b7eb8f;
}

.cons-card {
  background: #fff2f0;
  border: 1rpx solid #ffccc7;
}

.section-title {
  font-size: 24rpx;
  font-weight: 500;
  display: block;
  margin-bottom: 10rpx;
}

.pros-card .section-title {
  color: #52c41a;
}

.cons-card .section-title {
  color: #ff4d4f;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.pro-tag {
  background: #d9f7be;
  color: #389e0d;
  font-size: 20rpx;
  padding: 6rpx 10rpx;
  border-radius: 6rpx;
  max-width: 100%;
  word-break: break-all;
  line-height: 1.3;
}

.risk-tag {
  background: #ffccc7;
  color: #cf1322;
  font-size: 20rpx;
  padding: 6rpx 10rpx;
  border-radius: 6rpx;
  max-width: 100%;
  word-break: break-all;
  line-height: 1.3;
}

/* 建议区域 */
.suggestion-section {
  background: #e6f7ff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
}

.suggestion-section .section-title {
  color: #1890ff;
  margin-bottom: 16rpx;
}

.suggestion-box {
  background: #fff;
  border-radius: 8rpx;
  padding: 20rpx;
}

.suggestion-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.6;
}

/* 破冰话题 */
.topics-section {
  margin-bottom: 20rpx;
}

.topics-section .section-title {
  color: #722ed1;
  margin-bottom: 12rpx;
}

.topic-list {
  background: #f9f0ff;
  border-radius: 12rpx;
  padding: 16rpx;
}

.topic-item {
  display: flex;
  align-items: flex-start;
  padding: 10rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.topic-item:last-child {
  border-bottom: none;
}

.topic-num {
  width: 36rpx;
  height: 36rpx;
  background: #722ed1;
  color: #fff;
  font-size: 22rpx;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.topic-text {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
}

/* 底部按钮 */
.ai-footer {
  padding: 16rpx 30rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #f0f0f0;
  background: #fff;
  flex-shrink: 0;
}

.btn-confirm {
  background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
  border-radius: 12rpx;
  height: 80rpx;
  line-height: 80rpx;
  width: 100%;
}

.btn-confirm:active {
  opacity: 0.9;
}
</style>
