<template>
  <view class="container">
    <!-- 顶部统计卡片 -->
    <view class="stats-card" :style="{ animationDelay: '0ms' }">
      <view class="stats-bg">
        <view class="bg-pattern"></view>
      </view>
      <view class="stats-content">
        <view class="stat-item" @click="changeFilter(-1)">
          <view class="stat-icon all">
            <u-icon name="list" size="20" color="#fff"></u-icon>
          </view>
          <text class="stat-num">{{ stats.total || 0 }}</text>
          <text class="stat-label">全部提醒</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @click="changeFilter(0)">
          <view class="stat-icon pending">
            <u-icon name="clock" size="20" color="#fff"></u-icon>
          </view>
          <text class="stat-num pending">{{ stats.pending || 0 }}</text>
          <text class="stat-label">待处理</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item" @click="changeFilter(1)">
          <view class="stat-icon today">
            <u-icon name="calendar" size="20" color="#fff"></u-icon>
          </view>
          <text class="stat-num today">{{ stats.today || 0 }}</text>
          <text class="stat-label">今日提醒</text>
        </view>
      </view>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-section" :style="{ animationDelay: '100ms' }">
      <scroll-view scroll-x class="filter-scroll" show-scrollbar="false">
        <view class="filter-list">
          <view 
            class="filter-item" 
            :class="{ active: isDone === -1 }"
            @click="changeFilter(-1)"
          >
            <u-icon name="list" size="14" :color="isDone === -1 ? '#fff' : '#86909C'"></u-icon>
            <text>全部</text>
          </view>
          <view 
            class="filter-item" 
            :class="{ active: isDone === 0 }"
            @click="changeFilter(0)"
          >
            <u-icon name="clock" size="14" :color="isDone === 0 ? '#fff' : '#86909C'"></u-icon>
            <text>待处理</text>
          </view>
          <view 
            class="filter-item" 
            :class="{ active: isDone === 1 }"
            @click="changeFilter(1)"
          >
            <u-icon name="checkmark-circle" size="14" :color="isDone === 1 ? '#fff' : '#86909C'"></u-icon>
            <text>已完成</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 提醒列表 -->
    <scroll-view scroll-y class="reminder-list" @scrolltolower="loadMore" enhanced show-scrollbar>
      <view v-if="loading && page === 1" class="loading-container">
        <view v-for="i in 4" :key="i" class="skeleton-item">
          <view class="skeleton-icon"></view>
          <view class="skeleton-content">
            <view class="skeleton-line"></view>
            <view class="skeleton-line short"></view>
          </view>
        </view>
      </view>

      <view v-else-if="reminderList.length === 0" class="empty-container">
        <view class="empty-illustration">
          <u-icon name="calendar" size="80" color="#E5E6EB"></u-icon>
          <view class="empty-ring ring-1"></view>
          <view class="empty-ring ring-2"></view>
        </view>
        <text class="empty-title">暂无提醒</text>
        <text class="empty-desc">您可以创建新的提醒事项</text>
        <view class="empty-action" @click="createReminder">
          <text>创建提醒</text>
        </view>
      </view>

      <view v-else class="reminder-items">
        <view 
          v-for="(item, index) in reminderList" 
          :key="item.id"
          class="reminder-card"
          :class="{ 
            'priority-high': item.priority === 3,
            'is-done': item.is_done === 1 
          }"
          :style="{ animationDelay: `${index * 60}ms` }"
        >
          <!-- 左侧图标 -->
          <view class="reminder-icon" :class="getTypeClass(item.type)">
            <text class="icon-text">{{ getTypeIcon(item.type) }}</text>
            <view class="icon-ring"></view>
          </view>

          <!-- 中间内容 -->
          <view class="reminder-content" @click="goToDetail(item)">
            <view class="content-header">
              <text class="reminder-title">{{ item.title }}</text>
              <view v-if="item.priority === 3" class="priority-badge">
                <u-icon name="flag" size="10" color="#fff"></u-icon>
                <text>高优先级</text>
              </view>
            </view>
            <text class="reminder-desc">{{ item.content }}</text>
            <view class="reminder-meta">
              <view class="meta-item">
                <u-icon name="clock" size="12" :color="getMetaColor(item)"></u-icon>
                <text :style="{ color: getMetaColor(item) }">{{ formatTime(item.remind_at) }}</text>
              </view>
              <view class="meta-divider" v-if="item.client"></view>
              <view class="meta-item" v-if="item.client">
                <u-icon name="account" size="12" color="#FF5E78"></u-icon>
                <text class="client-name">{{ item.client.name }}</text>
              </view>
            </view>
          </view>

          <!-- 右侧操作 -->
          <view class="reminder-actions">
            <view v-if="item.is_done === 0" class="action-btn complete" @click.stop="markDone(item.id)">
              <u-icon name="checkmark" size="14" color="#fff"></u-icon>
            </view>
            <view v-else class="done-badge">
              <u-icon name="checkmark-circle-fill" size="24" color="#52C41A"></u-icon>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="hasMore" class="load-more">
          <u-loading-icon size="20" mode="circle"></u-loading-icon>
          <text>加载中...</text>
        </view>
        <view v-else-if="reminderList.length > 0" class="no-more">
          <view class="no-more-line"></view>
          <text>没有更多了</text>
          <view class="no-more-line"></view>
        </view>
      </view>
    </scroll-view>

    <!-- 悬浮添加按钮 -->
    <view class="fab-btn" @click="createReminder">
      <u-icon name="plus" size="28" color="#fff"></u-icon>
    </view>
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
      isDone: -1,
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
        1: '📞',
        2: '🎂',
        3: '💕',
        4: '⚠️'
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
      return classes[type] || 'type-default'
    },
    getMetaColor(item) {
      if (item.is_done === 1) return '#86909C'
      const remindTime = new Date(item.remind_at).getTime()
      const now = new Date().getTime()
      if (remindTime < now) return '#FF4D4F'
      return '#86909C'
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
    },
    createReminder() {
      uni.showToast({ title: '功能开发中', icon: 'none' })
    }
  }
}
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

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F7FA 0%, #ffffff 20%, #F5F7FA 100%);
  padding-bottom: 100px;
}

