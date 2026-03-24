<template>
  <view class="jade-tabbar">
    <!-- 背景层 -->
    <view class="jade-tabbar-bg">
      <view class="jade-surface"></view>
      <view class="jade-texture"></view>
    </view>
    
    <!-- 导航项容器 -->
    <view class="jade-tabbar-content">
      <view 
        v-for="(item, index) in list" 
        :key="index"
        class="jade-tab-item"
        :class="{ 
          active: selected === index,
          center: index === 2 
        }"
        @click="switchTab(index)"
      >
        <!-- 普通项 -->
        <template v-if="index !== 2">
          <view class="jade-icon-wrapper">
            <image 
              class="jade-icon" 
              :src="selected === index ? item.selectedIconPath : item.iconPath"
              mode="aspectFit"
            />
            <view v-if="selected === index" class="jade-icon-glow"></view>
          </view>
          <text class="jade-text" :class="{ active: selected === index }">
            {{ item.text }}
          </text>
          <!-- 选中指示点 -->
          <view v-if="selected === index" class="jade-indicator"></view>
        </template>
        
        <!-- 中央玉扣按钮 -->
        <template v-else>
          <view class="jade-button-center">
            <view class="jade-knot">
              <view class="jade-knot-bg">
                <view class="jade-knot-highlight"></view>
                <view class="jade-knot-depth"></view>
              </view>
              <view class="jade-knot-content">
                <u-icon name="plus" size="28" color="#FFF"></u-icon>
              </view>
              <view class="jade-knot-ring"></view>
            </view>
            <!-- 玉扣光晕 -->
            <view class="jade-knot-aura"></view>
          </view>
          <text class="jade-text center">{{ item.text }}</text>
        </template>
      </view>
    </view>
    
    <!-- 底部装饰线 -->
    <view class="jade-bottom-line">
      <view class="jade-line-glow"></view>
    </view>
    
    <!-- 安全区域适配 -->
    <view class="jade-safe-area"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  selected: number;
}>();

// Tab 配置（与 pages.json 保持一致）
const list = ref([
  {
    pagePath: '/pages/home/index',
    text: '工作台',
    iconPath: '/static/tabbar/home.png',
    selectedIconPath: '/static/tabbar/home-active.png'
  },
  {
    pagePath: '/pages/client/list',
    text: '客户池',
    iconPath: '/static/tabbar/client.png',
    selectedIconPath: '/static/tabbar/client-active.png'
  },
  {
    pagePath: '/pages/form/index',
    text: '录入',
    iconPath: '',
    selectedIconPath: ''
  },
  {
    pagePath: '/pages/profile/index',
    text: '我的',
    iconPath: '/static/tabbar/profile.png',
    selectedIconPath: '/static/tabbar/profile-active.png'
  }
]);

const selected = ref(props.selected || 0);

watch(() => props.selected, (newVal) => {
  selected.value = newVal;
});

const switchTab = (index: number) => {
  const url = list.value[index].pagePath;
  uni.switchTab({ url });
};
</script>

