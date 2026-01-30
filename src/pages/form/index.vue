<template>
  <view class="container">
    <view class="form-card">
      <view class="header">
        <text class="title">填写个人档案</text>
        <text class="subtitle">完善资料，遇见更好的TA</text>
      </view>

      <u-form :model="form" ref="uForm" labelPosition="top">
        <u-form-item label="姓名" prop="name" borderBottom required>
          <u-input v-model="form.name" placeholder="请输入真实姓名"></u-input>
        </u-form-item>
        
        <u-form-item label="性别" prop="gender" borderBottom required>
          <u-radio-group v-model="form.gender">
            <u-radio label="男" :name="1" activeColor="#2979ff"></u-radio>
            <u-radio label="女" :name="2" activeColor="#FF4D6A" style="margin-left: 20px"></u-radio>
          </u-radio-group>
        </u-form-item>

        <u-form-item label="出生日期" prop="birthday" borderBottom required @click="showCalendar = true">
          <u-input v-model="form.birthday" placeholder="请选择出生日期" disabled disabledColor="#fff"></u-input>
          <u-icon slot="right" name="calendar"></u-icon>
        </u-form-item>

        <u-form-item label="身高(cm)" prop="height" borderBottom>
          <u-input v-model="form.height" type="number" placeholder="请输入身高"></u-input>
        </u-form-item>

        <u-form-item label="手机号码" prop="phone" borderBottom required>
          <u-input v-model="form.phone" type="number" placeholder="方便红娘联系您"></u-input>
        </u-form-item>
        
        <u-form-item label="月收入(元)" prop="income" borderBottom>
          <u-input v-model="form.income" type="number" placeholder="请输入月收入"></u-input>
        </u-form-item>

        <u-form-item label="学历" prop="education" borderBottom>
          <u-radio-group v-model="form.education">
            <u-radio label="本科" :name="3" style="margin-right: 15px"></u-radio>
            <u-radio label="硕士" :name="4" style="margin-right: 15px"></u-radio>
            <u-radio label="其他" :name="1"></u-radio>
          </u-radio-group>
        </u-form-item>
        
        <u-form-item label="自我介绍" prop="remark" borderBottom>
          <u-textarea v-model="form.remark" placeholder="简单介绍一下自己..." count></u-textarea>
        </u-form-item>
      </u-form>

      <view class="submit-btn">
        <u-button type="primary" shape="circle" color="#FF4D6A" :loading="submitting" @click="submit">提交档案</u-button>
      </view>
    </view>
    
    <u-calendar :show="showCalendar" @confirm="onCalendarConfirm" @close="showCalendar = false"></u-calendar>
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
    // Convert string to number
    if (payload.height) payload.height = Number(payload.height);
    if (payload.income) payload.income = Number(payload.income);
    
    await createClient(payload);
    uni.showToast({ title: '提交成功', icon: 'success' });
    
    // Reset or Navigate
    setTimeout(() => {
      uni.switchTab({ url: '/pages/home/index' });
    }, 1500);
  } catch (e) {
    // Error handled in interceptor
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #FF4D6A; // 背景色与主题色一致
  padding: 20px 15px;
}

.form-card {
  background: #fff;
  border-radius: 16px;
  padding: 25px 20px;
  
  .header {
    text-align: center;
    margin-bottom: 30px;
    
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      display: block;
    }
    .subtitle {
      font-size: 12px;
      color: #999;
      margin-top: 5px;
    }
  }
}

.submit-btn {
  margin-top: 30px;
}
</style>
