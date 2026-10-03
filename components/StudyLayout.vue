<template>
  <view class="app-shell" :class="themeClass">
    <view class="status-spacer"></view>
    <view v-if="!immersive" class="topbar">
      <view v-if="showBack" class="back-hit" @tap="goBack"><text class="back-arrow">‹</text></view>
      <view v-else class="back-hit back-placeholder"></view>
      <view class="top-title">{{ title }}</view>
      <view class="top-action"><slot name="action" /></view>
    </view>
    <view v-else class="practice-head"><view class="back-hit" @tap="goBack"><text class="back-arrow">‹</text></view><text class="practice-heading">{{ title }}</text><text class="step-count">{{ step }}/{{ total }}</text></view>
    <scroll-view class="page-scroll" scroll-y :scroll-top="scrollTop" :show-scrollbar="false" lower-threshold="100" @scrolltolower="$emit('load-more')">
      <slot />
    </scroll-view>
    <slot name="fixed-action" />
  </view>
  <view v-if="toast" class="toast">{{ toast }}</view>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  showBack: { type: Boolean, default: true },
  themeClass: { type: String, default: '' },
  scrollTop: { type: Number, default: 0 },
  toast: { type: String, default: '' },
  immersive: { type: Boolean, default: false },
  step: { type: Number, default: 1 },
  total: { type: Number, default: 1 },
  backAction: { type: Function, default: null }
})
defineEmits(['load-more'])

function goBack() { if (props.backAction) { props.backAction(); return } uni.navigateBack({fail:() => uni.switchTab({url:'/pages/index/index'})}) }
</script>
