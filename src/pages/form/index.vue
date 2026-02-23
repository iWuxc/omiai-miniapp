<template>
  <view class="container">
    <view class="form-wrapper">
      <!-- 标题区 -->
      <view class="header" :style="{ animationDelay: '0ms' }">
        <view class="header-content">
          <view class="title-section">
            <view class="title-badge">
              <u-icon name="edit-pen" size="14" color="#FF5E78"></u-icon>
            </view>
            <text class="page-title">完善客户档案</text>
          </view>
          <view class="import-btn" @click="goImport">
            <u-icon name="download" color="#FF5E78" size="14"></u-icon>
            <text>批量导入</text>
          </view>
        </view>
        <text class="subtitle">
          <u-icon name="info-circle" size="14" color="#FF5E78" style="margin-right: 6px;"></u-icon>
          信息越完善，智能匹配的成功率越高哦
        </text>
      </view>

      <!-- 表单区 -->
      <view class="form-card" :style="{ animationDelay: '100ms' }">
        <u-form :model="form" ref="uForm" labelPosition="left" labelWidth="80" :labelStyle="{ color: '#4E5969', fontSize: '15px' }">
          <!-- 头像照片区块 -->
          <view class="section-block">
            <view class="section-header">
              <view class="section-icon bg-pink">
                <u-icon name="camera-fill" size="20" color="#FF5E78"></u-icon>
              </view>
              <view class="section-info">
                <text class="section-title">头像照片</text>
                <text class="section-desc">上传清晰的正面照</text>
              </view>
            </view>
            
            <view class="avatar-upload-box">
               <u-upload
                  :fileList="avatarList"
                  @afterRead="afterReadAvatar"
                  @delete="deleteAvatar"
                  name="avatar"
                  multiple
                  :maxCount="1"
                  width="100"
                  height="100"
                  border-radius="50"
                  accept="image"
                  :capture="['album', 'camera']"
               >
                  <view class="avatar-placeholder">
                    <u-icon name="plus" size="32" color="#FF5E78"></u-icon>
                    <text class="placeholder-text">上传头像</text>
                  </view>
               </u-upload>
            </view>
          </view>

          <!-- 基本信息区块 -->
          <view class="section-block">
            <view class="section-header">
              <view class="section-icon bg-blue">
                <u-icon name="file-text-fill" size="20" color="#4A90E2"></u-icon>
              </view>
              <view class="section-info">
                <text class="section-title">基本信息</text>
                <text class="section-desc">完善客户基础资料</text>
              </view>
            </view>
            
            <view class="form-fields">
              <u-form-item label="真实姓名" prop="name" required borderBottom>
                <u-input v-model="form.name" placeholder="请输入姓名" border="none"></u-input>
              </u-form-item>
              
              <u-form-item label="客户性别" prop="gender" required borderBottom>
                <u-radio-group v-model="form.gender">
                  <u-radio label="男" :name="1" :activeColor="maleColor" style="margin-right: 24px"></u-radio>
                  <u-radio label="女" :name="2" :activeColor="primaryColor"></u-radio>
                </u-radio-group>
              </u-form-item>

              <u-form-item label="出生年月" prop="birthday" required borderBottom @click="onBirthdayClick">
                <u-input v-model="form.birthday" placeholder="请选择出生年月" disabled disabledColor="#fff" border="none"></u-input>
                <u-icon slot="right" name="arrow-right" color="#C0C4CC" size="16"></u-icon>
              </u-form-item>
              
              <u-form-item label="年龄" prop="age" required borderBottom>
                <u-input v-model="form.age" type="number" placeholder="请输入年龄" border="none"></u-input>
                <text class="input-suffix">岁</text>
              </u-form-item>

              <u-form-item label="属相" prop="zodiac" required borderBottom>
                <u-input v-model="form.zodiac" placeholder="例如：猴" border="none"></u-input>
              </u-form-item>

              <u-form-item label="联系电话" prop="phone" required borderBottom>
                <u-input v-model="form.phone" type="number" placeholder="请输入11位手机号" border="none" maxlength="11"></u-input>
              </u-form-item>
            </view>
          </view>

          <!-- 详细画像区块 -->
          <view class="section-block">
            <view class="section-header">
              <view class="section-icon bg-green">
                <u-icon name="grid-fill" size="20" color="#52C41A"></u-icon>
              </view>
              <view class="section-info">
                <text class="section-title">详细画像</text>
                <text class="section-desc">填写客户的详细信息</text>
              </view>
            </view>

            <view class="form-fields">
              <view class="row-fields">
                 <view class="col-field">
                    <u-form-item label="身高" prop="height" required borderBottom labelWidth="50">
                      <u-input v-model="form.height" type="number" placeholder="0" border="none"></u-input>
                      <text class="input-suffix">cm</text>
                    </u-form-item>
                 </view>
                 <view class="col-field">
                    <u-form-item label="体重" prop="weight" required borderBottom labelWidth="50">
                      <u-input v-model="form.weight" type="number" placeholder="0" border="none"></u-input>
                      <text class="input-suffix">kg</text>
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
                  <u-radio label="离异" :name="3" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
                  <u-radio label="丧偶" :name="4" :activeColor="primaryColor"></u-radio>
                </u-radio-group>
              </u-form-item>

              <u-form-item label="月收入" prop="income" required borderBottom>
                <u-input v-model="form.income" type="number" placeholder="请输入月收入" border="none"></u-input>
                <text class="input-suffix">元</text>
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

              <u-form-item label="工作城市" prop="work_city" required borderBottom @click="openRegionPicker('work')">
                <u-input v-model="form.work_city" placeholder="请选择工作城市" disabled disabledColor="#fff" border="none"></u-input>
                <u-icon slot="right" name="arrow-right" color="#C0C4CC" size="16"></u-icon>
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

              <u-form-item label="买房地址" prop="house_address" v-if="form.house_status === 2 || form.house_status === 3" required borderBottom @click="openRegionPicker('house')">
                <u-input v-model="form.house_address" placeholder="请选择购房地址" disabled disabledColor="#fff" border="none"></u-input>
                <u-icon slot="right" name="arrow-right" color="#C0C4CC" size="16"></u-icon>
              </u-form-item>

              <u-form-item label="车辆情况" prop="car_status" required borderBottom>
                <u-radio-group v-model="form.car_status">
                  <u-radio label="无车" :name="1" :activeColor="primaryColor" style="margin-right: 12px"></u-radio>
                  <u-radio label="有车" :name="2" :activeColor="primaryColor"></u-radio>
                </u-radio-group>
              </u-form-item>

              <u-form-item label="家庭成员" prop="family_description" required labelPosition="top" class="textarea-item">
                <u-textarea 
                  v-model="form.family_description" 
                  placeholder="请填写：关系+姓名+年龄" 
                  height="100" 
                  :customStyle="textareaStyle"
                ></u-textarea>
              </u-form-item>

              <u-form-item label="父母工作" prop="parents_profession" labelPosition="top" class="textarea-item">
                <u-textarea 
                  v-model="form.parents_profession" 
                  placeholder="如：父亲退休，母亲家庭主妇" 
                  height="80" 
                  :customStyle="textareaStyle"
                ></u-textarea>
              </u-form-item>

              <u-form-item label="对另一半要求" prop="partner_requirements" required labelPosition="top" class="textarea-item">
                <u-textarea 
                  v-model="form.partner_requirements" 
                  placeholder="年龄范围、学历要求、身高要求、其他要求..." 
                  height="120" 
                  :customStyle="textareaStyle"
                ></u-textarea>
              </u-form-item>

              <u-form-item label="红娘备注" prop="remark" labelPosition="top" class="textarea-item">
                <u-textarea 
                  v-model="form.remark" 
                  placeholder="请描述客户的性格、爱好、家庭情况等..." 
                  count 
                  height="140" 
                  :customStyle="textareaStyle"
                ></u-textarea>
              </u-form-item>
            </view>
          </view>

          <!-- 生活照区块 -->
          <view class="section-block">
            <view class="section-header">
              <view class="section-icon bg-orange">
                <u-icon name="photo-fill" size="20" color="#FF9F00"></u-icon>
              </view>
              <view class="section-info">
                <text class="section-title">生活相册</text>
                <text class="section-desc">最多可上传9张照片</text>
              </view>
            </view>
            
            <view class="photos-upload">
              <u-upload
                :fileList="photoList"
                @afterRead="afterReadPhotos"
                @delete="deletePhoto"
                name="photos"
                multiple
                :maxCount="9"
                width="90"
                height="90"
                accept="image"
                :capture="['album', 'camera']"
              ></u-upload>
            </view>
          </view>
        </u-form>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section" :style="{ animationDelay: '200ms' }">
        <view class="submit-btn" @click="submit">
          <text class="btn-text">提交并保存档案</text>
          <u-icon name="arrow-right" size="16" color="#fff"></u-icon>
        </view>
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

    <!-- 地区选择器 -->
    <u-picker 
      :show="showRegionPicker" 
      :columns="regionColumns" 
      keyName="name" 
      :defaultIndex="regionDefaultIndex"
      @confirm="onRegionConfirm" 
      @cancel="showRegionPicker = false" 
      @change="onRegionChange" 
      :loading="regionLoading"
    ></u-picker>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { createClient } from '@/api/client';
