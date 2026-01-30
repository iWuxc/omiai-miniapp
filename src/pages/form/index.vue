<template>
  <view class="container">
    <view class="form-wrapper">
      <view class="header">
        <text class="title">录入新档案</text>
        <text class="subtitle">请完善客户的真实信息，以便精准匹配</text>
      </view>

      <view class="form-card">
        <u-form :model="form" ref="uForm" labelPosition="top" :labelStyle="{ color: '#606266', fontSize: '14px', marginBottom: '8px' }">
          <view class="section-title">基础信息</view>
          
          <u-form-item label="姓名" prop="name" required borderBottom>
            <u-input v-model="form.name" placeholder="请输入真实姓名" border="none"></u-input>
          </u-form-item>
          
          <u-form-item label="性别" prop="gender" required borderBottom>
            <u-radio-group v-model="form.gender">
              <u-radio label="男" :name="1" activeColor="#3E7BFA" style="margin-right: 20px"></u-radio>
              <u-radio label="女" :name="2" activeColor="#FF5E5E"></u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="出生日期" prop="birthday" required borderBottom @click="showCalendar = true">
            <u-input v-model="form.birthday" placeholder="请选择出生日期" disabled disabledColor="#fff" border="none"></u-input>
            <u-icon slot="right" name="arrow-right" color="#DCDFE6"></u-icon>
          </u-form-item>

          <u-form-item label="手机号码" prop="phone" required borderBottom>
            <u-input v-model="form.phone" type="number" placeholder="请输入11位手机号" border="none"></u-input>
          </u-form-item>

          <view class="section-title mt-20">详细画像</view>

          <view class="row">
             <view class="col">
                <u-form-item label="身高(cm)" prop="height" borderBottom>
                  <u-input v-model="form.height" type="number" placeholder="0" border="none"></u-input>
                </u-form-item>
             </view>
             <view class="col">
                <u-form-item label="月收入(元)" prop="income" borderBottom>
                  <u-input v-model="form.income" type="number" placeholder="0" border="none"></u-input>
                </u-form-item>
             </view>
          </view>

          <u-form-item label="学历" prop="education" borderBottom>
            <u-radio-group v-model="form.education">
              <u-radio label="本科" :name="3" activeColor="#FF5E5E" style="margin-right: 15px"></u-radio>
              <u-radio label="硕士" :name="4" activeColor="#FF5E5E" style="margin-right: 15px"></u-radio>
              <u-radio label="其他" :name="1" activeColor="#FF5E5E"></u-radio>
            </u-radio-group>
          </u-form-item>
          
          <u-form-item label="自我介绍" prop="remark">
            <u-textarea v-model="form.remark" placeholder="介绍一下性格、爱好、家庭情况..." count height="100" :customStyle="{ background: '#F8F9FB', border: 'none' }"></u-textarea>
          </u-form-item>
        </u-form>
      </view>

      <view class="submit-btn">
        <u-button type="primary" shape="circle" color="#FF5E5E" :loading="submitting" @click="submit" customStyle="box-shadow: 0 4px 12px rgba(255, 94, 94, 0.3);">提交档案</u-button>
      </view>
    </view>
    
    <u-calendar :show="showCalendar" @confirm="onCalendarConfirm" @close="showCalendar = false" color="#FF5E5E"></u-calendar>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { createClient } from '@/api/client';

const showCalendar = ref(false);
const submitting = ref(false);

const form = reactive({
  name: '',
  gender: 1,
  birthday: '',
  height: undefined,
  phone: '',
  income: undefined,
  education: 3,
  remark: ''
});

const onCalendarConfirm = (e: any) => {
  showCalendar.value = false;
  form.birthday = e[0];
};

const submit = async () => {
  if (!form.name || !form.phone || !form.birthday) {
    uni.showToast({ title: '请填写必填项', icon: 'none' });
    return;
  }
  
  submitting.value = true;
  try {
    const payload: any = { ...form };
    if (payload.height) payload.height = Number(payload.height);
    if (payload.income) payload.income = Number(payload.income);
    
    await createClient(payload);
    uni.showToast({ title: '提交成功', icon: 'success' });
    
    setTimeout(() => {
      uni.switchTab({ url: '/pages/home/index' });
    }, 1500);
  } catch (e) {
    // Error handled
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: $uni-bg-color;
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  padding: 0 4px;
  
  .title {
    font-size: 24px;
    font-weight: 600;
    color: $uni-text-color;
    display: block;
    margin-bottom: 6px;
  }
  .subtitle {
    font-size: 13px;
    color: $uni-text-color-grey;
  }
}

.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: $uni-shadow-base;
  
  .section-title {
      font-size: 15px;
      font-weight: 600;
      color: $uni-text-color;
      margin-bottom: 16px;
      position: relative;
      padding-left: 10px;
      
      &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 3px;
          background: $uni-color-primary;
          border-radius: 2px;
      }
  }
  
  .mt-20 { margin-top: 24px; }
  
  .row {
      display: flex;
      gap: 20px;
      .col { flex: 1; }
  }
}

.submit-btn {
  margin-top: 30px;
  padding: 0 20px;
}
</style>
