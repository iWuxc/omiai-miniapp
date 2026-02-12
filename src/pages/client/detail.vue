<template>
  <view class="client-detail-container">
    <!-- 顶部渐变背景 -->
    <view class="header-bg"></view>
    
    <!-- 导航栏 -->
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <view class="back-btn" @click="goBack">
          <u-icon name="arrow-left" size="22" color="#fff"></u-icon>
        </view>
        <text class="nav-title">客户档案</text>
        <view class="more-btn" @click="showMoreMenu">
          <u-icon name="more-dot-fill" size="22" color="#fff"></u-icon>
        </view>
      </view>
    </view>

    <!-- 主体内容 -->
    <scroll-view 
      scroll-y 
      class="content-scroll" 
      :style="{ paddingTop: (statusBarHeight + 44) + 'px' }"
      @scroll="onScroll"
    >
      <!-- 个人资料头部 -->
      <view class="profile-header">
        <view class="avatar-section">
          <view class="avatar-wrapper" @click="previewAvatar">
            <image 
              :src="getAvatar(client)" 
              class="avatar-img"
              mode="aspectFill"
            />
            <view class="status-ring" :class="getStatusClass(client.status)"></view>
            <view class="zoom-icon">
              <u-icon name="zoom-in" size="14" color="#fff"></u-icon>
            </view>
          </view>
          <view class="profile-info">
            <view class="name-row">
              <text class="name">{{ client.name || '未命名' }}</text>
              <view class="gender-badge" :class="client.gender === 1 ? 'male' : 'female'">
                <u-icon :name="client.gender === 1 ? 'man' : 'woman'" size="12" color="#fff"></u-icon>
                <text class="gender-text">{{ client.gender === 1 ? '男' : '女' }}</text>
              </view>
            </view>
            <view class="id-text">ID: {{ client.id }}</view>
            <view class="status-bar">
              <view class="status-tag" :class="getStatusClass(client.status)">
                {{ getStatusText(client.status) }}
              </view>
            </view>
          </view>
        </view>

        <!-- 关键数据 -->
        <view class="key-stats">
          <view class="stat-item">
            <text class="stat-value">{{ client.age || '-' }}</text>
            <text class="stat-label">年龄</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-value">{{ client.height ? client.height + 'cm' : '-' }}</text>
            <text class="stat-label">身高</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-value">{{ getEducationText(client.education) }}</text>
            <text class="stat-label">学历</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-value">{{ client.zodiac || '-' }}</text>
            <text class="stat-label">属相</text>
          </view>
        </view>
      </view>

      <!-- 标签导航 -->
      <view class="tab-section" :class="{ sticky: isTabSticky }">
        <view class="tab-list">
          <view 
            v-for="(tab, index) in tabs" 
            :key="index"
            class="tab-item"
            :class="{ active: currentTab === index }"
            @click="switchTab(index)"
          >
            <text class="tab-name">{{ tab.name }}</text>
            <view class="tab-line" v-if="currentTab === index"></view>
          </view>
        </view>
      </view>

      <!-- 基础档案 Tab -->
      <view v-if="currentTab === 0" class="tab-content">
        <!-- 联系方式卡片 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon contact">
              <u-icon name="phone-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">联系方式</text>
          </view>
          <view class="card-body">
            <view class="info-row" @click="makePhoneCall(client.phone)">
              <view class="info-label">
                <u-icon name="phone" size="14" color="#909399"></u-icon>
                <text>手机号码</text>
              </view>
              <view class="info-value-box">
                <text class="info-value">{{ client.phone || '未填写' }}</text>
                <u-icon v-if="client.phone" name="arrow-right" size="14" color="#C0C4CC"></u-icon>
              </view>
            </view>
            <view class="info-row">
              <view class="info-label">
                <u-icon name="calendar" size="14" color="#909399"></u-icon>
                <text>出生年月</text>
              </view>
              <text class="info-value">{{ client.birthday || '-' }}</text>
            </view>
          </view>
        </view>

        <!-- 工作信息卡片 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon work">
              <u-icon name="bag-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">工作信息</text>
          </view>
          <view class="card-body">
            <view class="info-row">
              <view class="info-label">
                <u-icon name="account" size="14" color="#909399"></u-icon>
                <text>职业</text>
              </view>
              <text class="info-value">{{ client.profession || '未填写' }}</text>
            </view>
            <view class="info-row">
              <view class="info-label">
                <u-icon name="map" size="14" color="#909399"></u-icon>
                <text>工作城市</text>
              </view>
              <text class="info-value">{{ client.work_city || '未填写' }}</text>
            </view>
            <view class="info-row highlight">
              <view class="info-label">
                <u-icon name="red-packet" size="14" color="#909399"></u-icon>
                <text>月收入</text>
              </view>
              <text class="info-value income">{{ client.income ? formatIncome(client.income) : '未填写' }}</text>
            </view>
          </view>
        </view>

        <!-- 资产情况卡片 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon asset">
              <u-icon name="home-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">资产情况</text>
          </view>
          <view class="card-body">
            <view class="info-row">
              <view class="info-label">
                <u-icon name="home" size="14" color="#909399"></u-icon>
                <text>房产状况</text>
              </view>
              <text class="info-value">{{ getHouseStatusText(client.house_status) }}</text>
            </view>
            <view class="info-row" v-if="client.house_address">
              <view class="info-label">
                <u-icon name="map-fill" size="14" color="#909399"></u-icon>
                <text>房产地址</text>
              </view>
              <text class="info-value">{{ client.house_address }}</text>
            </view>
            <view class="info-row">
              <view class="info-label">
                <u-icon name="car" size="14" color="#909399"></u-icon>
                <text>车辆状况</text>
              </view>
              <text class="info-value">{{ getCarStatusText(client.car_status) }}</text>
            </view>
          </view>
        </view>

        <!-- 身体信息卡片 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon body">
              <u-icon name="account-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">身体信息</text>
          </view>
          <view class="card-body grid-layout">
            <view class="grid-item">
              <text class="grid-label">身高</text>
              <text class="grid-value">{{ client.height ? client.height + 'cm' : '-' }}</text>
            </view>
            <view class="grid-item">
              <text class="grid-label">体重</text>
              <text class="grid-value">{{ client.weight ? client.weight + 'kg' : '-' }}</text>
            </view>
            <view class="grid-item">
              <text class="grid-label">属相</text>
              <text class="grid-value">{{ client.zodiac || '-' }}</text>
            </view>
            <view class="grid-item">
              <text class="grid-label">婚姻状况</text>
              <text class="grid-value">{{ getMaritalStatusText(client.marital_status) || '-' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 详细资料 Tab -->
      <view v-if="currentTab === 1" class="tab-content">
        <!-- 现居地址 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon location">
              <u-icon name="map-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">现居地址</text>
          </view>
          <view class="card-body">
            <view class="address-box">
              <u-icon name="map" size="16" color="#FF5E78"></u-icon>
              <text class="address-text">{{ client.address || '未填写居住地址' }}</text>
            </view>
          </view>
        </view>

        <!-- 家庭背景 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon family">
              <u-icon name="account-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">家庭背景</text>
          </view>
          <view class="card-body">
            <view class="content-block">
              <view class="block-title">家庭成员</view>
              <text class="block-content">{{ client.family_description || '暂无家庭成员信息' }}</text>
            </view>
            <view class="content-block" v-if="client.parents_profession">
              <view class="block-title">父母工作</view>
              <text class="block-content">{{ client.parents_profession }}</text>
            </view>
          </view>
        </view>

        <!-- 自我介绍 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon intro">
              <u-icon name="edit-pen-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">自我介绍</text>
          </view>
          <view class="card-body">
            <text class="intro-text">{{ client.remark || '暂无自我介绍' }}</text>
          </view>
        </view>

        <!-- 择偶标准 -->
        <view class="info-card" v-if="client.partner_requirements">
          <view class="card-header">
            <view class="header-icon match">
              <u-icon name="heart-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">择偶标准</text>
          </view>
          <view class="card-body">
            <view class="requirement-box">
              <text class="req-text">{{ formatPartnerRequirements(client.partner_requirements) }}</text>
            </view>
          </view>
        </view>

        <!-- 个性标签 -->
        <view class="info-card" v-if="client.tags">
          <view class="card-header">
            <view class="header-icon tags">
              <u-icon name="tags-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">个性标签</text>
          </view>
          <view class="card-body">
            <view class="tag-cloud">
              <text 
                v-for="(tag, index) in parseTags(client.tags)" 
                :key="index" 
                class="tag-pill"
                :style="{ animationDelay: index * 0.05 + 's' }"
              >
                {{ tag }}
              </text>
            </view>
          </view>
        </view>

        <!-- 照片墙 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon photo">
              <u-icon name="photo-fill" size="16" color="#fff"></u-icon>
            </view>
            <text class="header-title">照片墙</text>
            <text class="photo-count">{{ photoList.length }}/9</text>
          </view>
          <view class="card-body">
            <view class="photo-grid">
              <view 
                v-for="(photo, index) in photoList" 
                :key="index"
                class="photo-item"
                :style="{ animationDelay: index * 0.05 + 's' }"
                @click="previewImage(index)"
              >
                <image :src="photo" mode="aspectFill" class="photo-img" />
                <view class="photo-delete" @click.stop="deletePhoto(index)">
                  <u-icon name="close" size="10" color="#fff"></u-icon>
                </view>
              </view>
              <view 
                class="photo-item upload-btn" 
                @click="chooseImage"
                v-if="photoList.length < 9"
              >
                <u-icon name="plus" size="28" color="#C0C4CC"></u-icon>
                <text class="upload-hint">添加照片</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 系统信息 -->
        <view class="info-card system-info">
          <view class="card-body">
            <view class="system-row">
              <text class="system-label">客户ID</text>
              <text class="system-value">{{ client.id }}</text>
            </view>
            <view class="system-row">
              <text class="system-label">录入时间</text>
              <text class="system-value">{{ formatTime(client.created_at) }}</text>
            </view>
            <view class="system-row">
              <text class="system-label">更新时间</text>
              <text class="system-value">{{ formatTime(client.updated_at) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 智能匹配 Tab -->
      <view v-if="currentTab === 2" class="tab-content">
        <view class="match-container">
          <view class="match-hero">
            <view class="match-icon-box">
              <u-icon name="heart-fill" size="60" color="#FF5E78"></u-icon>
            </view>
            <text class="match-title">AI 智能匹配</text>
            <text class="match-desc">基于大数据算法，为您推荐最合适的伴侣</text>
          </view>

          <view class="match-features">
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="search" size="24" color="#FF5E78"></u-icon>
              </view>
              <view class="feature-info">
                <text class="feature-title">精准筛选</text>
                <text class="feature-desc">根据择偶标准智能匹配</text>
              </view>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="chart" size="24" color="#FF5E78"></u-icon>
              </view>
              <view class="feature-info">
                <text class="feature-title">匹配评分</text>
                <text class="feature-desc">多维度计算匹配度</text>
              </view>
            </view>
            <view class="feature-item">
              <view class="feature-icon">
                <u-icon name="eye" size="24" color="#FF5E78"></u-icon>
              </view>
              <view class="feature-info">
                <text class="feature-title">实时推荐</text>
                <text class="feature-desc">动态更新推荐列表</text>
              </view>
            </view>
          </view>

          <view class="match-action">
            <button 
              class="match-btn" 
              :disabled="isMatchDisabled"
              @click="match"
            >
              <text class="btn-text">开始智能匹配</text>
            </button>
            <text v-if="isMatchDisabled" class="match-tip">{{ matchDisabledReason }}</text>
          </view>
        </view>
      </view>

      <!-- 底部留白 -->
      <view class="footer-spacer"></view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="footer-bar" v-if="currentTab !== 2">
      <view class="footer-content">
        <button 
          v-if="currentTab === 0" 
          class="action-btn primary"
          :disabled="isMatchDisabled"
          @click="match"
        >
          <text>一键智能匹配</text>
        </button>
        <template v-if="currentTab === 1">
          <button class="action-btn secondary" @click="editClient">
            <text>编辑资料</text>
          </button>
          <button 
            v-if="client.status === 1" 
            class="action-btn danger"
            @click="handleDelete"
          >
            <text>删除</text>
          </button>
          <button 
            class="action-btn primary"
            :disabled="isMatchDisabled"
            @click="match"
          >
            <text>智能匹配</text>
          </button>
        </template>
      </view>
    </view>

    <!-- 更多操作弹窗 -->
    <u-action-sheet
      :show="showActionSheet"
      :actions="actionList"
      title="更多操作"
      @close="showActionSheet = false"
      @select="onActionSelect"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getClientDetail, matchClient, deleteClient, type Client } from '@/api/client';
import { dissolveMatch } from '@/api/match';
import { uploadFile } from '@/api/common';

// 状态栏高度
const statusBarHeight = ref(44);

// 获取系统信息设置状态栏高度
try {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 44;
} catch (e) {
  console.error('获取系统信息失败', e);
}

const client = ref<Client>({} as Client);
const showActionSheet = ref(false);
const currentTab = ref(0);
const isTabSticky = ref(false);
const uploading = ref(false);

const tabs = [
  { name: '基础档案' },
  { name: '详细资料' },
  { name: '智能匹配' },
];

const actionList = [
  { name: '编辑资料', color: '#303133' },
  { name: '删除客户', color: '#FF5E78' }
];

const defaultAvatar = 'https://cdn.uviewui.com/uview/album/1.jpg';

// 照片列表
const photoList = computed(() => {
  if (!client.value.photos) return [];
  try {
    return JSON.parse(client.value.photos);
  } catch {
    return client.value.photos.split(',').filter(p => p.trim());
  }
});

// 是否禁用匹配
const isMatchDisabled = computed(() => {
  return client.value.status === 2 || client.value.status === 3 || client.value.status === 4;
});

// 匹配禁用原因
const matchDisabledReason = computed(() => {
  if (client.value.status === 2) return '当前状态为"匹配中"，无法进行新匹配';
  if (client.value.status === 3) return '当前状态为"已拉手"，无法进行新匹配';
  if (client.value.status === 4) return '当前状态为"停止服务"，无法进行匹配';
  return '';
});

// 获取头像
const getAvatar = (c: any) => {
  if (c && c.avatar) return c.avatar;
  if (c && c.id) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`;
  return defaultAvatar;
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 显示更多菜单
const showMoreMenu = () => {
  showActionSheet.value = true;
};

// 选择操作
const onActionSelect = (e: any) => {
  if (e.name === '编辑资料') {
    editClient();
  } else if (e.name === '删除客户') {
    handleDelete();
  }
};

// 切换标签
const switchTab = (index: number) => {
  currentTab.value = index;
};

// 滚动事件
const onScroll = (e: any) => {
  isTabSticky.value = e.detail.scrollTop > 200;
};

// 编辑客户
const editClient = () => {
  const id = client.value.id;
  if (id) {
    uni.navigateTo({ url: `/pages/client/edit?id=${id}` });
  }
};

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    loadDetail(parseInt(options.id));
  }
});

// 加载详情
const loadDetail = async (id: number) => {
  try {
    const res: any = await getClientDetail(id);
    client.value = res;
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
};

// 开始匹配
const match = () => {
  if (!client.value.id) return;
  
  if (isMatchDisabled.value) {
    uni.showToast({ title: matchDisabledReason.value, icon: 'none' });
    return;
  }
  
  uni.navigateTo({ url: `/pages/match/candidates?clientId=${client.value.id}` });
};

// 删除客户
const handleDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除客户「${client.value.name}」吗？删除后无法恢复！`,
    confirmColor: '#FF4D4F',
    confirmText: '确认删除',
    cancelText: '取消',
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteClient(client.value.id as number);
          uni.showToast({ title: '删除成功', icon: 'success' });
          setTimeout(() => uni.navigateBack(), 1500);
        } catch (e: any) {
          uni.showToast({ title: e?.msg || '删除失败', icon: 'none' });
        }
      }
    }
  });
};

