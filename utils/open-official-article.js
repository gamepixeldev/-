export function openOfficialArticle(source) {
  const notify = message => uni.showToast({title:message,icon:'none'})
  if (!source.url) { notify('公众号文章链接暂不可用'); return }
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.openOfficialAccountArticle) wx.openOfficialAccountArticle({url:source.url,fail:() => notify('暂时无法打开公众号文章')})
  else notify('请更新微信后再打开公众号文章')
  // #endif
  // #ifdef H5
  window.open(source.url, '_blank', 'noopener')
  // #endif
}
