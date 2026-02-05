<template>
  <view class="container">
    <view class="form-wrapper">
      <!-- 1) 标题区 (中式亲和力：大标题 + 温馨提示) -->
      <view class="header fade-in">
        <view class="header-row">
            <text class="omiai-title-xl">完善客户档案</text>
            <view class="import-btn" @click="goImport">
                <u-icon name="download" color="#FF5E78" size="14"></u-icon>
                <text>批量导入</text>
            </view>
        </view>
        <text class="omiai-text-md subtitle">信息越完善，智能匹配的成功率越高哦</text>
      </view>

      <!-- 2) 表单区 (中式清晰层次：分组 + 细致标签) -->
      <view class="form-card omiai-card fade-in">
        <u-form :model="form" ref="uForm" labelPosition="left" labelWidth="80" :labelStyle="{ color: '#4E5969', fontSize: '15px' }">
          <view class="section-title">
            <view class="title-line"></view>
            <text>头像照片</text>
          </view>
          
          <view class="avatar-upload-box">
             <u-upload
                :fileList="avatarList"
                @afterRead="afterReadAvatar"
                @delete="deleteAvatar"
                name="avatar"
                multiple
                :maxCount="1"
                width="80"
                height="80"
                border-radius="40"
                accept="image"
                :capture="['album', 'camera']"
             >
                <view class="avatar-placeholder">
                  <u-icon name="camera-fill" size="26" color="#C0C4CC"></u-icon>
                  <text class="omiai-text-sm">上传头像</text>
                </view>
             </u-upload>
          </view>

          <view class="section-title mt-30">
            <view class="title-line"></view>
            <text>基本信息</text>
          </view>
          
          <u-form-item label="真实姓名" prop="name" required borderBottom>
            <u-input v-model="form.name" placeholder="请输入姓名" border="none"></u-input>
          </u-form-item>
          
          <u-form-item label="客户性别" prop="gender" required borderBottom>
            <u-radio-group v-model="form.gender">
              <u-radio label="男" :name="1" :activeColor="maleColor" style="margin-right: 24px"></u-radio>
              <u-radio label="女" :name="2" :activeColor="primaryColor"></u-radio>
            </u-radio-group>
          </u-form-item>

          <!-- 出生年月表单项 -->
          <u-form-item label="出生年月" prop="birthday" required borderBottom @click="onBirthdayClick">
            <u-input v-model="form.birthday" placeholder="请选择YYYY-MM" disabled disabledColor="#fff" border="none"></u-input>
            <u-icon slot="right" name="calendar" :color="primaryColor" size="18"></u-icon>
          </u-form-item>
          
          <!-- moved to bottom -->

          <u-form-item label="年龄" prop="age" required borderBottom>
            <u-input v-model="form.age" type="number" placeholder="请输入年龄" border="none"></u-input>
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

          <u-form-item label="具体工作" prop="profession" required borderBottom>
            <u-input v-model="form.profession" placeholder="请描述具体工作内容" border="none"></u-input>
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
            <u-input v-model="form.house_address" placeholder="请输入购房详细地址" border="none"></u-input>
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

          <u-form-item label="红娘备注" prop="remark" labelPosition="top">
            <u-textarea 
              v-model="form.remark" 
              placeholder="请描述客户的性格、爱好、家庭情况等..." 
              count 
              height="120" 
              :customStyle="{ background: '#F7F8FA', border: 'none', borderRadius: '12px', padding: '12px', marginTop: '8px' }"
            ></u-textarea>
          </u-form-item>

          <view class="section-title mt-30">
            <view class="title-line"></view>
            <text>更多生活照</text>
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

      <!-- 3) 提交按钮 (中式品牌感：渐变主按钮) -->
      <view class="submit-btn fade-in">
        <u-button 
          :loading="submitting" 
          @click="submit" 
          class="omiai-btn-primary"
          customStyle="height: 50px; font-size: 16px; border: none;"
        >提交并保存档案</u-button>
      </view>
    </view>
    
    <!-- 年月选择器弹窗 -->
    <view v-if="showCalendar" class="calendar-mask" @click="showCalendar = false">
      <view class="calendar-popup" @click.stop>
        <view class="picker-header-row">
          <text class="picker-cancel" @click="showCalendar = false">取消</text>
          <text class="picker-title-text">选择出生年月</text>
          <text class="picker-confirm" @click="confirmYearMonth">确定</text>
        </view>
        <view class="picker-body">
          <picker-view :value="[yearIndex, monthIndex]" @change="onPickerChange" class="picker-view-box">
            <picker-view-column>
              <view class="picker-item" v-for="(year, index) in yearOptions" :key="index">{{ year }}年</view>
            </picker-view-column>
            <picker-view-column>
              <view class="picker-item" v-for="(month, index) in monthOptions" :key="index">{{ month }}月</view>
            </picker-view-column>
          </picker-view>
        </view>
      </view>
    </view>
    
    <u-modal :show="showConfirm" title="确认提交" content="请核对信息是否准确，提交后红娘将开始为您匹配" @confirm="confirmSubmit" @cancel="showConfirm = false" showCancelButton></u-modal>
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

// 年月选择器数据
const currentYear = new Date().getFullYear();
const yearOptions: string[] = [];
for (let y = currentYear; y >= 1950; y--) {
  yearOptions.push(String(y));
}
const monthOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const yearIndex = ref(25); // 默认选中25年前
const monthIndex = ref(0);

