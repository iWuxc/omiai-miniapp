<template>
  <view class="container">
    <view class="header-bg"></view>
    
    <view class="profile-card">
      <view class="avatar-box">
        <u-avatar :src="client.avatar" size="88" :sex-icon="client.gender === 1 ? 'man' : 'woman'"></u-avatar>
      </view>
      <view class="info-box">
        <text class="name">{{ client.name }}</text>
        <view class="tags">
          <view class="tag">{{ calculateAge(client.birthday) }}岁</view>
          <view class="tag" v-if="client.zodiac">{{ client.zodiac }}</view>
          <view class="tag" v-if="client.education">{{ getEducationText(client.education) }}</view>
          <view class="tag highlight" v-if="client.marital_status">{{ getMaritalStatusText(client.marital_status) }}</view>
        </view>
      </view>
    </view>

    <view class="tab-container">
      <u-tabs :list="tabs" :current="currentTab" @change="onTabChange" 
        lineColor="#FF5E5E" 
        activeColor="#FF5E5E" 
        inactiveColor="#909399"
        :itemStyle="{ height: '48px', fontSize: '15px' }"
      ></u-tabs>
    </view>
    
    <view class="content">
      <!-- Tab 1: 基本资料 -->
      <view v-if="currentTab === 0" class="info-section animate__animated animate__fadeIn">
        <!-- 详细资料 -->
        <view class="section-title">基础档案</view>
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
            <text class="value">{{ client.income ? client.income : '-' }}</text>
          </view>
          <view class="grid-item">
            <text class="label">职业</text>
            <text class="value">{{ client.profession || '-' }}</text>
          </view>
          <view class="grid-item full">
            <text class="label">房车情况</text>
            <text class="value">{{ getAssetsText(client) }}</text>
          </view>
          <view class="grid-item full">
            <text class="label">居住地址</text>
            <text class="value">{{ client.address || '未填写' }}</text>
          </view>
        </view>

        <!-- 独白与家庭 -->
        <view class="section-title mt-30">自我介绍</view>
        <view class="text-box">
          {{ client.remark || '暂无介绍' }}
        </view>
        
        <view class="section-title mt-30" v-if="client.family_description">家庭背景</view>
        <view class="text-box" v-if="client.family_description">
          {{ client.family_description }}
        </view>

        <view class="section-title mt-30" v-if="client.partner_requirements">择偶标准</view>
        <view class="text-box" v-if="client.partner_requirements">
          {{ client.partner_requirements }}
        </view>
        
        <view class="contact-actions">
           <u-button type="info" plain shape="circle" icon="phone" text="拨打电话" @click="makePhoneCall(client.phone)"></u-button>
        </view>
      </view>
      
      <!-- Tab 2: 匹配结果 -->
      <view v-if="currentTab === 1" class="match-section animate__animated animate__fadeIn">
        <u-empty mode="list" text="暂无匹配记录" v-if="matchList.length === 0">
          <u-button slot="bottom" type="primary" size="small" shape="circle" color="#FF5E5E" @click="match" style="margin-top: 20px;">立即开始匹配</u-button>
        </u-empty>
        
        <view class="match-list" v-else>
           <view class="match-header">
             <text>匹配到 {{ matchList.length }} 位嘉宾</text>
             <view class="refresh-btn" @click="match">
               <u-icon name="refresh" color="#FF5E5E" size="14"></u-icon>
               <text>刷新</text>
             </view>
           </view>

           <view class="client-card" v-for="(item, index) in matchList" :key="index" @click="goDetail(item.id)">
            <view class="card-left">
              <u-avatar :src="item.avatar" size="48" :sex-icon="item.gender === 1 ? 'man' : 'woman'"></u-avatar>
            </view>
            <view class="card-center">
              <view class="header-row">
                <text class="name">{{ item.name }}</text>
                <text class="age">{{ calculateAge(item.birthday) }}岁</text>
              </view>
              <view class="info-row">
                 <text>{{ getEducationText(item.education) }}</text>
                 <text class="divider">·</text>
                 <text>{{ item.height ? item.height + 'cm' : '-' }}</text>
                 <text class="divider">·</text>
                 <text>{{ item.income ? item.income : '-' }}</text>
              </view>
            </view>
            <view class="card-right">
              <view class="match-score">98%</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="footer-placeholder"></view>
    <view class="footer" v-if="currentTab === 0">
      <u-button type="primary" shape="circle" color="#FF5E5E" :loading="matching" @click="match" customStyle="box-shadow: 0 4px 12px rgba(255, 94, 94, 0.3);">一键智能匹配</u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getClientDetail, matchClient, type Client } from '@/api/client';

const client = ref<Client>({} as Client);
const matchList = ref<Client[]>([]);
const currentTab = ref(0);
const tabs = [{ name: '档案详情' }, { name: '智能匹配' }];
const matching = ref(false);
const clientId = ref<number>(0);

