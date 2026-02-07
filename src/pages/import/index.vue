<template>
  <view class="container">
    <view class="nav-header" @click="goBack">
        <u-icon name="arrow-left" size="22" color="#1D2129"></u-icon>
    </view>

    <view class="header-box">
      <text class="title">批量数据导入</text>
      <text class="subtitle">支持粘贴微信聊天记录文本，系统自动识别客户信息</text>
    </view>

    <!-- Step 1: Input -->
    <view class="input-card omiai-card fade-in" v-if="step === 1">
      <view class="card-header">
        <text class="label">数据源</text>
        <view class="actions">
             <text class="guide-link" @click="showGuide = true">如何导出微信记录?</text>
        </view>
      </view>
      <u-textarea 
        v-model="rawText" 
        placeholder="请在此粘贴文本数据，例如：\n姓名：张三\n电话：13800000000\n..." 
        height="300"
        count
        maxlength="50000"
      ></u-textarea>
      
      <view class="btn-box">
         <u-button 
            type="primary" 
            text="开始解析" 
            :loading="analyzing" 
            customStyle="background: #FF5E78; border: none; margin-top: 20px;"
            @click="analyze"
            :disabled="!rawText"
         ></u-button>
      </view>
    </view>

    <!-- Step 2: Preview -->
    <view class="preview-box fade-in" v-if="step === 2">
      <view class="summary-bar">
         <text class="stat">共识别 <text class="highlight">{{ parseResult.total }}</text> 条数据</text>
         <text class="stat error" v-if="errorCount > 0">包含 {{ errorCount }} 条错误</text>
      </view>
      
       <scroll-view scroll-y class="record-list">
         <view class="record-item" v-for="(item, index) in parseResult.records" :key="index">
             <!-- 头部：姓名和状态 -->
             <view class="item-header">
                 <text class="name">{{ item.name || '未识别姓名' }}</text>
                 <text class="status-badge error" v-if="item.parse_status === 'error'">{{ item.error_msg || '识别异常' }}</text>
                 <text class="status-badge success" v-else-if="item.parse_status === 'warning'">部分识别</text>
                 <text class="status-badge success" v-else>识别成功</text>
             </view>
             
             <!-- 基础信息区 -->
             <view class="info-section">
                 <view class="section-title">基础信息</view>
                 <view class="info-grid">
                     <view class="info-cell">
                         <text class="cell-label">电话</text>
                         <text class="cell-value" :class="{ 'empty': !item.phone }">{{ item.phone || '未识别' }}</text>
                     </view>
                     <view class="info-cell">
                         <text class="cell-label">性别</text>
                         <text class="cell-value" :class="{ 'empty': !item.gender }">{{ formatGender(item.gender) }}</text>
                     </view>
                     <view class="info-cell">
                         <text class="cell-label">年龄</text>
                         <text class="cell-value" :class="{ 'empty': !item.age }">{{ item.age ? item.age + '岁' : (item.birthday || '未识别') }}</text>
                     </view>
                     <view class="info-cell">
                         <text class="cell-label">属相</text>
                         <text class="cell-value" :class="{ 'empty': !item.zodiac }">{{ item.zodiac || '未识别' }}</text>
                     </view>
                     <view class="info-cell">
                         <text class="cell-label">身高</text>
                         <text class="cell-value" :class="{ 'empty': !item.height }">{{ item.height ? item.height + 'cm' : '未识别' }}</text>
                     </view>
                     <view class="info-cell">
                         <text class="cell-label">体重</text>
                         <text class="cell-value" :class="{ 'empty': !item.weight }">{{ item.weight ? item.weight + 'kg' : '未识别' }}</text>
                     </view>
                 </view>
             </view>
             
             <!-- 教育婚姻区 -->
             <view class="info-section">
                 <view class="section-title">教育婚姻</view>
                 <view class="info-row">
                     <text class="field">学历: {{ formatEducation(item.education) }}</text>
                     <text class="field">婚姻: {{ formatMarital(item.marital_status) }}</text>
                 </view>
             </view>
             
             <!-- 工作收入区 -->
             <view class="info-section">
                 <view class="section-title">工作收入</view>
                 <view class="info-row">
                     <text class="field">职业: {{ item.profession || '-' }}</text>
                     <text class="field">收入: {{ item.income ? formatIncome(item.income) : '-' }}</text>
                 </view>
             </view>
             
             <!-- 资产情况区 -->
             <view class="info-section">
                 <view class="section-title">资产情况</view>
                 <view class="info-row">
                     <text class="field">房产: {{ formatHouseStatus(item.house_status) }}</text>
                     <text class="field" v-if="item.house_address">地址: {{ item.house_address }}</text>
                 </view>
                 <view class="info-row">
                     <text class="field">车辆: {{ item.car_status === 2 ? '有车' : (item.car_status === 1 ? '无车' : '-') }}</text>
                 </view>
             </view>
             
             <!-- 家庭信息区 -->
             <view class="info-section" v-if="item.address || item.family_description">
                 <view class="section-title">家庭信息</view>
                 <view class="long-text" v-if="item.address">
                     <text class="label">住址: </text>
                     <text>{{ item.address }}</text>
                 </view>
                 <view class="long-text" v-if="item.family_description">
                     <text class="label">家庭成员: </text>
                     <text>{{ item.family_description }}</text>
                 </view>
             </view>
             
             <!-- 择偶要求区 -->
             <view class="info-section" v-if="item.partner_requirements || item.parents_profession">
                 <view class="section-title">择偶相关</view>
                 <view class="long-text" v-if="item.partner_requirements">
                     <text class="label">择偶要求: </text>
                     <text>{{ item.partner_requirements }}</text>
                 </view>
                 <view class="long-text" v-if="item.parents_profession">
                     <text class="label">父母工作: </text>
                     <text>{{ item.parents_profession }}</text>
                 </view>
             </view>
             
             <!-- 备注区 -->
             <view class="info-section" v-if="item.remark">
                 <view class="section-title">备注</view>
                 <view class="long-text">
                     <text>{{ item.remark }}</text>
                 </view>
             </view>
         </view>
       </scroll-view>

      <view class="btn-group">
         <u-button plain text="返回修改" @click="step = 1" customStyle="flex: 1; margin-right: 10px;"></u-button>
         <u-button 
            type="primary" 
            :text="`确认导入 (${validCount}条)`" 
            :loading="importing" 
            customStyle="background: #FF5E78; border: none; flex: 2;"
            @click="executeImport"
            :disabled="validCount === 0"
         ></u-button>
      </view>
    </view>

    <!-- Step 3: Result -->
    <view class="result-box fade-in" v-if="step === 3">
        <u-icon name="checkmark-circle-fill" color="#52C41A" size="80"></u-icon>
        <text class="result-title">导入完成</text>
        <view class="result-detail">
            <text>成功导入: {{ importResult.success_count }}</text>
            <text>失败条数: {{ importResult.fail_count }}</text>
        </view>
        <view class="error-log" v-if="importResult.errors && importResult.errors.length > 0">
            <text class="log-title">错误日志:</text>
            <text v-for="(err, i) in importResult.errors" :key="i" class="log-item">{{ err }}</text>
        </view>
        <u-button 
            type="primary" 
            text="返回列表" 
            plain
            customStyle="margin-top: 40px; width: 200px; color: #FF5E78; border-color: #FF5E78;"
            @click="goList"
        ></u-button>
        <u-button 
            text="继续导入" 
            customStyle="margin-top: 16px; width: 200px;"
            @click="reset"
        ></u-button>
    </view>

    <!-- Guide Modal -->
    <u-modal :show="showGuide" title="导出指南" @confirm="showGuide = false">
        <view class="guide-content">
            <text>1. 在电脑端微信打开聊天窗口。</text>
            <text>2. 选中需要导入的聊天记录（包含客户填写的模板信息）。</text>
            <text>3. 右键点击“复制”或 Ctrl+C。</text>
            <text>4. 将文本粘贴到本页面的输入框中。</text>
            <text class="tip">* 系统会自动识别“姓名：xxx”等关键字段。</text>
        </view>
    </u-modal>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { analyzeImport, batchImport } from '@/api/import'; // Need to create api

