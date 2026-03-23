<template>
  <view class="container">
    <u-navbar title="消息与互动" :is-back="false" bgColor="#fff"></u-navbar>

    <view class="tabs">
      <u-tabs :list="tabList" :current="currentTab" @click="tabChange" lineColor="#FF4D6A" activeColor="#FF4D6A"></u-tabs>
    </view>

    <scroll-view scroll-y class="list-container">
      <!-- 互相心动列表 -->
      <view v-if="currentTab === 0">
        <view class="list-item" v-for="item in mutualList" :key="item.interaction_id">
          <image class="avatar" :src="item.avatar || '/static/default-avatar.png'"></image>
          <view class="info">
            <view class="name-time">
              <text class="name">{{ item.name }}</text>
              <text class="time">{{ item.created_at }}</text>
            </view>
            <text class="desc">你们互相心动了！红娘正在为您安排牵线。</text>
          </view>
          <u-button type="primary" size="mini" shape="circle" color="#FF4D6A" text="联系红娘" @click="contactManager"></u-button>
        </view>
        <u-empty v-if="mutualList.length === 0" text="暂无互相心动的人" mode="message"></u-empty>
      </view>

      <!-- 谁喜欢我列表 -->
      <view v-if="currentTab === 1">
        <view class="list-item blur-item" v-for="item in likedList" :key="item.interaction_id" @click="unlockProfile">
          <!-- 前端实现高斯模糊，吸引用户付费或联系红娘解锁 -->
          <view class="avatar-wrap">
            <image class="avatar blur" :src="item.avatar || '/static/default-avatar.png'"></image>
            <view class="lock-icon"><u-icon name="lock-fill" color="#fff" size="20"></u-icon></view>
          </view>
          <view class="info">
            <view class="name-time">
              <text class="name">{{ item.name }}</text>
              <text class="time">{{ item.created_at }}</text>
            </view>
            <text class="desc">TA看了你的资料，非常心动！</text>
          </view>
          <u-button type="primary" plain size="mini" shape="circle" color="#FF4D6A" text="解锁查看"></u-button>
        </view>
        <u-empty v-if="likedList.length === 0" text="还没有人对你心动，去完善资料吧" mode="message"></u-empty>
      </view>
    </scroll-view>

    <!-- 解锁提示弹窗 -->
    <u-modal :show="showUnlockModal" title="解锁查看特权" content="联系您的专属红娘，或开通VIP即可查看谁喜欢了你。" :showCancelButton="true" confirmText="联系红娘" confirmColor="#FF4D6A" @confirm="contactManager" @cancel="showUnlockModal = false"></u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { cInteract } from '@/api/c_api'

const tabList = ref([{ name: '互相心动' }, { name: '谁喜欢我' }])
const currentTab = ref(0)

const mutualList = ref<any[]>([])
const likedList = ref<any[]>([])
const showUnlockModal = ref(false)

onShow(() => {
  fetchData()
})

const tabChange = (item: any) => {
  currentTab.value = item.index
  fetchData()
}

const fetchData = async () => {
  if (currentTab.value === 0) {
    const res: any = await cInteract.getMutualMatches()
    if (res.code === 200) mutualList.value = res.data || []
  } else {
    const res: any = await cInteract.getReceivedLikes()
    if (res.code === 200) likedList.value = res.data || []
  }
}

const unlockProfile = () => {
  showUnlockModal.value = true
}

const contactManager = () => {
  showUnlockModal.value = false
  // 模拟联系红娘，可以跳转到客服或者拨打电话
  uni.showToast({ title: '已通知专属红娘', icon: 'success' })
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}

.tabs {
  background: #fff;
}

.list-container {
  flex: 1;
  padding: 20rpx;
}

.list-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.02);

  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }

  .avatar-wrap {
    position: relative;
    width: 100rpx;
    height: 100rpx;
    margin-right: 20rpx;

    .blur {
      filter: blur(8px);
    }

    .lock-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.4);
      border-radius: 50%;
      padding: 10rpx;
    }
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .name-time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;

      .name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      .time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .desc {
      font-size: 26rpx;
      color: #666;
    }
  }
}
</style>
