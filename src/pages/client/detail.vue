<template>
  <view class="container">
    <!-- 顶部背景 -->
    <view class="header-bg-fixed"></view>

    <!-- 自定义导航栏 -->
    <view class="nav-bar">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#fff"></u-icon>
      </view>
      <text class="nav-title">客户详情</text>
      <view class="more-btn" @click="showMoreMenu">
        <u-icon name="more-dot-fill" size="20" color="#fff"></u-icon>
      </view>
    </view>
    
    <!-- 核心资料卡片 -->
    <view class="hero-header fade-in">
      <view class="hero-image-box">
        <u-image 
          :src="getAvatar(client)" 
          width="100%" 
          height="320px" 
          mode="aspectFill"
        ></u-image>
        <view class="hero-overlay"></view>
        
        <view class="hero-content">
          <view class="name-row">
            <text class="name">{{ client.name || '未命名' }}</text>
            <view class="gender-tag" :class="client.gender === 1 ? 'male' : 'female'">
              <u-icon :name="client.gender === 1 ? 'man' : 'woman'" size="12" color="#fff"></u-icon>
            </view>
            <view class="status-tag" :class="getStatusClass(client.status)">
              {{ getStatusText(client.status) }}
            </view>
          </view>
          <view class="tags-row">
            <text class="hero-tag">{{ client.age || '-' }}岁</text>
            <text class="hero-tag" v-if="client.zodiac">{{ client.zodiac }}</text>
            <text class="hero-tag">{{ getEducationText(client.education) }}</text>
            <text class="hero-tag" v-if="client.marital_status">{{ getMaritalStatusText(client.marital_status) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 胶囊式选项卡 -->
    <view class="sticky-tabs-container">
      <view class="segmented-control">
        <view 
          class="segment-item" 
          :class="{ active: currentTab === 0 }"
          @click="currentTab = 0"
        >基础档案</view>
        <view 
          class="segment-item" 
          :class="{ active: currentTab === 1 }"
          @click="currentTab = 1"
        >详细资料</view>
        <view 
          class="segment-item" 
          :class="{ active: currentTab === 2 }"
          @click="currentTab = 2"
        >智能匹配</view>
      </view>
    </view>
    
    <view class="content">
      <!-- Tab 1: 基础档案 -->
      <view v-if="currentTab === 0" class="info-section fade-in">
        <!-- 联系方式卡片 -->
        <view class="info-card">
          <view class="card-header">
            <u-icon name="phone-fill" size="18" color="#FF5E78"></u-icon>
            <text class="header-title">联系方式</text>
          </view>
          <view class="cell-item">
            <text class="label">手机号码</text>
            <view class="value-box">
              <text class="value">{{ client.phone || '-' }}</text>
              <u-icon v-if="client.phone" name="phone-fill" size="16" color="#FF5E78" @click="makePhoneCall(client.phone)"></u-icon>
            </view>
          </view>
          <view class="cell-item">
            <text class="label">出生年月</text>
            <view class="value-box">
              <text class="value">{{ client.birthday || '-' }}</text>
            </view>
          </view>
        </view>

        <!-- 身体信息卡片 -->
        <view class="info-card mt-16">
          <view class="card-header">
            <u-icon name="account-fill" size="18" color="#409EFF"></u-icon>
            <text class="header-title">身体信息</text>
          </view>
          <view class="cell-grid">
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
              <text class="grid-label">年龄</text>
              <text class="grid-value">{{ client.age ? client.age + '岁' : '-' }}</text>
            </view>
          </view>
        </view>

        <!-- 职业收入卡片 -->
        <view class="info-card mt-16">
          <view class="card-header">
            <u-icon name="bag-fill" size="18" color="#67C23A"></u-icon>
            <text class="header-title">职业收入</text>
          </view>
          <view class="cell-item">
            <text class="label">职业</text>
            <view class="value-box">
              <text class="value">{{ client.profession || '未填写' }}</text>
            </view>
          </view>
          <view class="cell-item">
            <text class="label">月收入</text>
            <view class="value-box">
              <text class="value highlight">{{ client.income ? formatIncome(client.income) : '未填写' }}</text>
            </view>
          </view>
        </view>

        <!-- 资产情况卡片 -->
        <view class="info-card mt-16">
          <view class="card-header">
            <u-icon name="home-fill" size="18" color="#E6A23C"></u-icon>
            <text class="header-title">资产情况</text>
          </view>
          <view class="cell-item">
            <text class="label">房产状况</text>
            <view class="value-box">
              <text class="value">{{ getHouseStatusText(client.house_status) }}</text>
            </view>
          </view>
          <view class="cell-item" v-if="client.house_address">
            <text class="label">房产地址</text>
            <view class="value-box">
              <text class="value">{{ client.house_address }}</text>
            </view>
          </view>
          <view class="cell-item">
            <text class="label">车辆状况</text>
            <view class="value-box">
              <text class="value">{{ getCarStatusText(client.car_status) }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- Tab 2: 详细资料 -->
      <view v-if="currentTab === 1" class="info-section fade-in">
        <!-- 住址信息 -->
        <view class="info-card">
          <view class="card-header">
            <u-icon name="map-fill" size="18" color="#909399"></u-icon>
            <text class="header-title">住址信息</text>
          </view>
          <view class="cell-item">
            <text class="label">现居地址</text>
            <view class="value-box">
              <text class="value">{{ client.address || '未填写' }}</text>
            </view>
          </view>
        </view>

        <!-- 家庭背景 -->
        <view class="info-card mt-16">
          <view class="card-header">
            <u-icon name="account-fill" size="18" color="#FF85C0"></u-icon>
            <text class="header-title">家庭背景</text>
          </view>
          <view class="rich-content">
            {{ client.family_description || '暂无家庭背景介绍' }}
          </view>
        </view>

        <!-- 自我介绍 -->
        <view class="info-card mt-16">
          <view class="card-header">
            <u-icon name="edit-pen-fill" size="18" color="#409EFF"></u-icon>
            <text class="header-title">自我介绍</text>
          </view>
          <view class="rich-content">
            {{ client.remark || '暂无自我介绍' }}
          </view>
        </view>

        <!-- 择偶标准 -->
        <view class="info-card mt-16" v-if="client.partner_requirements">
          <view class="card-header">
            <u-icon name="heart-fill" size="18" color="#FF5E78"></u-icon>
            <text class="header-title">择偶标准</text>
          </view>
          <view class="rich-content requirement">
            {{ formatPartnerRequirements(client.partner_requirements) }}
          </view>
        </view>

        <!-- 标签 -->
        <view class="info-card mt-16" v-if="client.tags">
          <view class="card-header">
            <u-icon name="tags-fill" size="18" color="#67C23A"></u-icon>
            <text class="header-title">个性标签</text>
          </view>
          <view class="tags-list">
            <text v-for="(tag, index) in parseTags(client.tags)" :key="index" class="tag-item">{{ tag }}</text>
          </view>
        </view>

        <!-- 照片墙 -->
        <view class="info-card mt-16">
          <view class="card-header">
            <u-icon name="photo-fill" size="18" color="#E6A23C"></u-icon>
            <text class="header-title">照片墙</text>
            <text class="photo-count">{{ photoList.length }}张</text>
          </view>
          
          <!-- 照片网格 -->
          <view class="photo-grid-wrapper">
            <view 
              v-for="(photo, index) in photoList" 
              :key="index" 
              class="photo-item"
              :style="{ animationDelay: index * 0.05 + 's' }"
              @click="previewImage(index)"
            >
              <u-image 
                :src="photo" 
                width="100%" 
                height="100%" 
                mode="aspectFill" 
                radius="8"
                :lazy-load="true"
                :show-loading="true"
              ></u-image>
              <!-- 删除按钮 -->
              <view class="photo-delete" @click.stop="deletePhoto(index)">
                <u-icon name="close" size="10" color="#fff"></u-icon>
              </view>
            </view>
            
            <!-- 上传按钮 -->
            <view class="photo-item upload-btn" @click="chooseImage" v-if="photoList.length < 9">
              <view class="upload-inner">
                <u-icon name="plus" size="28" color="#C0C4CC"></u-icon>
                <text class="upload-text">添加照片</text>
              </view>
            </view>
          </view>
          
          <!-- 上传提示 -->
          <view class="photo-tip" v-if="photoList.length === 0">
            <u-icon name="info-circle" size="14" color="#909399"></u-icon>
            <text>暂无照片，点击上方按钮添加</text>
          </view>
          <view class="photo-tip" v-else-if="photoList.length < 9">
            <text>还可以添加 {{ 9 - photoList.length }} 张照片</text>
          </view>
        </view>

        <!-- 系统信息 -->
        <view class="info-card mt-16 system-info">
          <view class="cell-item">
            <text class="label">客户ID</text>
            <view class="value-box">
              <text class="value">{{ client.id || '-' }}</text>
            </view>
          </view>
          <view class="cell-item">
            <text class="label">录入时间</text>
            <view class="value-box">
              <text class="value">{{ formatTime(client.created_at) }}</text>
            </view>
          </view>
          <view class="cell-item">
            <text class="label">更新时间</text>
            <view class="value-box">
              <text class="value">{{ formatTime(client.updated_at) }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- Tab 3: 智能匹配 -->
      <view v-if="currentTab === 2" class="match-section fade-in">
        <!-- 搜索条件预览 -->
        <view v-if="sourceReq && Object.keys(sourceReq).length > 0" class="filter-preview" @click="showFilterModal = true">
           <view class="filter-row">
             <u-icon name="setting" color="#FF5E78" size="14"></u-icon>
             <text class="filter-text">匹配条件: {{ getReqSummary(sourceReq) }}</text>
             <u-icon name="arrow-right" color="#C0C4CC" size="12"></u-icon>
           </view>
        </view>

        <view v-if="matchList.length === 0" class="empty-box">
          <u-empty mode="search" text="暂无匹配结果" icon-color="#F2F3F5">
            <u-button slot="bottom" @click="match" class="omiai-btn-primary" customStyle="margin-top: 24px; width: 180px;">立即智能匹配</u-button>
          </u-empty>
        </view>
        
        <view class="match-list" v-else>
           <view class="match-header">
             <text class="omiai-text-sm">匹配到 {{ matchList.length }} 位理想嘉宾</text>
             <view class="refresh-btn" @click="match">
               <u-icon name="reload" :color="primaryColor" size="14"></u-icon>
               <text>重新匹配</text>
             </view>
           </view>

           <view class="match-card omiai-card" v-for="(item, index) in matchList" :key="index" @click="goDetail(item.client.id)">
            <view class="card-body">
              <view class="avatar-box">
                <u-avatar :src="getAvatar(item.client)" size="60" shape="circle"></u-avatar>
              </view>
              <view class="info-box">
                <view class="name-row">
                  <text class="omiai-title-lg">{{ item.client.name }}</text>
                  <text class="age-info">{{ item.client.age }}岁</text>
                </view>
                <view class="detail-row omiai-text-sm">
                   <text>{{ getEducationText(item.client.education) }}</text>
                   <text class="sep">·</text>
                   <text>{{ item.client.height }}cm</text>
                </view>
                <view class="match-reasons" v-if="item.match_tags && item.match_tags.length > 0">
                    <text v-for="(tag, tIdx) in item.match_tags" :key="tIdx" class="reason-tag">{{ tag }}</text>
                </view>
              </view>
              <view class="score-box">
                <view class="score-val">{{ item.score }}<text class="unit">分</text></view>
                <text class="score-label">匹配度</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 更多菜单弹窗 -->
    <u-action-sheet
      :show="showActionSheet"
      :actions="actionList"
      title="更多操作"
      @close="showActionSheet = false"
      @select="onActionSelect"
    />
    
    <!-- 匹配条件弹窗 -->
    <u-popup :show="showFilterModal" mode="bottom" @close="showFilterModal = false" round="16">
        <view class="filter-modal">
            <view class="modal-header">
                <text class="title">调整匹配条件</text>
                <u-icon name="close" @click="showFilterModal = false"></u-icon>
            </view>
            <view class="modal-body">
                <view class="tip-text">当前匹配基于客户档案中的"择偶标准"自动计算。如需调整，请前往档案详情页修改资料。</view>
                <view class="req-json">
                    {{ JSON.stringify(sourceReq, null, 2) }}
                </view>
            </view>
        </view>
    </u-popup>
    
    <view class="footer-placeholder"></view>
    <view class="footer" v-if="currentTab !== 2">
      <view class="footer-actions">
        <u-button 
          v-if="currentTab === 0"
          :loading="matching" 
          @click="match" 
          class="omiai-btn-primary"
          customStyle="flex: 1; height: 46px; font-size: 15px; border: none;"
        >一键智能匹配</u-button>
        <u-button 
          v-if="currentTab === 1"
          @click="editClient" 
          type="primary"
          plain
          customStyle="flex: 1; height: 46px; font-size: 15px; margin-right: 12px;"
        >编辑资料</u-button>
        <u-button 
          v-if="currentTab === 1"
          :loading="matching" 
          @click="match" 
          class="omiai-btn-primary"
          customStyle="flex: 1; height: 46px; font-size: 15px; border: none;"
        >智能匹配</u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getClientDetail, matchClient, type Client } from '@/api/client';
import { uploadFile } from '@/api/common';

const primaryColor = '#FF5E78';
const defaultAvatar = 'https://cdn.uviewui.com/uview/album/1.jpg';

const getAvatar = (c: any) => {
  if (c && c.avatar) return c.avatar;
  if (c && c.id) return `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.id}`;
  return defaultAvatar;
};

const client = ref<Client>({} as Client);
const matchList = ref<any[]>([]);
const sourceReq = ref<any>({});
const showFilterModal = ref(false);
const showActionSheet = ref(false);
const currentTab = ref(0);
const matching = ref(false);
const clientId = ref<number>(0);
const uploading = ref(false);

// 照片列表
const photoList = computed(() => {
  if (!client.value.photos) return [];
  try {
    return JSON.parse(client.value.photos);
  } catch {
    return client.value.photos.split(',').filter(p => p.trim());
  }
});

const actionList = [
  { name: '编辑资料', color: '#303133' },
  { name: '删除客户', color: '#FF5E78' }
];

const goBack = () => {
  uni.navigateBack();
};

const showMoreMenu = () => {
  showActionSheet.value = true;
};

const onActionSelect = (e: any) => {
  if (e.name === '编辑资料') {
    editClient();
  } else if (e.name === '删除客户') {
    uni.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      confirmColor: '#FF5E78',
      success: (res) => {
        if (res.confirm) {
          uni.showToast({ title: '删除功能开发中', icon: 'none' });
        }
      }
    });
  }
};

const editClient = () => {
  uni.showToast({ title: '编辑功能开发中', icon: 'none' });
};

const getReqSummary = (req: any) => {
    const parts = [];
    if (req.min_age || req.max_age) parts.push(`${req.min_age || 18}-${req.max_age || 99}岁`);
    if (req.min_height) parts.push(`${req.min_height}cm+`);
    return parts.join(' / ') || '默认条件';
};

onLoad((options: any) => {
  if (options.id) {
    clientId.value = parseInt(options.id);
    loadDetail(clientId.value);
  }
});

const loadDetail = async (id: number) => {
  try {
    const res: any = await getClientDetail(id);
    client.value = res;
  } catch (e) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  }
};