// 拨打电话
const makePhoneCall = (phone: string) => {
  if (phone) {
    uni.makePhoneCall({ phoneNumber: phone });
  }
};

// 预览图片
const previewImage = (index: number) => {
  uni.previewImage({
    urls: photoList.value,
    current: index,
    loop: true
  });
};

// 预览头像
const previewAvatar = () => {
  const avatarUrl = getAvatar(client.value);
  uni.previewImage({
    urls: [avatarUrl],
    current: 0,
    loop: false
  });
};

// 选择图片
const chooseImage = async () => {
  if (uploading.value) return;
  
  const remainCount = 9 - photoList.value.length;
  if (remainCount <= 0) {
    uni.showToast({ title: '最多只能上传9张照片', icon: 'none' });
    return;
  }
  
  try {
    const res = await uni.chooseImage({
      count: remainCount,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera']
    });
    
    await uploadImages(res.tempFilePaths as string[]);
  } catch (e) {
    console.error('选择图片失败', e);
  }
};

// 上传图片
const uploadImages = async (filePaths: string[]) => {
  uploading.value = true;
  const newPhotos = [...photoList.value];
  let successCount = 0;
  
  for (const filePath of filePaths) {
    try {
      const res: any = await uploadFile(filePath);
      if (res?.url) {
        newPhotos.push(res.url);
        successCount++;
      }
    } catch (e) {
      console.error('上传失败', e);
    }
  }
  
  uploading.value = false;
  
  if (successCount > 0) {
    client.value.photos = JSON.stringify(newPhotos);
    uni.showToast({ title: `成功上传${successCount}张照片`, icon: 'success' });
  }
};