const step = ref(1);
const rawText = ref('');
const analyzing = ref(false);
const importing = ref(false);
const showGuide = ref(false);

const parseResult = ref<any>({ total: 0, records: [] });
const importResult = ref<any>({});

const errorCount = computed(() => {
    return parseResult.value.records.filter((r: any) => r.parse_status === 'error').length;
});

const validCount = computed(() => {
    return parseResult.value.records.filter((r: any) => r.parse_status !== 'error').length;
});

// 格式化函数
const formatGender = (gender: number) => {
    if (gender === 1) return '男';
    if (gender === 2) return '女';
    return '未识别';
};

const formatEducation = (edu: number) => {
    const map: Record<number, string> = {
        1: '高中',
        2: '大专',
        3: '本科',
        4: '硕士',
        5: '博士'
    };
    return map[edu] || '-';
};

const formatMarital = (status: number) => {
    const map: Record<number, string> = {
        1: '未婚',
        2: '已婚',
        3: '离异',
        4: '丧偶'
    };
    return map[status] || '-';
};

const formatIncome = (income: number) => {
    if (income >= 10000) {
        return (income / 10000).toFixed(1) + '万/月';
    }
    return income + '元/月';
};

const formatHouseStatus = (status: number) => {
    if (status === 2) return '已购房';
    if (status === 3) return '贷款购房';
    if (status === 1) return '无房';
    return '-';
};

