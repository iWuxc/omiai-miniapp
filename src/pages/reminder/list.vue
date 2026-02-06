<template>
  <view class="container">
    <!-- 统计卡片 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-num">{{ stats.total }}</text>
        <text class="stat-label">全部提醒</text>
      </view>
      <view class="stat-item">
        <text class="stat-num stat-pending">{{ stats.pending }}</text>
        <text class="stat-label">待处理</text>
      </view>
      <view class="stat-item">
        <text class="stat-num stat-today">{{ stats.today }}</text>
        <text class="stat-label">今日提醒</text>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tabs">
      <view 
        class="tab-item" 
        :class="{ active: isDone === -1 }"
        @click="changeFilter(-1)"
      >
        全部
      </view>
      <view 
        class="tab-item" 
        :class="{ active: isDone === 0 }"
        @click="changeFilter(0)"
      >
        待处理
      </view>
      <view 
        class="tab-item" 
        :class="{ active: isDone === 1 }"
        @click="changeFilter(1)"
      >
        已完成
      </view>
    </view>

    <!-- 提醒列表 -->
    <scroll-view scroll-y class="reminder-list" @scrolltolower="loadMore">
      <view v-if="loading && page === 1" class="loading">
        <text>加载中...</text>
      </view>

      <view v-else-if="reminderList.length === 0" class="empty">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无提醒</text>
      </view>

      <view v-else>
        <view 
          v-for="item in reminderList" 
          :key="item.id"
          class="reminder-item"
          :class="{ 
            'reminder-high': item.priority === 3,
            'reminder-done': item.is_done === 1 
          }"
        >
          <!-- 左侧类型图标 -->
          <view class="reminder-icon" :class="getTypeClass(item.type)">
            <text>{{ getTypeIcon(item.type) }}</text>
          </view>

          <!-- 中间内容 -->
          <view class="reminder-content" @click="goToDetail(item)">
            <view class="reminder-header">
              <text class="reminder-title">{{ item.title }}</text>
              <view v-if="item.priority === 3" class="priority-badge">高</view>
            </view>
            <text class="reminder-desc">{{ item.content }}</text>
            <view class="reminder-meta">
              <text class="reminder-time">{{ formatTime(item.remind_at) }}</text>
              <text v-if="item.client" class="reminder-client">{{ item.client.name }}</text>
            </view>
          </view>

          <!-- 右侧操作 -->
          <view class="reminder-actions">
            <view v-if="item.is_done === 0" class="action-btns">
              <button size="mini" class="btn-done" @click="markDone(item.id)">完成</button>
            </view>
            <view v-else class="done-tag">
              <text>✓ 已完成</text>
            </view>
          </view>
        </view>

        <view v-if="hasMore" class="load-more">
          <text>加载更多...</text>
        </view>
        <view v-else-if="reminderList.length > 0" class="no-more">
          <text>没有更多了</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getReminderList, getReminderStats, markReminderAsDone, deleteReminder } from '@/api/reminder'