// 删除照片
const deletePhoto = (index: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这张照片吗？',
    confirmColor: '#FF5E78',
    success: (res) => {
      if (res.confirm) {
        const newPhotos = [...photoList.value];
        newPhotos.splice(index, 1);
        client.value.photos = JSON.stringify(newPhotos);
        uni.showToast({ title: '删除成功', icon: 'success' });
      }
    }
  });
};

// 格式化函数
const formatIncome = (income: number): string => {
  if (income >= 10000) {
    return (income / 10000).toFixed(1) + '万/月';
  }
  return income + '元/月';
};

const formatTime = (time: string | undefined): string => {
  if (!time) return '-';
  const date = new Date(time);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const formatPartnerRequirements = (req: string | undefined): string => {
  if (!req) return '暂无择偶要求';
  try {
    const obj = JSON.parse(req);
    const parts = [];
    if (obj.min_age && obj.max_age) parts.push(`年龄：${obj.min_age}-${obj.max_age}岁`);
    if (obj.min_height && obj.max_height) parts.push(`身高：${obj.min_height}-${obj.max_height}cm`);
    if (obj.education?.length) parts.push(`学历：${obj.education.map((e: number) => getEducationText(e)).join('、')}`);
    if (obj.other_requirements) parts.push(`其他：${obj.other_requirements}`);
    return parts.join('，');
  } catch {
    return req;
  }
};

const parseTags = (tags: string | undefined): string[] => {
  if (!tags) return [];
  try {
    return JSON.parse(tags);
  } catch {
    return tags.split(',').filter(t => t.trim());
  }
};

const getEducationText = (level: number | undefined): string => {
  const map: any = { 1: '高中', 2: '大专', 3: '本科', 4: '硕士', 5: '博士' };
  return map[level ?? 0] || '未知';
};

const getMaritalStatusText = (status: number | undefined): string => {
  const map: any = { 1: '未婚', 2: '已婚', 3: '离异', 4: '丧偶' };
  return map[status ?? 0] || '';
};

const getHouseStatusText = (status: number | undefined): string => {
  const map: any = { 1: '无房', 2: '已购房', 3: '贷款购房' };
  return map[status ?? 0] || '未填写';
};

const getCarStatusText = (status: number | undefined): string => {
  const map: any = { 1: '无车', 2: '有车' };
  return map[status ?? 0] || '未填写';
};

const getStatusText = (status: number | undefined): string => {
  const map: any = { 1: '单身', 2: '匹配中', 3: '已拉手', 4: '停止服务' };
  return map[status ?? 1] || '单身';
};

const getStatusClass = (status: number | undefined): string => {
  const map: any = { 1: 'single', 2: 'matching', 3: 'matched', 4: 'stopped' };
  return map[status ?? 1] || 'single';
};
</script>

<style lang="scss" scoped>
// 设计系统变量
$primary: #FF5E78;
$primary-light: #FF8A9B;
$primary-dark: #E54D65;
$secondary: #FFF5F7;
$success: #52C41A;
$warning: #FAAD14;
$danger: #FF4D4F;
$text-main: #303133;
$text-second: #606266;
$text-tip: #909399;
$border-color: #EBEEF5;
$bg-page: #F5F7FA;
$bg-white: #FFFFFF;
$shadow-sm: 0 2px 12px rgba(0, 0, 0, 0.06);
$shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.12);

