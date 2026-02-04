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
                accept="image"
                :capture="['album', 'camera']"
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

          <!-- 出生年月表单项 -->
          <u-form-item label="出生年月" prop="birthday" required borderBottom @click="!isH5 && (showCalendar = true)">
            <u-input v-model="form.birthday" placeholder="请选择YYYY-MM" disabled disabledColor="#fff" border="none"></u-input>
            <u-icon slot="right" name="calendar" :color="primaryColor" size="18"></u-icon>
            <!-- H5原生日期选择器 - 绝对定位覆盖 -->
            <input 
              v-if="isH5"
              type="month"
              v-model="form.birthday"
              class="native-date-picker"
              :max="currentYearMonth"
              :min="'1950-01'"
              @change="onNativeDateChange"
            />
          </u-form-item>
          
          <!-- 小程序日期选择器弹窗 -->
          <u-popup
            v-if="!isH5"
            :show="showCalendar"
            mode="bottom"
            @close="showCalendar = false"
            :closeable="true"
            :safeAreaInsetBottom="true"
            :zIndex="9999"
          >
            <view class="picker-header">
              <text class="picker-title">选择出生年月</text>
            </view>
            <u-picker
              :show="showCalendar"
              :columns="yearMonthColumns"
              @confirm="onCalendarConfirm"
              @cancel="showCalendar = false"
              @close="showCalendar = false"
              :closeOnClickOverlay="false"
              :confirmColor="primaryColor"
              keyName="label"
            ></u-picker>
          </u-popup>

          <u-form-item label="年龄" prop="age" required borderBottom>
            <u-input v-model="form.age" type="number" placeholder="请输入您的年龄" border="none"></u-input>
          </u-form-item>

          <u-form-item label="属相" prop="zodiac" required borderBottom>
            <u-input v-model="form.zodiac" placeholder="例如：猴" border="none"></u-input>
          </u-form-item>

          <u-form-item label="联系电话" prop="phone" required borderBottom>
            <u-input v-model="form.phone" type="number" placeholder="请输入11位手机号" border="none" maxlength="11"></u-input>
          </u-form-item>

          <view class="section-title mt-30">
            <view class="title-line"></view>
            <text>详细画像</text>
          </view>

          <view class="row">
             <view class="col">
                <u-form-item label="身高(cm)" prop="height" required borderBottom labelWidth="60">
                  <u-input v-model="form.height" type="number" placeholder="0" border="none"></u-input>
                </u-form-item>
             </view>
             <view class="col">
                <u-form-item label="体重(kg)" prop="weight" required borderBottom labelWidth="60">
                  <u-input v-model="form.weight" type="number" placeholder="0" border="none"></u-input>
                </u-form-item>
             </view>
          </view>

          <u-form-item label="最高学历" prop="education" required borderBottom>
            <u-radio-group v-model="form.education">
              <u-radio label="大专" :name="2" :activeColor="primaryColor" style="margin-right: 8px"></u-radio>
              <u-radio label="本科" :name="3" :activeColor="primaryColor" style="margin-right: 8px"></u-radio>
              <u-radio label="硕士" :name="4" :activeColor="primaryColor" style="margin-right: 8px"></u-radio>
              <u-radio label="博士" :name="5" :activeColor="primaryColor"></u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="婚姻状况" prop="marital_status" required borderBottom>
            <u-radio-group v-model="form.marital_status">
              <u-radio label="未婚" :name="1" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
              <u-radio label="已婚" :name="2" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
              <u-radio label="离异" :name="3" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
              <u-radio label="丧偶" :name="4" :activeColor="primaryColor"></u-radio>
            </u-radio-group>
          </u-form-item>
          
          <u-form-item label="月收入(元)" prop="income" required borderBottom>
            <u-input v-model="form.income" type="number" placeholder="请输入月收入" border="none"></u-input>
          </u-form-item>

          <u-form-item label="家庭住址" prop="address" required borderBottom>
            <u-input v-model="form.address" placeholder="省市区+详细地址" border="none"></u-input>
          </u-form-item>

          <u-form-item label="工作单位" prop="work_unit" required borderBottom>
            <u-input v-model="form.work_unit" placeholder="具体工作单位" border="none"></u-input>
          </u-form-item>

          <u-form-item label="职位" prop="position" required borderBottom>
            <u-input v-model="form.position" placeholder="具体职位" border="none"></u-input>
          </u-form-item>

          <u-form-item label="房产情况" prop="house_status" required borderBottom>
            <u-radio-group v-model="form.house_status">
              <u-radio label="无房" :name="1" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
              <u-radio label="已购房" :name="2" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
              <u-radio label="贷款购房" :name="3" :activeColor="primaryColor"></u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="买房地址" prop="house_address" v-if="form.house_status === 2 || form.house_status === 3" required borderBottom>
            <u-input v-model="form.house_address" placeholder="请输入您的购房详细地址" border="none"></u-input>
          </u-form-item>

          <u-form-item label="车辆情况" prop="car_status" required borderBottom>
            <u-radio-group v-model="form.car_status">
              <u-radio label="无车" :name="1" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
              <u-radio label="有车" :name="2" :activeColor="primaryColor"></u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="家庭成员" prop="family_description" required labelPosition="top">
            <u-textarea 
              v-model="form.family_description" 
              placeholder="请填写：关系+姓名+年龄" 
              height="80" 
              :customStyle="{ background: '#F7F8FA', border: 'none', borderRadius: '12px', padding: '12px', marginTop: '8px' }"
            ></u-textarea>
          </u-form-item>

          <u-form-item label="对另一半要求" prop="partner_requirements" required labelPosition="top">
            <u-textarea 
              v-model="form.partner_requirements" 
              placeholder="年龄范围、学历要求、身高要求、其他要求..." 
              height="100" 
              :customStyle="{ background: '#F7F8FA', border: 'none', borderRadius: '12px', padding: '12px', marginTop: '8px' }"
            ></u-textarea>
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
            accept="image"
            :capture="['album', 'camera']"
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
    
    <u-modal :show="showConfirm" title="确认提交" content="请核对您的信息是否准确，提交后红娘姐姐将开始为您牵线匹配" @confirm="confirmSubmit" @cancel="showConfirm = false" showCancelButton></u-modal>
    
    <!-- 提交成功弹窗 -->
    <u-modal :show="showSuccess" title="提交成功" content="红娘姐姐已收到您的资料，会尽快为您匹配哦！" @confirm="onSuccessConfirm"></u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { createClient } from '@/api/client';