import { uploadFile } from '@/api/common';
import { getProvinces, getCities, getDistricts } from '@/api/china_region';
import { config as appConfig } from '@/config';

const isH5 = computed(() => {
  return typeof window !== 'undefined' && window.navigator && window.navigator.userAgent;
});

const currentYearMonth = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
});

const primaryColor = '#FF5E78';
const maleColor = '#4A90E2';
const showCalendar = ref(false);
const submitting = ref(false);

// Region Picker State
const showRegionPicker = ref(false);
const regionLoading = ref(false);
const regionType = ref<'work' | 'house'>('work');
const regionColumns = ref<any[][]>([[], [], []]); // 省、市、区
const regionDefaultIndex = ref<number[]>([0, 0, 0]); // 默认选中索引
const provinceList = ref<any[]>([]);
const cityList = ref<any[]>([]);
const districtList = ref<any[]>([]);

const currentYear = new Date().getFullYear();
const yearOptions: string[] = [];
for (let y = currentYear; y >= 1950; y--) {
  yearOptions.push(String(y));
}
const monthOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

const yearIndex = ref(25);
const monthIndex = ref(0);

const minDateStr = ref('1950-01-01');
const maxDateStr = ref(`${currentYear}-12-31`);

const avatarList = ref<any[]>([]);
const photoList = ref<any[]>([]);
const showConfirm = ref(false);