const match = async () => {
  if (!clientId.value) return;
  
  matching.value = true;
  try {
    const res: any = await matchClient(clientId.value);
    matchList.value = res.list || [];
    sourceReq.value = res.source_req || {};
    currentTab.value = 2;
    
    if (matchList.value.length > 0) {
        uni.showToast({ title: '匹配成功', icon: 'success' });
    } else {
        uni.showToast({ title: '暂无合适匹配', icon: 'none' });
    }
  } catch (e) {
    uni.showToast({ title: '匹配请求失败', icon: 'none' });
  } finally {
    matching.value = false;
  }
};

const goDetail = (id: number | undefined) => {
  if(id) uni.navigateTo({ url: `/pages/client/detail?id=${id}` });
};

const makePhoneCall = (phone: string) => {
    if (phone) {
        uni.makePhoneCall({ phoneNumber: phone });
    }
};

const previewImage = (index: number) => {
  uni.previewImage({
    urls: photoList.value,
    current: index,
    loop: true
  });
};

// 选择并上传图片
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
    
    const tempFilePaths = res.tempFilePaths as string[];
    await uploadImages(tempFilePaths);
  } catch (e) {
    console.error('Choose image failed:', e);
  }
};

// 批量上传图片
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
    } catch (e: any) {
      console.error('Upload failed:', e);
      uni.showToast({ 
        title: e?.message || '上传失败', 
        icon: 'none' 
      });
    }
  }
  
  uploading.value = false;
  
  if (successCount > 0) {
    await updateClientPhotos(newPhotos);
    uni.showToast({ 
      title: `成功上传${successCount}张照片`, 
      icon: 'success' 
    });
  }
};