import { uploadFile } from '@/api/common';
import { config as appConfig } from '@/config';

// 判断是否H5环境（运行时判断）
const isH5 = computed(() => {
  return typeof window !== 'undefined' && window.navigator && window.navigator.userAgent;
});

// 当前年月（用于原生input限制）
const currentYearMonth = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
});

const primaryColor = '#FF5E78';
const maleColor = '#4A90E2';
const showCalendar = ref(false);
const submitting = ref(false);
const showSuccess = ref(false);

// 生成年份-月份选择器数据（1950-当前年份）
const currentYear = new Date().getFullYear();
const years = [];
for (let y = 1950; y <= currentYear; y++) {
  years.push({ label: String(y), value: y });
}
const months = [
  { label: '01', value: 1 }, { label: '02', value: 2 },
  { label: '03', value: 3 }, { label: '04', value: 4 },
  { label: '05', value: 5 }, { label: '06', value: 6 },
  { label: '07', value: 7 }, { label: '08', value: 8 },
  { label: '09', value: 9 }, { label: '10', value: 10 },
  { label: '11', value: 11 }, { label: '12', value: 12 }
];
const yearMonthColumns = ref([years, months]);

const avatarList = ref<any[]>([]);
const photoList = ref<any[]>([]);
const showConfirm = ref(false);

const form = reactive({
  name: '',
  gender: 1,
  birthday: '',
  age: undefined,
  zodiac: '',
  avatar: '',
  height: undefined,
  weight: undefined,
  phone: '',
  income: undefined,
  education: 3,
  marital_status: 1,
  address: '',
  work_unit: '',
  position: '',
  house_status: 1,
  house_address: '',
  car_status: 1,
  family_description: '',
  partner_requirements: '',
  remark: '',
  photos: ''
});

const onCalendarConfirm = (e: any) => {
  showCalendar.value = false;
  // u-picker 返回选中的列数据
  const selected = e.value;
  if (selected && selected.length >= 2) {
    const year = selected[0].label;
    const month = selected[1].label;
    form.birthday = `${year}-${month}`;
  }
};

// H5原生日期选择器变更
const onNativeDateChange = (e: any) => {
  form.birthday = e.target.value;
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
      const filePath = f.url || f.path;
      const res: any = await uploadFile(filePath);
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

const submit = () => {
  if (!form.name || !form.phone || !form.birthday || !form.age || !form.zodiac || 
      !form.height || !form.weight || !form.income || !form.address || 
      !form.work_unit || !form.position || !form.family_description || !form.partner_requirements) {
    uni.showToast({ title: '请填写所有必填项', icon: 'none' });
    return;
  }

  if ((form.house_status === 2 || form.house_status === 3) && !form.house_address) {
    uni.showToast({ title: '请输入买房地址', icon: 'none' });
    return;
  }
  
  if (form.phone.length !== 11) {
    uni.showToast({ title: '请输入11位手机号', icon: 'none' });
    return;
  }

  showConfirm.value = true;
};

const confirmSubmit = async () => {
  showConfirm.value = false;
  submitting.value = true;
  try {
    const payload: any = { ...form };
    if (payload.height) payload.height = Number(payload.height);
    if (payload.weight) payload.weight = Number(payload.weight);
    if (payload.income) payload.income = Number(payload.income);
    if (payload.age) payload.age = Number(payload.age);
    
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

/* H5原生日期选择器 - 覆盖在表单项上 */
.native-date-picker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 100;
}

/* picker弹窗头部 */
.picker-header {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  
  .picker-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
}

/* 确保picker在H5中正确显示在底部 */
:deep(.u-popup__content) {
  max-height: 60vh;
}

:deep(.u-picker) {
  background: #fff;
}
</style>
