<template>
  <view class="container">
    <!-- 情侣核心卡片 -->
    <view class="match-card omiai-card fade-in">
      <view class="couple-box">
        <view class="person">
          <u-avatar :src="record.male_client?.avatar" size="70"></u-avatar>
          <text class="name">{{ record.male_client?.name }}</text>
          <text class="tag">男方</text>
        </view>
        <view class="match-info">
          <u-icon name="heart-fill" color="#FF5E78" size="36"></u-icon>
          <text class="score">{{ record.match_score }}%</text>
          <view class="status-tag" @click="showStatusModal = true">
            <u-tag :text="getStatusText(record.status)" :type="getStatusType(record.status)" shape="circle"></u-tag>
            <u-icon name="edit-pen" size="14" color="#909399" style="margin-left: 4px"></u-icon>
          </view>
        </view>
        <view class="person">
          <u-avatar :src="record.female_client?.avatar" size="70"></u-avatar>
          <text class="name">{{ record.female_client?.name }}</text>
          <text class="tag">女方</text>
        </view>
      </view>
      <view class="base-info omiai-text-sm">
        <view class="info-row">
          <text class="label">匹配日期：</text>
          <text class="val">{{ formatDate(record.match_date) }}</text>
        </view>
        <view class="info-row" v-if="record.remark">
          <text class="label">备注信息：</text>
          <text class="val">{{ record.remark }}</text>
        </view>
      </view>
    </view>

    <!-- 关系历程时间轴 -->
    <view class="section-title">
      <view class="title-line"></view>
      <text>关系历程</text>
    </view>
    <view class="timeline-box omiai-card">
      <u-steps :current="statusHistory.length - 1" direction="column" dot>
        <u-steps-item
          v-for="(item, index) in statusHistory"
          :key="item.id"
          :title="getStatusText(item.new_status)"
          :desc="formatHistoryDesc(item)"
        ></u-steps-item>
      </u-steps>
      <u-empty v-if="statusHistory.length === 0" text="暂无历程记录" mode="history"></u-empty>
    </view>

    <!-- 回访记录列表 -->
    <view class="section-title">
      <view class="title-line"></view>
      <text>回访记录</text>
      <u-button size="mini" type="primary" plain @click="showFollowUpModal = true">添加回访</u-button>
    </view>

    <view class="followup-list">
      <view v-for="item in followUps" :key="item.id" class="followup-item omiai-card">
        <view class="item-header">
          <text class="date">{{ formatDate(item.follow_up_date) }}</text>
          <u-rate :count="5" v-model="item.satisfaction" disabled size="14" active-color="#FF5E78"></u-rate>
        </view>
        <view class="item-body">
          <view class="method-tag">{{ item.method }}</view>
          <view class="content">{{ item.content }}</view>
        </view>
        <view class="feedback" v-if="item.feedback">
          <text class="label">反馈：</text>
          <text>{{ item.feedback }}</text>
        </view>
        <view class="next-time omiai-text-sm" v-if="item.next_follow_up_at">
          下次回访提醒：{{ formatDate(item.next_follow_up_at) }}
        </view>
      </view>
      <u-empty v-if="followUps.length === 0" text="暂无回访记录" mode="news"></u-empty>
    </view>

    <!-- 添加回访 Modal -->
    <u-modal :show="showFollowUpModal" title="添加回访记录" @confirm="submitFollowUp" @cancel="showFollowUpModal = false" showCancelButton>
      <view class="modal-form">
        <u-form :model="followUpForm" :rules="rules" ref="uFormRef" labelWidth="80">
          <u-form-item label="回访方式" prop="method" required>
            <u-radio-group v-model="followUpForm.method">
              <u-radio label="电话" name="电话"></u-radio>
              <u-radio label="面谈" name="面谈" style="margin-left: 10px"></u-radio>
              <u-radio label="线上" name="线上" style="margin-left: 10px"></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="回访内容" prop="content" required>
            <u-textarea v-model="followUpForm.content" placeholder="记录回访详情" count></u-textarea>
          </u-form-item>
          <u-form-item label="客户反馈" prop="feedback">
            <u-textarea v-model="followUpForm.feedback" placeholder="客户给出的反馈" count></u-textarea>
          </u-form-item>
          <u-form-item label="满意程度" prop="satisfaction">
            <u-rate v-model="followUpForm.satisfaction" active-color="#FF5E78"></u-rate>
          </u-form-item>
          <u-form-item label="下次回访" prop="next_follow_up_at" borderBottom @click="showDatePicker = true">
             <u-input v-model="followUpForm.next_follow_up_at" placeholder="选择下次回访日期" readonly suffixIcon="calendar"></u-input>
          </u-form-item>
          <view class="quick-dates">
             <u-tag text="7天后" plain size="mini" @click="setNextFollowUp(7)" style="margin-right: 10px"></u-tag>
             <u-tag text="30天后" plain size="mini" @click="setNextFollowUp(30)" style="margin-right: 10px"></u-tag>
             <u-tag text="90天后" plain size="mini" @click="setNextFollowUp(90)"></u-tag>
          </view>
        </u-form>
      </view>
    </u-modal>
    
    <u-calendar :show="showDatePicker" @confirm="onDateConfirm" @close="showDatePicker = false" :minDate="minDate"></u-calendar>

    <!-- 状态变更 Modal -->
    <u-modal :show="showStatusModal" title="变更关系状态" @confirm="submitStatusUpdate" @cancel="showStatusModal = false" showCancelButton>
      <view class="modal-form">
        <u-form :model="statusForm" labelWidth="80">
          <u-form-item label="新状态">
             <u-radio-group v-model="statusForm.status" placement="column">
                <u-radio :label="getStatusText(1)" :name="1" style="margin-bottom: 8px"></u-radio>
                <u-radio :label="getStatusText(2)" :name="2" style="margin-bottom: 8px"></u-radio>
                <u-radio :label="getStatusText(3)" :name="3" style="margin-bottom: 8px"></u-radio>
                <u-radio :label="getStatusText(4)" :name="4" style="margin-bottom: 8px"></u-radio>
                <u-radio :label="getStatusText(5)" :name="5" style="margin-bottom: 8px"></u-radio>
                <u-radio :label="getStatusText(6)" :name="6" style="margin-bottom: 8px"></u-radio>
             </u-radio-group>
          </u-form-item>
          <u-form-item label="变更原因">
            <u-textarea v-model="statusForm.reason" placeholder="请输入变更原因"></u-textarea>
          </u-form-item>
        </u-form>
      </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import { getFollowUps, createFollowUp, updateMatchStatus, getStatusHistory } from '@/api/match';