// 删除照片
const deletePhoto = (index: number) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这张照片吗？',
    confirmColor: '#FF5E78',
    success: async (res) => {
      if (res.confirm) {
        const newPhotos = [...photoList.value];
        newPhotos.splice(index, 1);
        await updateClientPhotos(newPhotos);
        uni.showToast({ title: '删除成功', icon: 'success' });
      }
    }
  });
};

// 更新客户照片（模拟API调用，实际应调用后端更新接口）
const updateClientPhotos = async (photos: string[]) => {
  // 这里应该先调用后端API更新照片
  // 暂时先更新本地数据
  client.value.photos = JSON.stringify(photos);
  
  // TODO: 调用后端更新接口
  // await updateClient({ ...client.value, photos: JSON.stringify(photos) });
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
    if (obj.min_age && obj.max_age) parts.push(`年龄: ${obj.min_age}-${obj.max_age}岁`);
    if (obj.min_height) parts.push(`身高: ${obj.min_height}cm+`);
    if (obj.education) parts.push(`学历: ${getEducationText(obj.education)}及以上`);
    if (obj.marital_status && obj.marital_status.length) {
      parts.push(`婚姻: ${obj.marital_status.map((s: number) => getMaritalStatusText(s)).join('/')}`);
    }
    return parts.length > 0 ? parts.join('，') : req;
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
    if (!status) return '';
    const map: any = { 1: '未婚', 2: '已婚', 3: '离异', 4: '丧偶' };
    return map[status] || '';
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
  const map: any = { 1: '单身', 2: '匹配中', 3: '已匹配', 4: '停止服务' };
  return map[status ?? 1] || '单身';
};