// 页面容器
.client-detail-container {
  min-height: 100vh;
  background-color: $bg-page;
  position: relative;
}

// 顶部渐变背景
.header-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
  z-index: 0;
}

// 导航栏
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  transition: background 0.3s ease;

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
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 50%;

    &:active {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0.95);
    }
  }

  .nav-title {
    font-size: 17px;
    font-weight: 600;
    color: #fff;
  }
}

// 内容滚动区
.content-scroll {
  position: relative;
  z-index: 1;
  height: 100vh;
  box-sizing: border-box;
}

// 个人资料头部
.profile-header {
  background: $bg-white;
  border-radius: 24px 24px 0 0;
  margin-top: 20px;
  padding: 24px 20px 20px;
  box-shadow: $shadow-sm;

  .avatar-section {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    .avatar-wrapper {
      position: relative;
      margin-right: 16px;
      cursor: pointer;

      .avatar-img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #fff;
        box-shadow: $shadow-md;
        transition: transform 0.2s ease;
      }

      .status-ring {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid #fff;

        &.single { background: $success; }
        &.matching { background: $warning; }
        &.matched { background: $primary; }
        &.stopped { background: $text-tip; }
      }

      .zoom-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 36px;
        height: 36px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      &:active {
        .avatar-img {
          transform: scale(0.95);
        }
      }

      &:hover, &:active {
        .zoom-icon {
          opacity: 1;
        }
      }
    }

    .profile-info {
      flex: 1;

      .name-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;

        .name {
          font-size: 24px;
          font-weight: 700;
          color: $text-main;
        }

        .gender-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;

          &.male { background: #E3F2FD; }
          &.female { background: #FCE4EC; }

          .gender-text {
            font-size: 12px;
            font-weight: 500;
            color: $text-second;
          }
        }
      }

      .id-text {
        font-size: 12px;
        color: $text-tip;
        margin-bottom: 10px;
      }

      .status-bar {
        .status-tag {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;

          &.single {
            background: #F6FFED;
            color: $success;
          }
          &.matching {
            background: #FFF7E6;
            color: $warning;
          }
          &.matched {
            background: $secondary;
            color: $primary;
          }
          &.stopped {
            background: #F5F5F5;
            color: $text-tip;
          }
        }
      }
    }
  }

  // 关键数据
  .key-stats {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-top: 20px;
    border-top: 1px solid $border-color;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;

      .stat-value {
        font-size: 20px;
        font-weight: 700;
        color: $text-main;
      }

      .stat-label {
        font-size: 12px;
        color: $text-tip;
      }
    }

    .stat-divider {
      width: 1px;
      height: 30px;
      background: $border-color;
    }
  }
}

