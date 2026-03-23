<template>
  <view class="container" v-if="eventInfo">
    <u-navbar :title="eventInfo.title" :autoBack="true"></u-navbar>
    
    <image class="cover" :src="eventInfo.cover || 'https://via.placeholder.com/400x200?text=Event'" mode="aspectFill"></image>
    
    <view class="main-info">
      <view class="title">{{ eventInfo.title }}</view>
      <view class="price-wrap">
        <text class="price" v-if="eventInfo.price_coins > 0">{{ eventInfo.price_coins }} 红豆</text>
        <text class="price free" v-else>免费</text>
        <text class="quota">还剩 {{ Math.max(0, eventInfo.max_quota - eventInfo.joined_count) }} 个名额</text>
      </view>
    </view>
    
    <view class="detail-section">
      <view class="sec-title">活动信息</view>
      <view class="info-list">
        <view class="info-item">
          <u-icon name="clock" size="18" color="#999"></u-icon>
          <view class="val">
            <view>{{ formatDate(eventInfo.start_time) }} 开始</view>
            <view class="sub-val">{{ formatDate(eventInfo.end_time) }} 结束</view>
          </view>
        </view>
        <view class="info-item">
          <u-icon name="map" size="18" color="#999"></u-icon>
          <view class="val">{{ eventInfo.address }}</view>
        </view>
      </view>
    </view>
    
    <view class="detail-section">
      <view class="sec-title">活动介绍</view>
      <view class="desc-content">
        {{ eventInfo.description || '主办方很懒，没有留下详细介绍~' }}
      </view>
    </view>
    
    <!-- 底部报名栏 -->
    <view class="bottom-action">
      <view class="tips">报名成功后，请准时前往场地</view>
      <u-button 
        shape="circle" 
        :color="isFull ? '#ccc' : '#FF4D6A'" 
        :text="isFull ? '名额已满' : '立即报名'" 
        :disabled="isFull || loading"
        @click="handleRegister"
      ></u-button>
    </view>
    
    <!-- 支付确认弹窗 -->
    <u-modal 
      :show="showPayModal" 
      title="确认报名" 
      :content="`本次活动将扣除您 ${eventInfo.price_coins} 红豆，是否继续？`" 
      :showCancelButton="true" 
      confirmColor="#FF4D6A"
      @confirm="doRegister"
      @cancel="showPayModal = false"
    ></u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { cEvent } from '@/api/c_api'
import dayjs from 'dayjs'

const eventInfo = ref<any>(null)
const showPayModal = ref(false)
const loading = ref(false)

onLoad(() => {
  const data = uni.getStorageSync('current_event')
  if (data) {
    eventInfo.value = data
  } else {
    uni.navigateBack()
  }
})

const isFull = computed(() => {
  if (!eventInfo.value) return false
  return eventInfo.value.joined_count >= eventInfo.value.max_quota
})

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY年MM月DD日 HH:mm')
}

const handleRegister = () => {
  if (eventInfo.value.price_coins > 0) {
    showPayModal.value = true
  } else {
    // 免费活动直接报名
    doRegister()
  }
}

const doRegister = async () => {
  showPayModal.value = false
  loading.value = true
  
  try {
    const res: any = await cEvent.register(eventInfo.value.id)
    if (res.code === 200) {
      uni.showToast({ title: '报名成功！', icon: 'success' })
      // 更新本地状态
      eventInfo.value.joined_count++
    } else {
      uni.showModal({
        title: '报名失败',
        content: res.msg || '余额不足或名额已满',
        showCancel: false
      })
    }
  } catch (e) {
    uni.showToast({ title: '网络错误', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 140rpx;
}

.cover {
  width: 100%;
  height: 400rpx;
}

.main-info {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .price-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .price {
      font-size: 36rpx;
      color: #FF4D6A;
      font-weight: bold;
      
      &.free {
        color: #19be6b;
      }
    }
    
    .quota {
      font-size: 26rpx;
      color: #999;
    }
  }
}

.detail-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .sec-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    position: relative;
    padding-left: 20rpx;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 10rpx;
      bottom: 10rpx;
      width: 6rpx;
      background: #FF4D6A;
      border-radius: 6rpx;
    }
  }
  
  .info-list {
    .info-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 30rpx;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .val {
        margin-left: 20rpx;
        font-size: 28rpx;
        color: #333;
        line-height: 1.5;
        flex: 1;
        
        .sub-val {
          color: #999;
          font-size: 24rpx;
          margin-top: 6rpx;
        }
      }
    }
  }
  
  .desc-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .tips {
    font-size: 24rpx;
    color: #999;
  }
  
  :deep(.u-button) {
    width: 240rpx;
    margin: 0;
  }
}
</style>
