<template>
  <view class="container">
    <view class="header">
      <u-avatar :src="client.avatar" size="80" :sex-icon="client.gender === 1 ? 'man' : 'woman'"></u-avatar>
      <view class="info">
        <text class="name">{{ client.name }}</text>
        <view class="tags">
          <u-tag :text="calculateAge(client.birthday) + '岁'" size="mini" type="info" plain v-if="client.birthday"></u-tag>
          <u-tag :text="client.zodiac" size="mini" type="info" plain v-if="client.zodiac"></u-tag>
          <u-tag :text="getEducationText(client.education)" size="mini" type="info" plain v-if="client.education"></u-tag>
          <u-tag :text="getMaritalStatusText(client.marital_status)" size="mini" type="warning" plain v-if="client.marital_status"></u-tag>
        </view>
      </view>
    </view>

    <u-tabs :list="tabs" :current="currentTab" @change="onTabChange" lineColor="#FF4D6A" activeColor="#FF4D6A"></u-tabs>
    
    <view class="content">
      <!-- Tab 1: 基本资料 -->
      <view v-if="currentTab === 0" class="info-section">
        <!-- 联系方式 (仅红娘可见) -->
        <view class="card-title">联系方式</view>
        <u-cell-group>
          <u-cell title="手机号码" :value="client.phone" isLink @click="makePhoneCall(client.phone)"></u-cell>
          <u-cell title="居住地址" :value="client.address || '未填写'"></u-cell>
        </u-cell-group>

        <!-- 详细资料 -->
        <view class="card-title mt-20">详细资料</view>
        <u-cell-group>
          <u-cell title="身高/体重">
            <text slot="value">{{ client.height ? client.height + 'cm' : '-' }} / {{ client.weight ? client.weight + 'kg' : '-' }}</text>
          </u-cell>
          <u-cell title="月收入" :value="client.income ? client.income + '元' : '未填写'"></u-cell>
          <u-cell title="职业" :value="client.profession || '未填写'"></u-cell>
          <u-cell title="房车情况" :value="getAssetsText(client)"></u-cell>
        </u-cell-group>

        <!-- 独白与家庭 -->
        <view class="desc-box">
          <text class="label">自我介绍</text>
          <text class="text">{{ client.remark || '暂无介绍' }}</text>
        </view>
        
        <view class="desc-box" v-if="client.family_description">
          <text class="label">家庭背景</text>
          <text class="text">{{ client.family_description }}</text>
        </view>

        <view class="desc-box" v-if="client.partner_requirements">
          <text class="label">择偶标准</text>
          <text class="text">{{ client.partner_requirements }}</text>
        </view>
      </view>
      
      <!-- Tab 2: 匹配结果 -->
      <view v-if="currentTab === 1" class="match-section">
        <u-empty mode="list" text="暂无匹配记录" v-if="matchList.length === 0">
          <u-button slot="bottom" type="primary" size="small" shape="circle" color="#FF4D6A" @click="match" style="margin-top: 20px;">立即开始匹配</u-button>
        </u-empty>
        
        <view class="match-list" v-else>
           <view class="match-header">
             <text>为您找到 {{ matchList.length }} 位推荐嘉宾</text>
             <u-icon name="refresh" color="#999" label="重新匹配" labelColor="#999" size="14" @click="match"></u-icon>
           </view>

           <view class="client-card" v-for="(item, index) in matchList" :key="index" @click="goDetail(item.id)">
            <view class="card-left">
              <u-avatar :src="item.avatar" size="50"></u-avatar>
            </view>
            <view class="card-center">
              <view class="name-row">
                <text class="name">{{ item.name }}</text>
                <u-icon :name="item.gender === 1 ? 'man' : 'woman'" :color="item.gender === 1 ? '#2979ff' : '#FF4D6A'" size="14"></u-icon>
                <text class="age" v-if="item.birthday">{{ calculateAge(item.birthday) }}岁</text>
              </view>
              <view class="info-row">
                 <text>{{ getEducationText(item.education) }}</text>
                 <text class="divider">|</text>
                 <text>{{ item.height ? item.height + 'cm' : '-' }}</text>
                 <text class="divider">|</text>
                 <text>{{ item.income ? item.income : '-' }}</text>
              </view>
              <view class="tags-row">
                <u-tag :text="item.profession" size="mini" type="info" plain v-if="item.profession"></u-tag>
                <u-tag :text="getAssetsText(item)" size="mini" type="warning" plain v-if="item.house_status || item.car_status"></u-tag>
              </view>
            </view>
            <view class="card-right">
              <u-icon name="arrow-right" color="#ccc"></u-icon>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="footer" v-if="currentTab === 0">
      <u-button type="primary" shape="circle" color="#FF4D6A" :loading="matching" @click="match">一键匹配</u-button>
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
const tabs = [{ name: '基本资料' }, { name: '匹配结果' }];
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
  if (!clientId.value) return;
  
  matching.value = true;
  try {
    const res: any = await matchClient(clientId.value);
    matchList.value = res.list || [];
    currentTab.value = 1; // Switch to match result tab
    if (matchList.value.length > 0) {
        uni.showToast({ title: `匹配成功`, icon: 'success' });
    } else {
        uni.showToast({ title: `暂无匹配对象`, icon: 'none' });
    }
  } catch (e) {
    uni.showToast({ title: '匹配失败', icon: 'none' });
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
  padding-bottom: 80px;
}

.header {
  background: #fff;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .info {
    margin-top: 15px;
    text-align: center;
    
    .name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
      display: block;
    }
    
    .tags {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
  }
}

.content {
  margin-top: 10px;
  padding: 0 15px;
  
  .info-section {
    padding-bottom: 20px;
  }

  .card-title {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 10px;
      margin-top: 20px;
      padding-left: 8px;
      border-left: 3px solid #FF4D6A;
  }
  .mt-20 { margin-top: 20px; }

  .desc-box {
    margin-top: 15px;
    padding: 15px;
    background: #fff;
    border-radius: 8px;
    
    .label {
      font-weight: bold;
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    }
    .text {
      color: #666;
      line-height: 1.6;
      font-size: 13px;
    }
  }
}

.match-section {
    padding-top: 10px;
    
    .match-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 5px;
        font-size: 12px;
        color: #666;
    }
}

.match-list {
  .client-card {
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);

    .card-left {
      margin-right: 15px;
    }

    .card-center {
      flex: 1;
      
      .name-row {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        
        .name {
          font-size: 16px;
          font-weight: bold;
          margin-right: 8px;
        }
        .age {
          font-size: 12px;
          color: #999;
          margin-left: 5px;
        }
      }
      
      .info-row {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          .divider {
              margin: 0 5px;
              color: #eee;
          }
      }

      .tags-row {
        display: flex;
        gap: 5px;
      }
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 20px 30px;
  background: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 100;
}
</style>
