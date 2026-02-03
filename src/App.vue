<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
  // 移除此处的跳转逻辑，改用 main.ts 中的路由拦截器，防止 H5 死循环
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
/* 全局中式审美风格样式 */
page {
  background-color: $omiai-bg-page;
  font-family: $omiai-font-family;
  color: $omiai-text-main;
  -webkit-font-smoothing: antialiased;
}

/* 通用卡片样式 - 更加圆润且有通透感 */
.omiai-card {
  background: $omiai-white;
  border-radius: $omiai-radius-lg; /* 修复: 使用新定义的 $omiai-radius-lg 替代不存在的 $omiai-radius-card */
  padding: 20px;
  box-shadow: $omiai-shadow-sm;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  
  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }
}

/* 标题层次 - 契合中文排版习惯 */
.omiai-title-xl {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
  color: $omiai-text-main;
}

.omiai-title-lg {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: $omiai-text-main;
}

.omiai-text-md {
  font-size: 15px;
  line-height: 1.6;
  color: $omiai-text-second;
}

.omiai-text-sm {
  font-size: 13px;
  line-height: 1.5;
  color: $omiai-text-tip;
}

/* 渐入动效 */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeInUp 0.4s ease-out forwards;
}

/* 品牌感按钮 - 渐变与圆润 */
.omiai-btn-primary {
  background: $omiai-primary-gradient;
  color: $omiai-white;
  border-radius: 999rpx;
  padding: 12px 24px;
  font-weight: 500;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(255, 94, 120, 0.2);
  
  &:active {
    opacity: 0.9;
    transform: scale(0.98);
  }
}

/* 标签样式 */
.omiai-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  background: $omiai-bg-page;
  color: $omiai-text-second;
  
  &.primary {
    background: $omiai-primary-light;
    color: $omiai-primary;
  }
}
</style>