<style lang="scss" scoped>
.jade-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  
  &-bg {
    position: absolute;
    inset: 0;
    
    .jade-surface {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, 
        rgba(255, 255, 255, 0.98) 0%, 
        rgba(252, 248, 248, 0.99) 50%,
        rgba(248, 244, 244, 1) 100%
      );
      backdrop-filter: blur(24px);
      box-shadow: 0 -4px 24px rgba(255, 107, 107, 0.08);
    }
    
    .jade-texture {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse at 20% 0%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 0%, rgba(238, 10, 36, 0.03) 0%, transparent 40%);
    }
  }
  
  &-content {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    height: 68px;
    padding: 8px 12px 0;
  }
  
  .jade-tab-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 70px;
    height: 56px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    
    &.active {
      transform: translateY(-4px);
    }
    
    &:active {
      transform: scale(0.9);
    }
    
    /* 普通项样式 */
    .jade-icon-wrapper {
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 3px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      
      .jade-icon {
        width: 26px;
        height: 26px;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .jade-icon-glow {
        position: absolute;
        inset: -6px;
        background: radial-gradient(circle, 
          rgba(255, 107, 107, 0.25) 0%, 
          transparent 70%
        );
        border-radius: 50%;
        animation: icon-pulse 2.5s ease-in-out infinite;
      }
    }
    
    &.active .jade-icon-wrapper {
      transform: scale(1.15);
    }
    
    .jade-text {
      font-size: 12px;
      color: #A8A29E;
      font-weight: 500;
      letter-spacing: 0.4px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif;
      
      &.active {
        color: #FF6B6B;
        font-weight: 700;
        text-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
        transform: translateY(-1px);
      }
      
      &.center {
        margin-top: 2px;
      }
    }
    
    .jade-indicator {
      position: absolute;
      bottom: 4px;
      width: 6px;
      height: 6px;
      background: linear-gradient(135deg, #FF6B6B 0%, #EE0A24 100%);
      border-radius: 50%;
      box-shadow: 0 0 12px rgba(255, 107, 107, 0.6), 0 0 24px rgba(255, 107, 107, 0.3);
      animation: indicator-glow 2s ease-in-out infinite;
    }
    
    /* 中央玉扣按钮 */
    &.center {
      margin-top: -24px;
      
      .jade-button-center {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .jade-knot {
        position: relative;
        width: 60px;
        height: 60px;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        
        &:active {
          transform: scale(0.92);
        }
        
        &-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          overflow: hidden;
          
          &::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(145deg, 
              #FFB3B3 0%, 
              #FF8787 25%,
              #FF6B6B 50%,
              #EE0A24 75%,
              #C7001D 100%
            );
            border-radius: 50%;
          }
          
          .jade-knot-highlight {
            position: absolute;
            top: 4px;
            left: 12%;
            right: 12%;
            height: 40%;
            background: linear-gradient(180deg, 
              rgba(255,255,255,0.7) 0%, 
              rgba(255,255,255,0.25) 45%,
              transparent 100%
            );
            border-radius: 50% 50% 45% 45%;
          }
          
          .jade-knot-depth {
            position: absolute;
            bottom: 6px;
            left: 18%;
            right: 18%;
            height: 24px;
            background: linear-gradient(180deg, 
              transparent 0%, 
              rgba(0,0,0,0.12) 100%
            );
            border-radius: 0 0 50% 50%;
            filter: blur(5px);
          }
        }
        
        &-content {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
        
        &-ring {
          position: absolute;
          inset: 4px;
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 50%;
          z-index: 2;
          box-shadow: inset 0 0 12px rgba(255,255,255,0.2);
        }
      }
      
      .jade-knot-aura {
        position: absolute;
        inset: -10px;
        background: radial-gradient(circle, 
          rgba(255, 107, 107, 0.2) 0%, 
          transparent 65%
        );
        border-radius: 50%;
        animation: aura-breathe 3.5s ease-in-out infinite;
        pointer-events: none;
      }
    }
  }
  
  /* 底部装饰线 */
  .jade-bottom-line {
    position: absolute;
    bottom: 0;
    left: 15%;
    right: 15%;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 107, 107, 0.15) 20%,
      rgba(255, 107, 107, 0.25) 50%,
      rgba(255, 107, 107, 0.15) 80%,
      transparent 100%
    );
    
    .jade-line-glow {
      position: absolute;
      top: -4px;
      left: 35%;
      right: 35%;
      height: 8px;
      background: radial-gradient(ellipse, 
        rgba(255, 107, 107, 0.2) 0%, 
        transparent 75%
      );
      animation: line-pulse 3s ease-in-out infinite;
    }
  }
  
  .jade-safe-area {
    height: constant(safe-area-inset-bottom);
    height: env(safe-area-inset-bottom);
    background: rgba(248, 244, 244, 1);
  }
}

@keyframes icon-pulse {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.5; 
  }
  50% { 
    transform: scale(1.15); 
    opacity: 1; 
  }
}

@keyframes aura-breathe {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.4; 
  }
  50% { 
    transform: scale(1.2); 
    opacity: 0.85; 
  }
}

@keyframes indicator-glow {
  0%, 100% { 
    box-shadow: 0 0 12px rgba(255, 107, 107, 0.6), 0 0 24px rgba(255, 107, 107, 0.3);
  }
  50% { 
    box-shadow: 0 0 16px rgba(255, 107, 107, 0.8), 0 0 32px rgba(255, 107, 107, 0.5);
  }
}

@keyframes line-pulse {
  0%, 100% { 
    opacity: 0.5;
    transform: scaleX(1);
  }
  50% { 
    opacity: 1;
    transform: scaleX(1.1);
  }
}
</style>
