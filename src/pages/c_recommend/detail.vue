<template>
  <view class="container">
    <u-navbar title="AI匹配分析" :autoBack="true" bgColor="transparent" titleStyle="color: #fff;"></u-navbar>
    
    <scroll-view scroll-y class="scroll-area">
      <!-- 头部卡片 -->
      <view class="profile-header">
        <image class="bg-img" :src="profile.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="mask"></view>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ profile.name }}</text>
            <view class="tags">
              <text class="tag">{{ profile.age }}岁</text>
              <text class="tag">{{ profile.height }}cm</text>
              <text class="tag">{{ profile.work_city }}</text>
            </view>
          </view>
          <text class="desc">{{ profile.profession }} · 月入 {{ profile.income }}元</text>
        </view>
      </view>

      <view class="content-body" v-if="aiMatch">
        <!-- AI 匹配得分 -->
        <view class="score-card">
          <view class="title">
            <u-icon name="star-fill" color="#FF4D6A" size="20"></u-icon>
            <text>AI 匹配度分析</text>
          </view>
          <view class="score-circle">
            <text class="num">{{ aiMatch.overall_score || 95 }}</text>
            <text class="unit">分</text>
          </view>
          <text class="level">{{ aiMatch.level || '天作之合' }}</text>
        </view>

        <!-- 详细分析 (复用B端组件或直接展示) -->
        <view class="analysis-card">
          <view class="section-title">硬性条件匹配</view>
          <text class="desc-text">{{ aiMatch.hard_conditions?.analysis || '双方年龄、身高、学历等条件非常匹配，门当户对。' }}</text>
          
          <view class="section-title mt-30">破冰话题建议</view>
          <view class="topic-list">
            <view class="topic-item" v-for="(topic, index) in (aiMatch.ice_breaker_topics || ['聊聊最近去过的旅游城市', '分享一下工作中的趣事'])" :key="index">
              <u-icon name="chat" color="#007aff" size="16"></u-icon>
              <text>{{ topic }}</text>
            </view>
          </view>
        </view>
        
        <view class="analysis-card">
          <view class="section-title">TA 的择偶要求</view>
          <text class="desc-text">{{ profile.partner_requirements || '随缘，看眼缘' }}</text>
        </view>
      </view>
      
      <view class="loading-state" v-else>
        <u-loading-icon text="AI正在飞速计算你们的缘分..." textSize="14"></u-loading-icon>
      </view>
    </scroll-view>

    <!-- 底部悬浮操作栏 -->
    <view class="bottom-bar">
      <u-button 
        type="primary" 
        shape="circle" 
        color="linear-gradient(to right, #ff6b81, #ff4d6a)" 
        text="超级心动" 
        @click="handleLike"
      ></u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { cRecommend, cInteract } from '@/api/c_api'

const profile = ref<any>({})
const aiMatch = ref<any>(null)
const targetId = ref('')

onLoad((options) => {
  if (options && options.id) {
    targetId.value = options.id
    fetchDetail(options.id)
  }
})

const fetchDetail = async (id: string) => {
  try {
    const res: any = await cRecommend.getDetail(id)
    if (res.code === 200) {
      profile.value = res.data.profile
      aiMatch.value = res.data.ai_match
    }
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

const handleLike = async () => {
  try {
    const res: any = await cInteract.like(targetId.value)
    if (res.code === 200) {
      if (res.data.is_matched) {
        uni.showModal({
          title: '恭喜',
          content: '你们互相心动了！红娘即将为您安排。',
          showCancel: false,
          success: () => {
            uni.navigateBack()
          }
        })
      } else {
        uni.showToast({ title: '心动已发送', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  } catch (e) {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}

.scroll-area {
  flex: 1;
  padding-bottom: 120rpx;
}

.profile-header {
  position: relative;
  height: 600rpx;
  
  .bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .mask {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  }
  
  .info {
    position: absolute;
    bottom: 40rpx;
    left: 30rpx;
    right: 30rpx;
    color: #fff;
    
    .name-row {
      display: flex;
      align-items: flex-end;
      margin-bottom: 10rpx;
      
      .name {
        font-size: 44rpx;
        font-weight: bold;
        margin-right: 20rpx;
      }
      
      .tags {
        display: flex;
        gap: 10rpx;
        
        .tag {
          background: rgba(255,255,255,0.2);
          padding: 2rpx 12rpx;
          border-radius: 6rpx;
          font-size: 22rpx;
        }
      }
    }
    
    .desc {
      font-size: 26rpx;
      opacity: 0.9;
    }
  }
}

.content-body {
  padding: 30rpx;
  margin-top: -30rpx;
  position: relative;
  z-index: 2;
}

.score-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  
  .title {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
  }
  
  .score-circle {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    border: 8rpx solid #FF4D6A;
    display: flex;
    align-items: baseline;
    justify-content: center;
    color: #FF4D6A;
    padding-bottom: 30rpx;
    box-sizing: border-box;
    
    .num {
      font-size: 64rpx;
      font-weight: bold;
    }
    .unit {
      font-size: 24rpx;
      margin-left: 4rpx;
    }
  }
  
  .level {
    margin-top: 20rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

.analysis-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    border-left: 6rpx solid #FF4D6A;
    padding-left: 16rpx;
  }
  
  .mt-30 {
    margin-top: 30rpx;
  }
  
  .desc-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
  
  .topic-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    
    .topic-item {
      display: flex;
      align-items: center;
      gap: 12rpx;
      background: #f0f8ff;
      padding: 16rpx 20rpx;
      border-radius: 12rpx;
      font-size: 26rpx;
      color: #333;
    }
  }
}

.loading-state {
  padding: 100rpx 0;
  display: flex;
  justify-content: center;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20rpx 40rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
}
</style>