export default {
  data() {
    return {
      reminderList: [],
      stats: {
        total: 0,
        pending: 0,
        today: 0
      },
      isDone: -1, // -1=全部, 0=未完成, 1=已完成
      page: 1,
      pageSize: 20,
      loading: false,
      hasMore: true
    }
  },
  onLoad() {
    this.loadStats()
    this.loadList()
  },
  onPullDownRefresh() {
    this.refresh()
    uni.stopPullDownRefresh()
  },
  methods: {
    async loadStats() {
      try {
        const data = await getReminderStats()
        this.stats = data
      } catch (e) {
        console.error('加载统计失败:', e)
      }
    },
    async loadList() {
      if (this.loading) return
      this.loading = true

      try {
        const data = await getReminderList({
          page: this.page,
          page_size: this.pageSize,
          is_done: this.isDone
        })

        if (this.page === 1) {
          this.reminderList = data.list || []
        } else {
          this.reminderList = [...this.reminderList, ...data.list]
        }
        this.hasMore = this.reminderList.length < data.total
      } catch (e) {
        console.error('加载列表失败:', e)
        uni.showToast({ title: '加载失败', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    refresh() {
      this.page = 1
      this.hasMore = true
      this.loadStats()
      this.loadList()
    },
    loadMore() {
      if (!this.hasMore || this.loading) return
      this.page++
      this.loadList()
    },
    changeFilter(isDone) {
      this.isDone = isDone
      this.page = 1
      this.reminderList = []
      this.loadList()
    },
    getTypeIcon(type) {
      const icons = {
        1: '📞', // 回访
        2: '🎂', // 生日
        3: '💕', // 纪念日
        4: '⚠️'  // 流失预警
      }
      return icons[type] || '📌'
    },
    getTypeClass(type) {
      const classes = {
        1: 'type-followup',
        2: 'type-birthday',
        3: 'type-anniversary',
        4: 'type-warning'
      }
      return classes[type] || ''
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const remindDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      
      if (remindDate.getTime() === today.getTime()) {
        return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      }
      
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      if (remindDate.getTime() === yesterday.getTime()) {
        return '昨天'
      }
      
      const diff = today - remindDate
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      if (days < 7) {
        return `${days}天前`
      }
      
      return `${date.getMonth() + 1}月${date.getDate()}日`
    },
    async markDone(id) {
      try {
        await markReminderAsDone(id)
        uni.showToast({ title: '已标记完成', icon: 'success' })
        this.refresh()
      } catch (e) {
        uni.showToast({ title: '操作失败', icon: 'none' })
      }
    },
    async deleteItem(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这个提醒吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await deleteReminder(id)
              uni.showToast({ title: '删除成功', icon: 'success' })
              this.refresh()
            } catch (e) {
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    },
    goToDetail(item) {
      if (item.client_id) {
        uni.navigateTo({
          url: `/pages/client/detail?id=${item.client_id}`
        })
      } else if (item.match_record_id) {
        uni.navigateTo({
          url: `/pages/match/detail?id=${item.match_record_id}`
        })
      }
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 统计卡片 */
.stats-card {
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 20rpx;
  margin: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.3);
}

.stat-item {
  flex: 1;
  text-align: center;
  color: #fff;
}

.stat-num {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
}

.stat-pending {
  color: #ffd700;
}

.stat-today {
  color: #90ee90;
}

.stat-label {
  font-size: 24rpx;
  opacity: 0.9;
  margin-top: 8rpx;
  display: block;
}

/* 筛选标签 */
.filter-tabs {
  display: flex;
  background: #fff;
  padding: 20rpx;
  margin: 0 20rpx 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
  transition: all 0.3s;
}

.tab-item.active {
  background: #667eea;
  color: #fff;
  font-weight: 500;
}

/* 列表 */
.reminder-list {
  height: calc(100vh - 320rpx);
  padding: 0 20rpx;
}

.loading, .empty, .no-more, .load-more {
  text-align: center;
  padding: 40rpx;
  color: #999;
  font-size: 28rpx;
}

.empty-icon {
  font-size: 80rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
  color: #999;
}

/* 提醒项 */
.reminder-item {
  display: flex;
  align-items: flex-start;
  background: #fff;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.reminder-high {
  border-left: 8rpx solid #ff6b6b;
  background: #fff5f5;
}

.reminder-done {
  opacity: 0.6;
}

.reminder-done .reminder-title,
.reminder-done .reminder-desc {
  text-decoration: line-through;
  color: #999;
}

/* 图标 */
.reminder-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.type-followup {
  background: #e3f2fd;
}

.type-birthday {
  background: #fff3e0;
}

.type-anniversary {
  background: #fce4ec;
}

.type-warning {
  background: #ffebee;
}

/* 内容 */
.reminder-content {
  flex: 1;
  min-width: 0;
}

.reminder-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.reminder-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.priority-badge {
  background: #ff6b6b;
  color: #fff;
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  margin-left: 12rpx;
}

.reminder-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  display: block;
  line-height: 1.5;
}

.reminder-meta {
  display: flex;
  font-size: 24rpx;
  color: #999;
}

.reminder-time {
  margin-right: 20rpx;
}

.reminder-client {
  color: #667eea;
}

/* 操作 */
.reminder-actions {
  margin-left: 20rpx;
  flex-shrink: 0;
}

.btn-done {
  background: #667eea;
  color: #fff;
  border: none;
  font-size: 24rpx;
  padding: 0 24rpx;
  margin: 0;
}

.done-tag {
  color: #52c41a;
  font-size: 24rpx;
  font-weight: 500;
}
</style>