// 标签导航
.tab-section {
  background: $bg-white;
  padding: 0 20px;
  border-bottom: 1px solid $border-color;
  position: sticky;
  top: 0;
  z-index: 10;

  &.sticky {
    box-shadow: $shadow-sm;
  }

  .tab-list {
    display: flex;
    gap: 24px;

    .tab-item {
      position: relative;
      padding: 16px 0;
      cursor: pointer;

      .tab-name {
        font-size: 15px;
        color: $text-second;
        transition: color 0.3s ease;
      }

      &.active {
        .tab-name {
          color: $primary;
          font-weight: 600;
        }

        .tab-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 3px;
          background: $primary;
          border-radius: 2px;
        }
      }
    }
  }
}

// 标签内容
.tab-content {
  padding: 16px;
}

// 信息卡片
.info-card {
  background: $bg-white;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: $shadow-sm;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 16px 12px;
    border-bottom: 1px solid $border-color;

    .header-icon {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.contact { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
      &.work { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
      &.asset { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
      &.body { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
      &.location { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
      &.family { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
      &.intro { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
      &.match { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }
      &.tags { background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%); }
      &.photo { background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); }
    }

    .header-title {
      font-size: 15px;
      font-weight: 600;
      color: $text-main;
    }

    .photo-count {
      margin-left: auto;
      font-size: 12px;
      color: $text-tip;
    }
  }

  .card-body {
    padding: 4px 16px 16px;

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      &.highlight {
        .info-value {
          color: $primary;
          font-weight: 600;
        }
      }

      .info-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: $text-second;
      }

      .info-value-box {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .info-value {
        font-size: 14px;
        color: $text-main;

        &.income {
          color: $primary;
          font-weight: 600;
          font-size: 15px;
        }
      }
    }

    // 网格布局
    &.grid-layout {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      padding: 16px;

      .grid-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 12px;
        background: $bg-page;
        border-radius: 12px;

        .grid-label {
          font-size: 12px;
          color: $text-tip;
        }

        .grid-value {
          font-size: 16px;
          font-weight: 600;
          color: $text-main;
        }
      }
    }
  }
}

// 地址盒子
.address-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: $bg-page;
  border-radius: 12px;

  .address-text {
    flex: 1;
    font-size: 14px;
    color: $text-main;
    line-height: 1.6;
  }
}

// 内容块
.content-block {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .block-title {
    font-size: 13px;
    color: $text-tip;
    margin-bottom: 8px;
  }

  .block-content {
    font-size: 14px;
    color: $text-second;
    line-height: 1.8;
    padding: 12px;
    background: $bg-page;
    border-radius: 12px;
  }
}

// 自我介绍
.intro-text {
  font-size: 14px;
  color: $text-second;
  line-height: 1.8;
  padding: 12px;
  background: $bg-page;
  border-radius: 12px;
}

// 择偶标准
.requirement-box {
  padding: 16px;
  background: linear-gradient(135deg, $secondary 0%, #fff 100%);
  border-radius: 12px;
  border-left: 4px solid $primary;

  .req-text {
    font-size: 14px;
    color: $text-main;
    line-height: 1.8;
  }
}

// 标签云
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .tag-pill {
    padding: 8px 16px;
    background: $bg-page;
    border-radius: 20px;
    font-size: 13px;
    color: $text-second;
    animation: fadeInUp 0.4s ease forwards;
    opacity: 0;
    transform: translateY(10px);

    &:nth-child(3n+1) {
      background: #FFF5F7;
      color: $primary;
    }

    &:nth-child(3n+2) {
      background: #F0F9FF;
      color: #1890ff;
    }

    &:nth-child(3n+3) {
      background: #F6FFED;
      color: $success;
    }
  }
}

// 照片网格
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  .photo-item {
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    animation: fadeInUp 0.4s ease forwards;
    opacity: 0;
    transform: translateY(10px);

    &:active {
      transform: scale(0.95);
    }

    .photo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-delete {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 24px;
      height: 24px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &:active {
        background: rgba($primary, 0.9);
      }
    }

    &.upload-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: $bg-page;
      border: 2px dashed #D9D9D9;

      &:active {
        border-color: $primary;
        background: $secondary;
      }

      .upload-hint {
        margin-top: 6px;
        font-size: 11px;
        color: $text-tip;
      }
    }
  }
}

