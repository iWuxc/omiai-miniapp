<template>
  <view class="match-detail-container">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <u-icon name="arrow-left" size="22" color="#1D2129"></u-icon>
        </view>
        <text class="nav-title">牵手档案</text>
        <view class="more-btn" @click="showMoreMenu">
          <u-icon name="more-dot-fill" size="22" color="#1D2129"></u-icon>
        </view>
      </view>
    </view>

    <!-- 主体内容 -->
    <scroll-view 
      scroll-y 
      class="content-scroll"
      :style="{ paddingTop: (statusBarHeight + 44) + 'px' }"
    >
      <!-- 情侣核心卡片 -->
      <view class="couple-card" v-if="record.male_client && record.female_client">
        <!-- 背景装饰 -->
        <view class="card-bg">
          <view class="bg-circle circle-1"></view>
          <view class="bg-circle circle-2"></view>
          <view class="bg-heart">💕</view>
        </view>

        <!-- 情侣信息 -->
        <view class="couple-content">
          <!-- 男方 -->
          <view class="person-card male">
            <view class="avatar-wrapper" @click="previewAvatar(record.male_client?.avatar)">
              <image 
                :src="record.male_client?.avatar || defaultAvatar" 
                class="person-avatar"
                mode="aspectFill"
              />
              <view class="gender-badge male">
                <u-icon name="man" size="12" color="#fff"></u-icon>
              </view>
            </view>
            <view class="person-info">
              <text class="person-name">{{ record.male_client?.name }}</text>
              <text class="person-meta">{{ record.male_client?.age }}岁 · {{ record.male_client?.profession || '未知职业' }}</text>
            </view>
          </view>

          <!-- 中间匹配信息 -->
          <view class="match-center">
            <view class="heart-container">
              <view class="heart-bg">
                <u-icon name="heart-fill" color="#FF5E78" size="32"></u-icon>
              </view>
              <view class="pulse-ring"></view>
              <view class="pulse-ring delay"></view>
            </view>
            <view class="match-score">
              <text class="score-num">{{ record.match_score || 0 }}</text>
              <text class="score-unit">%匹配</text>
            </view>
            <view class="match-days" v-if="record.match_date">
              <text class="days-num">{{ getTogetherDays(record.match_date) }}</text>
              <text class="days-text">天</text>
            </view>
          </view>

          <!-- 女方 -->
          <view class="person-card female">
            <view class="avatar-wrapper" @click="previewAvatar(record.female_client?.avatar)">
              <image 
                :src="record.female_client?.avatar || defaultAvatar" 
                class="person-avatar"
                mode="aspectFill"
              />
              <view class="gender-badge female">
                <u-icon name="woman" size="12" color="#fff"></u-icon>
              </view>
            </view>
            <view class="person-info">
              <text class="person-name">{{ record.female_client?.name }}</text>
              <text class="person-meta">{{ record.female_client?.age }}岁 · {{ record.female_client?.profession || '未知职业' }}</text>
            </view>
          </view>
        </view>

        <!-- 关系状态条 -->
        <view class="status-bar" @click="showStatusModal = true">
          <view class="status-track">
            <view 
              class="status-progress" 
              :style="{ width: getStatusProgress(record.status) + '%' }"
            ></view>
            <view 
              v-for="(status, index) in statusList" 
              :key="index"
              class="status-point"
              :class="{ 
                active: index < getStatusIndex(record.status),
                current: index === getStatusIndex(record.status)
              }"
              :style="{ left: (index / (statusList.length - 1)) * 100 + '%' }"
            >
              <view class="point-dot"></view>
              <text class="point-label">{{ status.label }}</text>
            </view>
          </view>
          <view class="status-edit-hint">
            <u-icon name="edit-pen" size="12" color="#909399"></u-icon>
            <text>点击更新状态</text>
          </view>
        </view>

        <!-- 基础信息 -->
        <view class="base-info">
          <view class="info-item">
            <u-icon name="calendar" size="14" color="#FF5E78"></u-icon>
            <text class="info-label">牵手日期</text>
            <text class="info-value">{{ formatDate(record.match_date) }}</text>
          </view>
          <view class="info-item" v-if="record.remark">
            <u-icon name="edit-pen" size="14" color="#FF5E78"></u-icon>
            <text class="info-label">红娘备注</text>
            <text class="info-value">{{ record.remark }}</text>
          </view>
        </view>
      </view>

      <!-- 快捷操作栏 -->
      <view class="quick-actions">
        <view class="action-item" @click="showFollowUpModal = true">
          <view class="action-icon primary">
            <u-icon name="phone-fill" size="20" color="#fff"></u-icon>
          </view>
          <text class="action-text">添加回访</text>
        </view>
        <view class="action-item" @click="navigateToCompare">
          <view class="action-icon secondary">
            <u-icon name="file-text-fill" size="20" color="#fff"></u-icon>
          </view>
          <text class="action-text">查看档案</text>
        </view>
        <view class="action-item" @click="showStatusModal = true">
          <view class="action-icon success">
            <u-icon name="edit-pen" size="20" color="#fff"></u-icon>
          </view>
          <text class="action-text">更新状态</text>
        </view>
      </view>

      <!-- 关系历程时间轴 -->
      <view class="section-block">
        <view class="section-header">
          <view class="header-icon">
            <u-icon name="clock" size="18" color="#fff"></u-icon>
          </view>
          <text class="header-title">爱情历程</text>
          <view class="header-line"></view>
        </view>

        <view class="timeline-container">
          <view v-if="statusHistory.length === 0" class="empty-timeline">
            <image class="empty-img" src="https://cdn.uviewui.com/uview/empty/data.png" mode="aspectFit"></image>
            <text class="empty-text">暂无历程记录，开始记录你们的爱情故事吧</text>
          </view>
          
          <view v-else class="timeline">
            <view 
              v-for="(item, index) in statusHistory" 
              :key="item.id"
              class="timeline-item"
              :class="{ last: index === statusHistory.length - 1 }"
              :style="{ animationDelay: index * 0.1 + 's' }"
            >
              <view class="timeline-marker">
                <view class="marker-dot" :class="getStatusClass(item.new_status)"></view>
                <view class="marker-line" v-if="index !== statusHistory.length - 1"></view>
              </view>
              <view class="timeline-content">
                <view class="content-header">
                  <text class="status-name">{{ getStatusText(item.new_status) }}</text>
                  <text class="change-date">{{ formatDate(item.change_time) }}</text>
                </view>
                <view class="content-body" v-if="item.reason">
                  <text class="change-reason">{{ item.reason }}</text>
                </view>
                <view class="content-footer">
                  <u-icon name="account" size="12" color="#C0C4CC"></u-icon>
                  <text class="operator">{{ item.operator || '系统' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 回访记录 -->
      <view class="section-block">
        <view class="section-header">
          <view class="header-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <u-icon name="phone" size="18" color="#fff"></u-icon>
          </view>
          <text class="header-title">回访记录</text>
          <view class="header-badge">{{ followUps.length }}条</view>
          <view class="header-line"></view>
        </view>

        <view class="followup-container">
          <view v-if="followUps.length === 0" class="empty-followup">
            <view class="empty-icon">
              <u-icon name="phone" size="40" color="#E5E7EB"></u-icon>
            </view>
            <text class="empty-text">暂无回访记录</text>
            <text class="empty-sub">点击上方"添加回访"记录第一次联系</text>
          </view>

          <view v-else class="followup-list">
            <view 
              v-for="(item, index) in followUps" 
              :key="item.id"
              class="followup-card"
              :class="{ highlight: item.satisfaction >= 4 }"
              :style="{ animationDelay: index * 0.08 + 's' }"
            >
              <!-- 卡片头部 -->
              <view class="card-header">
                <view class="header-left">
                  <view class="method-tag" :class="item.method">
                    <u-icon 
                      :name="getMethodIcon(item.method)" 
                      size="12" 
                      color="#fff"
                    ></u-icon>
                    <text>{{ item.method }}</text>
                  </view>
                  <text class="visit-date">{{ formatDate(item.follow_up_date) }}</text>
                </view>
                <view class="satisfaction-stars">
                  <u-rate 
                    :count="5" 
                    v-model="item.satisfaction" 
                    disabled 
                    size="14" 
                    active-color="#FFB800"
                    inactive-color="#E5E7EB"
                  ></u-rate>
                </view>
              </view>

              <!-- 回访内容 -->
              <view class="card-body">
                <view class="content-section">
                  <text class="section-label">回访内容</text>
                  <text class="section-content">{{ item.content }}</text>
                </view>

                <view class="content-section" v-if="item.feedback">
                  <text class="section-label">客户反馈</text>
                  <view class="feedback-box">
                    <text class="section-content">{{ item.feedback }}</text>
                  </view>
                </view>
              </view>

              <!-- 下次回访提醒 -->
              <view class="card-footer" v-if="item.next_follow_up_at">
                <view class="reminder-tag">
                  <u-icon name="bell" size="12" color="#FF5E78"></u-icon>
                  <text>下次回访：{{ formatDate(item.next_follow_up_at) }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部留白 -->
      <view class="footer-spacer"></view>
    </scroll-view>

    <!-- 添加回访 Modal -->
    <u-popup :show="showFollowUpModal" mode="bottom" @close="showFollowUpModal = false" round="20">
      <view class="modal-container">
        <view class="modal-header">
          <text class="modal-title">添加回访记录</text>
          <u-icon name="close" size="24" color="#909399" @click="showFollowUpModal = false"></u-icon>
        </view>

        <scroll-view scroll-y class="modal-body">
          <view class="form-group">
            <text class="form-label">回访方式 <text class="required">*</text></text>
            <view class="method-selector">
              <view 
                v-for="method in ['电话', '面谈', '线上']" 
                :key="method"
                class="method-item"
                :class="{ active: followUpForm.method === method }"
                @click="followUpForm.method = method"
              >
                <u-icon :name="getMethodIcon(method)" size="18" :color="followUpForm.method === method ? '#FF5E78' : '#909399'"></u-icon>
                <text>{{ method }}</text>
              </view>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">回访内容 <text class="required">*</text></text>
            <textarea 
              v-model="followUpForm.content" 
              class="form-textarea"
              placeholder="详细记录本次回访的内容、客户的反馈和情绪状态..."
              maxlength="500"
            ></textarea>
            <text class="char-count">{{ followUpForm.content.length }}/500</text>
          </view>

          <view class="form-group">
            <text class="form-label">客户反馈</text>
            <textarea 
              v-model="followUpForm.feedback" 
              class="form-textarea"
              placeholder="客户对相亲对象的意见或建议..."
              maxlength="300"
            ></textarea>
            <text class="char-count">{{ followUpForm.feedback.length }}/300</text>
          </view>

          <view class="form-group">
            <text class="form-label">满意程度</text>
            <view class="satisfaction-selector">
              <u-rate 
                v-model="followUpForm.satisfaction" 
                :count="5" 
                size="28"
                active-color="#FFB800"
                gutter="10"
              ></u-rate>
              <text class="satisfaction-text">{{ getSatisfactionText(followUpForm.satisfaction) }}</text>
            </view>
          </view>

          <view class="form-group">
            <text class="form-label">下次回访</text>
            <view class="date-selector">
              <view class="date-input" @click="showDatePicker = true">
                <u-icon name="calendar" size="18" color="#FF5E78"></u-icon>
                <text :class="{ placeholder: !followUpForm.next_follow_up_at }">
                  {{ followUpForm.next_follow_up_at || '选择日期' }}
                </text>
              </view>
              <view class="quick-dates">
                <text 
                  v-for="days in [7, 14, 30]" 
                  :key="days"
                  class="quick-tag"
                  @click="setNextFollowUp(days)"
                >{{ days }}天后</text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="modal-footer">
          <button class="btn-secondary" @click="showFollowUpModal = false">取消</button>
          <button class="btn-primary" @click="submitFollowUp" :disabled="!canSubmitFollowUp">
            <text v-if="!loading">保存记录</text>
            <view v-else class="btn-loading">
              <view class="spinner"></view>
            </view>
          </button>
        </view>
      </view>
    </u-popup>

    <!-- 状态变更 Modal -->
    <u-popup :show="showStatusModal" mode="bottom" @close="showStatusModal = false" round="20">
      <view class="modal-container">
        <view class="modal-header">
          <text class="modal-title">更新关系状态</text>
          <u-icon name="close" size="24" color="#909399" @click="showStatusModal = false"></u-icon>
        </view>

        <view class="modal-body">
          <view class="status-flow">
            <view 
              v-for="(status, index) in statusList" 
              :key="index"
              class="status-option"
              :class="{ 
                active: statusForm.status === status.value,
                passed: index < getStatusIndex(record.status)
              }"
              @click="statusForm.status = status.value"
            >
              <view class="option-icon" :style="{ background: status.color }">
                <u-icon :name="status.icon" size="20" color="#fff"></u-icon>
              </view>
              <view class="option-info">
                <text class="option-name">{{ status.label }}</text>
                <text class="option-desc">{{ status.desc }}</text>
              </view>
              <view class="option-check" v-if="statusForm.status === status.value">
                <u-icon name="checkmark" size="16" color="#fff"></u-icon>
              </view>
            </view>
          </view>

          <view class="form-group" style="margin-top: 20px;">
            <text class="form-label">变更原因</text>
            <textarea 
              v-model="statusForm.reason" 
              class="form-textarea"
              placeholder="记录状态变更的原因或备注..."
              maxlength="200"
            ></textarea>
          </view>
        </view>

        <view class="modal-footer">
          <button class="btn-secondary" @click="showStatusModal = false">取消</button>
          <button class="btn-primary" @click="submitStatusUpdate" :disabled="statusForm.status === record.status">
            确认更新
          </button>
        </view>
      </view>
    </u-popup>

    <!-- 日期选择器 -->
    <u-calendar 
      :show="showDatePicker" 
      @confirm="onDateConfirm" 
      @close="showDatePicker = false" 
      :minDate="minDate"
      title="选择下次回访日期"
    ></u-calendar>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import { getFollowUps, createFollowUp, updateMatchStatus, getStatusHistory } from '@/api/match';
import type { MatchStatusHistory } from '@/api/match';
import http from '@/utils/request';

// 状态栏高度
const statusBarHeight = ref(44);
try {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 44;
} catch (e) {
  console.error('获取系统信息失败', e);
}

const record = ref<any>({});
const followUps = ref<any[]>([]);
const statusHistory = ref<MatchStatusHistory[]>([]);
const showFollowUpModal = ref(false);
const showStatusModal = ref(false);
const showDatePicker = ref(false);
const matchId = ref(0);
const minDate = ref(Date.now());
const uFormRef = ref();
const loading = ref(false);

const defaultAvatar = 'https://cdn.uviewui.com/uview/album/1.jpg';

// 状态列表
const statusList = [
  { value: 1, label: '相识', desc: '初次见面，开始了解', icon: 'eye', color: '#909399' },
  { value: 2, label: '交往', desc: '确定关系，正式交往', icon: 'heart', color: '#FF5E78' },
  { value: 3, label: '稳定', desc: '感情稳定，持续升温', icon: 'star', color: '#52C41A' },
  { value: 4, label: '订婚', desc: '订婚阶段，准备结婚', icon: 'gift', color: '#FAAD14' },
  { value: 5, label: '结婚', desc: '步入婚姻殿堂', icon: 'home', color: '#FF4D4F' },
  { value: 6, label: '分手', desc: '不合适，和平分手', icon: 'minus-circle', color: '#8C8C8C' }
];

const followUpForm = reactive({
  method: '电话',
  content: '',
  feedback: '',
  satisfaction: 5,
  next_follow_up_at: ''
});

const statusForm = reactive({
  status: 1,
  reason: ''
});

// 是否可以提交回访
const canSubmitFollowUp = computed(() => {
  return followUpForm.method && followUpForm.content.trim().length > 0 && !loading.value;
});

// 获取状态索引
const getStatusIndex = (status: number) => {
  return statusList.findIndex(s => s.value === status);
};

// 获取状态进度百分比
const getStatusProgress = (status: number) => {
  const index = getStatusIndex(status);
  if (index === -1) return 0;
  return (index / (statusList.length - 1)) * 100;
};

// 获取在一起的天数
const getTogetherDays = (matchDate: string) => {
  if (!matchDate) return 0;
  const start = new Date(matchDate);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// 获取回访方式图标
const getMethodIcon = (method: string) => {
  const map: any = { '电话': 'phone-fill', '面谈': 'account-fill', '线上': 'chat-fill' };
  return map[method] || 'phone-fill';
};

// 获取满意程度文字
const getSatisfactionText = (score: number) => {
  const texts = ['非常不满意', '不满意', '一般', '满意', '非常满意'];
  return texts[score - 1] || '一般';
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 显示更多菜单
const showMoreMenu = () => {
  uni.showActionSheet({
    itemList: ['查看男方档案', '查看女方档案', '解除匹配'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.navigateTo({ url: `/pages/client/detail?id=${record.value.male_client?.id}` });
      } else if (res.tapIndex === 1) {
        uni.navigateTo({ url: `/pages/client/detail?id=${record.value.female_client?.id}` });
      } else if (res.tapIndex === 2) {
        uni.showModal({
          title: '确认解除',
          content: '确定要解除这对情侣的匹配关系吗？',
          confirmColor: '#FF4D4F',
          success: (res) => {
            if (res.confirm) {
              // TODO: 调用解除匹配API
              uni.showToast({ title: '功能开发中', icon: 'none' });
            }
          }
        });
      }
    }
  });
};

// 预览头像
const previewAvatar = (avatar: string) => {
  if (avatar) {
    uni.previewImage({ urls: [avatar], current: 0 });
  }
};

// 跳转到对比页面
const navigateToCompare = () => {
  uni.navigateTo({
    url: `/pages/match/compare?maleId=${record.value.male_client?.id}&femaleId=${record.value.female_client?.id}`
  });
};

onLoad((options: any) => {
  if (options.id) {
    matchId.value = Number(options.id);
    fetchDetail();
    fetchFollowUps();
    fetchStatusHistory();
  }
});

const fetchDetail = async () => {
  try {
    const res: any = await http.get(`/couples/list`, { params: { id: matchId.value } });
    if (res && res.length > 0) {
      record.value = res[0];
      statusForm.status = record.value.status;
    }
  } catch (e) {}
};

const fetchFollowUps = async () => {
  try {
    const res: any = await getFollowUps(matchId.value);
    followUps.value = res || [];
  } catch (e) {}
};

const fetchStatusHistory = async () => {
  try {
    const res: any = await getStatusHistory(matchId.value);
    statusHistory.value = (res || []).sort((a: any, b: any) => 
      new Date(a.change_time).getTime() - new Date(b.change_time).getTime()
    );
  } catch (e) {}
};

const onDateConfirm = (e: any) => {
  followUpForm.next_follow_up_at = e[0];
  showDatePicker.value = false;
};

const setNextFollowUp = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  followUpForm.next_follow_up_at = date.toISOString().split('T')[0];
};

const submitFollowUp = async () => {
  if (!canSubmitFollowUp.value) return;
  
  loading.value = true;
  try {
    await createFollowUp({
      match_record_id: matchId.value,
      follow_up_date: new Date().toISOString(),
      ...followUpForm
    });
    uni.showToast({ title: '保存成功', icon: 'success' });
    showFollowUpModal.value = false;
    
    // 重置表单
    followUpForm.content = '';
    followUpForm.feedback = '';
    followUpForm.satisfaction = 5;
    followUpForm.next_follow_up_at = '';
    
    fetchFollowUps();
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const submitStatusUpdate = async () => {
  if (statusForm.status === record.value.status) {
    showStatusModal.value = false;
    return;
  }
  
  try {
    await updateMatchStatus({
      id: matchId.value,
      status: statusForm.status,
      reason: statusForm.reason
    });
    uni.showToast({ title: '状态更新成功', icon: 'success' });
    showStatusModal.value = false;
    statusForm.reason = '';
    fetchDetail();
    fetchStatusHistory();
  } catch (e) {
    uni.showToast({ title: '更新失败', icon: 'none' });
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getStatusText = (status: number) => {
  const map: any = { 1: '相识', 2: '交往', 3: '稳定', 4: '订婚', 5: '结婚', 6: '分手' };
  return map[status] || '未知';
};

const getStatusClass = (status: number) => {
  const map: any = { 
    1: 'gray', 
    2: 'pink', 
    3: 'green', 
    4: 'orange', 
    5: 'red', 
    6: 'dark' 
  };
  return map[status] || 'gray';
};
</script>

<style lang="scss" scoped>
// 动画定义
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

// 页面容器
.match-detail-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5F7 0%, #ffffff 30%, #F8F9FA 100%);
}

// 导航栏
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;

  .nav-content {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }

  .back-btn, .more-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:active {
      transform: scale(0.95);
    }
  }

  .nav-title {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

// 内容滚动区
.content-scroll {
  height: 100vh;
  box-sizing: border-box;
}

// 情侣核心卡片
.couple-card {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #FFF5F7 100%);
  border-radius: 24px;
  margin: 16px;
  margin-top: 60px;
  padding: 28px 20px;
  box-shadow: 0 8px 32px rgba(255, 94, 120, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;

  .card-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    pointer-events: none;

    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 94, 120, 0.08) 0%, transparent 70%);

      &.circle-1 {
        width: 200px;
        height: 200px;
        top: -50px;
        right: -50px;
      }

      &.circle-2 {
        width: 150px;
        height: 150px;
        bottom: 20px;
        left: -30px;
      }
    }

    .bg-heart {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      opacity: 0.3;
      animation: float 3s ease-in-out infinite;
    }
  }

  .couple-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .person-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    .avatar-wrapper {
      position: relative;
      margin-bottom: 12px;

      .person-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #fff;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .gender-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #fff;

        &.male {
          background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
        }

        &.female {
          background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
        }
      }
    }

    .person-info {
      text-align: center;

      .person-name {
        display: block;
        font-size: 17px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }

      .person-meta {
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .match-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 16px;

    .heart-container {
      position: relative;
      margin-bottom: 8px;

      .heart-bg {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #FF8A9B 0%, #FF5E78 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(255, 94, 120, 0.3);
        position: relative;
        z-index: 2;
        animation: pulse 2s ease-in-out infinite;
      }

      .pulse-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        border: 2px solid rgba(255, 94, 120, 0.3);
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;

        &.delay {
          animation-delay: 0.5s;
        }
      }
    }

    .match-score {
      text-align: center;
      margin-bottom: 8px;

      .score-num {
        font-size: 28px;
        font-weight: 700;
        color: #FF5E78;
        text-shadow: 0 2px 4px rgba(255, 94, 120, 0.2);
      }

      .score-unit {
        font-size: 12px;
        color: #909399;
        margin-left: 2px;
      }
    }

    .match-days {
      display: flex;
      align-items: baseline;
      background: linear-gradient(135deg, #FFF0F2 0%, #FFE4E8 100%);
      padding: 4px 12px;
      border-radius: 20px;

      .days-num {
        font-size: 18px;
        font-weight: 700;
        color: #FF5E78;
      }

      .days-text {
        font-size: 12px;
        color: #FF5E78;
        margin-left: 2px;
      }
    }
  }

  // 状态进度条
  .status-bar {
    margin-top: 24px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    backdrop-filter: blur(10px);

    .status-track {
      position: relative;
      height: 4px;
      background: #E5E7EB;
      border-radius: 2px;
      margin-bottom: 28px;

      .status-progress {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: linear-gradient(90deg, #FF8A9B 0%, #FF5E78 100%);
        border-radius: 2px;
        transition: width 0.6s ease;
      }

      .status-point {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;

        .point-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #E5E7EB;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .point-label {
          position: absolute;
          top: 18px;
          font-size: 10px;
          color: #909399;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        &.active {
          .point-dot {
            background: #FF5E78;
          }
        }

        &.current {
          .point-dot {
            background: #FF5E78;
            box-shadow: 0 0 0 4px rgba(255, 94, 120, 0.2);
            transform: scale(1.2);
          }

          .point-label {
            color: #FF5E78;
            font-weight: 600;
          }
        }
      }
    }

    .status-edit-hint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 12px;
      color: #909399;
    }
  }

  // 基础信息
  .base-info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dashed rgba(255, 94, 120, 0.2);

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        font-size: 13px;
        color: #909399;
      }

      .info-value {
        flex: 1;
        font-size: 13px;
        color: #303133;
        font-weight: 500;
      }
    }
  }
}