const textareaStyle = {
  background: '#F7F8FA',
  border: 'none',
  borderRadius: '12px',
  padding: '16px',
  marginTop: '8px',
  fontSize: '15px',
  lineHeight: '1.6'
};

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
  work_city: '',
  work_province_code: '',
  work_city_code: '',
  work_district_code: '',
  position: '',
  house_status: 1,
  house_address: '',
  house_province_code: '',
  house_city_code: '',
  house_district_code: '',
  car_status: 1,
  family_description: '',
  parents_profession: '',
  partner_requirements: '',
  remark: '',
  photos: ''
});

const syncPhotos = () => {
  const urls = photoList.value.filter(p => p.status === 'success').map(p => p.url);
  form.photos = JSON.stringify(urls);
};

const validateFile = (file: any) => {
  const maxSize = 50 * 1024 * 1024;
  const filePath = file.url || file.path;
  
  if (!filePath) {
    return true;
  }
  
  if (file.size > maxSize) {
    uni.showToast({ title: '文件超过50MB', icon: 'none' });
    return false;
  }
  return true;
};

const afterReadAvatar = async (event: any) => {
  let { file } = event;
  if (Array.isArray(file)) {
    file = file[0];
  }

  if (!validateFile(file)) return;
  
  avatarList.value.push({ ...file, status: 'uploading', message: '上传中' });
  try {
    const filePath = file.url || file.path;
    const res: any = await uploadFile(filePath);
    const url = res.url.startsWith('http') ? res.url : appConfig.assetsUrl + res.url;
    avatarList.value[0].url = url;
    avatarList.value[0].status = 'success';
    form.avatar = url;
  } catch (e) {
    avatarList.value[0].status = 'failed';
    avatarList.value[0].message = '上传失败';
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
      !form.work_unit || !form.work_city || !form.position || !form.family_description || !form.partner_requirements) {
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

// 地区选择器逻辑
const openRegionPicker = async (type: 'work' | 'house') => {
  regionType.value = type;
  // 强制重置选中项索引，解决回显异常
  regionDefaultIndex.value = [0, 0, 0];
  showRegionPicker.value = true;
  
  if (provinceList.value.length === 0) {
    regionLoading.value = true;
    try {
      const res: any = await getProvinces();
      provinceList.value = res || [];
      regionColumns.value[0] = provinceList.value;
      
      // 默认加载第一个省的城市
      if (provinceList.value.length > 0) {
        const cities: any = await getCities(provinceList.value[0].code);
        cityList.value = cities || [];
        regionColumns.value[1] = cityList.value;
        
        // 默认加载第一个城市的区县
        if (cityList.value.length > 0) {
           const districts: any = await getDistricts(cityList.value[0].code);
           districtList.value = districts || [];
           regionColumns.value[2] = districtList.value;
        } else {
           regionColumns.value[2] = [];
        }
      }
    } catch (e) {
      uni.showToast({ title: '加载地区数据失败', icon: 'none' });
    } finally {
      regionLoading.value = false;
    }
  }
};

const onRegionChange = async (e: any) => {
  const { columnIndex, index, indexs } = e;
  
  // 省份变动 -> 加载城市
  if (columnIndex === 0) {
    regionLoading.value = true;
    try {
      const provinceCode = provinceList.value[index].code;
      const cities: any = await getCities(provinceCode);
      cityList.value = cities || [];
      regionColumns.value[1] = cityList.value;
      
      // 重置区县
      if (cityList.value.length > 0) {
        const districts: any = await getDistricts(cityList.value[0].code);
        districtList.value = districts || [];
        regionColumns.value[2] = districtList.value;
      } else {
        regionColumns.value[2] = [];
      }
    } finally {
      regionLoading.value = false;
    }
  }
  
  // 城市变动 -> 加载区县
  if (columnIndex === 1) {
    regionLoading.value = true;
    try {
      // 注意：这里需要根据当前选中的省份索引来获取城市列表
      // 但由于 uView 的 picker 实现，change 事件触发时 columns[1] 已经是新的城市列表了
      // 这里的 index 是城市在 columns[1] 中的索引
      const cityCode = cityList.value[index].code;
      const districts: any = await getDistricts(cityCode);
      districtList.value = districts || [];
      regionColumns.value[2] = districtList.value;
    } finally {
      regionLoading.value = false;
    }
  }
};

const onRegionConfirm = (e: any) => {
  const { value } = e;
  // value 是一个数组，包含选中的对象 [省, 市, 区]
  const province = value[0];
  const city = value[1];
  const district = value[2];
  
  const fullName = `${province?.name || ''}${city?.name || ''}${district?.name || ''}`;
  
  if (regionType.value === 'work') {
    form.work_city = fullName;
    form.work_province_code = province?.code || '';
    form.work_city_code = city?.code || '';
    form.work_district_code = district?.code || '';
  } else {
    form.house_address = fullName;
    form.house_province_code = province?.code || '';
    form.house_city_code = city?.code || '';
    form.house_district_code = district?.code || '';
  }
  
  showRegionPicker.value = false;
};
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

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F7FA 0%, #ffffff 20%, #F5F7FA 100%);
  padding: 20px 16px 60px;
}

.form-wrapper {
  max-width: 100%;
}

// Header
.header {
  margin-bottom: 24px;
  animation: fadeInUp 0.5s ease-out both;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .title-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .title-badge {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #FFF0F2 0%, rgba(255, 94, 120, 0.15) 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #1D2129;
  }
  
  .import-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #FFF0F2 0%, rgba(255, 94, 120, 0.08) 100%);
    padding: 8px 16px;
    border-radius: 20px;
    transition: all 0.2s ease;
    
    text {
      font-size: 13px;
      color: #FF5E78;
      font-weight: 500;
    }
    
    &:active {
      transform: scale(0.95);
      background: linear-gradient(135deg, rgba(255, 94, 120, 0.15) 0%, #FFF0F2 100%);
    }
  }
  
  .subtitle {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #86909C;
    padding-left: 4px;
  }
}

// Form Card
.form-card {
  background: #FFFFFF;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 24px 20px;
  animation: fadeInUp 0.5s ease-out both;
}

// Section Block
.section-block {
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #E5E6EB;
}

.section-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &.bg-pink {
    background: linear-gradient(135deg, #FFF0F2 0%, rgba(255, 94, 120, 0.12) 100%);
  }
  
  &.bg-blue {
    background: linear-gradient(135deg, #E8F3FF 0%, rgba(74, 144, 226, 0.12) 100%);
  }
  
  &.bg-green {
    background: linear-gradient(135deg, #E8FFEA 0%, rgba(82, 196, 26, 0.12) 100%);
  }
  
  &.bg-orange {
    background: linear-gradient(135deg, #FFF7E8 0%, rgba(255, 159, 0, 0.12) 100%);
  }
}

.section-info {
  flex: 1;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: #1D2129;
  display: block;
  margin-bottom: 4px;
}

.section-desc {
  font-size: 13px;
  color: #86909C;
}

// Avatar Upload
.avatar-upload-box {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  
  :deep(.u-upload) {
    .u-upload__wrap {
      justify-content: center;
    }
  }
  
  .avatar-placeholder {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #FFF0F2 0%, #FFFAFB 100%);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px dashed rgba(255, 94, 120, 0.3);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.95);
      background: linear-gradient(135deg, rgba(255, 94, 120, 0.08) 0%, #FFF0F2 100%);
      border-color: #FF5E78;
    }
    
    .placeholder-text {
      font-size: 13px;
      color: #FF5E78;
      margin-top: 8px;
      font-weight: 500;
    }
  }
}

// Form Fields
.form-fields {
  :deep(.u-form-item) {
    margin-bottom: 4px;
    
    .u-form-item__body {
      padding: 14px 0;
    }
    
    .u-input {
      font-size: 15px;
      
      &__content__field-wrapper__field {
        color: #1D2129;
      }
    }
  }
}

.input-suffix {
  font-size: 14px;
  color: #86909C;
  margin-left: 8px;
  font-weight: 500;
}

.row-fields {
  display: flex;
  gap: 16px;
  
  .col-field {
    flex: 1;
  }
}

.textarea-item {
  margin-top: 8px;
}

// Photos Upload
.photos-upload {
  padding: 8px 0;
  
  :deep(.u-upload) {
    .u-upload__wrap {
      gap: 12px;
    }
    
    .u-upload__button {
      width: 90px !important;
      height: 90px !important;
      border-radius: 12px;
      border: 2px dashed rgba(255, 94, 120, 0.2);
      background: linear-gradient(135deg, #FFF0F2 0%, #FFFAFB 100%);
    }
  }
}

// Submit Section
.submit-section {
  margin-top: 40px;
  padding: 0 4px;
  animation: fadeInUp 0.5s ease-out both;
}

.submit-btn {
  background: linear-gradient(135deg, #FF5E78 0%, #FF8A9B 100%);
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(255, 94, 120, 0.35);
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(2px) scale(0.98);
    box-shadow: 0 4px 12px rgba(255, 94, 120, 0.25);
  }
  
  .btn-text {
    color: #fff;
    font-size: 17px;
    font-weight: 600;
  }
}

// Calendar Modal
.calendar-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  backdrop-filter: blur(4px);
}

.calendar-popup {
  background: #fff;
  border-radius: 24px 24px 0 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  animation: slideUp 0.3s ease-out;
}

.picker-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #F2F3F5;
  
  .picker-cancel { 
    color: #86909C; 
    font-size: 16px;
    padding: 8px;
  }
  
  .picker-title-text { 
    font-size: 17px; 
    font-weight: 600; 
    color: #1D2129; 
  }
  
  .picker-confirm { 
    color: #FF5E78; 
    font-size: 16px; 
    font-weight: 600;
    padding: 8px;
  }
}

.picker-body {
  height: 280px;
  
  .picker-view-box {
    width: 100%;
    height: 100%;
  }
  
  .picker-item {
    line-height: 52px;
    text-align: center;
    font-size: 17px;
    color: #1D2129;
  }
}
</style>
