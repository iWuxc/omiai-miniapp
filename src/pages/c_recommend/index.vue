<template>
  <view class="container">
    <u-navbar title="发现缘分" :is-back="false" bgColor="transparent" titleStyle="color: #fff; font-weight: bold;"></u-navbar>
    
    <view class="card-stack" v-if="recommendList.length > 0">
      <view 
        class="card" 
        v-for="(item, index) in displayList" 
        :key="item.id"
        :style="getCardStyle(index)"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd($event, item)"
        @click="goToDetail(item.id)"
      >
        <image class="avatar" :src="item.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="info-mask">
          <view class="name-age">
            <text class="name">{{ item.name }}</text>
            <view class="age-tag">
              <u-icon :name="item.gender === 1 ? 'man' : 'woman'" size="12" :color="item.gender === 1 ? '#007aff' : '#ff4d6a'"></u-icon>
              <text>{{ item.age }}岁</text>
            </view>
          </view>
          <view class="basic-info">
            <text>{{ item.height }}cm</text>
            <text class="dot">·</text>
            <text>{{ getEduText(item.education) }}</text>
            <text class="dot">·</text>
            <text>{{ item.work_city || '未知城市' }}</text>
          </view>
        </view>
        
        <!-- 喜欢/不喜欢 提示图层 -->
        <view class="action-hint like-hint" :style="{ opacity: currentAction === 'like' && index === 0 ? hintOpacity : 0 }">
          <u-icon name="heart-fill" color="#FF4D6A" size="80"></u-icon>
        </view>
        <view class="action-hint dislike-hint" :style="{ opacity: currentAction === 'dislike' && index === 0 ? hintOpacity : 0 }">
          <u-icon name="close" color="#999" size="80"></u-icon>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else-if="!loading">
      <u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" text="今日推荐已看完，明天再来吧~"></u-empty>
    </view>

    <!-- 底部操作按钮 -->
    <view class="action-bar" v-if="recommendList.length > 0">
      <view class="btn-circle dislike-btn" @click="handleAction('dislike')">
        <u-icon name="close" color="#999" size="30"></u-icon>
      </view>
      <view class="btn-circle like-btn" @click="handleAction('like')">
        <u-icon name="heart-fill" color="#FF4D6A" size="36"></u-icon>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { cRecommend, cInteract } from '@/api/c_api'

const recommendList = ref<any[]>([])
const loading = ref(true)

// 卡片滑动相关状态
const startX = ref(0)
const moveX = ref(0)
const currentAction = ref('')
const hintOpacity = ref(0)

// 只显示最上面的3张卡片以优化性能
const displayList = computed(() => {
  return recommendList.value.slice(0, 3)
})

const getEduText = (val: number) => {
  const map: Record<number, string> = { 1: '高中', 2: '大专', 3: '本科', 4: '硕士', 5: '博士' }
  return map[val] || '未知'
}

const fetchDaily = async () => {
  loading.value = true
  try {
    const res: any = await cRecommend.getDaily()
    if (res.code === 200) {
      recommendList.value = res.data.list || []
    }
  } finally {
    loading.value = false
  }
}

// 动态计算卡片样式实现层叠效果
const getCardStyle = (index: number) => {
  if (index === 0) {
    // 顶层卡片，跟随手指移动
    const rotate = moveX.value * 0.05
    return {
      transform: `translateX(${moveX.value}px) rotate(${rotate}deg)`,
      zIndex: 10,
      transition: moveX.value === 0 ? 'transform 0.3s ease' : 'none'
    }
  }
  
  // 底层卡片，缩放和下移
  const scale = 1 - index * 0.05
  const translateY = index * 20
  return {
    transform: `scale(${scale}) translateY(${translateY}px)`,
    zIndex: 10 - index,
    transition: 'transform 0.3s ease',
    opacity: 1 - index * 0.2
  }
}

const touchStart = (e: any) => {
  startX.value = e.touches[0].clientX
  moveX.value = 0
}

const touchMove = (e: any) => {
  const currentX = e.touches[0].clientX
  moveX.value = currentX - startX.value
  
  // 计算提示图标透明度
  hintOpacity.value = Math.min(Math.abs(moveX.value) / 100, 1)
  currentAction.value = moveX.value > 0 ? 'like' : 'dislike'
}

const touchEnd = async (e: any, item: any) => {
  if (moveX.value > 100) {
    // 右滑：喜欢
    await doLike(item.id)
  } else if (moveX.value < -100) {
    // 左滑：不喜欢
    popCard()
  } else {
    // 滑动距离不够，弹回原位
    moveX.value = 0
    hintOpacity.value = 0
  }
}

const handleAction = async (action: 'like' | 'dislike') => {
  if (recommendList.value.length === 0) return
  
  const currentItem = recommendList.value[0]
  if (action === 'like') {
    // 模拟向右滑出
    moveX.value = 300
    await doLike(currentItem.id)
  } else {
    // 模拟向左滑出
    moveX.value = -300
    setTimeout(() => {
      popCard()
    }, 300)
  }
}

const doLike = async (targetId: number) => {
  try {
    const res: any = await cInteract.like(targetId)
    if (res.code === 200 && res.data.is_matched) {
      // 互相心动了！
      uni.showModal({
        title: '恭喜！',
        content: '你们互相心动了，红娘会尽快为您安排联系！',
        showCancel: false,
        confirmColor: '#FF4D6A'
      })
    } else {
      uni.showToast({ title: '已发送心动', icon: 'none' })
    }
  } finally {
    setTimeout(() => {
      popCard()
    }, 300)
  }
}

const popCard = () => {
  moveX.value = 0
  hintOpacity.value = 0
  currentAction.value = ''
  recommendList.value.shift()
}

const goToDetail = (id: number) => {
  // 如果正在滑动中，不触发点击
  if (Math.abs(moveX.value) > 10) return
  uni.navigateTo({ url: `/pages/c_recommend/detail?id=${id}` })
}

onMounted(() => {
  fetchDaily()
})
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background: linear-gradient(180deg, #FF4D6A 0%, #f8f8f8 30%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-stack {
  position: relative;
  flex: 1;
  margin: 40rpx 40rpx;
  perspective: 1000px;
}

.card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 30rpx;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
  overflow: hidden;
  transform-origin: 50% 100%;

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .info-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 60rpx 40rpx 40rpx;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
    color: #fff;
    pointer-events: none;

    .name-age {
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;

      .name {
        font-size: 48rpx;
        font-weight: bold;
        margin-right: 20rpx;
      }

      .age-tag {
        background: rgba(255,255,255,0.2);
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        font-size: 24rpx;
        display: flex;
        align-items: center;
        gap: 6rpx;
      }
    }

    .basic-info {
      font-size: 28rpx;
      opacity: 0.9;
      
      .dot {
        margin: 0 10rpx;
      }
    }
  }

  .action-hint {
    position: absolute;
    top: 60rpx;
    padding: 20rpx;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    pointer-events: none;
    
    &.like-hint {
      left: 60rpx;
      transform: rotate(-15deg);
      border: 6rpx solid #FF4D6A;
    }
    
    &.dislike-hint {
      right: 60rpx;
      transform: rotate(15deg);
      border: 6rpx solid #999;
    }
  }
}

.action-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80rpx;
  padding-bottom: 80rpx;

  .btn-circle {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10rpx 20rpx rgba(0,0,0,0.05);
    transition: transform 0.1s;
    
    &:active {
      transform: scale(0.9);
    }
    
    &.like-btn {
      width: 140rpx;
      height: 140rpx;
    }
  }
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