// 快捷操作栏
.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 0 16px;
  margin-bottom: 24px;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    &:active {
      transform: scale(0.95);
    }

    .action-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);

      &.primary {
        background: linear-gradient(135deg, #FF8A9B 0%, #FF5E78 100%);
      }

      &.secondary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.success {
        background: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
      }
    }

    .action-text {
      font-size: 12px;
      color: #606266;
      font-weight: 500;
    }
  }
}

// 区块样式
.section-block {
  margin-bottom: 20px;

  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    margin-bottom: 16px;

    .header-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #FF8A9B 0%, #FF5E78 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .header-badge {
      background: linear-gradient(135deg, #FF8A9B 0%, #FF5E78 100%);
      color: #fff;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 10px;
      font-weight: 500;
    }

    .header-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, #E5E7EB 0%, transparent 100%);
    }
  }
}

// 时间轴容器
.timeline-container {
  background: #fff;
  border-radius: 16px;
  margin: 0 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .empty-timeline {
    text-align: center;
    padding: 40px 20px;

    .empty-img {
      width: 120px;
      height: 120px;
      margin-bottom: 16px;
    }

    .empty-text {
      font-size: 14px;
      color: #909399;
      line-height: 1.6;
    }
  }

  .timeline {
    .timeline-item {
      display: flex;
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0;

      &.last {
        .timeline-marker {
          .marker-line {
            display: none;
          }
        }
      }

      .timeline-marker {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 16px;

        .marker-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;

          &.gray { background: #909399; }
          &.pink { background: #FF5E78; }
          &.green { background: #52C41A; }
          &.orange { background: #FAAD14; }
          &.red { background: #FF4D4F; }
          &.dark { background: #606266; }
        }

        .marker-line {
          width: 2px;
          flex: 1;
          background: linear-gradient(180deg, #E5E7EB 0%, #F5F5F5 100%);
          margin: 4px 0;
          min-height: 60px;
        }
      }

      .timeline-content {
        flex: 1;
        padding-bottom: 24px;

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .status-name {
            font-size: 15px;
            font-weight: 600;
            color: #303133;
          }

          .change-date {
            font-size: 12px;
            color: #909399;
          }
        }

        .content-body {
          background: #F8F9FA;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 8px;

          .change-reason {
            font-size: 13px;
            color: #606266;
            line-height: 1.6;
          }
        }

        .content-footer {
          display: flex;
          align-items: center;
          gap: 4px;

          .operator {
            font-size: 12px;
            color: #C0C4CC;
          }
        }
      }
    }
  }
}

// 回访记录容器
.followup-container {
  padding: 0 16px;

  .empty-followup {
    text-align: center;
    padding: 60px 20px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .empty-icon {
      margin-bottom: 16px;
    }

    .empty-text {
      font-size: 15px;
      color: #606266;
      margin-bottom: 8px;
      display: block;
    }

    .empty-sub {
      font-size: 13px;
      color: #909399;
    }
  }

  .followup-list {
    .followup-card {
      background: #fff;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0;
      border-left: 4px solid transparent;
      transition: all 0.3s ease;

      &.highlight {
        border-left-color: #FF5E78;
        background: linear-gradient(90deg, #FFF5F7 0%, #ffffff 20%);
      }

      &:active {
        transform: scale(0.98);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;

          .method-tag {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            color: #fff;
            font-weight: 500;

            &.电话 {
              background: linear-gradient(135deg, #FF8A9B 0%, #FF5E78 100%);
            }

            &.面谈 {
              background: linear-gradient(135deg, #52C41A 0%, #389E0D 100%);
            }

            &.线上 {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
          }

          .visit-date {
            font-size: 13px;
            color: #909399;
          }
        }
      }

      .card-body {
        .content-section {
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }

          .section-label {
            display: block;
            font-size: 12px;
            color: #909399;
            margin-bottom: 6px;
          }

          .section-content {
            font-size: 14px;
            color: #303133;
            line-height: 1.7;
          }

          .feedback-box {
            background: #F8F9FA;
            padding: 12px;
            border-radius: 10px;
          }
        }
      }

      .card-footer {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px dashed #E5E7EB;

        .reminder-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #FFF0F2 0%, #FFE4E8 100%);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          color: #FF5E78;
          font-weight: 500;
        }
      }
    }
  }
}

// Modal 样式
.modal-container {
  background: #fff;
  border-radius: 20px 20px 0 0;
  max-height: 85vh;
  display: flex;
  flex-direction: column;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #F0F0F0;

    .modal-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .modal-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    .form-group {
      margin-bottom: 24px;

      .form-label {
        display: block;
        font-size: 14px;
        color: #303133;
        font-weight: 500;
        margin-bottom: 12px;

        .required {
          color: #FF5E78;
          margin-left: 2px;
        }
      }

      .method-selector {
        display: flex;
        gap: 12px;

        .method-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 16px 12px;
          background: #F8F9FA;
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.3s ease;

          &.active {
            background: #FFF5F7;
            border-color: #FF5E78;
          }

          &:active {
            transform: scale(0.95);
          }

          text {
            font-size: 13px;
            color: #606266;
          }
        }
      }

      .form-textarea {
        width: 100%;
        min-height: 100px;
        background: #F8F9FA;
        border: none;
        border-radius: 12px;
        padding: 12px;
        font-size: 14px;
        color: #303133;
        line-height: 1.6;

        &::placeholder {
          color: #C0C4CC;
        }
      }

      .char-count {
        display: block;
        text-align: right;
        font-size: 12px;
        color: #C0C4CC;
        margin-top: 6px;
      }

      .satisfaction-selector {
        display: flex;
        align-items: center;
        gap: 16px;

        .satisfaction-text {
          font-size: 14px;
          color: #FF5E78;
          font-weight: 500;
        }
      }

      .date-selector {
        .date-input {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #F8F9FA;
          border-radius: 12px;
          margin-bottom: 12px;

          text {
            font-size: 14px;
            color: #303133;

            &.placeholder {
              color: #C0C4CC;
            }
          }
        }

        .quick-dates {
          display: flex;
          gap: 10px;

          .quick-tag {
            padding: 6px 14px;
            background: #FFF5F7;
            border-radius: 20px;
            font-size: 13px;
            color: #FF5E78;
            font-weight: 500;

            &:active {
              background: #FF5E78;
              color: #fff;
            }
          }
        }
      }
    }

    .status-flow {
      .status-option {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: #F8F9FA;
        border-radius: 12px;
        margin-bottom: 12px;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &.active {
          background: #FFF5F7;
          border-color: #FF5E78;
        }

        &.passed {
          opacity: 0.6;
        }

        &:active {
          transform: scale(0.98);
        }

        .option-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .option-info {
          flex: 1;

          .option-name {
            display: block;
            font-size: 15px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 4px;
          }

          .option-desc {
            font-size: 12px;
            color: #909399;
          }
        }

        .option-check {
          width: 24px;
          height: 24px;
          background: #FF5E78;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .modal-footer {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid #F0F0F0;

    .btn-secondary, .btn-primary {
      flex: 1;
      height: 48px;
      border-radius: 12px;
      border: none;
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.98);
      }

      &:disabled {
        opacity: 0.5;
      }
    }

    .btn-secondary {
      background: #F5F5F5;
      color: #606266;
    }

    .btn-primary {
      background: linear-gradient(135deg, #FF8A9B 0%, #FF5E78 100%);
      color: #fff;
      box-shadow: 0 4px 15px rgba(255, 94, 120, 0.3);

      .btn-loading {
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      }
    }
  }
}

// 底部留白
.footer-spacer {
  height: 40px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
