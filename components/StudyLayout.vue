<template>
  <view class="app-shell" :class="themeClass">
    <view class="status-spacer"></view>
    <view class="topbar">
      <view v-if="showBack" class="back-hit" @tap="goBack"><text class="back-arrow">‹</text></view>
      <view v-else class="back-hit back-placeholder"></view>
      <view class="top-title">{{ title }}</view>
      <view class="top-action"><slot name="action" /></view>
    </view>
    <scroll-view class="page-scroll" scroll-y :scroll-top="scrollTop" :show-scrollbar="false" lower-threshold="100" @scrolltolower="$emit('load-more')">
      <slot />
    </scroll-view>
    <view v-if="showTabs" class="tabbar">
      <view v-for="tab in tabs" :key="tab.id" class="tab-item" :class="{active:activeTab === tab.id}" @tap="openTab(tab)"><text class="tab-icon">{{ tab.icon }}</text><text>{{ tab.label }}</text></view>
    </view>
  </view>
  <view v-if="toast" class="toast">{{ toast }}</view>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  showBack: { type: Boolean, default: true },
  showTabs: { type: Boolean, default: false },
  activeTab: { type: String, default: '' },
  themeClass: { type: String, default: '' },
  scrollTop: { type: Number, default: 0 },
  toast: { type: String, default: '' }
})
defineEmits(['load-more'])

const tabs = [
  {id:'home',label:'首页',icon:'⌂',url:'/pages/index/index'},
  {id:'reading',label:'精读',icon:'▤',url:'/pages/reading/index'},
  {id:'grammar',label:'语法',icon:'文',url:'/pages/grammar/index'},
  {id:'vocab',label:'单词',icon:'Aa',url:'/pages/vocab/index'},
  {id:'puzzle',label:'拼句',icon:'拼',url:'/pages/puzzle/index'}
]
function openTab(tab) { if (tab.id !== props.activeTab) uni.navigateTo({url:tab.url}) }
function goBack() { uni.navigateBack({fail:() => uni.redirectTo({url:'/pages/index/index'})}) }
</script>
