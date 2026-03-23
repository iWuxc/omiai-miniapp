<template>
  <view class="container">
    <u-navbar title="完善个人资料" :autoBack="true" bgColor="#fff"></u-navbar>
    
    <view class="content">
      <view class="avatar-section" @click="chooseAvatar">
        <u-avatar :src="form.avatar" size="80" shape="circle"></u-avatar>
        <text class="upload-tip">点击上传真实头像</text>
      </view>

      <u-form :model="form" ref="formRef" labelWidth="80">
        <u-form-item label="昵称" prop="name" borderBottom required>
          <u-input v-model="form.name" border="none" placeholder="请输入你的昵称"></u-input>
        </u-form-item>

        <u-form-item label="性别" prop="gender" borderBottom required>
          <u-radio-group v-model="form.gender" placement="row">
            <u-radio :customStyle="{marginRight: '16px'}" :name="1" label="男"></u-radio>
            <u-radio :name="2" label="女"></u-radio>
          </u-radio-group>
        </u-form-item>

        <u-form-item label="出生年月" prop="birthday" borderBottom required @click="showDatePicker = true">
          <u-input v-model="form.birthday" disabled disabledColor="#ffffff" border="none" placeholder="请选择出生年月"></u-input>
          <template #right>
            <u-icon name="arrow-right"></u-icon>
          </template>
        </u-form-item>

        <u-form-item label="身高(cm)" prop="height" borderBottom required>
          <u-input v-model="form.height" type="number" border="none" placeholder="请输入身高"></u-input>
        </u-form-item>

        <u-form-item label="学历" prop="education" borderBottom required @click="showEduPicker = true">
          <u-input :value="eduText" disabled disabledColor="#ffffff" border="none" placeholder="请选择学历"></u-input>
          <template #right>
            <u-icon name="arrow-right"></u-icon>
          </template>
        </u-form-item>

        <u-form-item label="月收入" prop="income" borderBottom required>
          <u-input v-model="form.income" type="number" border="none" placeholder="请输入月收入(元)"></u-input>
        </u-form-item>

        <u-form-item label="工作城市" prop="work_city" borderBottom required>
          <u-input v-model="form.work_city" border="none" placeholder="如: 北京"></u-input>
        </u-form-item>
        
        <u-form-item label="择偶要求" prop="partner_requirements" borderBottom>
          <u-textarea v-model="form.partner_requirements" placeholder="请描述你心仪的TA"></u-textarea>
        </u-form-item>
      </u-form>

      <view class="submit-btn">
        <u-button type="primary" shape="circle" color="#FF4D6A" text="保存并开启缘分" @click="submit"></u-button>
      </view>
    </view>

    <!-- 选择器组件 -->
    <u-datetime-picker
      :show="showDatePicker"
      v-model="dateValue"
      mode="year-month"
      @confirm="onDateConfirm"
      @cancel="showDatePicker = false"
    ></u-datetime-picker>

    <u-picker 
      :show="showEduPicker" 
      :columns="[eduOptions]" 
      keyName="label"
      @confirm="onEduConfirm" 
      @cancel="showEduPicker = false"
    ></u-picker>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { cProfile } from '@/api/c_api'

const formRef = ref(null)
const showDatePicker = ref(false)
const showEduPicker = ref(false)
const dateValue = ref(Number(new Date()))

const eduOptions = [
  { label: '高中及以下', value: 1 },
  { label: '大专', value: 2 },
  { label: '本科', value: 3 },
  { label: '硕士', value: 4 },
  { label: '博士及以上', value: 5 }
]

const form = ref({
  name: '',
  gender: 1,
  birthday: '',
  avatar: '',
  height: null,
  education: 3,
  income: null,
  work_city: '',
  partner_requirements: ''
})

const eduText = computed(() => {
  const opt = eduOptions.find(item => item.value === form.value.education)
  return opt ? opt.label : ''
})

const onDateConfirm = (e: any) => {
  const date = new Date(e.value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  form.value.birthday = `${year}-${month}`
  showDatePicker.value = false
}

const onEduConfirm = (e: any) => {
  form.value.education = e.value[0].value
  showEduPicker.value = false
}

const chooseAvatar = () => {
  // TODO: 接入图片上传接口
  uni.chooseImage({
    count: 1,
    success: (res) => {
      form.value.avatar = res.tempFilePaths[0] as string
      // 这里应该调用上传API替换为网络URL
    }
  })
}

const submit = async () => {
  if (!form.value.name || !form.value.birthday || !form.value.height) {
    uni.showToast({ title: '请填写完整必填项', icon: 'none' })
    return
  }
  
  try {
    const data = {
      ...form.value,
      height: Number(form.value.height),
      income: Number(form.value.income)
    }
    const res: any = await cProfile.updateMine(data)
    if (res.code === 200) {
      uni.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/c_recommend/index' })
      }, 1500)
    }
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #f8f8f8;
}

.content {
  padding: 30rpx;
  background: #fff;
  margin-top: 20rpx;
  border-radius: 20rpx 20rpx 0 0;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  
  .upload-tip {
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #999;
  }
}

.submit-btn {
  margin-top: 60rpx;
  padding-bottom: 60rpx;
}
</style>