onLoad(async (options: any) => {
  if (options.id) {
    clientId.value = Number(options.id);
    await fetchDetail(clientId.value);
  }
});

const fetchDetail = async (id: number) => {
  try {
    const res: any = await getClientDetail(id);
    client.value = res;
  } catch (e) {
    uni.showToast({ title: '获取详情失败', icon: 'none' });
  }
};

const onTabChange = (item: any) => {
  currentTab.value = item.index;
};

const match = async () => {
  console.log('Match clicked, clientId:', clientId.value);
  if (!clientId.value) {
    uni.showToast({ title: '未找到客户ID', icon: 'none' });
    return;
  }
  
  matching.value = true;
  try {
    console.log('Calling matchClient API...');
    const res: any = await matchClient(clientId.value);
    console.log('Match result:', res);
    
    matchList.value = res.list || [];
    currentTab.value = 1; 
    
    if (matchList.value.length > 0) {
        uni.showToast({ title: `匹配成功`, icon: 'success' });
    } else {
        uni.showToast({ title: `暂无匹配对象`, icon: 'none' });
    }
  } catch (e) {
    console.error('Match failed:', e);
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

// Helper functions
const calculateAge = (birthday: string) => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const getEducationText = (level: number | undefined) => {
  if (!level) return '未知';
  const map: any = { 1: '高中', 2: '大专', 3: '本科', 4: '硕士', 5: '博士' };
  return map[level] || '未知';
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
  background-color: $uni-bg-color;
  position: relative;
}

.header-bg {
    height: 180px;
    background: linear-gradient(180deg, #FFEEEE 0%, #F8F9FB 100%);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 0;
}

.profile-card {
    position: relative;
    z-index: 1;
    margin: 20px 16px 0;
    background: #fff;
    border-radius: 16px;
    padding: 24px 20px;
    box-shadow: $uni-shadow-base;
    text-align: center;
    
    .avatar-box {
        margin-top: -50px;
        margin-bottom: 12px;
        display: inline-block;
        border: 4px solid #fff;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    
    .info-box {
        .name {
            font-size: 20px;
            font-weight: 600;
            color: $uni-text-color;
            margin-bottom: 12px;
            display: block;
        }
        
        .tags {
            display: flex;
            justify-content: center;
            gap: 8px;
            
            .tag {
                font-size: 12px;
                color: $uni-text-color-grey;
                background: #F5F7FA;
                padding: 4px 10px;
                border-radius: 6px;
                
                &.highlight {
                    color: $uni-color-primary;
                    background: rgba(255, 94, 94, 0.08);
                }
            }
        }
    }
}

.tab-container {
    margin-top: 16px;
    background: #fff;
    border-radius: 16px 16px 0 0;
    padding: 0 16px;
    position: relative;
    z-index: 1;
}

.content {
  background: #fff;
  min-height: 400px;
  padding: 20px 20px 80px;
  
  .section-title {
      font-size: 15px;
      font-weight: 600;
      color: $uni-text-color;
      margin-bottom: 12px;
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
  
  .mt-30 { margin-top: 30px; }
  
  .grid-info {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -8px;
      
      .grid-item {
          width: 50%;
          padding: 8px;
          box-sizing: border-box;
          
          &.full { width: 100%; }
          
          .label {
              font-size: 12px;
              color: $uni-text-color-grey;
              display: block;
              margin-bottom: 4px;
          }
          .value {
              font-size: 14px;
              color: $uni-text-color;
              font-weight: 500;
          }
      }
  }
  
  .text-box {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
      background: #F8F9FB;
      padding: 12px;
      border-radius: 8px;
  }
  
  .contact-actions {
      margin-top: 30px;
  }
}

.match-section {
    .match-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        font-size: 13px;
        color: $uni-text-color-grey;
        
        .refresh-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            color: $uni-color-primary;
        }
    }
    
    .client-card {
        background: #fff;
        border: 1px solid #F0F0F0;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        
        .card-left { margin-right: 12px; }
        
        .card-center {
            flex: 1;
            .header-row {
                display: flex;
                align-items: center;
                margin-bottom: 6px;
                .name { font-size: 15px; font-weight: 600; margin-right: 8px; }
                .age { font-size: 12px; color: $uni-text-color-grey; }
            }
            .info-row {
                font-size: 12px;
                color: $uni-text-color-grey;
                .divider { margin: 0 4px; }
            }
        }
        
        .card-right {
            .match-score {
                font-size: 16px;
                font-weight: bold;
                color: $uni-color-primary;
                font-family: 'DIN Alternate';
            }
        }
    }
}

.footer-placeholder { height: 80px; }

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 20px 30px;
  background: #fff;
  border-top: 1px solid #F0F0F0;
  z-index: 100;
}
</style>
