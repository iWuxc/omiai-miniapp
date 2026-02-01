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
          <u-tag :text="getStatusText(record.status)" :type="getStatusType(record.status)" shape="circle"></u-tag>
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
        <u-form :model="followUpForm" labelWidth="80">
          <u-form-item label="回访方式">
            <u-radio-group v-model="followUpForm.method">
              <u-radio label="电话" name="电话"></u-radio>
              <u-radio label="面谈" name="面谈" style="margin-left: 10px"></u-radio>
              <u-radio label="线上" name="线上" style="margin-left: 10px"></u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="回访内容">
            <u-textarea v-model="followUpForm.content" placeholder="记录回访详情"></u-textarea>
          </u-form-item>
          <u-form-item label="客户反馈">
            <u-textarea v-model="followUpForm.feedback" placeholder="客户给出的反馈"></u-textarea>
          </u-form-item>
          <u-form-item label="满意度">
            <u-rate v-model="followUpForm.satisfaction" active-color="#FF5E78"></u-rate>
          </u-form-item>
        </u-form>
      </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getFollowUps, createFollowUp, updateMatchStatus } from '@/api/match';
import http from '@/utils/request';

const record = ref<any>({});
const followUps = ref<any[]>([]);
const showFollowUpModal = ref(false);
const matchId = ref(0);

const followUpForm = reactive({
  method: '电话',
  content: '',
  feedback: '',
  satisfaction: 5
});

onLoad((options: any) => {
  if (options.id) {
    matchId.value = Number(options.id);
    fetchDetail();
    fetchFollowUps();
  }
});

const fetchDetail = async () => {
  try {
    // Note: This needs a dedicated GetMatchDetail API if not in the list
    // For now, let's assume we can get it from the list or a simple GET
    const res: any = await http.get(`/match/list`, { params: { id: matchId.value } });
    if (res && res.length > 0) record.value = res[0];
  } catch (e) {}
};

const fetchFollowUps = async () => {
  try {
    const res: any = await getFollowUps(matchId.value);
    followUps.value = res || [];
  } catch (e) {}
};

const submitFollowUp = async () => {
  if (!followUpForm.content) {
    uni.showToast({ title: '内容不能为空', icon: 'none' });
    return;
  }
  try {
    await createFollowUp({
      match_record_id: matchId.value,
      follow_up_date: new Date().toISOString(),
      ...followUpForm
    });
    uni.showToast({ title: '保存成功' });
    showFollowUpModal.value = false;
    fetchFollowUps();
  } catch (e) {}
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return dateStr.split('T')[0];
};

const getStatusText = (status: number) => {
  const map: any = { 1: '已匹配', 2: '已分手', 3: '已结婚' };
  return map[status] || '未知';
};

const getStatusType = (status: number) => {
  const map: any = { 1: 'primary', 2: 'info', 3: 'success' };
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
