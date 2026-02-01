<template>
  <view class="container">
    <view class="form-wrapper">
      <!-- 1) 标题区 -->
      <view class="header fade-in">
        <text class="omiai-title-xl">填写您的档案</text>
        <text class="omiai-text-md subtitle">遇见缘分，从完善资料开始</text>
      </view>

      <!-- 2) 表单区 -->
      <view class="form-card omiai-card fade-in">
        <u-form :model="form" ref="uForm" labelPosition="left" labelWidth="80" :labelStyle="{ color: '#4E5969', fontSize: '15px' }">
          <view class="section-title">
            <view class="title-line"></view>
            <text>上传美照</text>
          </view>
          
          <view class="avatar-upload-box">
             <u-upload
                :fileList="avatarList"
                @afterRead="afterReadAvatar"
                @delete="deleteAvatar"
                name="avatar"
                :maxCount="1"
                width="100"
                height="100"
             >
                <view class="avatar-placeholder">
                  <u-icon name="camera-fill" size="30" color="#C0C4CC"></u-icon>
                  <text class="omiai-text-sm">个人头像</text>
                </view>
             </u-upload>
          </view>

          <view class="section-title mt-30">
            <view class="title-line"></view>
            <text>基本信息</text>
          </view>
          
          <u-form-item label="您的姓名" prop="name" required borderBottom>
            <u-input v-model="form.name" placeholder="请输入姓名" border="none"></u-input>
          </u-form-item>
          
          <u-form-item label="您的性别" prop="gender" required borderBottom>
            <u-radio-group v-model="form.gender">
              <u-radio label="男" :name="1" :activeColor="maleColor" style="margin-right: 24px"></u-radio>
              <u-radio label="女" :name="2" :activeColor="primaryColor"></u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="出生日期" prop="birthday" required borderBottom @click="showCalendar = true">
            <u-input v-model="form.birthday" placeholder="请选择日期" disabled disabledColor="#fff" border="none"></u-input>
            <u-icon slot="right" name="calendar" :color="primaryColor" size="18"></u-icon>
          </u-form-item>

          <u-form-item label="联系电话" prop="phone" required borderBottom>
            <u-input v-model="form.phone" type="number" placeholder="请输入手机号" border="none"></u-input>
          </u-form-item>

          <view class="section-title mt-30">
            <view class="title-line"></view>
            <text>详细画像</text>
          </view>

          <view class="row">
             <view class="col">
                <u-form-item label="身高(cm)" prop="height" borderBottom labelWidth="60">
                  <u-input v-model="form.height" type="number" placeholder="0" border="none"></u-input>
                </u-form-item>
             </view>
             <view class="col">
                <u-form-item label="体重(kg)" prop="weight" borderBottom labelWidth="60">
                  <u-input v-model="form.weight" type="number" placeholder="0" border="none"></u-input>
                </u-form-item>
             </view>
          </view>

          <u-form-item label="最高学历" prop="education" borderBottom>
            <u-radio-group v-model="form.education">
              <u-radio label="大专" :name="2" :activeColor="primaryColor" style="margin-right: 8px"></u-radio>
              <u-radio label="本科" :name="3" :activeColor="primaryColor" style="margin-right: 8px"></u-radio>
              <u-radio label="硕士" :name="4" :activeColor="primaryColor" style="margin-right: 8px"></u-radio>
              <u-radio label="博士" :name="5" :activeColor="primaryColor"></u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="婚姻状况" prop="marital_status" borderBottom>
            <u-radio-group v-model="form.marital_status">
              <u-radio label="未婚" :name="1" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
              <u-radio label="离异" :name="2" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
              <u-radio label="丧偶" :name="3" :activeColor="primaryColor"></u-radio>
            </u-radio-group>
          </u-form-item>
          
          <u-form-item label="月收入" prop="income" borderBottom>
            <u-input v-model="form.income" type="number" placeholder="请输入月收入" border="none"></u-input>
          </u-form-item>

          <u-form-item label="现居城市" prop="address" borderBottom>
            <u-input v-model="form.address" placeholder="例如：上海市浦东新区" border="none"></u-input>
          </u-form-item>

          <u-form-item label="具体职业" prop="profession" borderBottom>
            <u-input v-model="form.profession" placeholder="例如：互联网产品经理" border="none"></u-input>
          </u-form-item>

          <u-form-item label="自我介绍" prop="remark" labelPosition="top">
            <u-textarea 
              v-model="form.remark" 
              placeholder="向大家介绍一下自己吧..." 
              count 
              height="100" 
              :customStyle="{ background: '#F7F8FA', border: 'none', borderRadius: '12px', padding: '12px', marginTop: '8px' }"
            ></u-textarea>
          </u-form-item>

          <u-form-item label="择偶要求" prop="partner_requirements" labelPosition="top">
            <u-textarea 
              v-model="form.partner_requirements" 
              placeholder="您希望找一个什么样的 TA 呢？" 
              count 
              height="100" 
              :customStyle="{ background: '#F7F8FA', border: 'none', borderRadius: '12px', padding: '12px', marginTop: '8px' }"
            ></u-textarea>
          </u-form-item>

          <view class="section-title mt-30">
            <view class="title-line"></view>
            <text>生活相册</text>
          </view>
          
          <u-upload
            :fileList="photoList"
            @afterRead="afterReadPhotos"
            @delete="deletePhoto"
            name="photos"
            multiple
            :maxCount="9"
            width="80"
            height="80"
          ></u-upload>
        </u-form>
      </view>

      <view class="submit-btn fade-in">
        <u-button 
          :loading="submitting" 
          @click="submit" 
          class="omiai-btn-primary"
          customStyle="height: 50px; font-size: 16px; border: none;"
        >完成并提交</u-button>
      </view>
    </view>
    
    <u-calendar :show="showCalendar" @confirm="onCalendarConfirm" @close="showCalendar = false" :color="primaryColor"></u-calendar>
    
    <!-- 提交成功弹窗 -->
    <u-modal :show="showSuccess" title="提交成功" content="红娘姐姐已收到您的资料，会尽快为您匹配哦！" @confirm="onSuccessConfirm"></u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { createClient } from '@/api/client';