// Stats Card
.stats-card {
  position: relative;
  margin: 16px;
  background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 50%, #FFB5C0 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(255, 94, 120, 0.25);
  animation: fadeInUp 0.5s ease-out both;
}

.stats-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  
  .bg-pattern {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
    border-radius: 50%;
  }
}

.stats-content {
  position: relative;
  display: flex;
  align-items: center;
  padding: 24px 16px;
  z-index: 1;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    opacity: 0.9;
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 4px;
  
  &.all { background: rgba(255, 255, 255, 0.25); }
  &.pending { background: rgba(255, 249, 196, 0.3); }
  &.today { background: rgba(200, 230, 201, 0.3); }
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  &.pending {
    color: #FFF9C4;
  }
  
  &.today {
    color: #C8E6C9;
  }
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 50px;
  background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
}

// Filter Section
.filter-section {
  margin: 16px;
  animation: fadeInUp 0.5s ease-out both;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-list {
  display: flex;
  gap: 12px;
  padding: 4px;
}

.filter-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
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

// Reminder List
.reminder-list {
  height: calc(100vh - 320px);
  padding: 0 16px;
}

// Loading Skeleton
.loading-container {
  padding: 8px 0;
}

.skeleton-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .skeleton-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
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
    height: 16px;
    background: linear-gradient(90deg, #F2F3F5 25%, #E5E6EB 50%, #F2F3F5 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 10px;
    
    &.short {
      width: 60%;
      height: 12px;
    }
  }
}