// 日历组件日期限制
const minDateStr = ref('1950-01-01');
const maxDateStr = ref(`${currentYear}-12-31`);

const avatarList = ref<any[]>([]);
const photoList = ref<any[]>([]);
const showConfirm = ref(false);

const form = reactive({
  name: '',
  gender: 1,
  birthday: '',
  age: undefined as number | undefined,
  zodiac: '',
  avatar: '',
  height: undefined as number | undefined,
  weight: undefined as number | undefined,
  phone: '',
  income: undefined as number | undefined,
  education: 3,
  marital_status: 1,
  address: '',
  profession: '',
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

const syncPhotos = () => {
  const urls = photoList.value.filter(p => p.status === 'success').map(p => p.url);
  form.photos = JSON.stringify(urls);
};

const validateFile = (file: any) => {
  const maxSize = 5 * 1024 * 1024;
  const filePath = file.url || file.path;
  
  if (!filePath) {
    // 无法获取路径时，暂时放行，由后端校验或后续流程处理
    return true;
  }

  // 简单的后缀检查（如果有）
  if (filePath.indexOf('.') > -1) {
      const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
      // 可以根据需要添加前端后缀校验
  }
  
  if (file.size > maxSize) {
    uni.showToast({ title: '文件超过5MB', icon: 'none' });
    return false;
  }
  return true;
};

const afterReadAvatar = async (event: any) => {
  let { file } = event;
  // 兼容多选情况，取第一个
  if (Array.isArray(file)) {
    file = file[0];
  }

  if (!validateFile(file)) return;
  
  avatarList.value.push({ ...file, status: 'uploading', message: '上传中' });
  try {
    const filePath = file.url || file.path;
    const res: any = await uploadFile(filePath);
    // Backend returns full URL if it's OSS/COS, or relative if local
    const url = res.url.startsWith('http') ? res.url : appConfig.assetsUrl + res.url;
    avatarList.value[0].url = url;
    avatarList.value[0].status = 'success';
    form.avatar = url;
  } catch (e) {
    avatarList.value[0].status = 'failed';
    avatarList.value[0].message = '上传失败';
    // 移除上传失败的文件
    setTimeout(() => {
        avatarList.value = [];
        form.avatar = '';
    }, 1000);
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
    
    photoList.value.push({ ...f, status: 'uploading', message: '上传中' });
    const item = photoList.value[photoList.value.length - 1];

    try {
      const filePath = f.url || f.path;
      const res: any = await uploadFile(filePath);
      // Backend returns full URL if it's OSS/COS, or relative if local
      const url = res.url.startsWith('http') ? res.url : appConfig.assetsUrl + res.url;
      item.url = url;
      item.status = 'success';
      syncPhotos();
    } catch (e) {
      item.status = 'failed';
      item.message = '上传失败';
    }
  }
};

const deletePhoto = (event: any) => {
  photoList.value.splice(event.index, 1);
  syncPhotos();
};

const onPickerChange = (e: any) => {
  const values = e.detail.value;
  yearIndex.value = values[0];
  monthIndex.value = values[1];
};

const confirmYearMonth = () => {
  const year = yearOptions[yearIndex.value];
  const month = monthOptions[monthIndex.value];
  form.birthday = `${year}-${month}`;
  showCalendar.value = false;
  
  // 计算年龄
  const currentYear = new Date().getFullYear();
  form.age = currentYear - parseInt(year);
};

const onBirthdayClick = () => {
  showCalendar.value = true;
};

const goImport = () => {
    uni.navigateTo({ url: '/pages/import/index' });
};

const submit = () => {
  if (!form.name || !form.phone || !form.birthday || !form.age || !form.zodiac || 
      !form.height || !form.weight || !form.income || !form.address || !form.profession ||
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
    uni.showToast({ title: '保存成功', icon: 'success' });
    
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
  padding: 24px 16px;
  background-color: $omiai-bg-page;
}

.header {
  margin-bottom: 24px;
  padding-left: 4px;
  
  .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .import-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #FFF0F2;
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 13px;
          color: $omiai-primary;
          font-weight: 500;
      }
  }
  
  .subtitle {
    color: $omiai-text-tip;
    margin-top: 6px;
    display: block;
  }
}

.avatar-upload-box {
  display: flex;
  justify-content: center;
  margin: 10px 0 20px;
  
  .avatar-placeholder {
    width: 80px;
    height: 80px;
    background: #F7F8FA;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px dashed $omiai-border;
  }
}

.form-card {
  padding: 20px 16px;
  border: none;
  background: $omiai-white;
  
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
  padding-bottom: 40px;
}

/* 出生年月项包装器 */
.birthday-item-wrapper {
  position: relative;

  /* 点击遮罩层 - 用于小程序唤起picker */
  .birthday-click-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
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
    z-index: 20;
  }
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

/* 自定义弹窗样式 */
.calendar-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.calendar-popup {
  background: #fff;
  border-radius: 12px 12px 0 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.picker-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  
  .picker-cancel { color: #969799; font-size: 15px; }
  .picker-title-text { font-size: 16px; font-weight: 500; color: #323233; }
  .picker-confirm { color: $omiai-primary; font-size: 15px; font-weight: 500; }
}

.picker-body {
  height: 260px;
  
  .picker-view-box {
    width: 100%;
    height: 100%;
  }
  
  .picker-item {
    line-height: 48px;
    text-align: center;
    font-size: 16px;
    color: #333;
  }
}
</style>