const getStatusClass = (status: number | undefined): string => {
  const map: any = { 1: 'single', 2: 'matching', 3: 'matched', 4: 'stopped' };
  return map[status ?? 1] || 'single';
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: $omiai-bg-page;
  position: relative;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  padding-top: env(safe-area-inset-top);
  padding-left: 16px;
  padding-right: 16px;
  z-index: 1000;
  background: transparent;
  display: flex;
  align-items: center;
  box-sizing: content-box;
  
  .back-btn, .more-btn {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 50%;
    flex-shrink: 0;
    
    &:active {
      background: rgba(0, 0, 0, 0.4);
      transform: scale(0.95);
    }
  }
  
  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    line-height: 44px;
  }
}

.header-bg-fixed {
    height: 280px;
    background: linear-gradient(180deg, $omiai-primary 0%, #FF8A9B 100%);
    position: absolute; 
    top: 0;
    left: 0;
    right: 0;
    z-index: 0;
}

.hero-header {
    position: relative;
    z-index: 10;
    background: #fff;
    margin-top: calc(44px + env(safe-area-inset-top));
    
    .hero-image-box {
        position: relative;
        
        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
            z-index: 1;
        }
        
        .hero-content {
            position: absolute;
            bottom: 24px;
            left: 20px;
            right: 20px;
            z-index: 2;
            color: #fff;
            
            .name-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
                flex-wrap: wrap;
                
                .name { 
                  font-size: 28px; 
                  font-weight: 700; 
                  text-shadow: 0 2px 4px rgba(0,0,0,0.3); 
                }
                .gender-tag {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &.male { background: $omiai-male; }
                    &.female { background: $omiai-female; }
                }
                .status-tag {
                  font-size: 11px;
                  padding: 2px 8px;
                  border-radius: 10px;
                  background: rgba(255,255,255,0.9);
                  font-weight: 500;
                  &.single { color: #67C23A; }
                  &.matching { color: #E6A23C; }
                  &.matched { color: #FF5E78; }
                  &.stopped { color: #909399; }
                }
            }
            
            .tags-row {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                
                .hero-tag {
                    font-size: 12px;
                    padding: 4px 10px;
                    background: rgba(255,255,255,0.2);
                    backdrop-filter: blur(8px);
                    border-radius: 4px;
                    color: #fff;
                }
            }
        }
    }
}

.sticky-tabs-container {
    background: $omiai-bg-page;
    padding: 16px 20px;
    margin-bottom: 8px;
    
    .segmented-control {
        display: flex;
        background: #E5E6EB;
        padding: 4px;
        border-radius: 999rpx;
        
        .segment-item {
            flex: 1;
            text-align: center;
            padding: 8px 0;
            font-size: 14px;
            font-weight: 500;
            color: $omiai-text-second;
            border-radius: 999rpx;
            transition: all 0.3s ease;
            
            &.active {
                background: #fff;
                color: $omiai-text-main;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
        }
    }
}

.content {
  padding: 0 16px 120px;
  position: relative;
  z-index: 1;
  
  .info-card {
      background: #fff;
      border-radius: 16px;
      padding: 0 16px;
      box-shadow: $omiai-shadow-sm;
      
      .card-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px 0 12px;
        border-bottom: 1px solid $omiai-border-light;
        
        .header-title {
          font-size: 15px;
          font-weight: 600;
          color: $omiai-text-main;
        }
      }
      
      .cell-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid $omiai-border-light;
          
          &:last-child { border-bottom: none; }
          
          .label { font-size: 14px; color: $omiai-text-second; }
          .value-box {
              display: flex;
              align-items: center;
              gap: 8px;
              .value { 
                font-size: 14px; 
                color: $omiai-text-main; 
                font-weight: 500;
                &.highlight { color: $omiai-primary; }
              }
          }
      }
      
      .cell-grid {
        display: flex;
        flex-wrap: wrap;
        padding: 16px 0;
        
        .grid-item {
          width: 50%;
          padding: 12px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          
          .grid-label {
            font-size: 12px;
            color: $omiai-text-tip;
          }
          .grid-value {
            font-size: 16px;
            font-weight: 600;
            color: $omiai-text-main;
          }
        }
      }
      
      .rich-content {
        padding: 16px 0;
        font-size: 14px;
        color: $omiai-text-second;
        line-height: 1.8;
        
        &.requirement {
          color: $omiai-primary;
          background: #FFF5F7;
          padding: 12px;
          border-radius: 8px;
          margin: 12px 0;
        }
      }
      
      .tags-list {
        padding: 12px 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .tag-item {
          font-size: 12px;
          padding: 6px 12px;
          background: $omiai-bg-page;
          color: $omiai-text-second;
          border-radius: 4px;
        }
      }
      
      .photo-grid-wrapper {
        padding: 16px 0;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        
        .photo-item {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          animation: fadeInUp 0.4s ease forwards;
          opacity: 0;
          transform: translateY(10px);
          
          &:active {
            transform: scale(0.95);
          }
          
          .photo-delete {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 22px;
            height: 22px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
            
            &:active {
              background: rgba(255, 94, 120, 0.9);
            }
          }
        }
        
        .upload-btn {
          border: 2px dashed #D9D9D9;
          background: #FAFAFA;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          
          &:active {
            border-color: $omiai-primary;
            background: #FFF5F7;
          }
          
          .upload-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            
            .upload-text {
              font-size: 11px;
              color: #999;
            }
          }
        }
      }
      
      .photo-count {
        margin-left: auto;
        font-size: 12px;
        color: $omiai-text-tip;
        font-weight: normal;
      }
      
      .photo-tip {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 12px 0 4px;
        font-size: 12px;
        color: $omiai-text-tip;
      }
      
      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      &.system-info {
        .cell-item {
          padding: 10px 0;
          .label, .value {
            font-size: 12px;
            color: $omiai-text-tip;
          }
        }
      }
  }
  
  .mt-16 { margin-top: 16px; }
}

.match-section {
    .empty-box {
      padding: 40px 0;
    }

    .filter-preview {
        background: #FFF;
        padding: 12px 16px;
        margin-bottom: 12px;
        border-radius: 12px;
        box-shadow: $omiai-shadow-sm;
        
        .filter-row {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .filter-text {
                flex: 1;
                font-size: 13px;
                color: $omiai-text-main;
            }
        }
    }

    .match-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        color: $omiai-text-tip;
        
        .refresh-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            color: $omiai-primary;
            font-weight: 500;
        }
    }
    
    .match-card {
        margin-bottom: 12px;
        border: none;
        padding: 16px;
        background: $omiai-white;
        border-radius: 16px;
        box-shadow: $omiai-shadow-sm;
        
        .card-body {
          display: flex;
          align-items: center;
        }

        .avatar-box { margin-right: 16px; }
        
        .info-box {
            flex: 1;
            .name-row {
                display: flex;
                align-items: baseline;
                margin-bottom: 4px;
                .age-info { margin-left: 8px; font-size: 12px; color: $omiai-text-tip; }
            }
            .detail-row {
                color: $omiai-text-second;
                .sep { margin: 0 6px; color: $omiai-border; }
            }
            .match-reasons {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-top: 6px;
                .reason-tag {
                    font-size: 10px;
                    color: $omiai-warning;
                    background: #FFF7E6;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
            }
        }
        
        .score-box {
            text-align: right;
            .score-val {
                font-size: 20px;
                font-weight: 600;
                color: $omiai-primary;
                .unit { font-size: 10px; margin-left: 1px; }
            }
            .score-label {
                font-size: 10px;
                color: $omiai-text-tip;
            }
        }
    }
}

.filter-modal {
    padding: 16px;
    background: #fff;
    min-height: 300px;
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        .title { font-size: 16px; font-weight: 600; }
    }
    
    .modal-body {
        .tip-text {
            font-size: 13px;
            color: $omiai-text-tip;
            margin-bottom: 16px;
        }
        .req-json {
            background: #f7f8fa;
            padding: 12px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            color: $omiai-text-second;
        }
    }
}

.footer-placeholder { height: 100px; }

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid $omiai-border;
  z-index: 100;
  
  .footer-actions {
    display: flex;
    gap: 12px;
  }
}
</style>