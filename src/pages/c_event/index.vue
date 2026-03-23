<template>
  <view class="container">
    <u-navbar title="同城相亲局" :autoBack="false" leftIcon=""></u-navbar>
    
    <view class="event-list">
      <view class="event-card" v-for="item in eventList" :key="item.id" @click="goToDetail(item)">
        <image class="cover" :src="item.cover || 'https://via.placeholder.com/400x200?text=Event'" mode="aspectFill"></image>
        <view class="content">
          <view class="title">{{ item.title }}</view>
          <view class="info-row">
            <u-icon name="clock" size="14" color="#999"></u-icon>
            <text class="info-text">{{ formatDate(item.start_time) }}</text>
          </view>
          <view class="info-row">
            <u-icon name="map" size="14" color="#999"></u-icon>
            <text class="info-text">{{ item.address }}</text>
          </view>
          
          <view class="bottom-bar">
            <view class="quota">
              <text class="highlight">{{ item.joined_count }}</text> / {{ item.max_quota }} 人已报名
            </view>
            <view class="price" v-if="item.price_coins > 0">
              <u-icon name="red-packet-fill" color="#FF4D6A" size="16"></u-icon>
              <text class="num">{{ item.price_coins }} 红豆</text>
            </view>
            <view class="price free" v-else>免费</view>
          </view>
        </view>
        <view class="status-tag" :class="{ 'full': item.joined_count >= item.max_quota }">
          {{ item.joined_count >= item.max_quota ? '已满员' : '报名中' }}
        </view>
      </view>
      
      <u-empty v-if="eventList.length === 0" mode="data" text="近期暂无同城活动，敬请期待"></u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
import { cEvent } from '@/api/c_api'
import dayjs from 'dayjs'

const eventList = ref<any[]>([])

const fetchList = async () => {
  try {
    const res: any = await cEvent.getList(1, 20)
    if (res.code === 200) {
      eventList.value = res.data.list || []
    }
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}

onShow(() => {
  fetchList()
})

onPullDownRefresh(async () => {
  await fetchList()
  uni.stopPullDownRefresh()
})

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('MM月DD日 HH:mm')
}

const goToDetail = (item: any) => {
  // 简单起见，直接把对象存入 storage 传给详情页
  uni.setStorageSync('current_event', item)
  uni.navigateTo({
    url: '/pages/c_event/detail'
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 50rpx;
}

.event-list {
  padding: 30rpx;
  
  .event-card {
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 30rpx;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
    
    .cover {
      width: 100%;
      height: 300rpx;
    }
    
    .content {
      padding: 24rpx;
      
      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 16rpx;
      }
      
      .info-row {
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        
        .info-text {
          font-size: 26rpx;
          color: #666;
          margin-left: 10rpx;
        }
      }
      
      .bottom-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24rpx;
        padding-top: 20rpx;
        border-top: 1rpx solid #eee;
        
        .quota {
          font-size: 24rpx;
          color: #999;
          
          .highlight {
            color: #FF4D6A;
            font-weight: bold;
          }
        }
        
        .price {
          display: flex;
          align-items: center;
          
          .num {
            font-size: 32rpx;
            color: #FF4D6A;
            font-weight: bold;
            margin-left: 8rpx;
          }
          
          &.free {
            color: #19be6b;
            font-size: 28rpx;
            font-weight: bold;
          }
        }
      }
    }
    
    .status-tag {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      background: linear-gradient(to right, #FF4D6A, #ff7a8a);
      color: #fff;
      font-size: 24rpx;
      padding: 6rpx 20rpx;
      border-radius: 30rpx;
      
      &.full {
        background: #ccc;
      }
    }
  }
}
</style>
