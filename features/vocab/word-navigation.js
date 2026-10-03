export function finishWordStudyStep(nextUrl = '') {
  const pages = getCurrentPages()
  let sourceIndex = -1
  for (let i = pages.length - 1; i >= 0; i--) {
    if (!['pages/vocab/detail','pages/vocab/spell'].includes((pages[i].route || '').replace(/^\//,''))) { sourceIndex = i; break }
  }
  const fallbackUrl = nextUrl || '/pages/vocab/index'
  if (sourceIndex < 0) { uni.reLaunch({url:fallbackUrl}); return }
  uni.navigateBack({delta:pages.length - 1 - sourceIndex,success:() => { if (nextUrl) setTimeout(() => uni.navigateTo({url:nextUrl}),120) },fail:() => uni.reLaunch({url:fallbackUrl})})
}

export function advanceWordStudy(from, to, nextUrl) {
  const pages = getCurrentPages()
  const previousRoute = (pages[pages.length - 2]?.route || '').replace(/^\//,'')
  if (previousRoute !== 'pages/vocab/detail') { finishWordStudyStep(nextUrl); return }
  uni.$emit('readEnglishAdvanceWord',{from,to})
  uni.navigateBack({delta:1,success:() => {
    // #ifdef H5
    setTimeout(() => { if (window.location.hash.startsWith('#/pages/vocab/detail')) window.history.replaceState(window.history.state,'',window.location.pathname + window.location.search + '#' + nextUrl) },80)
    // #endif
  },fail:() => uni.redirectTo({url:nextUrl})})
}
