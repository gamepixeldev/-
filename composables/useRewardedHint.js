import { onUnmounted } from 'vue'
import { rewardedAdUnitId } from '../config/rewarded-ad.js'

export function useRewardedHint() {
  let ad = null
  let pending = null
  let busy = false
  let active = true

  function finish(result) {
    const hint = pending
    pending = null
    busy = false
    if (!active || !hint || !hint.isCurrent()) return
    if (!result?.isEnded) {
      uni.showToast({title:'未完整观看广告，提示未解锁',icon:'none'})
      return
    }
    uni.showModal({title:hint.title,content:hint.answer,showCancel:false,confirmText:'继续填写'})
  }
  function fail() {
    if (!pending) return
    pending = null
    busy = false
    if (active) uni.showModal({title:'广告暂不可用',content:'广告加载失败，请稍后再试。答案尚未解锁。',showCancel:false,confirmText:'知道了'})
  }
  function show(hint) {
    if (!rewardedAdUnitId) { busy = false; uni.showModal({title:'广告暂不可用',content:'激励视频广告位尚未配置，暂时无法解锁提示。',showCancel:false,confirmText:'知道了'}); return }
    if (typeof uni.createRewardedVideoAd !== 'function') { busy = false; uni.showModal({title:'当前环境不支持',content:'激励视频需要在已配置广告位的微信小程序中观看，当前预览环境无法解锁提示。',showCancel:false,confirmText:'知道了'}); return }
    pending = hint
    try {
      if (!ad) {
        ad = uni.createRewardedVideoAd({adUnitId:rewardedAdUnitId})
        ad.onClose(finish)
        ad.onError(fail)
      }
      Promise.resolve(ad.show()).catch(async () => { try { await ad.load(); await ad.show() } catch (_) { fail() } })
    } catch (_) { fail() }
  }
  function request({kind,answer,isCurrent}) {
    if (busy || !answer) return
    busy = true
    const title = kind === 'spell' ? '正确拼写' : '正确语序'
    const hint = {title,answer,isCurrent}
    uni.showModal({title:'观看广告获取提示',content:'需要完整观看一段激励视频广告，才能查看' + title + '。是否观看？',confirmText:'观看广告',cancelText:'暂不观看',success:result => { if (!result.confirm) { busy = false; return } show(hint) },fail:() => { busy = false }})
  }
  onUnmounted(() => { active = false; pending = null })
  return { request }
}