import type { MatchStatusHistory } from '@/api/match';
import http from '@/utils/request';

const record = ref<any>({});
const followUps = ref<any[]>([]);
const statusHistory = ref<MatchStatusHistory[]>([]);
const showFollowUpModal = ref(false);
const showStatusModal = ref(false);
const showDatePicker = ref(false);
const matchId = ref(0);
const minDate = ref(Date.now());
const uFormRef = ref();

const followUpForm = reactive({
  method: '电话',
  content: '',
  feedback: '',
  satisfaction: 5,
  next_follow_up_at: ''
});

const rules = {
  method: [{ required: true, message: '请选择回访方式', trigger: ['change'] }],
  content: [{ required: true, message: '请输入回访内容', trigger: ['blur', 'change'] }]
};

const statusForm = reactive({
  status: 1,
  reason: ''
});

onReady(() => {
  if (uFormRef.value) {
    uFormRef.value.setRules(rules);
  }
});

const onDateConfirm = (e: any) => {
  followUpForm.next_follow_up_at = e[0];
  showDatePicker.value = false;
};

const setNextFollowUp = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  followUpForm.next_follow_up_at = date.toISOString().split('T')[0];
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
      statusForm.status = record.value.status; // Init form status
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
    // Sort by change_time asc for timeline
    statusHistory.value = (res || []).sort((a: any, b: any) => new Date(a.change_time).getTime() - new Date(b.change_time).getTime());
  } catch (e) {}
};

const submitFollowUp = async () => {
  try {
    await uFormRef.value.validate();
    
    await createFollowUp({
      match_record_id: matchId.value,
      follow_up_date: new Date().toISOString(),
      ...followUpForm
    });
    uni.showToast({ title: '保存成功' });
    showFollowUpModal.value = false;
    fetchFollowUps();
  } catch (e) {
    // Validation error or API error
    console.log(e);
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
    uni.showToast({ title: '状态更新成功' });
    showStatusModal.value = false;
    fetchDetail();
    fetchStatusHistory();
  } catch (e) {}
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatHistoryDesc = (item: MatchStatusHistory) => {
  const date = formatDate(item.change_time);
  const reason = item.reason ? ` - ${item.reason}` : '';
  const operator = item.operator ? ` (${item.operator})` : '';
  return `${date}${reason}${operator}`;
};

const getStatusText = (status: number) => {
  const map: any = { 1: '相识', 2: '交往', 3: '稳定', 4: '订婚', 5: '结婚', 6: '分手' };
  return map[status] || '未知';
};

const getStatusType = (status: number) => {
  const map: any = { 1: 'info', 2: 'primary', 3: 'success', 4: 'warning', 5: 'error', 6: 'info' };
  return map[status] || 'primary';
};
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
  background-color: $omiai-bg-page;
  min-height: 100vh;
}

.match-card {
  padding: 24px;
  margin-bottom: 24px;
  .couple-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    .person {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      .name { font-weight: 600; font-size: 16px; }
      .tag { font-size: 11px; color: $omiai-text-tip; background: #F2F3F5; padding: 2px 8px; border-radius: 4px; }
    }
    .match-info {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      .score { font-size: 20px; font-weight: bold; color: $omiai-primary; }
      .status-tag {
        display: flex;
        align-items: center;
      }
    }
  }
  .base-info {
    border-top: 1px solid #F2F3F5;
    padding-top: 16px;
    .info-row {
      margin-bottom: 8px;
      .label { color: $omiai-text-tip; }
      .val { color: $omiai-text-main; }
    }
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  .title-line { width: 4px; height: 16px; background: $omiai-primary; border-radius: 2px; }
  text { font-size: 16px; font-weight: 600; flex: 1; }
}

.timeline-box {
  padding: 24px 16px;
  margin-bottom: 24px;
}

.followup-list {
  .followup-item {
    padding: 16px;
    margin-bottom: 12px;
    .item-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      .date { font-weight: 600; }
    }
    .item-body {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      .method-tag { background: $omiai-primary-light; color: $omiai-primary; font-size: 11px; padding: 2px 6px; border-radius: 4px; height: 18px; line-height: 18px; }
      .content { flex: 1; color: $omiai-text-main; line-height: 1.5; }
    }
    .feedback {
      background: #F7F8FA;
      padding: 10px;
      border-radius: 8px;
      font-size: 13px;
      .label { color: $omiai-text-tip; }
    }
    .next-time { margin-top: 12px; color: $omiai-primary; }
  }
}

.modal-form {
  padding: 10px;
}
</style>
