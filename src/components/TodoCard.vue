<!-- 待办提醒卡片组件 -->
<template>
  <view class="todo-card" v-if="visible">
    <view class="todo-header">
      <text class="todo-title">👋 早上好，今天有 {{ total }} 件事</text>
      <text class="todo-close" @click="close">×</text>
    </view>
    
    <view class="todo-list">
      <!-- 高优先级提醒（流失风险等）-->
      <view 
        v-for="item in highPriorityList" 
        :key="item.id"
        class="todo-item todo-high"
        @click="goToClient(item)"
      >
        <view class="todo-icon">⚠️</view>
        <view class="todo-content">
          <text class="todo-text">{{ item.title }}</text>
          <text class="todo-time">{{ formatTime(item.remind_at) }}</text>
        </view>
        <view class="todo-action">
          <button size="mini" type="warn" @click.stop="markDone(item.id)">完成</button>
        </view>
      </view>

      <!-- 生日提醒 -->
      <view 
        v-for="item in birthdayList" 
        :key="item.id"
        class="todo-item todo-birthday"
        @click="goToClient(item)"
      >
        <view class="todo-icon">🎂</view>
        <view class="todo-content">
          <text class="todo-text">{{ item.title }}</text>
          <text class="todo-time">{{ item.content }}</text>
        </view>
        <view class="todo-action">
          <button size="mini" type="primary" @click.stop="markDone(item.id)">已祝福</button>
        </view>
      </view>

      <!-- 回访提醒 -->
      <view 
        v-for="item in followUpList" 
        :key="item.id"
        class="todo-item"
        @click="goToClient(item)"
      >
        <view class="todo-icon">📞</view>
        <view class="todo-content">
          <text class="todo-text">{{ item.title }}</text>
          <text class="todo-time">{{ item.content }}</text>
        </view>
        <view class="todo-action">
          <button size="mini" @click.stop="markDone(item.id)">完成</button>
        </view>
      </view>

      <!-- 纪念日提醒 -->
      <view 
        v-for="item in anniversaryList" 
        :key="item.id"
        class="todo-item todo-anniversary"
        @click="goToMatch(item)"
      >
        <view class="todo-icon">💕</view>
        <view class="todo-content">
          <text class="todo-text">{{ item.title }}</text>
          <text class="todo-time">{{ item.content }}</text>
        </view>
        <view class="todo-action">
          <button size="mini" type="primary" @click.stop="markDone(item.id)">已跟进</button>
        </view>
      </view>
    </view>

    <view class="todo-footer" @click="goToReminderList">
      <text>查看全部提醒 ({{ pendingCount }} 个待处理)</text>
      <text class="arrow">→</text>
    </view>
  </view>
</template>

<script>
import { getPendingReminders, markReminderAsDone } from '@/api/reminder'

export default {
  name: 'TodoCard',
  data() {
    return {
      visible: true,
      reminderList: [],
      pendingCount: 0
    }
  },
  computed: {
    total() {
      return this.reminderList.length
    },
    highPriorityList() {
      return this.reminderList.filter(item => item.priority === 3 && item.type === 4)
    },
    birthdayList() {
      return this.reminderList.filter(item => item.type === 2)
    },
    followUpList() {
      return this.reminderList.filter(item => item.type === 1)
    },
    anniversaryList() {
      return this.reminderList.filter(item => item.type === 3)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const data = await getPendingReminders()
        this.reminderList = data.list || []
        this.pendingCount = this.reminderList.length
      } catch (e) {
        console.error('加载提醒失败:', e)
      }
    },
    close() {
      this.visible = false
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      const now = new Date()
      const diff = now - date
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return '今天'
      if (days === 1) return '昨天'
      if (days < 7) return `${days}天前`
      return `${Math.floor(days / 7)}周前`
    },
    async markDone(id) {
      try {
        await markReminderAsDone(id)
        uni.showToast({ title: '已标记完成', icon: 'success' })
        this.reminderList = this.reminderList.filter(item => item.id !== id)
        this.pendingCount = this.reminderList.length
      } catch (e) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    goToClient(item) {
      if (item.client_id) {
        uni.navigateTo({
          url: `/pages/client/detail?id=${item.client_id}`
        })
      }
    },
    goToMatch(item) {
      if (item.match_record_id) {
        uni.navigateTo({
          url: `/pages/match/detail?id=${item.match_record_id}`
        })
      }
    },
    goToReminderList() {
      uni.navigateTo({
        url: '/pages/reminder/list'
      })
    }
  }
}
</script>

<style scoped>
.todo-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  padding: 30rpx;
  margin: 20rpx;
  color: #fff;
  box-shadow: 0 8rpx 32rpx rgba(102, 126, 234, 0.3);
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.todo-title {
  font-size: 32rpx;
  font-weight: bold;
}

.todo-close {
  font-size: 40rpx;
  opacity: 0.8;
  padding: 10rpx;
}

.todo-list {
  max-height: 600rpx;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  backdrop-filter: blur(10px);
}

.todo-high {
  background: rgba(255, 107, 107, 0.3);
  border: 2rpx solid rgba(255, 107, 107, 0.5);
}

.todo-birthday {
  background: rgba(255, 193, 7, 0.3);
  border: 2rpx solid rgba(255, 193, 7, 0.5);
}

.todo-anniversary {
  background: rgba(233, 30, 99, 0.3);
  border: 2rpx solid rgba(233, 30, 99, 0.5);
}

.todo-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.todo-content {
  flex: 1;
  min-width: 0;
}

.todo-text {
  font-size: 28rpx;
  font-weight: 500;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todo-time {
  font-size: 24rpx;
  opacity: 0.8;
  margin-top: 8rpx;
  display: block;
}

.todo-action {
  margin-left: 20rpx;
}

.todo-action button {
  margin: 0;
  font-size: 24rpx;
  padding: 0 20rpx;
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: none;
}

.todo-high .todo-action button {
  background: #ff6b6b;
  color: #fff;
}

.todo-birthday .todo-action button {
  background: #ffc107;
  color: #333;
}

.todo-anniversary .todo-action button {
  background: #e91e63;
  color: #fff;
}

.todo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid rgba(255, 255, 255, 0.2);
  font-size: 26rpx;
  opacity: 0.9;
}

.arrow {
  font-size: 32rpx;
}
</style>