// 系统信息
.info-card.system-info {
  .system-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .system-label {
      font-size: 12px;
      color: $text-tip;
    }

    .system-value {
      font-size: 12px;
      color: $text-second;
    }
  }
}

// 智能匹配容器
.match-container {
  padding: 20px 0;

  .match-hero {
    text-align: center;
    padding: 40px 20px;

    .match-icon-box {
      width: 100px;
      height: 100px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, $secondary 0%, #fff 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 30px rgba($primary, 0.2);
    }

    .match-title {
      display: block;
      font-size: 22px;
      font-weight: 700;
      color: $text-main;
      margin-bottom: 10px;
    }

    .match-desc {
      font-size: 14px;
      color: $text-second;
    }
  }

  .match-features {
    padding: 20px;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: $bg-white;
      border-radius: 16px;
      margin-bottom: 12px;
      box-shadow: $shadow-sm;

      .feature-icon {
        width: 48px;
        height: 48px;
        background: $secondary;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .feature-info {
        flex: 1;

        .feature-title {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: $text-main;
          margin-bottom: 4px;
        }

        .feature-desc {
          font-size: 13px;
          color: $text-second;
        }
      }
    }
  }

  .match-action {
    padding: 20px;

    .match-btn {
      width: 100%;
      height: 50px;
      background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
      border-radius: 25px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba($primary, 0.3);

      &:active {
        transform: scale(0.98);
        box-shadow: 0 4px 12px rgba($primary, 0.2);
      }

      &:disabled {
        background: #D9D9D9;
        box-shadow: none;
      }

      .btn-text {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
      }
    }

    .match-tip {
      display: block;
      text-align: center;
      margin-top: 12px;
      font-size: 13px;
      color: $text-tip;
    }
  }
}

// 底部留白
.footer-spacer {
  height: 100px;
}

// 底部操作栏
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid $border-color;
  z-index: 100;

  .footer-content {
    display: flex;
    gap: 12px;

    .action-btn {
      flex: 1;
      height: 46px;
      border-radius: 23px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;

      &:active {
        transform: scale(0.98);
      }

      text {
        font-size: 15px;
        font-weight: 600;
      }

      &.primary {
        background: linear-gradient(135deg, $primary 0%, $primary-light 100%);
        box-shadow: 0 4px 15px rgba($primary, 0.3);

        text {
          color: #fff;
        }

        &:disabled {
          background: #D9D9D9;
          box-shadow: none;
        }
      }

      &.secondary {
        background: $bg-page;

        text {
          color: $text-main;
        }
      }

      &.danger {
        width: 80px;
        flex: none;
        background: #FFF2F0;

        text {
          color: $danger;
        }
      }
    }
  }
}

// 动画
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
