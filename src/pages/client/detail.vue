<template>
  <view class="container">
    <!-- 1) 顶部背景 (中式温馨：品牌色渐变) - 改为直接作为背景或置顶节点 -->
    <view class="header-bg-fixed"></view>

    <!-- 0) 自定义导航栏 (透明 -> 白色) -->
    <view class="nav-bar">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" size="20" color="#fff"></u-icon>
      </view>
      <text class="nav-title">客户详情</text>
    </view>
    
    <!-- 2) 核心资料卡片 (中式亲和力：圆润阴影卡片) -->
    <view class="profile-card omiai-card fade-in">
      <view class="avatar-box">
        <u-avatar :src="client.avatar" size="90" shape="circle"></u-avatar>
        <view class="gender-tag" :class="client.gender === 1 ? 'male' : 'female'">
          <u-icon :name="client.gender === 1 ? 'man' : 'woman'" size="12" color="#fff"></u-icon>
        </view>
      </view>
      <view class="info-box">
        <text class="omiai-title-xl">{{ client.name }}</text>
        <view class="tags">
          <text class="tag-item">{{ client.age }}岁</text>
          <text class="tag-item" v-if="client.zodiac">{{ client.zodiac }}</text>
          <text class="tag-item" v-if="client.education">{{ getEducationText(client.education) }}</text>
          <text class="tag-item highlight" v-if="client.marital_status">{{ getMaritalStatusText(client.marital_status) }}</text>
        </view>
      </view>
    </view>

    <!-- 3) 选项卡 (品牌一致性) -->
    <view class="tab-container fade-in">
      <u-tabs :list="tabs" :current="currentTab" @change="onTabChange" 
        :lineColor="primaryColor" 
        :activeColor="primaryColor" 
        inactiveColor="#86909C"
        :itemStyle="{ height: '50px', fontSize: '15px', fontWeight: '500' }"
      ></u-tabs>
    </view>
    
    <view class="content">
      <!-- Tab 1: 档案详情 -->
      <view v-if="currentTab === 0" class="info-section fade-in">
        <view class="section-title">
          <view class="title-line"></view>
          <text>详细画像</text>
        </view>
        <view class="grid-info">
          <view class="grid-item">
            <text class="label">身高</text>
            <text class="value">{{ client.height ? client.height + 'cm' : '-' }}</text>
          </view>
          <view class="grid-item">
            <text class="label">体重</text>
            <text class="value">{{ client.weight ? client.weight + 'kg' : '-' }}</text>
          </view>
          <view class="grid-item">
            <text class="label">月收入</text>
            <text class="value">{{ client.income ? client.income + '元' : '-' }}</text>
          </view>
          <view class="grid-item">
            <text class="label">具体工作</text>
            <text class="value">{{ client.profession || '-' }}</text>
          </view>
          <view class="grid-item full">
            <text class="label">房车情况</text>
            <text class="value">{{ getAssetsText(client) }}</text>
          </view>
          <view class="grid-item full">
            <text class="label">家庭住址</text>
            <text class="value">{{ client.address || '未填写' }}</text>
          </view>
        </view>

        <view class="section-title mt-30">
          <view class="title-line"></view>
          <text>自我介绍</text>
        </view>
        <view class="text-box omiai-text-md">
          {{ client.remark || '暂无详细介绍' }}
        </view>
        
        <view v-if="client.family_description">
          <view class="section-title mt-30">
            <view class="title-line"></view>
            <text>家庭背景</text>
          </view>
          <view class="text-box omiai-text-md">
            {{ client.family_description }}
          </view>
        </view>

        <view v-if="client.partner_requirements">
          <view class="section-title mt-30">
            <view class="title-line"></view>
            <text>择偶标准</text>
          </view>
          <view class="text-box omiai-text-md">
            {{ client.partner_requirements }}
          </view>
        </view>
        
        <view class="contact-actions">
           <u-button 
             customStyle="background: #F2F3F5; color: #1D2129; border: none; border-radius: 999rpx; height: 48px; font-weight: 500;" 
             icon="phone-fill" 
             @click="makePhoneCall(client.phone)"
           >联系客户</u-button>
        </view>
      </view>
      
      <!-- Tab 2: 智能匹配 -->
      <view v-if="currentTab === 1" class="match-section fade-in">
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
                <u-avatar :src="item.client.avatar" size="60" shape="circle"></u-avatar>
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
    
    <u-popup :show="showFilterModal" mode="bottom" @close="showFilterModal = false" round="16">
        <view class="filter-modal">
            <view class="modal-header">
                <text class="title">调整匹配条件</text>
                <u-icon name="close" @click="showFilterModal = false"></u-icon>
            </view>
            <view class="modal-body">
                <!-- 简单的条件展示，暂不支持修改，后续迭代支持 -->
                <view class="tip-text">当前匹配基于客户档案中的“择偶标准”自动计算。如需调整，请前往档案详情页修改资料。</view>
                <view class="req-json">
                    {{ JSON.stringify(sourceReq, null, 2) }}
                </view>
            </view>
        </view>
    </u-popup>
    
    <view class="footer-placeholder"></view>
    <view class="footer" v-if="currentTab === 0">
      <u-button 
        :loading="matching" 
        @click="match" 
        class="omiai-btn-primary"
        customStyle="height: 50px; font-size: 16px; border: none;"
      >一键智能匹配</u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getClientDetail, matchClient, type Client } from '@/api/client';

