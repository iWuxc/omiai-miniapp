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
            <view class="item-header">
                <text class="name">{{ item.name || '未识别姓名' }}</text>
                <text class="status-badge error" v-if="item.parse_status === 'error'">{{ item.error_msg }}</text>
                <text class="status-badge success" v-else>正常</text>
            </view>
            <view class="item-body">
                <text class="field">电话: {{ item.phone || '-' }}</text>
                <text class="field">性别: {{ item.gender === 1 ? '男' : (item.gender === 2 ? '女' : '-') }}</text>
                <text class="field">年龄: {{ item.birthday || '-' }}</text>
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
        height: 400px;
        background: #fff;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 20px;
    }
    
    .record-item {
        padding: 12px;
        border-bottom: 1px solid $omiai-border;
        &:last-child { border-bottom: none; }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            .name { font-weight: 500; font-size: 15px; }
            .status-badge {
                font-size: 11px;
                padding: 2px 6px;
                border-radius: 4px;
                &.error { background: #FFF7E6; color: $omiai-warning; }
                &.success { background: #E8FFEA; color: #52C41A; }
            }
        }
        
        .item-body {
            .field { font-size: 12px; color: $omiai-text-second; margin-right: 12px; }
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
