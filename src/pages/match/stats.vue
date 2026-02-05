<template>
  <view class="container">
    <view class="header omiai-card">
        <view class="title">数据概览</view>
        <view class="grid">
            <view class="item">
                <text class="num">{{ stats.total_matches }}</text>
                <text class="label">总匹配数</text>
            </view>
            <view class="item">
                <text class="num">{{ (stats.success_rate * 100).toFixed(1) }}%</text>
                <text class="label">结婚成功率</text>
            </view>
            <view class="item">
                <text class="num">{{ stats.married_count }}</text>
                <text class="label">已结婚对数</text>
            </view>
        </view>
    </view>

    <view class="chart-card omiai-card">
        <view class="title">状态分布</view>
        <view class="status-list">
             <view v-for="(count, status) in stats.status_distribution" :key="status" class="status-item">
                <text class="status-name">{{ getStatusName(status) }}</text>
                <view class="progress-box">
                    <u-line-progress :percentage="getPercentage(count)" :showText="false" activeColor="#FF4D6A" height="10"></u-line-progress>
                </view>
                <text class="status-count">{{ count }}</text>
             </view>
        </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getMatchStats } from '@/api/match';

const stats = ref({
    total_matches: 0,
    status_distribution: {} as Record<string, number>,
    married_count: 0,
    success_rate: 0
});

const getStatusName = (status: any) => {
    const map: any = {
        1: '相识',
        2: '交往',
        3: '稳定',
        4: '订婚',
        5: '结婚',
        6: '分手'
    };
    return map[status] || '未知';
};

const getPercentage = (count: number) => {
    if (stats.value.total_matches === 0) return 0;
    return (count / stats.value.total_matches) * 100;
};

onMounted(async () => {
    try {
        const res: any = await getMatchStats();
        if (res) {
            stats.value = res;
        }
    } catch (e) {
        console.error(e);
    }
});
</script>

<style lang="scss" scoped>
.container {
    padding: 20rpx;
}
.header {
    margin-bottom: 20rpx;
    .title {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
    }
    .grid {
        display: flex;
        justify-content: space-around;
        .item {
            display: flex;
            flex-direction: column;
            align-items: center;
            .num {
                font-size: 40rpx;
                font-weight: bold;
                color: #FF4D6A;
            }
            .label {
                font-size: 24rpx;
                color: #666;
                margin-top: 10rpx;
            }
        }
    }
}
.chart-card {
    .title {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 30rpx;
    }
    .status-item {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        .status-name {
            width: 100rpx;
            font-size: 28rpx;
            color: #333;
        }
        .progress-box {
            flex: 1;
            margin: 0 20rpx;
        }
        .status-count {
            width: 60rpx;
            text-align: right;
            font-size: 24rpx;
            color: #999;
        }
    }
}
</style>