const analyze = async () => {
    if (!rawText.value) return;
    analyzing.value = true;
    try {
        const res: any = await analyzeImport({ content: rawText.value });
        parseResult.value = res;
        step.value = 2;
    } catch (e) {
        uni.showToast({ title: '解析失败，请检查格式', icon: 'none' });
    } finally {
        analyzing.value = false;
    }
};

const executeImport = async () => {
    importing.value = true;
    try {
        const res: any = await batchImport({ list: parseResult.value.records });
        importResult.value = res;
        step.value = 3;
    } catch (e) {
        uni.showToast({ title: '导入请求失败', icon: 'none' });
    } finally {
        importing.value = false;
    }
};

const goList = () => {
    uni.switchTab({ url: '/pages/client/list' });
};

const goBack = () => {
    uni.navigateBack();
};

const reset = () => {
    step.value = 1;
    rawText.value = '';
    parseResult.value = { total: 0, records: [] };
};
</script>

<style lang="scss" scoped>
.container {
    padding: 20px;
    background: $omiai-bg-page;
    min-height: 100vh;
}

.nav-header {
    margin-bottom: 20px;
    padding-top: 30px; 
    display: inline-flex;
    padding-right: 20px;
}

.header-box {
    margin-bottom: 24px;
    .title {
        font-size: 24px;
        font-weight: 600;
        color: $omiai-text-main;
        display: block;
        margin-bottom: 8px;
    }
    .subtitle {
        font-size: 14px;
        color: $omiai-text-tip;
    }
}

.input-card {
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    
    .card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        .label { font-weight: 500; }
        .guide-link { color: $omiai-primary; font-size: 13px; }
    }
}

.preview-box {
    .summary-bar {
        margin-bottom: 12px;
        .stat { margin-right: 16px; font-size: 14px; }
        .highlight { color: $omiai-primary; font-weight: 600; }
        .error { color: $omiai-warning; }
    }
    
    .record-list {
        height: 60vh;
        background: #f5f5f5;
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 20px;
    }
    
    .record-item {
        padding: 16px;
        margin-bottom: 12px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f0f0f0;
            .name { font-weight: 600; font-size: 17px; color: #333; }
            .status-badge {
                font-size: 11px;
                padding: 4px 10px;
                border-radius: 20px;
                font-weight: 500;
                &.error { background: #FFF2F0; color: #FF4D4F; }
                &.success { background: #F6FFED; color: #52C41A; }
            }
        }
        
        .info-section {
            margin-bottom: 12px;
            &:last-child { margin-bottom: 0; }
            
            .section-title {
                font-size: 13px;
                font-weight: 600;
                color: #666;
                margin-bottom: 8px;
                padding-left: 8px;
                border-left: 3px solid $omiai-primary;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                
                .info-cell {
                    background: #f7f8fa;
                    padding: 8px;
                    border-radius: 8px;
                    text-align: center;
                    
                    .cell-label {
                        display: block;
                        font-size: 11px;
                        color: #999;
                        margin-bottom: 4px;
                    }
                    
                    .cell-value {
                        display: block;
                        font-size: 13px;
                        color: #333;
                        font-weight: 500;
                        
                        &.empty {
                            color: #ccc;
                        }
                    }
                }
            }
            
            .info-row {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                
                .field {
                    font-size: 13px;
                    color: #333;
                    background: #f7f8fa;
                    padding: 6px 10px;
                    border-radius: 6px;
                }
            }
            
            .long-text {
                font-size: 13px;
                color: #333;
                line-height: 1.6;
                background: #f7f8fa;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 8px;
                
                .label {
                    color: #666;
                    font-weight: 500;
                }
            }
        }
    }
    
    .btn-group {
        display: flex;
        margin-top: 20px;
    }
}

.result-box {
    text-align: center;
    padding-top: 40px;
    background: #fff;
    border-radius: 12px;
    padding-bottom: 40px;
    
    .result-title {
        display: block;
        font-size: 20px;
        font-weight: 600;
        margin-top: 16px;
    }
    
    .result-detail {
        margin-top: 12px;
        color: $omiai-text-second;
        text { margin: 0 10px; }
    }
    
    .error-log {
        margin-top: 24px;
        text-align: left;
        background: #f7f8fa;
        padding: 16px;
        margin-left: 20px;
        margin-right: 20px;
        border-radius: 8px;
        
        .log-title { font-weight: 500; margin-bottom: 8px; display: block; }
        .log-item { display: block; font-size: 12px; color: $omiai-text-tip; margin-bottom: 4px; }
    }
}

.guide-content {
    padding: 20px;
    text { display: block; margin-bottom: 8px; color: $omiai-text-main; font-size: 14px; }
    .tip { color: $omiai-text-tip; font-size: 12px; margin-top: 12px; }
}
</style>