// Empty State
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 40px;
  
  .empty-illustration {
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 24px;
    
    .empty-ring {
      position: absolute;
      border: 2px solid #E5E6EB;
      border-radius: 50%;
      
      &.ring-1 {
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        animation: pulse 2s ease-in-out infinite;
      }
      
      &.ring-2 {
        top: -20px;
        left: -20px;
        right: -20px;
        bottom: -20px;
        animation: pulse 2s ease-in-out infinite 0.5s;
      }
    }
    
    :deep(.u-icon) {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
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
    margin-bottom: 24px;
  }
  
  .empty-action {
    padding: 12px 32px;
    background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
    border-radius: 24px;
    box-shadow: 0 4px 16px rgba(255, 94, 120, 0.35);
    
    text {
      color: #fff;
      font-size: 15px;
      font-weight: 600;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

// Reminder Items
.reminder-items {
  padding: 8px 0;
}

.reminder-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.5s ease-out both;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:active {
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: transparent;
    transition: all 0.3s ease;
  }
  
  &.priority-high::before {
    background: linear-gradient(180deg, #FF4D4F 0%, #FF7875 100%);
  }
  
  &.is-done {
    opacity: 0.7;
    background: linear-gradient(90deg, #F5F7FA 0%, #fff 100%);
    
    .reminder-title,
    .reminder-desc {
      text-decoration: line-through;
      color: #86909C;
    }
  }
}

// Reminder Icon
.reminder-icon {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  
  .icon-text {
    font-size: 28px;
    z-index: 1;
  }
  
  .icon-ring {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 20px;
    opacity: 0.3;
    animation: pulse 2s ease-in-out infinite;
  }
  
  &.type-followup {
    background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
    .icon-ring { background: linear-gradient(135deg, #4A90E2 0%, #6BB3FF 100%); }
  }
  
  &.type-birthday {
    background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
    .icon-ring { background: linear-gradient(135deg, #FF9F00 0%, #FFC53D 100%); }
  }
  
  &.type-anniversary {
    background: linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%);
    .icon-ring { background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%); }
  }
  
  &.type-warning {
    background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
    .icon-ring { background: linear-gradient(135deg, #FF4D4F 0%, #FF7875 100%); }
  }
  
  &.type-default {
    background: linear-gradient(135deg, #F5F7FA 0%, #E5E6EB 100%);
    .icon-ring { background: linear-gradient(135deg, #86909C 0%, #C9CDD4 100%); }
  }
}

// Reminder Content
.reminder-content {
  flex: 1;
  min-width: 0;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.reminder-title {
  font-size: 16px;
  font-weight: 600;
  color: #1D2129;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.priority-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #FF4D4F 0%, #FF7875 100%);
  padding: 4px 10px;
  border-radius: 12px;
  margin-left: 8px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.25);
  
  text {
    font-size: 11px;
    color: #fff;
    font-weight: 600;
  }
}

.reminder-desc {
  font-size: 14px;
  color: #4E5969;
  margin-bottom: 10px;
  display: block;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.reminder-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.meta-divider {
  width: 1px;
  height: 12px;
  background: #E5E6EB;
}

.client-name {
  color: #FF5E78;
  font-weight: 600;
}

// Reminder Actions
.reminder-actions {
  margin-left: 12px;
  padding-left: 12px;
  border-left: 1px dashed #E5E6EB;
}

.action-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &.complete {
    background: linear-gradient(135deg, #52C41A 0%, #73D13D 100%);
    box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
    
    &:active {
      transform: scale(0.9);
      box-shadow: 0 2px 8px rgba(82, 196, 26, 0.2);
    }
  }
}

.done-badge {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Load More
.load-more, .no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  font-size: 14px;
  color: #86909C;
}

.no-more {
  gap: 12px;
  
  .no-more-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #E5E6EB 50%, transparent 100%);
    max-width: 60px;
  }
  
  text {
    color: #C0C4CC;
  }
}

// FAB Button
.fab-btn {
  position: fixed;
  bottom: 40px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(255, 94, 120, 0.4);
  z-index: 100;
  animation: float 3s ease-in-out infinite;
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 4px 12px rgba(255, 94, 120, 0.3);
  }
}
</style>