import { uploadFile } from '@/api/common';
import { config as appConfig } from '@/config';

const primaryColor = '#FF5E78';
const maleColor = '#4A90E2';
const showCalendar = ref(false);
const submitting = ref(false);
const showSuccess = ref(false);

const avatarList = ref<any[]>([]);
const photoList = ref<any[]>([]);

const form = reactive({
  name: '',
  gender: 1,
  birthday: '',
  avatar: '',
  height: undefined,
  weight: undefined,
  phone: '',
  income: undefined,
  education: 3,
  marital_status: 1,
  address: '',
  profession: '',
  remark: '',
  partner_requirements: '',
  photos: ''
});

const onCalendarConfirm = (e: any) => {
  showCalendar.value = false;
  form.birthday = e[0];
};

const validateFile = (file: any) => {
  const maxSize = 5 * 1024 * 1024;
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = file.url.substring(file.url.lastIndexOf('.')).toLowerCase();
  
  if (file.size > maxSize) {
    uni.showToast({ title: '文件超过5MB', icon: 'none' });
    return false;
  }
  return true;
};

const afterReadAvatar = async (event: any) => {
  const { file } = event;
  if (!validateFile(file)) return;
  
  avatarList.value.push({ ...file, status: 'uploading', message: '上传中' });
  try {
    const res: any = await uploadFile(file.url);
    const url = res.url.startsWith('http') ? res.url : appConfig.assetsUrl + res.url;
    avatarList.value[0].url = url;
    avatarList.value[0].status = 'success';
    form.avatar = url;
  } catch (e) {
    avatarList.value[0].status = 'failed';
    avatarList.value[0].message = '上传失败';
  }
};

const deleteAvatar = () => {
  avatarList.value = [];
  form.avatar = '';
};

const afterReadPhotos = async (event: any) => {
  const { file } = event;
  const files = Array.isArray(file) ? file : [file];
  
  for (const f of files) {
    if (!validateFile(f)) continue;
    
    const index = photoList.value.length;
    photoList.value.push({ ...f, status: 'uploading', message: '上传中' });
    try {
      const res: any = await uploadFile(f.url);
      const url = res.url.startsWith('http') ? res.url : appConfig.assetsUrl + res.url;
      photoList.value[index].url = url;
      photoList.value[index].status = 'success';
      syncPhotos();
    } catch (e) {
      photoList.value[index].status = 'failed';
      photoList.value[index].message = '上传失败';
    }
  }
};

const deletePhoto = (event: any) => {
  photoList.value.splice(event.index, 1);
  syncPhotos();
};

const syncPhotos = () => {
  const urls = photoList.value.filter(p => p.status === 'success').map(p => p.url);
  form.photos = JSON.stringify(urls);
};

const submit = async () => {
  if (!form.name || !form.phone || !form.birthday) {
    uni.showToast({ title: '请填写必选项', icon: 'none' });
    return;
  }
  
  submitting.value = true;
  try {
    const payload: any = { ...form };
    if (payload.height) payload.height = Number(payload.height);
    if (payload.weight) payload.weight = Number(payload.weight);
    if (payload.income) payload.income = Number(payload.income);
    
    await createClient(payload);
    showSuccess.value = true;
  } catch (e) {
    // Error handled
  } finally {
    submitting.value = false;
  }
};

const onSuccessConfirm = () => {
  showSuccess.value = false;
  // If in H5, maybe redirect to a success page or just close
  // In mini-program, maybe go home
  uni.reLaunch({ url: '/pages/home/index' });
};
</script>

<style lang="scss" scoped>
.container {
  padding: 40px 16px;
  background-color: $omiai-bg-page;
  min-height: 100vh;
}

.header {
  margin-bottom: 30px;
  text-align: center;
  
  .subtitle {
    color: $omiai-text-tip;
    margin-top: 8px;
    display: block;
  }
}

.avatar-upload-box {
  display: flex;
  justify-content: center;
  margin: 10px 0 24px;
  
  .avatar-placeholder {
    width: 100px;
    height: 100px;
    background: #F7F8FA;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px dashed $omiai-border;
  }
}

.form-card {
  padding: 24px 16px;
  border: none;
  background: $omiai-white;
  box-shadow: $omiai-shadow-sm;
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    font-size: 15px;
    font-weight: 600;
    color: $omiai-text-main;
    
    .title-line {
      width: 4px;
      height: 14px;
      background: $omiai-primary;
      border-radius: 2px;
    }
  }
  
  .mt-30 { margin-top: 32px; }
  
  .row {
    display: flex;
    gap: 16px;
    .col { flex: 1; }
  }
}

.submit-btn {
  margin-top: 32px;
  padding-bottom: 60px;
}
</style>