const primaryColor = '#FF5E78';
const client = ref<Client>({} as Client);
const matchList = ref<any[]>([]); // Use any[] because structure changed to { client: Client, score: number }
const sourceReq = ref<any>({});
const showFilterModal = ref(false);
const currentTab = ref(0);
const tabs = [{ name: '档案详情' }, { name: '智能匹配' }];
const matching = ref(false);
const clientId = ref<number>(0);

const goBack = () => {
  uni.navigateBack();
};

const getReqSummary = (req: any) => {
    const parts = [];
    if (req.min_age || req.max_age) parts.push(`${req.min_age}-${req.max_age}岁`);
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

const onTabChange = (item: any) => {
    currentTab.value = item.index;
};

const match = async () => {
  if (!clientId.value) return;
  
  matching.value = true;
  try {
    const res: any = await matchClient(clientId.value);
    matchList.value = res.list || [];
    sourceReq.value = res.source_req || {};
    currentTab.value = 1; 
    
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

const getEducationText = (level: number | undefined) => {
  const map: any = { 1: '高中', 2: '大专', 3: '本科', 4: '硕士', 5: '博士' };
  return map[level ?? 0] || '未知';
};

const getMaritalStatusText = (status: number | undefined) => {
    if (!status) return '';
    const map: any = { 1: '未婚', 2: '离异', 3: '丧偶' };
    return map[status] || '';
};

const getAssetsText = (c: Client) => {
  const parts = [];
  if (c.house_status === 1) parts.push('有房');
  if (c.car_status === 1) parts.push('有车');
  return parts.length > 0 ? parts.join(' / ') : '未填写';
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
  height: 88px;
  padding-top: 44px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  z-index: 1000;
  /* 移除背景色，确保能看到下方的渐变 */
  background: transparent;
  
  .back-btn {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
  }
  
  .nav-title {
    flex: 1;
    text-align: center;
    margin-right: 48px;
    font-size: 17px;
    font-weight: 600;
    color: #fff;
  }
}

.header-bg-fixed {
    height: 300px;
    background: linear-gradient(180deg, $omiai-primary 0%, $omiai-bg-page 100%);
    position: fixed; /* 改为 fixed 确保始终顶在最上方 */
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
}

.profile-card {
    margin: 140px 16px 0; /* 增加边距，确保不被固定导航栏遮挡 */
    position: relative;
    z-index: 10;
    border: none;
    text-align: center;
    background: $omiai-white;
    box-shadow: $omiai-shadow-md;
    overflow: visible !important; /* 确保负边距的头像不被裁切 */
    
    .avatar-box {
        margin-top: -45px;
        margin-bottom: 16px;
        display: inline-block;
        position: relative;
        padding: 4px;
        background: $omiai-white;
        border-radius: 50%;
        
        .gender-tag {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid #fff;
          
          &.male { background-color: $omiai-male; }
          &.female { background-color: $omiai-female; }
        }
    }
    
    .info-box {
        .tags {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 12px;
            
            .tag-item {
                font-size: 11px;
                color: $omiai-text-second;
                background: $omiai-bg-page;
                padding: 3px 10px;
                border-radius: 4px;
                
                &.highlight {
                    color: $omiai-primary;
                    background: $omiai-primary-light;
                }
            }
        }
    }
}

.tab-container {
    margin-top: 12px;
    padding: 0 16px;
}

.content {
  padding: 20px 16px 100px;
  
  .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 16px;
      font-weight: 600;
      color: $omiai-text-main;
      
      .title-line {
        width: 4px;
        height: 16px;
        background: $omiai-primary;
        border-radius: 2px;
      }
  }
  
  .mt-30 { margin-top: 30px; }
  
  .grid-info {
      display: flex;
      flex-wrap: wrap;
      background: $omiai-white;
      padding: 8px;
      border-radius: $omiai-radius-md;
      
      .grid-item {
          width: 50%;
          margin-bottom: 16px;
          padding: 0 8px;
          
          &.full { width: 100%; }
          
          .label {
              font-size: 12px;
              color: $omiai-text-tip;
              display: block;
              margin-bottom: 4px;
          }
          .value {
              font-size: 14px;
              color: $omiai-text-main;
              font-weight: 500;
          }
      }
  }
  
  .text-box {
      color: $omiai-text-second;
      line-height: 1.6;
      background: $omiai-white;
      padding: 16px;
      border-radius: $omiai-radius-md;
  }
  
  .contact-actions {
      margin-top: 32px;
  }
}

.match-section {
    .empty-box {
      padding: 40px 0;
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

.filter-preview {
    background: #FFF;
    padding: 12px 16px;
    margin-bottom: 12px;
    border-radius: 8px;
    
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
  padding: 16px 16px 32px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid $omiai-border;
  z-index: 100;
}
</style>
